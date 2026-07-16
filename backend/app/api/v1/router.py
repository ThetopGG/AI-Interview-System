from fastapi import APIRouter

from app.api.v1.endpoints import interview, resume, role, summary

api_router = APIRouter()
api_router.include_router(resume.router, prefix="/resume", tags=["resume"])
api_router.include_router(role.router, prefix="/roles", tags=["roles"])
api_router.include_router(interview.router, prefix="/interview", tags=["interview"])
api_router.include_router(summary.router, prefix="/summary", tags=["summary"])
