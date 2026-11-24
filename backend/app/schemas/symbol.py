from pydantic import BaseModel
from typing import Optional, Dict, Any
from enum import Enum

class SymbolType(str, Enum):
    MODULE = "module"
    CLASS = "class"
    FUNCTION = "function"
    METHOD = "method"
    INTERFACE = "interface"
    ENDPOINT = "endpoint"
    VARIABLE = "variable"

class SymbolResponse(BaseModel):
    id: str
    repository_id: str
    file_id: Optional[str] = None
    name: str
    symbol_type: SymbolType
    language: str
    file_path: str
    start_line: int
    end_line: int
    signature: Optional[str] = None
    docstring: Optional[str] = None
    metadata_json: Dict[str, Any] = {}

    class Config:
        from_attributes = True
