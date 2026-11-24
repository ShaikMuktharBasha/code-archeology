from pydantic import BaseModel, Field
from typing import List, Optional

class CitationReference(BaseModel):
    file_path: str
    start_line: Optional[int] = None
    end_line: Optional[int] = None
    symbol_name: Optional[str] = None
    snippet: Optional[str] = None

class ChatQueryRequest(BaseModel):
    query: str = Field(..., description="The user's natural language question about the codebase")
    conversation_id: Optional[str] = None
    selected_file_paths: Optional[List[str]] = Field(default_factory=list)

class ChatQueryResponse(BaseModel):
    answer: str
    citations: List[CitationReference] = []
    suggested_followups: List[str] = []
    confidence_score: float = 0.95
