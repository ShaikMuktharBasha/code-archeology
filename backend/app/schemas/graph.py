from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from enum import Enum

class RelationType(str, Enum):
    IMPORTS = "imports"
    CALLS = "calls"
    EXTENDS = "extends"
    DEPENDS_ON = "depends_on"
    DEFINES = "defines"

class GraphNode(BaseModel):
    id: str
    type: str = "customNode"
    position: Dict[str, float] = Field(default_factory=lambda: {"x": 0.0, "y": 0.0})
    data: Dict[str, Any] = Field(default_factory=dict)

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None
    relation_type: RelationType
    animated: bool = False
    data: Dict[str, Any] = Field(default_factory=dict)

class ArchitectureGraphResponse(BaseModel):
    repository_id: str
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    stats: Dict[str, int] = Field(default_factory=dict)
