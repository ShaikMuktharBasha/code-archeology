import os
import shutil
import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from app.schemas.repository import RepositoryResponse, GitHubIngestRequest
from app.services.ingestion import IngestionService
from app.services.repo_store import repo_store

router = APIRouter(prefix="/repositories", tags=["Repositories"])


@router.get("", response_model=List[RepositoryResponse])
async def list_repositories():
    """Returns all indexed repositories."""
    return repo_store.list_repositories()


@router.get("/{id}", response_model=RepositoryResponse)
async def get_repository(id: str):
    """Retrieves a single repository by ID."""
    repo = repo_store.get_repository(id)
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")
    return repo


@router.post("/upload", response_model=RepositoryResponse, status_code=status.HTTP_201_CREATED)
async def upload_repository_zip(
    file: UploadFile = File(...),
    name: str = Form(None),
    description: str = Form(None),
):
    """Safely ingests, extracts, and parses a ZIP repository archive."""
    if not file.filename or not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Only .zip repository archives are supported")

    repo_id = f"repo-{uuid.uuid4().hex[:8]}"
    upload_dir = IngestionService.ensure_upload_dir()
    zip_path = os.path.join(upload_dir, f"{repo_id}.zip")

    try:
        with open(zip_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        _, files, symbols, imports_map, lang_dist = IngestionService.process_zip_upload(zip_path, repo_id)
        now = datetime.utcnow()
        repo_name = name or file.filename.replace(".zip", "")

        new_repo = {
            "id": repo_id,
            "name": repo_name,
            "description": description or f"Analyzed ZIP archive ({len(files)} files, {len(symbols)} AST symbols)",
            "source_type": "zip",
            "source_url": file.filename,
            "branch": "main",
            "status": "ready",
            "file_count": len(files),
            "symbol_count": len(symbols),
            "languages": lang_dist or {"Other": 100.0},
            "created_at": now,
            "updated_at": now,
        }
        return repo_store.save_analyzed_repo(new_repo, files, symbols, imports_map)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process archive: {str(e)}")
    finally:
        if os.path.exists(zip_path):
            try:
                os.remove(zip_path)
            except Exception:
                pass


@router.post("/github", response_model=RepositoryResponse, status_code=status.HTTP_201_CREATED)
async def ingest_github_repository(payload: GitHubIngestRequest):
    """Downloads a real GitHub repository archive, parses AST symbols, and builds its graph."""
    try:
        owner, repo_name, branch = IngestionService.parse_github_url(payload.repo_url)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    repo_id = f"repo-{uuid.uuid4().hex[:8]}"
    upload_dir = IngestionService.ensure_upload_dir()
    zip_path = os.path.join(upload_dir, f"{repo_id}.zip")

    try:
        used_branch = await IngestionService.download_github_zip(
            owner, repo_name, branch or "main", zip_path, payload.auth_token
        )
        _, files, symbols, imports_map, lang_dist = IngestionService.process_zip_upload(zip_path, repo_id)
        now = datetime.utcnow()

        new_repo = {
            "id": repo_id,
            "name": f"{owner}/{repo_name}",
            "description": f"GitHub repository ({used_branch} branch) • {len(files)} files, {len(symbols)} AST symbols",
            "source_type": "github",
            "source_url": payload.repo_url,
            "branch": used_branch,
            "status": "ready",
            "file_count": len(files),
            "symbol_count": len(symbols),
            "languages": lang_dist or {"Other": 100.0},
            "created_at": now,
            "updated_at": now,
        }
        return repo_store.save_analyzed_repo(new_repo, files, symbols, imports_map)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze GitHub repository: {str(e)}")
    finally:
        if os.path.exists(zip_path):
            try:
                os.remove(zip_path)
            except Exception:
                pass
