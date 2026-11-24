from fastapi import APIRouter
from app.schemas.chat import ChatQueryRequest, ChatQueryResponse
from app.services.gemini_service import GeminiCodebaseIntelligence

router = APIRouter(prefix="/repositories/{id}/ask", tags=["AI Codebase Q&A"])

@router.post("", response_model=ChatQueryResponse)
async def ask_codebase_question(id: str, payload: ChatQueryRequest):
    """
    Asks a natural-language question against the repository.
    Powered by Google Gemini and code retrieval context, with exact file/line citations.
    """
    return await GeminiCodebaseIntelligence.ask_codebase(
        repository_id=id,
        query=payload.query,
        context_files=payload.selected_file_paths
    )
