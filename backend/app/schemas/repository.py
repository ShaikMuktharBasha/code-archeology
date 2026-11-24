from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class RepositoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    source_type: str = Field(..., description="'zip' or 'github'")
    source_url: Optional[str] = None
    branch: Optional[str] = "main"

class RepositoryCreate(RepositoryBase):
    pass

class GitHubIngestRequest(BaseModel):
    repo_url: str = Field(..., description="e.g. https://github.com/fastapi/fastapi")
    branch: Optional[str] = "main"
    auth_token: Optional[str] = None

class RepositoryResponse(RepositoryBase):
    id: str
    status: str
    file_count: int
    symbol_count: int
    languages: Dict[str, float]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class FileNodeResponse(BaseModel):
    id: str
    repository_id: str
    path: str
    name: str
    extension: Optional[str] = None
    language: Optional[str] = None
    size_bytes: int = 0
    line_count: int = 0
    is_directory: bool = False
    parent_path: Optional[str] = None
    symbols_count: int = 0

    class Config:
        from_attributes = True

class FileContentResponse(BaseModel):
    id: str
    path: str
    name: str
    language: Optional[str] = None
    line_count: int = 0
    content: str
    symbols: List[Dict[str, Any]] = []
