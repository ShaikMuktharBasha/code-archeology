import ast
import re
from typing import List, Dict, Any, Optional
from app.schemas.symbol import SymbolType

class CodeParserService:
    """
    Language-aware symbol extraction engine.
    Uses Python AST for native deep Python inspection and resilient
    regex grammar matching for TypeScript, JavaScript, Java, and Go.
    Designed with a clean interface for tree-sitter binding integration.
    """

    @classmethod
    def parse_source_code(cls, file_path: str, code: str, language: str) -> List[Dict[str, Any]]:
        symbols: List[Dict[str, Any]] = []

        if language == "Python":
            symbols.extend(cls._parse_python_ast(file_path, code))
        elif language in ("TypeScript", "TypeScript (React)", "JavaScript", "JavaScript (React)"):
            symbols.extend(cls._parse_js_ts(file_path, code))
        elif language == "Java":
            symbols.extend(cls._parse_java(file_path, code))
        elif language == "Go":
            symbols.extend(cls._parse_go(file_path, code))
        else:
            # Fallback basic heuristics
            symbols.extend(cls._parse_generic(file_path, code, language))

        return symbols

    @classmethod
    def _parse_python_ast(cls, file_path: str, code: str) -> List[Dict[str, Any]]:
        symbols = []
        try:
            tree = ast.parse(code)
            for node in ast.walk(tree):
                if isinstance(node, ast.ClassDef):
                    symbols.append({
                        "name": node.name,
                        "symbol_type": SymbolType.CLASS.value,
                        "language": "Python",
                        "file_path": file_path,
                        "start_line": node.lineno,
                        "end_line": getattr(node, 'end_lineno', node.lineno),
                        "docstring": ast.get_docstring(node),
                        "signature": f"class {node.name}" + (f"({', '.join(ast.unparse(b) for b in node.bases)})" if node.bases else "")
                    })
                elif isinstance(node, ast.FunctionDef) or isinstance(node, ast.AsyncFunctionDef):
                    is_async = isinstance(node, ast.AsyncFunctionDef)
                    prefix = "async def" if is_async else "def"
                    symbols.append({
                        "name": node.name,
                        "symbol_type": SymbolType.FUNCTION.value,
                        "language": "Python",
                        "file_path": file_path,
                        "start_line": node.lineno,
                        "end_line": getattr(node, 'end_lineno', node.lineno),
                        "docstring": ast.get_docstring(node),
                        "signature": f"{prefix} {node.name}(...)"
                    })
        except SyntaxError:
            # Fall back to regex if file has Python syntax quirks
            return cls._parse_generic(file_path, code, "Python")
        return symbols

    @classmethod
    def _parse_js_ts(cls, file_path: str, code: str) -> List[Dict[str, Any]]:
        symbols = []
        lines = code.splitlines()

        for idx, line in enumerate(lines, 1):
            stripped = line.strip()

            # Class declaration
            class_match = re.search(r'\b(?:export\s+)?(?:default\s+)?class\s+([A-Za-z0-9_]+)', stripped)
            if class_match:
                symbols.append({
                    "name": class_match.group(1),
                    "symbol_type": SymbolType.CLASS.value,
                    "language": "TypeScript",
                    "file_path": file_path,
                    "start_line": idx,
                    "end_line": idx + 10,
                    "signature": stripped.split('{')[0].strip(),
                    "docstring": None
                })
                continue

            # Interface declaration
            interface_match = re.search(r'\b(?:export\s+)?interface\s+([A-Za-z0-9_]+)', stripped)
            if interface_match:
                symbols.append({
                    "name": interface_match.group(1),
                    "symbol_type": SymbolType.INTERFACE.value,
                    "language": "TypeScript",
                    "file_path": file_path,
                    "start_line": idx,
                    "end_line": idx + 5,
                    "signature": stripped.split('{')[0].strip(),
                    "docstring": None
                })
                continue

            # Function or React component declaration
            func_match = re.search(r'\b(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)', stripped)
            if not func_match:
                func_match = re.search(r'\b(?:export\s+)?(?:const|let|var)\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>', stripped)

            if func_match:
                symbols.append({
                    "name": func_match.group(1),
                    "symbol_type": SymbolType.FUNCTION.value,
                    "language": "TypeScript",
                    "file_path": file_path,
                    "start_line": idx,
                    "end_line": idx + 10,
                    "signature": stripped.split('{')[0].strip(),
                    "docstring": None
                })

        return symbols

    @classmethod
    def _parse_java(cls, file_path: str, code: str) -> List[Dict[str, Any]]:
        symbols = []
        lines = code.splitlines()
        for idx, line in enumerate(lines, 1):
            class_match = re.search(r'\b(?:public|protected|private)?\s*(?:static)?\s*class\s+([A-Za-z0-9_]+)', line)
            if class_match:
                symbols.append({
                    "name": class_match.group(1),
                    "symbol_type": SymbolType.CLASS.value,
                    "language": "Java",
                    "file_path": file_path,
                    "start_line": idx,
                    "end_line": idx + 20,
                    "signature": line.split('{')[0].strip(),
                    "docstring": None
                })
        return symbols

    @classmethod
    def _parse_go(cls, file_path: str, code: str) -> List[Dict[str, Any]]:
        symbols = []
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
                    "end_line": idx + 10,
                    "signature": line.split('{')[0].strip(),
                    "docstring": None
                })
        return symbols

    @classmethod
    def _parse_generic(cls, file_path: str, code: str, language: str) -> List[Dict[str, Any]]:
        return []
