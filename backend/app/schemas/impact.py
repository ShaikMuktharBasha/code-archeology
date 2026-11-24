from pydantic import BaseModel, Field
from typing import List, Dict, Any

class AffectedItem(BaseModel):
    id: str
    name: str
    type: str # 'file', 'class', 'function'
    path: str
    reason: str
    impact_level: str # 'high', 'medium', 'low'

class ImpactResponse(BaseModel):
    symbol_id: str
    target_name: str
    target_type: str
    target_path: str
    direct_dependencies: List[AffectedItem]
    reverse_dependencies: List[AffectedItem] # who depends on target
    blast_radius_score: int # 0 to 100
    affected_files_count: int
    summary: str
    graph: Dict[str, Any] = Field(default_factory=dict)
