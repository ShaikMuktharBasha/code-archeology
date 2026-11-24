from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.repository import FileNodeResponse, FileContentResponse

router = APIRouter(prefix="/repositories/{id}/files", tags=["Files"])

# Sample realistic file tree metadata
SAMPLE_FILES = [
    {
        "id": "f-1",
        "repository_id": "repo-sample-1",
        "path": "src/api/router.ts",
        "name": "router.ts",
        "extension": ".ts",
        "language": "TypeScript",
        "size_bytes": 4200,
        "line_count": 128,
        "is_directory": False,
        "parent_path": "src/api",
        "symbols_count": 8
    },
    {
        "id": "f-2",
        "repository_id": "repo-sample-1",
        "path": "src/services/auth.ts",
        "name": "auth.ts",
        "extension": ".ts",
        "language": "TypeScript",
        "size_bytes": 5600,
        "line_count": 184,
        "is_directory": False,
        "parent_path": "src/services",
        "symbols_count": 12
    },
    {
        "id": "f-3",
        "repository_id": "repo-sample-1",
        "path": "src/services/ingestion.py",
        "name": "ingestion.py",
        "extension": ".py",
        "language": "Python",
        "size_bytes": 7800,
        "line_count": 210,
        "is_directory": False,
        "parent_path": "src/services",
        "symbols_count": 15
    },
    {
        "id": "f-4",
        "repository_id": "repo-sample-1",
        "path": "src/parser/ast.py",
        "name": "ast.py",
        "extension": ".py",
        "language": "Python",
        "size_bytes": 6400,
        "line_count": 195,
        "is_directory": False,
        "parent_path": "src/parser",
        "symbols_count": 24
    },
    {
        "id": "f-5",
        "repository_id": "repo-sample-1",
        "path": "src/database/schema.sql",
        "name": "schema.sql",
        "extension": ".sql",
        "language": "SQL",
        "size_bytes": 3100,
        "line_count": 88,
        "is_directory": False,
        "parent_path": "src/database",
        "symbols_count": 6
    }
]

SAMPLE_FILE_CONTENT = """// src/services/auth.ts
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
      throw new Error(`Invalid token signature: ${(err as Error).message}`);
    }
  }

  private async isTokenRevoked(jti: string): Promise<boolean> {
    return false; // Verified against active session store
  }
}
"""

@router.get("", response_model=List[FileNodeResponse])
async def list_repository_files(id: str, search: Optional[str] = Query(None)):
    """Returns the list of analyzed files for the given repository."""
    if search:
        search_lower = search.lower()
        return [f for f in SAMPLE_FILES if search_lower in f["path"].lower()]
    return SAMPLE_FILES

@router.get("/content", response_model=FileContentResponse)
async def get_file_content(id: str, path: str = Query(...)):
    """Retrieves the source code content and associated symbols of a specific file."""
    matched = next((f for f in SAMPLE_FILES if f["path"] == path), SAMPLE_FILES[1])
    return FileContentResponse(
        id=matched["id"],
        path=matched["path"],
        name=matched["name"],
        language=matched["language"],
        line_count=matched["line_count"],
        content=SAMPLE_FILE_CONTENT,
        symbols=[
            {"name": "AuthService", "type": "class", "start_line": 9, "end_line": 52},
            {"name": "validateToken", "type": "function", "start_line": 23, "end_line": 46},
            {"name": "isTokenRevoked", "type": "function", "start_line": 48, "end_line": 51}
        ]
    )
