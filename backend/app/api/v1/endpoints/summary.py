from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.summary import SummaryOut
from app.services import interview_service, summary_service

router = APIRouter()


@router.post("/{session_id}/generate", response_model=SummaryOut)
def generate_summary(session_id: str, db: Session = Depends(get_db)):
    session = interview_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    if session.summary:
        return session.summary

    if session.status != "completed":
        interview_service.mark_session_complete(db, session)

    return summary_service.generate_summary(db, session)


@router.get("/{session_id}", response_model=SummaryOut)
def get_summary(session_id: str, db: Session = Depends(get_db)):
    session = interview_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    if not session.summary:
        raise HTTPException(status_code=404, detail="Summary not generated yet.")
    return session.summary
