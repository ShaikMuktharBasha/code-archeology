from fastapi import APIRouter
from app.schemas.impact import ImpactResponse
from app.services.impact_analyzer import ImpactAnalyzerService

router = APIRouter(prefix="/repositories/{id}/impact", tags=["Impact Analysis"])

@router.get("/{symbol_id}", response_model=ImpactResponse)
async def get_symbol_impact(id: str, symbol_id: str):
    """
    Calculates direct dependencies, reverse dependencies, and the blast radius
    impact if the specified symbol or file is changed.
    """
    return ImpactAnalyzerService.analyze_symbol_impact(id, symbol_id)
