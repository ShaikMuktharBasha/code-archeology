import ast
import re
from typing import List, Dict, Any
from app.schemas.symbol import SymbolType


class CodeParserService:
    """
    Language-aware symbol and import extraction engine.
    Uses Python AST for native deep Python inspection and resilient
    regex grammar matching for TypeScript, JavaScript, Java, and Go.
    """

    @classmethod
    def parse_source_code(cls, file_path: str, code: str, language: str) -> List[Dict[str, Any]]:
        if not code:
            return []

        if language == "Python":
            return cls._parse_python_ast(file_path, code)
        elif language in ("TypeScript", "TypeScript (React)", "JavaScript", "JavaScript (React)"):
            return cls._parse_js_ts(file_path, code, language)
        elif language == "Java":
            return cls._parse_java(file_path, code)
        elif language == "Go":
            return cls._parse_go(file_path, code)
        return []

    @classmethod
    def extract_imports(cls, code: str, language: str) -> List[str]:
        """Extracts imported module/file paths from source code."""
        if not code:
            return []
        imports: List[str] = []

        if language == "Python":
            try:
                tree = ast.parse(code)
                for node in ast.walk(tree):
                    if isinstance(node, ast.Import):
                        for alias in node.names:
                            imports.append(alias.name)
                    elif isinstance(node, ast.ImportFrom) and node.module:
                        imports.append(node.module)
            except SyntaxError:
                for match in re.findall(r'^\s*(?:from|import)\s+([a-zA-Z0-9_.]+)', code, re.MULTILINE):
                    imports.append(match)

        elif language in ("TypeScript", "TypeScript (React)", "JavaScript", "JavaScript (React)"):
            for match in re.findall(r'''(?:import|export)\s+.*?\s+from\s+['"]([^'"]+)['"]''', code):
                imports.append(match)
            for match in re.findall(r'''require\(['"]([^'"]+)['"]\)''', code):
                imports.append(match)

        elif language == "Go":
            for match in re.findall(r'^\s*import\s+"([^"]+)"', code, re.MULTILINE):
                imports.append(match)

        elif language == "Java":
            for match in re.findall(r'^\s*import\s+([a-zA-Z0-9_.]+);', code, re.MULTILINE):
                imports.append(match)

        return list(dict.fromkeys(imports))

    @classmethod
    def _parse_python_ast(cls, file_path: str, code: str) -> List[Dict[str, Any]]:
        symbols: List[Dict[str, Any]] = []
        try:
            tree = ast.parse(code)
            for node in ast.walk(tree):
                if isinstance(node, ast.ClassDef):
                    bases = ", ".join(ast.unparse(b) for b in node.bases) if node.bases else ""
                    symbols.append({
                        "name": node.name,
                        "symbol_type": SymbolType.CLASS.value,
                        "language": "Python",
                        "file_path": file_path,
                        "start_line": node.lineno,
                        "end_line": getattr(node, "end_lineno", node.lineno),
                        "docstring": ast.get_docstring(node),
                        "signature": f"class {node.name}({bases})" if bases else f"class {node.name}",
                    })
                elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    is_async = isinstance(node, ast.AsyncFunctionDef)
                    prefix = "async def" if is_async else "def"
                    args = [a.arg for a in node.args.args[:4]]
                    arg_str = ", ".join(args) + (", ..." if len(node.args.args) > 4 else "")
                    symbols.append({
                        "name": node.name,
                        "symbol_type": SymbolType.FUNCTION.value,
                        "language": "Python",
                        "file_path": file_path,
                        "start_line": node.lineno,
                        "end_line": getattr(node, "end_lineno", node.lineno),
                        "docstring": ast.get_docstring(node),
                        "signature": f"{prefix} {node.name}({arg_str})",
                    })
        except SyntaxError:
            # Regex fallback for Python syntax quirks
            for idx, line in enumerate(code.splitlines(), 1):
                m_cls = re.match(r'^\s*class\s+([A-Za-z0-9_]+)', line)
                if m_cls:
                    symbols.append({
                        "name": m_cls.group(1),
                        "symbol_type": SymbolType.CLASS.value,
                        "language": "Python",
                        "file_path": file_path,
                        "start_line": idx,
                        "end_line": idx + 5,
                        "signature": line.strip().rstrip(':'),
                        "docstring": None,
                    })
                m_fn = re.match(r'^\s*(?:async\s+)?def\s+([A-Za-z0-9_]+)', line)
                if m_fn:
                    symbols.append({
                        "name": m_fn.group(1),
                        "symbol_type": SymbolType.FUNCTION.value,
                        "language": "Python",
                        "file_path": file_path,
                        "start_line": idx,
                        "end_line": idx + 5,
                        "signature": line.strip().rstrip(':'),
                        "docstring": None,
                    })
        return symbols

    @classmethod
    def _parse_js_ts(cls, file_path: str, code: str, language: str) -> List[Dict[str, Any]]:
        symbols: List[Dict[str, Any]] = []
        lines = code.splitlines()
        lang_label = "TypeScript" if "TypeScript" in language else "JavaScript"

        for idx, line in enumerate(lines, 1):
            stripped = line.strip()

            class_match = re.search(r'\b(?:export\s+)?(?:default\s+)?class\s+([A-Za-z0-9_]+)', stripped)
            if class_match:
                symbols.append({
                    "name": class_match.group(1),
                    "symbol_type": SymbolType.CLASS.value,
                    "language": lang_label,
                    "file_path": file_path,
                    "start_line": idx,
                    "end_line": min(len(lines), idx + 15),
                    "signature": stripped.split('{')[0].strip(),
                    "docstring": None,
                })
                continue

            interface_match = re.search(r'\b(?:export\s+)?interface\s+([A-Za-z0-9_]+)', stripped)
            if interface_match:
                symbols.append({
                    "name": interface_match.group(1),
                    "symbol_type": SymbolType.INTERFACE.value,
                    "language": lang_label,
                    "file_path": file_path,
                    "start_line": idx,
                    "end_line": min(len(lines), idx + 8),
                    "signature": stripped.split('{')[0].strip(),
                    "docstring": None,
                })
                continue

            func_match = re.search(r'\b(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)', stripped)
            if not func_match:
                func_match = re.search(
                    r'\b(?:export\s+)?(?:const|let)\s+([A-Za-z0-9_]+)\s*(?::[^=]+)?=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>',
                    stripped,
                )

            if func_match:
                symbols.append({
                    "name": func_match.group(1),
                    "symbol_type": SymbolType.FUNCTION.value,
                    "language": lang_label,
                    "file_path": file_path,
                    "start_line": idx,
                    "end_line": min(len(lines), idx + 12),
                    "signature": stripped.split('{')[0].strip(),
                    "docstring": None,
                })

        return symbols

    @classmethod
    def _parse_java(cls, file_path: str, code: str) -> List[Dict[str, Any]]:
        symbols: List[Dict[str, Any]] = []
        lines = code.splitlines()
        for idx, line in enumerate(lines, 1):
            class_match = re.search(
                r'\b(?:public|protected|private)?\s*(?:abstract|final|static)?\s*(?:class|interface|enum)\s+([A-Za-z0-9_]+)',
                line,
            )
            if class_match:
                symbols.append({
                    "name": class_match.group(1),
                    "symbol_type": SymbolType.CLASS.value,
                    "language": "Java",
                    "file_path": file_path,
                    "start_line": idx,
                    "end_line": min(len(lines), idx + 20),
                    "signature": line.split('{')[0].strip(),
                    "docstring": None,
                })
        return symbols

    @classmethod
    def _parse_go(cls, file_path: str, code: str) -> List[Dict[str, Any]]:
        symbols: List[Dict[str, Any]] = []
        lines = code.splitlines()
        for idx, line in enumerate(lines, 1):
            fn_match = re.search(r'^func\s+(?:\([^)]+\)\s+)?([A-Za-z0-9_]+)', line)
            if fn_match:
                symbols.append({
                    "name": fn_match.group(1),
                    "symbol_type": SymbolType.FUNCTION.value,
                    "language": "Go",
                    "file_path": file_path,
                    "start_line": idx,
                    "end_line": min(len(lines), idx + 12),
                    "signature": line.split('{')[0].strip(),
                    "docstring": None,
                })
            type_match = re.search(r'^type\s+([A-Za-z0-9_]+)\s+(?:struct|interface)', line)
            if type_match:
                symbols.append({
                    "name": type_match.group(1),
                    "symbol_type": SymbolType.CLASS.value,
                    "language": "Go",
                    "file_path": file_path,
                    "start_line": idx,
                    "end_line": min(len(lines), idx + 10),
                    "signature": line.split('{')[0].strip(),
                    "docstring": None,
                })
        return symbols
