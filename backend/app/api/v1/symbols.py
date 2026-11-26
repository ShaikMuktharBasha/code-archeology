from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.symbol import SymbolResponse, SymbolType
from app.services.repo_store import repo_store

router = APIRouter(prefix="/repositories/{id}/symbols", tags=["Symbols"])


@router.get("", response_model=List[SymbolResponse])
async def list_symbols(
    id: str,
    symbol_type: Optional[SymbolType] = Query(None),
    search: Optional[str] = Query(None),
):
    """Retrieves all parsed AST symbols for the given repository."""
    if not repo_store.get_repository(id):
        raise HTTPException(status_code=404, detail="Repository not found")

    results = repo_store.get_symbols(id)
    if symbol_type:
        results = [s for s in results if s["symbol_type"] == symbol_type.value]
    if search:
        search_lower = search.lower()
        results = [
            s for s in results
            if search_lower in s["name"].lower() or search_lower in s["file_path"].lower()
        ]
    return results
