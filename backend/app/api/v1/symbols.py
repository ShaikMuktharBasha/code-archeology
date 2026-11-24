from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.symbol import SymbolResponse, SymbolType

router = APIRouter(prefix="/repositories/{id}/symbols", tags=["Symbols"])

SAMPLE_SYMBOLS = [
    {
        "id": "sym-1",
        "repository_id": "repo-sample-1",
        "file_id": "f-2",
        "name": "AuthService",
        "symbol_type": SymbolType.CLASS,
        "language": "TypeScript",
        "file_path": "src/services/auth.ts",
        "start_line": 9,
        "end_line": 52,
        "signature": "export class AuthService",
        "docstring": "AuthService handles token verification and session lifecycle.",
        "metadata_json": {"methods_count": 2}
    },
    {
        "id": "sym-2",
        "repository_id": "repo-sample-1",
        "file_id": "f-2",
        "name": "validateToken",
        "symbol_type": SymbolType.FUNCTION,
        "language": "TypeScript",
        "file_path": "src/services/auth.ts",
        "start_line": 23,
        "end_line": 46,
        "signature": "async validateToken(token: string): Promise<UserClaims>",
        "docstring": "Validates inbound bearer token and extracts verified claims.",
        "metadata_json": {"is_async": True, "return_type": "Promise<UserClaims>"}
    },
    {
        "id": "sym-3",
        "repository_id": "repo-sample-1",
        "file_id": "f-3",
        "name": "IngestionEngine",
        "symbol_type": SymbolType.CLASS,
        "language": "Python",
        "file_path": "src/services/ingestion.py",
        "start_line": 15,
        "end_line": 85,
        "signature": "class IngestionEngine",
        "docstring": "Safely processes and unpacks source repository archives.",
        "metadata_json": {"methods_count": 4}
    },
    {
        "id": "sym-4",
        "repository_id": "repo-sample-1",
        "file_id": "f-4",
        "name": "TreeSitterParser",
        "symbol_type": SymbolType.FUNCTION,
        "language": "Python",
        "file_path": "src/parser/ast.py",
        "start_line": 20,
        "end_line": 90,
        "signature": "def parse_ast_tree(source: str, lang: str) -> ASTNode",
        "docstring": "Generates language-aware syntax nodes from raw code stream.",
        "metadata_json": {"language": "Python"}
    }
]

@router.get("", response_model=List[SymbolResponse])
async def list_symbols(
    id: str,
    symbol_type: Optional[SymbolType] = Query(None),
    search: Optional[str] = Query(None)
):
    """Retrieves all parsed symbols (classes, functions, interfaces, modules) in the codebase."""
    results = SAMPLE_SYMBOLS
    if symbol_type:
        results = [s for s in results if s["symbol_type"] == symbol_type]
    if search:
        search_lower = search.lower()
        results = [s for s in results if search_lower in s["name"].lower() or search_lower in s["file_path"].lower()]
    return results
