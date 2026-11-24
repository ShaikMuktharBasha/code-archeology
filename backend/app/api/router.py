from fastapi import APIRouter
from app.api.v1 import repositories, files, symbols, graph, chat, impact

api_router = APIRouter()

api_router.include_router(repositories.router)
api_router.include_router(files.router)
api_router.include_router(symbols.router)
api_router.include_router(graph.router)
api_router.include_router(chat.router)
api_router.include_router(impact.router)
