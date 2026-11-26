import os
import shutil
import zipfile
import tempfile
import re
from pathlib import Path
from typing import List, Dict, Any, Tuple
import httpx
from app.core.config import settings
from app.core.security import SecurityGuard
from app.services.parser import CodeParserService

IGNORE_DIRS = {
    'node_modules', '.git', '__pycache__', 'venv', '.venv', 'env',
    'dist', 'build', '.next', '.cache', 'coverage', '.idea', '.vscode',
    'target', 'vendor', 'bin', 'obj', '.pytest_cache'
}

BINARY_EXTENSIONS = {
    '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2',
    '.ttf', '.eot', '.pdf', '.zip', '.tar', '.gz', '.exe', '.dll', '.so',
    '.pyc', '.pyo', '.class', '.lock', '.db', '.sqlite'
}

EXTENSION_TO_LANGUAGE = {
    '.py': 'Python',
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript (React)',
    '.js': 'JavaScript',
    '.jsx': 'JavaScript (React)',
    '.java': 'Java',
    '.go': 'Go',
    '.rs': 'Rust',
    '.cpp': 'C++',
    '.c': 'C',
    '.h': 'C/C++ Header',
    '.json': 'JSON',
    '.md': 'Markdown',
    '.yaml': 'YAML',
    '.yml': 'YAML',
    '.toml': 'TOML',
    '.sql': 'SQL',
    '.css': 'CSS',
    '.html': 'HTML',
    '.sh': 'Shell',
}


class IngestionService:
    @staticmethod
    def ensure_upload_dir() -> str:
        try:
            os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
            return settings.UPLOAD_DIR
        except OSError:
            # Serverless fallback (e.g. Vercel /tmp)
            tmp_dir = os.path.join(tempfile.gettempdir(), "code_archaeologist_uploads")
            os.makedirs(tmp_dir, exist_ok=True)
            return tmp_dir

    @classmethod
    async def download_github_zip(
        cls, owner: str, repo: str, branch: str, dest_zip_path: str, auth_token: str | None = None
    ) -> str:
        """
        Downloads a GitHub repository archive via HTTPX.
        Tries the requested branch, falling back to 'master' or GitHub's default zipball.
        """
        headers = {"User-Agent": "Code-Archaeologist/1.0"}
        if auth_token:
            headers["Authorization"] = f"Bearer {auth_token}"

        candidates = [
            (branch, f"https://github.com/{owner}/{repo}/archive/refs/heads/{branch}.zip"),
        ]
        if branch == "main":
            candidates.append(("master", f"https://github.com/{owner}/{repo}/archive/refs/heads/master.zip"))
        candidates.append((branch, f"https://api.github.com/repos/{owner}/{repo}/zipball/{branch}"))

        async with httpx.AsyncClient(follow_redirects=True, timeout=30.0) as client:
            last_status = None
            for used_branch, url in candidates:
                resp = await client.get(url, headers=headers)
                last_status = resp.status_code
                if resp.status_code == 200:
                    with open(dest_zip_path, "wb") as f:
                        f.write(resp.content)
                    return used_branch

        raise ValueError(
            f"Could not download GitHub repository '{owner}/{repo}' (HTTP {last_status}). "
            "Ensure the repository is public and the branch name is correct."
        )

    @classmethod
    def process_zip_upload(
        cls, zip_path: str, repo_id: str
    ) -> Tuple[str, List[Dict[str, Any]], List[Dict[str, Any]], Dict[str, List[str]], Dict[str, float]]:
        """
        Extracts ZIP file safely into a sandbox directory, scans files,
        parses AST symbols & imports, and computes language distribution.
        """
        upload_dir = cls.ensure_upload_dir()
        target_dir = os.path.join(upload_dir, repo_id)
        os.makedirs(target_dir, exist_ok=True)

        is_safe, msg = SecurityGuard.validate_zip(zip_path, target_dir)
        if not is_safe:
            shutil.rmtree(target_dir, ignore_errors=True)
            raise ValueError(f"Security validation failed: {msg}")

        with zipfile.ZipFile(zip_path, 'r') as zf:
            for member in zf.infolist():
                member_path = os.path.normpath(member.filename)
                if member_path.startswith("..") or os.path.isabs(member_path):
                    continue
                zf.extract(member, target_dir)

        # Unwrap single top-level folder (typical of GitHub zipballs like repo-main/)
        scan_root = target_dir
        entries = os.listdir(target_dir)
        if len(entries) == 1 and os.path.isdir(os.path.join(target_dir, entries[0])):
            scan_root = os.path.join(target_dir, entries[0])

        files_data, symbols_data, imports_map, lang_dist = cls.scan_and_analyze_directory(scan_root, repo_id)

        # Cleanup extracted files after in-memory indexing to keep disk clean
        shutil.rmtree(target_dir, ignore_errors=True)

        return scan_root, files_data, symbols_data, imports_map, lang_dist

    @classmethod
    def scan_and_analyze_directory(
        cls, root_dir: str, repo_id: str, max_files: int = 400
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], Dict[str, List[str]], Dict[str, float]]:
        files_data: List[Dict[str, Any]] = []
        symbols_data: List[Dict[str, Any]] = []
        imports_map: Dict[str, List[str]] = {}
        lang_counts: Dict[str, int] = {}
        total_code_files = 0

        for root, dirs, files in os.walk(root_dir):
            dirs[:] = sorted([d for d in dirs if d not in IGNORE_DIRS and not d.startswith('.')])

            for file in sorted(files):
                if len(files_data) >= max_files:
                    break
                if file.startswith('.') and file not in {'.env.example', '.gitignore'}:
                    continue

                ext = Path(file).suffix.lower()
                if ext in BINARY_EXTENSIONS:
                    continue

                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, root_dir).replace('\\', '/')
                lang = EXTENSION_TO_LANGUAGE.get(ext, 'Other')

                try:
                    size = os.path.getsize(file_path)
                    content = ""
                    lines = 0
                    if size < 300 * 1024:  # Read up to 300KB text files
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            lines = len(content.splitlines())
                except Exception:
                    size = 0
                    content = ""
                    lines = 0

                file_id = f"{repo_id}_f{len(files_data) + 1}"

                # Parse symbols & imports for supported languages
                parsed_symbols = CodeParserService.parse_source_code(rel_path, content, lang)
                parsed_imports = CodeParserService.extract_imports(content, lang)

                if parsed_imports:
                    imports_map[rel_path] = parsed_imports

                for sym in parsed_symbols:
                    sym_id = f"{repo_id}_sym{len(symbols_data) + 1}"
                    symbols_data.append({
                        "id": sym_id,
                        "repository_id": repo_id,
                        "file_id": file_id,
                        **sym,
                        "metadata_json": {"language": lang},
                    })

                files_data.append({
                    "id": file_id,
                    "repository_id": repo_id,
                    "path": rel_path,
                    "name": file,
                    "extension": ext,
                    "language": lang,
                    "size_bytes": size,
                    "line_count": lines,
                    "is_directory": False,
                    "parent_path": os.path.dirname(rel_path).replace('\\', '/') or None,
                    "symbols_count": len(parsed_symbols),
                    "content": content,
                })

                if lang != 'Other':
                    lang_counts[lang] = lang_counts.get(lang, 0) + 1
                    total_code_files += 1

        lang_percentages: Dict[str, float] = {}
        if total_code_files > 0:
            # Top 5 languages sorted by count
            sorted_langs = sorted(lang_counts.items(), key=lambda x: x[1], reverse=True)[:5]
            for lang, count in sorted_langs:
                lang_percentages[lang] = round((count / total_code_files) * 100, 1)

        return files_data, symbols_data, imports_map, lang_percentages

    @classmethod
    def parse_github_url(cls, url: str) -> Tuple[str, str, str]:
        """Extracts owner, repo, and branch from a GitHub URL."""
        cleaned = url.strip().rstrip('/')
        pattern = r"github\.com[/:]([\w.-]+)/([\w.-]+?)(?:\.git)?(?:/tree/([\w.-]+))?$"
        match = re.search(pattern, cleaned)
        if not match:
            raise ValueError("Invalid GitHub repository URL. Must be in format https://github.com/owner/repo")
        owner, repo, branch = match.groups()
        return owner, repo, branch or "main"
