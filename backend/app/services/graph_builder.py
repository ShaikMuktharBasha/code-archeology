from typing import List, Dict, Any
from app.schemas.graph import GraphNode, GraphEdge, RelationType, ArchitectureGraphResponse

class GraphBuilderService:
    """
    Transforms parsed symbols, modules, and file connections into
    a DAG (Directed Acyclic Graph) formatted for React Flow.
    """

    @classmethod
    def build_sample_architecture_graph(cls, repo_id: str) -> ArchitectureGraphResponse:
        """
        Generates a rich, realistic sample architecture DAG for visual exploration
        and immediate interactive testing in Code Archaeologist.
        """
        nodes: List[GraphNode] = [
            GraphNode(
                id="api-gateway",
                type="moduleNode",
                position={"x": 400.0, "y": 50.0},
                data={
                    "label": "API Gateway & Router",
                    "kind": "module",
                    "path": "src/api/router.ts",
                    "language": "TypeScript",
                    "symbolsCount": 8,
                    "status": "stable",
                    "badge": "Core Routing"
                }
            ),
            GraphNode(
                id="auth-service",
                type="serviceNode",
                position={"x": 150.0, "y": 200.0},
                data={
                    "label": "AuthService & JWT",
                    "kind": "class",
                    "path": "src/services/auth.ts",
                    "language": "TypeScript",
                    "symbolsCount": 12,
                    "status": "security-critical",
                    "badge": "Authentication"
                }
            ),
            GraphNode(
                id="repo-ingestor",
                type="serviceNode",
                position={"x": 400.0, "y": 200.0},
                data={
                    "label": "IngestionEngine",
                    "kind": "class",
                    "path": "src/services/ingestion.py",
                    "language": "Python",
                    "symbolsCount": 15,
                    "status": "active",
                    "badge": "Ingestion"
                }
            ),
            GraphNode(
                id="ai-agent",
                type="serviceNode",
                position={"x": 650.0, "y": 200.0},
                data={
                    "label": "GeminiContextEngine",
                    "kind": "class",
                    "path": "src/services/gemini.py",
                    "language": "Python",
                    "symbolsCount": 9,
                    "status": "ai-ready",
                    "badge": "AI Retrieval"
                }
            ),
            GraphNode(
                id="ast-parser",
                type="functionNode",
                position={"x": 300.0, "y": 360.0},
                data={
                    "label": "TreeSitterParser",
                    "kind": "function",
                    "path": "src/parser/ast.py",
                    "language": "Python",
                    "symbolsCount": 24,
                    "status": "optimized",
                    "badge": "AST Resolution"
                }
            ),
            GraphNode(
                id="graph-builder",
                type="functionNode",
                position={"x": 500.0, "y": 360.0},
                data={
                    "label": "GraphBuilderDAG",
                    "kind": "function",
                    "path": "src/graph/builder.py",
                    "language": "Python",
                    "symbolsCount": 18,
                    "status": "graph-core",
                    "badge": "Topology"
                }
            ),
            GraphNode(
                id="postgres-db",
                type="databaseNode",
                position={"x": 250.0, "y": 520.0},
                data={
                    "label": "PostgreSQL + pgvector",
                    "kind": "database",
                    "path": "src/database/schema.sql",
                    "language": "SQL",
                    "symbolsCount": 6,
                    "status": "persisted",
                    "badge": "Storage & Vectors"
                }
            ),
            GraphNode(
                id="vector-index",
                type="databaseNode",
                position={"x": 550.0, "y": 520.0},
                data={
                    "label": "CodeChunkEmbeddingStore",
                    "kind": "database",
                    "path": "src/vectors/store.py",
                    "language": "Python",
                    "symbolsCount": 7,
                    "status": "vector-search",
                    "badge": "pgvector Index"
                }
            ),
        ]

        edges: List[GraphEdge] = [
            GraphEdge(
                id="e1-2",
                source="api-gateway",
                target="auth-service",
                label="authenticates",
                relation_type=RelationType.CALLS,
                animated=True
            ),
            GraphEdge(
                id="e1-3",
                source="api-gateway",
                target="repo-ingestor",
                label="dispatches upload",
                relation_type=RelationType.CALLS,
                animated=True
            ),
            GraphEdge(
                id="e1-4",
                source="api-gateway",
                target="ai-agent",
                label="queries context",
                relation_type=RelationType.CALLS
            ),
            GraphEdge(
                id="e3-5",
                source="repo-ingestor",
                target="ast-parser",
                label="extracts AST",
                relation_type=RelationType.DEPENDS_ON
            ),
            GraphEdge(
                id="e5-6",
                source="ast-parser",
                target="graph-builder",
                label="streams symbols",
                relation_type=RelationType.DEPENDS_ON
            ),
            GraphEdge(
                id="e6-7",
                source="graph-builder",
                target="postgres-db",
                label="persists relations",
                relation_type=RelationType.IMPORTS
            ),
            GraphEdge(
                id="e4-8",
                source="ai-agent",
                target="vector-index",
                label="similarity search",
                relation_type=RelationType.DEPENDS_ON
            ),
            GraphEdge(
                id="e8-7",
                source="vector-index",
                target="postgres-db",
                label="hnsw vector index",
                relation_type=RelationType.DEPENDS_ON
            ),
        ]

        return ArchitectureGraphResponse(
            repository_id=repo_id,
            nodes=nodes,
            edges=edges,
            stats={
                "total_nodes": len(nodes),
                "total_edges": len(edges),
                "modules": 1,
                "classes": 3,
                "functions": 2,
                "databases": 2
            }
        )
