from fastapi import APIRouter, HTTPException
from app.schemas.graph import ArchitectureGraphResponse
from app.services.repo_store import repo_store

router = APIRouter(prefix="/repositories/{id}", tags=["Architecture Graph"])


@router.get("/graph", response_model=ArchitectureGraphResponse)
async def get_architecture_graph(id: str):
    """
    Returns the dynamically computed architecture DAG for the repository,
    built from its actual files, AST symbols, and import relationships.
    """
    graph = repo_store.get_graph(id)
    if not graph:
        raise HTTPException(status_code=404, detail="Repository graph not found")
    return graph


@router.get("/dependencies")
async def get_repository_dependencies(id: str):
    """Returns the resolved dependency edges for the repository."""
    graph = repo_store.get_graph(id)
    if not graph:
        raise HTTPException(status_code=404, detail="Repository not found")
    return {
        "repository_id": id,
        "total_edges": len(graph.edges),
        "dependencies": graph.edges,
    }
