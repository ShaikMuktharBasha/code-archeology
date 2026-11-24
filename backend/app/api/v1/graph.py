from fastapi import APIRouter
from app.schemas.graph import ArchitectureGraphResponse
from app.services.graph_builder import GraphBuilderService

router = APIRouter(prefix="/repositories/{id}", tags=["Architecture Graph"])

@router.get("/graph", response_model=ArchitectureGraphResponse)
async def get_architecture_graph(id: str):
    """
    Returns the complete architecture Directed Acyclic Graph (DAG) for the repository,
    optimized for React Flow rendering.
    """
    return GraphBuilderService.build_sample_architecture_graph(id)

@router.get("/dependencies")
async def get_repository_dependencies(id: str):
    """
    Returns the dependency list and metrics for the repository.
    """
    graph = GraphBuilderService.build_sample_architecture_graph(id)
    return {
        "repository_id": id,
        "total_edges": len(graph.edges),
        "dependencies": graph.edges
    }
