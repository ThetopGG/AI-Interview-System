from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.crud.resume import get_resume
from app.db.session import get_db
from app.models.role import Role
from app.schemas.interview import (
    AnswerSubmitRequest,
    InterviewSessionOut,
    InterviewStartRequest,
    NextQuestionResponse,
    QuestionOut,
)
from app.services import interview_service

router = APIRouter()


@router.post("/start", response_model=InterviewSessionOut)
def start_interview(payload: InterviewStartRequest, db: Session = Depends(get_db)):
    resume = get_resume(db, payload.resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    role = db.query(Role).filter(Role.id == payload.role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found.")

    session = interview_service.create_session(
        db,
        candidate_id=resume.candidate_id,
        resume_id=resume.id,
        role_id=role.id,
        resume_text=resume.raw_text,
    )
    return session


@router.post("/{session_id}/next-question", response_model=NextQuestionResponse)
def next_question(session_id: str, db: Session = Depends(get_db)):
    session = interview_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    if len(session.questions) >= settings.QUESTIONS_PER_INTERVIEW:
        return NextQuestionResponse(session_id=session.id, question=None, is_complete=True)

    qa = interview_service.generate_and_store_next_question(db, session)
    if qa is None:
        return NextQuestionResponse(session_id=session.id, question=None, is_complete=True)

    return NextQuestionResponse(
        session_id=session.id, question=QuestionOut.model_validate(qa), is_complete=False
    )


@router.post("/{session_id}/answer", response_model=QuestionOut)
def submit_answer(session_id: str, payload: AnswerSubmitRequest, db: Session = Depends(get_db)):
    session = interview_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    qa = interview_service.submit_answer(db, payload.question_id, payload.answer_text)
    if not qa:
        raise HTTPException(status_code=404, detail="Question not found.")
    return qa


@router.post("/{session_id}/complete", response_model=InterviewSessionOut)
def complete_interview(session_id: str, db: Session = Depends(get_db)):
    session = interview_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    return interview_service.mark_session_complete(db, session)


@router.get("/{session_id}", response_model=InterviewSessionOut)
def get_interview_session(session_id: str, db: Session = Depends(get_db)):
    session = interview_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    return session
