from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.repository import FileNodeResponse, FileContentResponse
from app.services.repo_store import repo_store

router = APIRouter(prefix="/repositories/{id}/files", tags=["Files"])


@router.get("", response_model=List[FileNodeResponse])
async def list_repository_files(id: str, search: Optional[str] = Query(None)):
    """Returns the list of analyzed files for the given repository."""
    if not repo_store.get_repository(id):
        raise HTTPException(status_code=404, detail="Repository not found")
    files = repo_store.get_files(id)
    if search:
        search_lower = search.lower()
        return [f for f in files if search_lower in f["path"].lower()]
    return files


@router.get("/content", response_model=FileContentResponse)
async def get_file_content(id: str, path: str = Query(...)):
    """Retrieves the actual source code content and associated AST symbols of a specific file."""
    if not repo_store.get_repository(id):
        raise HTTPException(status_code=404, detail="Repository not found")

    matched = repo_store.get_file_by_path(id, path)
    if not matched:
        raise HTTPException(status_code=404, detail="File not found in repository")

    file_symbols = [
        {
            "name": s["name"],
            "type": s["symbol_type"],
            "start_line": s["start_line"],
            "end_line": s["end_line"],
        }
        for s in repo_store.get_symbols(id)
        if s["file_path"] == matched["path"]
    ]

    return FileContentResponse(
        id=matched["id"],
        path=matched["path"],
        name=matched["name"],
        language=matched.get("language"),
        line_count=matched.get("line_count", 0),
        content=matched.get("content") or f"// Binary or empty file: {matched['path']}",
        symbols=file_symbols,
    )
