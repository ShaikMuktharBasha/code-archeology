import os
import shutil
import zipfile
import re
from pathlib import Path
from typing import List, Dict, Any, Tuple
from app.core.config import settings
from app.core.security import SecurityGuard

IGNORE_DIRS = {
    'node_modules', '.git', '__pycache__', 'venv', '.venv', 'env',
    'dist', 'build', '.next', '.cache', 'coverage', '.idea', '.vscode'
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
}

class IngestionService:
    @staticmethod
    def ensure_upload_dir() -> str:
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        return settings.UPLOAD_DIR

    @classmethod
    def process_zip_upload(cls, zip_path: str, repo_id: str) -> Tuple[str, List[Dict[str, Any]], Dict[str, float]]:
        """
        Extracts ZIP file safely into a sandbox directory, scans files,
        and computes file metadata and language distribution.
        """
        upload_dir = cls.ensure_upload_dir()
        target_dir = os.path.join(upload_dir, repo_id)
        os.makedirs(target_dir, exist_ok=True)

        # Validate security
        is_safe, msg = SecurityGuard.validate_zip(zip_path, target_dir)
        if not is_safe:
            shutil.rmtree(target_dir, ignore_errors=True)
            raise ValueError(f"Security validation failed: {msg}")

        # Extract ZIP safely
        with zipfile.ZipFile(zip_path, 'r') as zf:
            for member in zf.infolist():
                # Avoid dangerous directory traversals
                member_path = os.path.normpath(member.filename)
                if member_path.startswith("..") or os.path.isabs(member_path):
                    continue
                zf.extract(member, target_dir)

        # Collect files
        return cls.scan_directory(target_dir, repo_id)

    @classmethod
    def scan_directory(cls, root_dir: str, repo_id: str) -> Tuple[str, List[Dict[str, Any]], Dict[str, float]]:
        files_data: List[Dict[str, Any]] = []
        lang_counts: Dict[str, int] = {}
        total_files = 0

        for root, dirs, files in os.walk(root_dir):
            # Prune ignored directories in place
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS and not d.startswith('.')]

            for file in files:
                if file.startswith('.'):
                    continue
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, root_dir).replace('\\', '/')
                ext = Path(file).suffix.lower()
                lang = EXTENSION_TO_LANGUAGE.get(ext, 'Other')

                try:
                    size = os.path.getsize(file_path)
                    # Read line count if text file
                    lines = 0
                    if size < 5 * 1024 * 1024: # max 5MB for text line counting
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            lines = sum(1 for _ in f)
                except Exception:
                    size = 0
                    lines = 0

                files_data.append({
                    "id": f"{repo_id}_{len(files_data) + 1}",
                    "repository_id": repo_id,
                    "path": rel_path,
                    "name": file,
                    "extension": ext,
                    "language": lang,
                    "size_bytes": size,
                    "line_count": lines,
                    "is_directory": False,
                    "parent_path": os.path.dirname(rel_path).replace('\\', '/') or None,
                })

                lang_counts[lang] = lang_counts.get(lang, 0) + 1
                total_files += 1

        # Calculate percentages
        lang_percentages: Dict[str, float] = {}
        if total_files > 0:
            for lang, count in lang_counts.items():
                lang_percentages[lang] = round((count / total_files) * 100, 1)

        return root_dir, files_data, lang_percentages

    @classmethod
    def parse_github_url(cls, url: str) -> Tuple[str, str, str]:
        """Extracts owner, repo, and branch from a GitHub URL."""
        pattern = r"github\.com[/:]([\w.-]+)/([\w.-]+?)(?:\.git)?(?:/tree/([\w.-]+))?$"
        match = re.search(pattern, url.strip())
        if not match:
            raise ValueError("Invalid GitHub repository URL. Must be in format https://github.com/owner/repo")
        owner, repo, branch = match.groups()
        return owner, repo, branch or "main"
