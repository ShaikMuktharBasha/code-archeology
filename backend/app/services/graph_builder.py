from typing import List
from app.schemas.graph import GraphNode, GraphEdge, RelationType, ArchitectureGraphResponse

class GraphBuilderService:
    """
    Transforms parsed symbols, modules, and file connections into
    a DAG (Directed Acyclic Graph) formatted for React Flow.
    """

    @classmethod
    def build_sample_architecture_graph(cls, repo_id: str) -> ArchitectureGraphResponse:
        nodes: List[GraphNode] = [
            GraphNode(
                id="api-gateway",
                type="moduleNode",
                position={"x": 420.0, "y": 40.0},
                data={
                    "label": "API Gateway & Ingress Router",
                    "kind": "module",
                    "layer": "ingress",
                    "path": "src/api/router.ts",
                    "language": "TypeScript",
                    "symbolsCount": 8,
                    "loc": 128,
                    "complexity": "Low",
                    "blastRadius": "Critical",
                    "status": "stable",
                    "badge": "HTTP / WS Ingress",
                    "description": "Central API routing hub intercepting public requests, applying CORS, authentication middleware, and rate limiting.",
                    "methods": [
                        {"name": "mountRoutes", "signature": "mountRoutes(app: Express): void", "visibility": "public", "startLine": 12, "endLine": 35},
                        {"name": "authMiddleware", "signature": "authMiddleware(req, res, next): Promise<void>", "visibility": "public", "isAsync": True, "startLine": 37, "endLine": 52},
                        {"name": "errorHandler", "signature": "errorHandler(err, req, res, next): void", "visibility": "public", "startLine": 55, "endLine": 74}
                    ],
                    "codeSnippet": "export const apiRouter = Router();\napiRouter.use('/auth', authRouter);\napiRouter.use('/repositories', repoRouter);\napiRouter.use('/graph', graphRouter);"
                }
            ),
            GraphNode(
                id="auth-service",
                type="serviceNode",
                position={"x": 120.0, "y": 240.0},
                data={
                    "label": "AuthService & JWT",
                    "kind": "class",
                    "layer": "domain",
                    "path": "src/services/auth.ts",
                    "language": "TypeScript",
                    "symbolsCount": 12,
                    "loc": 184,
                    "complexity": "Medium",
                    "blastRadius": "Critical",
                    "status": "security-critical",
                    "badge": "Domain Security",
                    "description": "Manages JWT verification, token revocation checking, public-key verification, and user claims extraction.",
                    "methods": [
                        {"name": "validateToken", "signature": "async validateToken(token: string): Promise<UserClaims>", "visibility": "public", "isAsync": True, "startLine": 23, "endLine": 46},
                        {"name": "isTokenRevoked", "signature": "private async isTokenRevoked(jti: string): Promise<boolean>", "visibility": "private", "isAsync": True, "startLine": 48, "endLine": 51},
                        {"name": "generateSessionToken", "signature": "generateSessionToken(payload: SessionPayload): string", "visibility": "public", "startLine": 54, "endLine": 70}
                    ],
                    "codeSnippet": "export class AuthService {\n  async validateToken(token: string): Promise<UserClaims> {\n    return jwt.verify(token, this.publicKey);\n  }\n}"
                }
            ),
            GraphNode(
                id="repo-ingestor",
                type="serviceNode",
                position={"x": 420.0, "y": 240.0},
                data={
                    "label": "IngestionEngine",
                    "kind": "class",
                    "layer": "domain",
                    "path": "src/services/ingestion.py",
                    "language": "Python",
                    "symbolsCount": 15,
                    "loc": 210,
                    "complexity": "High",
                    "blastRadius": "Caution",
                    "status": "active",
                    "badge": "Safe Ingestion",
                    "description": "Sanitizes and safely extracts uploaded ZIP archives, checks for zip-slip traversal exploits, and scans repository files.",
                    "methods": [
                        {"name": "process_zip_upload", "signature": "def process_zip_upload(zip_path: str, repo_id: str) -> dict", "visibility": "public", "startLine": 14, "endLine": 48},
                        {"name": "scan_directory", "signature": "def scan_directory(root_dir: str, repo_id: str) -> tuple", "visibility": "public", "startLine": 50, "endLine": 88},
                        {"name": "parse_github_url", "signature": "def parse_github_url(url: str) -> tuple", "visibility": "public", "startLine": 90, "endLine": 105}
                    ],
                    "codeSnippet": "class IngestionEngine:\n    def process_zip_upload(self, zip_path: str, repo_id: str) -> dict:\n        SecurityGuard.validate_zip(zip_path, target_dir)\n        return scan_directory(target_dir, repo_id)"
                }
            ),
            GraphNode(
                id="ai-agent",
                type="serviceNode",
                position={"x": 720.0, "y": 240.0},
                data={
                    "label": "GeminiContextEngine",
                    "kind": "class",
                    "layer": "domain",
                    "path": "src/services/gemini.py",
                    "language": "Python",
                    "symbolsCount": 9,
                    "loc": 165,
                    "complexity": "Medium",
                    "blastRadius": "Caution",
                    "status": "ai-ready",
                    "badge": "AI Grounding",
                    "description": "Connects to Google Gemini API via official Google Gen AI SDK. Budgets tokens and generates grounded citations.",
                    "methods": [
                        {"name": "ask_codebase", "signature": "async def ask_codebase(repo_id: str, query: str) -> ChatQueryResponse", "visibility": "public", "isAsync": True, "startLine": 18, "endLine": 58},
                        {"name": "budget_context_tokens", "signature": "def budget_context_tokens(chunks: list, max_tokens=8000) -> str", "visibility": "private", "startLine": 60, "endLine": 75}
                    ],
                    "codeSnippet": "class GeminiContextEngine:\n    async def ask_codebase(self, repo_id: str, query: str):\n        response = client.models.generate_content(model=MODEL, contents=prompt)\n        return parse_grounded_response(response)"
                }
            ),
            GraphNode(
                id="ast-parser",
                type="functionNode",
                position={"x": 280.0, "y": 450.0},
                data={
                    "label": "TreeSitterParser",
                    "kind": "function",
                    "layer": "analysis",
                    "path": "src/parser/ast.py",
                    "language": "Python",
                    "symbolsCount": 24,
                    "loc": 195,
                    "complexity": "High",
                    "blastRadius": "Critical",
                    "status": "optimized",
                    "badge": "Grammar AST",
                    "description": "Multi-language grammar parsing engine extracting AST syntax trees, class definitions, function signatures, and calls.",
                    "methods": [
                        {"name": "parse_source_code", "signature": "def parse_source_code(file_path: str, code: str, lang: str) -> list", "visibility": "public", "startLine": 15, "endLine": 35},
                        {"name": "_parse_python_ast", "signature": "def _parse_python_ast(file_path: str, code: str) -> list", "visibility": "private", "startLine": 38, "endLine": 65},
                        {"name": "_parse_js_ts", "signature": "def _parse_js_ts(file_path: str, code: str) -> list", "visibility": "private", "startLine": 68, "endLine": 110}
                    ],
                    "codeSnippet": "def parse_source_code(file_path: str, code: str, language: str):\n    tree = ast.parse(code)\n    for node in ast.walk(tree):\n        if isinstance(node, ast.ClassDef): ..."
                }
            ),
            GraphNode(
                id="graph-builder",
                type="functionNode",
                position={"x": 560.0, "y": 450.0},
                data={
                    "label": "GraphBuilderDAG",
                    "kind": "function",
                    "layer": "analysis",
                    "path": "src/graph/builder.py",
                    "language": "Python",
                    "symbolsCount": 18,
                    "loc": 140,
                    "complexity": "Medium",
                    "blastRadius": "Caution",
                    "status": "graph-core",
                    "badge": "DAG Topology",
                    "description": "Computes directed acyclic graphs, resolves symbol connections, identifies circular dependencies, and formats for React Flow.",
                    "methods": [
                        {"name": "build_architecture_dag", "signature": "def build_architecture_dag(symbols: list, imports: list) -> GraphResponse", "visibility": "public", "startLine": 10, "endLine": 45},
                        {"name": "detect_cycles", "signature": "def detect_cycles(edges: list) -> list", "visibility": "private", "startLine": 48, "endLine": 62}
                    ],
                    "codeSnippet": "def build_architecture_dag(symbols, imports):\n    nodes = create_graph_nodes(symbols)\n    edges = compute_directed_edges(imports)\n    return ArchitectureGraphResponse(nodes=nodes, edges=edges)"
                }
            ),
            GraphNode(
                id="postgres-db",
                type="databaseNode",
                position={"x": 220.0, "y": 660.0},
                data={
                    "label": "PostgreSQL + pgvector",
                    "kind": "database",
                    "layer": "storage",
                    "path": "src/database/schema.sql",
                    "language": "SQL",
                    "symbolsCount": 6,
                    "loc": 88,
                    "complexity": "Low",
                    "blastRadius": "Critical",
                    "status": "persisted",
                    "badge": "Relational Storage",
                    "description": "Stores indexed repositories, files, extracted AST symbols, dependency edges, and conversation histories.",
                    "methods": [
                        {"name": "repositories_table", "signature": "CREATE TABLE repositories (id UUID PRIMARY KEY, name VARCHAR...)", "visibility": "public", "startLine": 5, "endLine": 20},
                        {"name": "symbols_table", "signature": "CREATE TABLE symbols (id UUID PRIMARY KEY, name VARCHAR, file_id UUID...)", "visibility": "public", "startLine": 22, "endLine": 45}
                    ],
                    "codeSnippet": "CREATE EXTENSION IF NOT EXISTS vector;\nCREATE TABLE symbols (\n  id UUID PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  file_path VARCHAR(1000) NOT NULL\n);"
                }
            ),
            GraphNode(
                id="vector-index",
                type="databaseNode",
                position={"x": 620.0, "y": 660.0},
                data={
                    "label": "CodeChunkVectorStore",
                    "kind": "database",
                    "layer": "storage",
                    "path": "src/vectors/store.py",
                    "language": "Python",
                    "symbolsCount": 7,
                    "loc": 145,
                    "complexity": "Medium",
                    "blastRadius": "Minimal",
                    "status": "vector-search",
                    "badge": "HNSW Embeddings",
                    "description": "High-dimensional embedding store with HNSW indexing for rapid cosine similarity retrieval of relevant code chunks.",
                    "methods": [
                        {"name": "index_code_chunk", "signature": "async def index_code_chunk(chunk_id: str, vector: list): Promise<void>", "visibility": "public", "startLine": 15, "endLine": 35},
                        {"name": "find_nearest_neighbors", "signature": "async def find_nearest_neighbors(query_vec: list, top_k=5) -> list", "visibility": "public", "startLine": 38, "endLine": 60}
                    ],
                    "codeSnippet": "class CodeChunkVectorStore:\n    async def find_nearest_neighbors(self, query_vec, top_k=5):\n        return await db.execute(select(Chunk).order_by(Chunk.embedding.cosine_distance(query_vec)).limit(top_k))"
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
