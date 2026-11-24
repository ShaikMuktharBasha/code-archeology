import { Repository, FileNode, FileContent, SymbolItem, ImpactAnalysis } from '../types';

export const SAMPLE_REPOSITORIES: Repository[] = [
  {
    id: 'repo-sample-1',
    name: 'code-archaeologist-core',
    description: 'High-throughput AST parser, symbol resolution engine, and graph intelligence framework',
    source_type: 'github',
    source_url: 'https://github.com/google/code-archaeologist',
    branch: 'main',
    status: 'ready',
    file_count: 84,
    symbol_count: 420,
    languages: { 'Python': 54.2, 'TypeScript': 38.6, 'SQL': 7.2 },
    created_at: '2026-11-20T14:30:00Z',
    updated_at: '2026-11-24T09:15:00Z',
  },
  {
    id: 'repo-sample-2',
    name: 'fastapi-microservices-mesh',
    description: 'Distributed async API gateway with JWT auth, circuit breaker, and gRPC bridges',
    source_type: 'github',
    source_url: 'https://github.com/tiangolo/fastapi',
    branch: 'master',
    status: 'ready',
    file_count: 142,
    symbol_count: 890,
    languages: { 'Python': 88.4, 'Docker': 6.1, 'Shell': 5.5 },
    created_at: '2026-11-18T10:00:00Z',
    updated_at: '2026-11-23T18:45:00Z',
  },
  {
    id: 'repo-sample-3',
    name: 'nextjs-saas-starter',
    description: 'Next.js 14 app directory with Stripe, Tailwind CSS, Prisma, and server actions',
    source_type: 'zip',
    source_url: 'starter-template.zip',
    branch: 'main',
    status: 'ready',
    file_count: 96,
    symbol_count: 512,
    languages: { 'TypeScript': 82.0, 'CSS': 12.0, 'JSON': 6.0 },
    created_at: '2026-11-15T08:20:00Z',
    updated_at: '2026-11-22T11:10:00Z',
  },
];

export const SAMPLE_FILES: FileNode[] = [
  {
    id: 'f-1',
    repository_id: 'repo-sample-1',
    path: 'src/api/router.ts',
    name: 'router.ts',
    extension: '.ts',
    language: 'TypeScript',
    size_bytes: 4200,
    line_count: 128,
    is_directory: false,
    parent_path: 'src/api',
    symbols_count: 8,
  },
  {
    id: 'f-2',
    repository_id: 'repo-sample-1',
    path: 'src/services/auth.ts',
    name: 'auth.ts',
    extension: '.ts',
    language: 'TypeScript',
    size_bytes: 5600,
    line_count: 184,
    is_directory: false,
    parent_path: 'src/services',
    symbols_count: 12,
  },
  {
    id: 'f-3',
    repository_id: 'repo-sample-1',
    path: 'src/services/ingestion.py',
    name: 'ingestion.py',
    extension: '.py',
    language: 'Python',
    size_bytes: 7800,
    line_count: 210,
    is_directory: false,
    parent_path: 'src/services',
    symbols_count: 15,
  },
  {
    id: 'f-4',
    repository_id: 'repo-sample-1',
    path: 'src/parser/ast.py',
    name: 'ast.py',
    extension: '.py',
    language: 'Python',
    size_bytes: 6400,
    line_count: 195,
    is_directory: false,
    parent_path: 'src/parser',
    symbols_count: 24,
  },
  {
    id: 'f-5',
    repository_id: 'repo-sample-1',
    path: 'src/database/schema.sql',
    name: 'schema.sql',
    extension: '.sql',
    language: 'SQL',
    size_bytes: 3100,
    line_count: 88,
    is_directory: false,
    parent_path: 'src/database',
    symbols_count: 6,
  },
  {
    id: 'f-6',
    repository_id: 'repo-sample-1',
    path: 'src/vectors/store.py',
    name: 'store.py',
    extension: '.py',
    language: 'Python',
    size_bytes: 4900,
    line_count: 145,
    is_directory: false,
    parent_path: 'src/vectors',
    symbols_count: 7,
  },
];

export const SAMPLE_FILE_CONTENTS: Record<string, FileContent> = {
  'src/services/auth.ts': {
    id: 'f-2',
    path: 'src/services/auth.ts',
    name: 'auth.ts',
    language: 'TypeScript',
    line_count: 52,
    content: `// src/services/auth.ts
import jwt from 'jsonwebtoken';
import { UserClaims, SessionPayload } from '../types/auth';
import { db } from '../database/schema';

/**
 * AuthService handles token verification, session lifecycle,
 * and permission resolution across microservices.
 */
export class AuthService {
  private readonly publicKey: string;
  private readonly issuer: string;

  constructor() {
    this.publicKey = process.env.JWT_PUBLIC_KEY || 'default-secret-key';
    this.issuer = 'code-archaeologist-auth';
  }

  /**
   * Validates inbound bearer token and extracts verified claims.
   * @throws UnauthorizedException on signature mismatch or token expiry.
   */
  async validateToken(token: string): Promise<UserClaims> {
    if (!token) {
      throw new Error('Missing bearer token in request header');
    }

    try {
      const decoded = jwt.verify(token, this.publicKey, {
        issuer: this.issuer,
      }) as UserClaims;

      // Check revocation list in Redis / PostgreSQL
      const isRevoked = await this.isTokenRevoked(decoded.jti);
      if (isRevoked) {
        throw new Error('Token has been revoked');
      }

      return decoded;
    } catch (err) {
      throw new Error(\`Invalid token signature: \${(err as Error).message}\`);
    }
  }

  private async isTokenRevoked(jti: string): Promise<boolean> {
    const session = await db.sessions.findUnique({ where: { id: jti } });
    return session ? session.is_revoked : true;
  }
}`,
    symbols: [
      { name: 'AuthService', type: 'class', start_line: 9, end_line: 52 },
      { name: 'validateToken', type: 'function', start_line: 23, end_line: 46 },
      { name: 'isTokenRevoked', type: 'function', start_line: 48, end_line: 51 },
    ],
  },
  'src/services/ingestion.py': {
    id: 'f-3',
    path: 'src/services/ingestion.py',
    name: 'ingestion.py',
    language: 'Python',
    line_count: 42,
    content: `# src/services/ingestion.py
import os
import zipfile
import shutil
from pathlib import Path
from app.core.security import SecurityGuard

class IngestionEngine:
    """Safe ingestion and file unpacker with zip slip validation."""

    def __init__(self, upload_dir: str):
        self.upload_dir = upload_dir

    def process_zip_upload(self, zip_path: str, repo_id: str) -> dict:
        target_dir = os.path.join(self.upload_dir, repo_id)
        os.makedirs(target_dir, exist_ok=True)

        is_safe, msg = SecurityGuard.validate_zip(zip_path, target_dir)
        if not is_safe:
            shutil.rmtree(target_dir, ignore_errors=True)
            raise ValueError(f"Zip validation failed: {msg}")

        with zipfile.ZipFile(zip_path, 'r') as zf:
            for member in zf.infolist():
                member_clean = os.path.normpath(member.filename)
                if not member_clean.startswith(".."):
                    zf.extract(member, target_dir)

        return {"repo_id": repo_id, "status": "extracted"}`,
    symbols: [
      { name: 'IngestionEngine', type: 'class', start_line: 8, end_line: 38 },
      { name: 'process_zip_upload', type: 'function', start_line: 14, end_line: 32 },
    ],
  },
};

export const SAMPLE_SYMBOLS: SymbolItem[] = [
  {
    id: 'sym-1',
    repository_id: 'repo-sample-1',
    name: 'AuthService',
    symbol_type: 'class',
    language: 'TypeScript',
    file_path: 'src/services/auth.ts',
    start_line: 9,
    end_line: 52,
    signature: 'export class AuthService',
    docstring: 'AuthService handles token verification and session lifecycle.',
  },
  {
    id: 'sym-2',
    repository_id: 'repo-sample-1',
    name: 'validateToken',
    symbol_type: 'function',
    language: 'TypeScript',
    file_path: 'src/services/auth.ts',
    start_line: 23,
    end_line: 46,
    signature: 'async validateToken(token: string): Promise<UserClaims>',
    docstring: 'Validates inbound bearer token and extracts verified claims.',
  },
  {
    id: 'sym-3',
    repository_id: 'repo-sample-1',
    name: 'IngestionEngine',
    symbol_type: 'class',
    language: 'Python',
    file_path: 'src/services/ingestion.py',
    start_line: 8,
    end_line: 38,
    signature: 'class IngestionEngine',
    docstring: 'Safe ingestion and file unpacker with zip slip validation.',
  },
  {
    id: 'sym-4',
    repository_id: 'repo-sample-1',
    name: 'TreeSitterParser',
    symbol_type: 'function',
    language: 'Python',
    file_path: 'src/parser/ast.py',
    start_line: 20,
    end_line: 90,
    signature: 'def parse_ast_tree(source: str, lang: str) -> ASTNode',
    docstring: 'Generates language-aware syntax nodes from raw code stream.',
  },
];

export const SAMPLE_IMPACT_ANALYSIS: ImpactAnalysis = {
  symbol_id: 'sym-2',
  target_name: 'AuthService.validateToken',
  target_type: 'function',
  target_path: 'src/services/auth.ts',
  blast_radius_score: 68,
  affected_files_count: 4,
  summary:
    "Modifying 'AuthService.validateToken' carries HIGH blast radius. 4 downstream services and authentication middlewares directly consume this method. Breaking the return contract will trigger HTTP 401/500 cascades in dependent API routes.",
  direct_dependencies: [
    {
      id: 'dep-1',
      name: 'jsonwebtoken',
      type: 'library',
      path: 'package.json',
      reason: 'Direct JWT verification dependency',
      impact_level: 'low',
    },
    {
      id: 'dep-2',
      name: 'SessionModel',
      type: 'class',
      path: 'src/models/session.ts',
      reason: 'Stores active token revocation list',
      impact_level: 'medium',
    },
  ],
  reverse_dependencies: [
    {
      id: 'rev-1',
      name: 'authMiddleware',
      type: 'function',
      path: 'src/api/router.ts',
      reason: 'Executes validateToken on every protected route',
      impact_level: 'high',
    },
    {
      id: 'rev-2',
      name: 'RepositoryAccessGuard',
      type: 'class',
      path: 'src/services/security.ts',
      reason: 'Verifies user permissions before granting codebase access',
      impact_level: 'high',
    },
    {
      id: 'rev-3',
      name: 'WebSocketAuthHandler',
      type: 'function',
      path: 'src/realtime/socket.ts',
      reason: 'Authenticates streaming graph subscriptions',
      impact_level: 'medium',
    },
    {
      id: 'rev-4',
      name: 'UserContextHook',
      type: 'function',
      path: 'src/frontend/hooks/useUser.ts',
      reason: 'Consumes decoded token payload contract on client',
      impact_level: 'medium',
    },
  ],
};
