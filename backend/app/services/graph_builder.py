from typing import List, Dict, Any
from app.schemas.graph import GraphNode, GraphEdge, RelationType, ArchitectureGraphResponse


class GraphBuilderService:
    """
    Transforms real parsed files, AST symbols, and import relationships into
    a layered Directed Acyclic Graph (DAG) formatted for React Flow.
    """

    @classmethod
    def _classify_file(cls, path: str, file_symbols: List[Dict[str, Any]]) -> tuple[str, str, str]:
        """Returns (node_type, layer, badge) based on real file path & symbols."""
        p = path.lower()
        if any(k in p for k in ("schema", "model", "database", "db.", "store", "vector", "prisma", "migration", ".sql")):
            return "databaseNode", "storage", "Data & Models"
        if any(k in p for k in ("router", "route", "api/", "controller", "endpoint", "gateway", "main.", "app.", "index.", "server.")):
            return "moduleNode", "ingress", "Entry / Routing"
        if any(k in p for k in ("parser", "ast", "graph", "analyzer", "engine", "worker", "util", "helper")):
            return "functionNode", "analysis", "Core Logic"
        if any(s.get("symbol_type") == "class" for s in file_symbols) or "service" in p:
            return "serviceNode", "domain", "Service / Class"
        return "functionNode", "domain", "Module"

    @classmethod
    def _resolve_import_target(cls, imp: str, all_files: List[Dict[str, Any]]) -> Dict[str, Any] | None:
        """Matches an import string (e.g. 'app.core.config' or './auth') to an actual repository file."""
        norm_imp = imp.replace(".", "/").lstrip("./")
        if not norm_imp:
            return None

        # Exact or suffix match against file paths without extension
        for f in all_files:
            path_no_ext = f["path"].rsplit(".", 1)[0]
            if path_no_ext == norm_imp or path_no_ext.endswith("/" + norm_imp) or path_no_ext.endswith(norm_imp):
                return f
            # Handle Python __init__.py or index.ts
            if path_no_ext.endswith("/__init__") or path_no_ext.endswith("/index"):
                pkg_dir = path_no_ext.rsplit("/", 1)[0]
                if pkg_dir == norm_imp or pkg_dir.endswith("/" + norm_imp):
                    return f
        return None

    @classmethod
    def build_graph_from_repo(
        cls,
        repo_id: str,
        files: List[Dict[str, Any]],
        symbols: List[Dict[str, Any]],
        imports_map: Dict[str, List[str]],
        max_nodes: int = 16,
    ) -> ArchitectureGraphResponse:
        """
        Dynamically builds a clean, layered React Flow architecture graph from
        a repository's actual scanned files, AST symbols, and import edges.
        """
        # Filter to code files (exclude markdown/json/txt unless no code files exist)
        code_files = [
            f for f in files
            if f.get("language") not in ("Other", "Markdown", "JSON", "YAML", "TOML")
        ]
        if not code_files:
            code_files = files

        # Score files by symbol count + import centrality so we surface the most architectural files
        scores: Dict[str, int] = {}
        for f in code_files:
            p = f["path"]
            score = f.get("symbols_count", 0) * 3 + len(imports_map.get(p, [])) * 2
            if any(k in p.lower() for k in ("main", "app", "index", "router", "server", "service", "model")):
                score += 10
            scores[p] = score

        top_files = sorted(code_files, key=lambda f: scores.get(f["path"], 0), reverse=True)[:max_nodes]
        top_paths = {f["path"] for f in top_files}

        # Group symbols by file_path
        symbols_by_file: Dict[str, List[Dict[str, Any]]] = {}
        for s in symbols:
            symbols_by_file.setdefault(s["file_path"], []).append(s)

        # Resolve real edges among top_files
        edges: List[GraphEdge] = []
        inbound_counts: Dict[str, int] = {}
        seen_edges = set()

        for src_file in top_files:
            src_path = src_file["path"]
            for imp in imports_map.get(src_path, []):
                target_file = cls._resolve_import_target(imp, top_files)
                if target_file and target_file["path"] != src_path:
                    edge_key = (src_file["id"], target_file["id"])
                    if edge_key not in seen_edges:
                        seen_edges.add(edge_key)
                        inbound_counts[target_file["id"]] = inbound_counts.get(target_file["id"], 0) + 1
                        edges.append(
                            GraphEdge(
                                id=f"e-{src_file['id']}-{target_file['id']}",
                                source=src_file["id"],
                                target=target_file["id"],
                                label=f"imports {imp.split('.')[-1].split('/')[-1]}",
                                relation_type=RelationType.IMPORTS,
                                animated=True,
                            )
                        )

        # Group nodes by layer for clean non-overlapping coordinates
        layer_buckets: Dict[str, List[Dict[str, Any]]] = {
            "ingress": [],
            "domain": [],
            "analysis": [],
            "storage": [],
        }
        file_classifications: Dict[str, tuple[str, str, str]] = {}
        for f in top_files:
            f_syms = symbols_by_file.get(f["path"], [])
            node_type, layer, badge = cls._classify_file(f["path"], f_syms)
            file_classifications[f["id"]] = (node_type, layer, badge)
            layer_buckets[layer].append(f)

        layer_y = {"ingress": 40.0, "domain": 250.0, "analysis": 460.0, "storage": 670.0}
        nodes: List[GraphNode] = []
        stats = {"total_nodes": 0, "total_edges": len(edges), "modules": 0, "classes": 0, "functions": 0, "databases": 0}

        for layer_name, bucket in layer_buckets.items():
            if not bucket:
                continue
            y = layer_y[layer_name]
            spacing_x = 320.0
            start_x = max(60.0, 480.0 - ((len(bucket) - 1) * spacing_x) / 2.0)

            for idx, f in enumerate(bucket):
                node_type, layer, badge = file_classifications[f["id"]]
                f_syms = symbols_by_file.get(f["path"], [])
                loc = f.get("line_count", 0)
                sym_cnt = len(f_syms)
                inbound = inbound_counts.get(f["id"], 0)

                complexity = "High" if loc > 200 or sym_cnt > 12 else ("Medium" if loc > 80 or sym_cnt > 4 else "Low")
                blast = "Critical" if inbound >= 3 else ("Caution" if inbound >= 1 else "Minimal")

                methods_list = [
                    {
                        "name": s["name"],
                        "signature": s.get("signature") or s["name"],
                        "visibility": "private" if s["name"].startswith("_") else "public",
                        "isAsync": "async" in (s.get("signature") or ""),
                        "startLine": s["start_line"],
                        "endLine": s["end_line"],
                    }
                    for s in f_syms[:10]
                ]

                content_lines = (f.get("content") or "").splitlines()[:8]
                snippet = "\n".join(content_lines) if content_lines else f"// {f['path']}"

                if node_type == "moduleNode":
                    stats["modules"] += 1
                elif node_type == "serviceNode":
                    stats["classes"] += 1
                elif node_type == "databaseNode":
                    stats["databases"] += 1
                else:
                    stats["functions"] += 1

                nodes.append(
                    GraphNode(
                        id=f["id"],
                        type=node_type,
                        position={"x": round(start_x + idx * spacing_x, 1), "y": y},
                        data={
                            "label": f["name"],
                            "kind": "database" if node_type == "databaseNode" else ("module" if node_type == "moduleNode" else ("class" if node_type == "serviceNode" else "function")),
                            "layer": layer,
                            "path": f["path"],
                            "language": f.get("language") or "Code",
                            "symbolsCount": sym_cnt,
                            "loc": loc,
                            "complexity": complexity,
                            "blastRadius": blast,
                            "status": "indexed",
                            "badge": badge,
                            "description": f"{f['path']} ({f.get('language', 'Code')}, {loc} lines, {sym_cnt} extracted AST symbols).",
                            "methods": methods_list,
                            "codeSnippet": snippet,
                        },
                    )
                )

        stats["total_nodes"] = len(nodes)
        return ArchitectureGraphResponse(
            repository_id=repo_id,
            nodes=nodes,
            edges=edges,
            stats=stats,
        )

    @classmethod
    def build_sample_architecture_graph(cls, repo_id: str) -> ArchitectureGraphResponse:
        """Retained for sample repository fallback."""
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
                    ],
                    "codeSnippet": "export const apiRouter = Router();\napiRouter.use('/auth', authRouter);\napiRouter.use('/repositories', repoRouter);"
                }
            ),
            GraphNode(
                id="auth-service",
                type="serviceNode",
                position={"x": 140.0, "y": 240.0},
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
                    "description": "Manages JWT verification, token revocation checking, and user claims extraction.",
                    "methods": [
                        {"name": "validateToken", "signature": "async validateToken(token: string): Promise<UserClaims>", "visibility": "public", "isAsync": True, "startLine": 23, "endLine": 46},
                        {"name": "isTokenRevoked", "signature": "private async isTokenRevoked(jti: string): Promise<boolean>", "visibility": "private", "isAsync": True, "startLine": 48, "endLine": 51},
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
                    "description": "Sanitizes and safely extracts uploaded ZIP archives and scans repository files.",
                    "methods": [
                        {"name": "process_zip_upload", "signature": "def process_zip_upload(zip_path: str, repo_id: str) -> dict", "visibility": "public", "startLine": 14, "endLine": 48},
                    ],
                    "codeSnippet": "class IngestionEngine:\n    def process_zip_upload(self, zip_path: str, repo_id: str) -> dict:\n        SecurityGuard.validate_zip(zip_path, target_dir)"
                }
            ),
            GraphNode(
                id="postgres-db",
                type="databaseNode",
                position={"x": 280.0, "y": 460.0},
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
                    "description": "Stores indexed repositories, files, extracted AST symbols, and vector embeddings.",
                    "methods": [],
                    "codeSnippet": "CREATE EXTENSION IF NOT EXISTS vector;\nCREATE TABLE symbols (id UUID PRIMARY KEY, name VARCHAR(255));"
                }
            ),
        ]

        edges: List[GraphEdge] = [
            GraphEdge(id="e1-2", source="api-gateway", target="auth-service", label="calls: validateToken", relation_type=RelationType.CALLS, animated=True),
            GraphEdge(id="e1-3", source="api-gateway", target="repo-ingestor", label="calls: process_zip", relation_type=RelationType.CALLS, animated=True),
            GraphEdge(id="e2-4", source="auth-service", target="postgres-db", label="imports: DB session", relation_type=RelationType.IMPORTS),
            GraphEdge(id="e3-4", source="repo-ingestor", target="postgres-db", label="persists AST", relation_type=RelationType.DEPENDS_ON),
        ]

        return ArchitectureGraphResponse(
            repository_id=repo_id,
            nodes=nodes,
            edges=edges,
            stats={"total_nodes": len(nodes), "total_edges": len(edges), "modules": 1, "classes": 2, "functions": 0, "databases": 1}
        )
