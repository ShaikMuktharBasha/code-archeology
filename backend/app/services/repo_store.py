from datetime import datetime
from typing import Dict, Any, List, Optional
from app.services.graph_builder import GraphBuilderService
from app.schemas.graph import ArchitectureGraphResponse
from app.schemas.symbol import SymbolType


class RepoStore:
    """
    Central per-repository store holding real analyzed files, source contents,
    extracted AST symbols, import relationships, and computed architecture graphs.
    """

    def __init__(self) -> None:
        self._repos: Dict[str, Dict[str, Any]] = {}
        self._seed_sample_repos()

    def _seed_sample_repos(self) -> None:
        now = datetime.utcnow()
        sample_auth_code = """// src/services/auth.ts
import jwt from 'jsonwebtoken';
import { UserClaims } from '../types/auth';
import { db } from '../database/schema';

export class AuthService {
  private readonly publicKey: string;

  constructor() {
    this.publicKey = process.env.JWT_PUBLIC_KEY || 'default-secret-key';
  }

  async validateToken(token: string): Promise<UserClaims> {
    if (!token) throw new Error('Missing bearer token');
    const decoded = jwt.verify(token, this.publicKey) as UserClaims;
    const isRevoked = await this.isTokenRevoked(decoded.jti);
    if (isRevoked) throw new Error('Token has been revoked');
    return decoded;
  }

  private async isTokenRevoked(jti: string): Promise<boolean> {
    const session = await db.sessions.findUnique({ where: { id: jti } });
    return session ? session.is_revoked : true;
  }
}
"""
        sample_router_code = """// src/api/router.ts
import { Router } from 'express';
import { AuthService } from '../services/auth';
import { IngestionEngine } from '../services/ingestion';

const authService = new AuthService();

export async function authMiddleware(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(' ')[1];
  req.user = await authService.validateToken(token);
  next();
}
"""
        sample_ingestion_code = """# src/services/ingestion.py
import os
import zipfile

class IngestionEngine:
    \"\"\"Safe ingestion and file unpacker with zip slip validation.\"\"\"
    def process_zip_upload(self, zip_path: str, repo_id: str) -> dict:
        target_dir = os.path.join('/tmp', repo_id)
        os.makedirs(target_dir, exist_ok=True)
        return {"repo_id": repo_id, "status": "extracted"}
"""
        sample_schema_code = """-- src/database/schema.sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE repositories (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
"""
        files_1 = [
            {"id": "f-1", "repository_id": "repo-sample-1", "path": "src/api/router.ts", "name": "router.ts", "extension": ".ts", "language": "TypeScript", "size_bytes": len(sample_router_code), "line_count": len(sample_router_code.splitlines()), "is_directory": False, "parent_path": "src/api", "symbols_count": 1, "content": sample_router_code},
            {"id": "f-2", "repository_id": "repo-sample-1", "path": "src/services/auth.ts", "name": "auth.ts", "extension": ".ts", "language": "TypeScript", "size_bytes": len(sample_auth_code), "line_count": len(sample_auth_code.splitlines()), "is_directory": False, "parent_path": "src/services", "symbols_count": 3, "content": sample_auth_code},
            {"id": "f-3", "repository_id": "repo-sample-1", "path": "src/services/ingestion.py", "name": "ingestion.py", "extension": ".py", "language": "Python", "size_bytes": len(sample_ingestion_code), "line_count": len(sample_ingestion_code.splitlines()), "is_directory": False, "parent_path": "src/services", "symbols_count": 2, "content": sample_ingestion_code},
            {"id": "f-4", "repository_id": "repo-sample-1", "path": "src/database/schema.sql", "name": "schema.sql", "extension": ".sql", "language": "SQL", "size_bytes": len(sample_schema_code), "line_count": len(sample_schema_code.splitlines()), "is_directory": False, "parent_path": "src/database", "symbols_count": 0, "content": sample_schema_code},
        ]
        symbols_1 = [
            {"id": "sym-1", "repository_id": "repo-sample-1", "file_id": "f-2", "name": "AuthService", "symbol_type": SymbolType.CLASS.value, "language": "TypeScript", "file_path": "src/services/auth.ts", "start_line": 6, "end_line": 25, "signature": "export class AuthService", "docstring": "Manages JWT verification.", "metadata_json": {}},
            {"id": "sym-2", "repository_id": "repo-sample-1", "file_id": "f-2", "name": "validateToken", "symbol_type": SymbolType.FUNCTION.value, "language": "TypeScript", "file_path": "src/services/auth.ts", "start_line": 13, "end_line": 19, "signature": "async validateToken(token: string): Promise<UserClaims>", "docstring": "Validates inbound bearer token.", "metadata_json": {}},
            {"id": "sym-3", "repository_id": "repo-sample-1", "file_id": "f-3", "name": "IngestionEngine", "symbol_type": SymbolType.CLASS.value, "language": "Python", "file_path": "src/services/ingestion.py", "start_line": 5, "end_line": 10, "signature": "class IngestionEngine", "docstring": "Safe ingestion and file unpacker.", "metadata_json": {}},
            {"id": "sym-4", "repository_id": "repo-sample-1", "file_id": "f-1", "name": "authMiddleware", "symbol_type": SymbolType.FUNCTION.value, "language": "TypeScript", "file_path": "src/api/router.ts", "start_line": 8, "end_line": 12, "signature": "export async function authMiddleware(req, res, next)", "docstring": "Express auth guard.", "metadata_json": {}},
        ]
        imports_1 = {
            "src/api/router.ts": ["../services/auth", "../services/ingestion"],
            "src/services/auth.ts": ["../database/schema"],
        }
        self._repos["repo-sample-1"] = {
            "repository": {
                "id": "repo-sample-1",
                "name": "code-archaeologist-core",
                "description": "Sample Demo: AST parser, symbol resolution engine, and graph intelligence framework",
                "source_type": "github",
                "source_url": "https://github.com/google/code-archaeologist",
                "branch": "main",
                "status": "ready",
                "file_count": len(files_1),
                "symbol_count": len(symbols_1),
                "languages": {"TypeScript": 50.0, "Python": 25.0, "SQL": 25.0},
                "created_at": now,
                "updated_at": now,
            },
            "files": files_1,
            "symbols": symbols_1,
            "imports_map": imports_1,
            "graph": GraphBuilderService.build_sample_architecture_graph("repo-sample-1"),
        }

    def save_analyzed_repo(
        self,
        repo_meta: Dict[str, Any],
        files: List[Dict[str, Any]],
        symbols: List[Dict[str, Any]],
        imports_map: Dict[str, List[str]],
    ) -> Dict[str, Any]:
        repo_id = repo_meta["id"]
        graph = GraphBuilderService.build_graph_from_repo(repo_id, files, symbols, imports_map)
        self._repos[repo_id] = {
            "repository": repo_meta,
            "files": files,
            "symbols": symbols,
            "imports_map": imports_map,
            "graph": graph,
        }
        return repo_meta

    def list_repositories(self) -> List[Dict[str, Any]]:
        # Newest first
        return [entry["repository"] for entry in reversed(list(self._repos.values()))]

    def get_repository(self, repo_id: str) -> Optional[Dict[str, Any]]:
        entry = self._repos.get(repo_id)
        return entry["repository"] if entry else None

    def get_files(self, repo_id: str) -> List[Dict[str, Any]]:
        entry = self._repos.get(repo_id)
        return entry["files"] if entry else []

    def get_file_by_path(self, repo_id: str, path: str) -> Optional[Dict[str, Any]]:
        files = self.get_files(repo_id)
        for f in files:
            if f["path"] == path:
                return f
        return files[0] if files else None

    def get_symbols(self, repo_id: str) -> List[Dict[str, Any]]:
        entry = self._repos.get(repo_id)
        return entry["symbols"] if entry else []

    def get_imports_map(self, repo_id: str) -> Dict[str, List[str]]:
        entry = self._repos.get(repo_id)
        return entry["imports_map"] if entry else {}

    def get_graph(self, repo_id: str) -> Optional[ArchitectureGraphResponse]:
        entry = self._repos.get(repo_id)
        return entry["graph"] if entry else None


repo_store = RepoStore()
