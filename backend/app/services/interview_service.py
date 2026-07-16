from datetime import datetime

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.interview_session import InterviewSession
from app.models.question_answer import QuestionAnswer
from app.models.role import Role
from app.services.question_generation_service import generate_next_question
from app.services.vector_store_service import index_resume_text


def create_session(
    db: Session, candidate_id: str, resume_id: str, role_id: str, resume_text: str
) -> InterviewSession:
    session = InterviewSession(
        candidate_id=candidate_id, resume_id=resume_id, role_id=role_id, status="in_progress"
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    index_resume_text(session.id, resume_text)
    return session


def get_session(db: Session, session_id: str) -> InterviewSession | None:
    return db.query(InterviewSession).filter(InterviewSession.id == session_id).first()


def generate_and_store_next_question(db: Session, session: InterviewSession) -> QuestionAnswer | None:
    if len(session.questions) >= settings.QUESTIONS_PER_INTERVIEW:
        return None

    role = db.query(Role).filter(Role.id == session.role_id).first()
    previous_questions = [q.question_text for q in session.questions]

    question_text = generate_next_question(
        role_id=session.role_id,
        role_title=role.title if role else session.role_id,
        session_id=session.id,
        previous_questions=previous_questions,
    )

    order_index = len(session.questions)
    qa = QuestionAnswer(session_id=session.id, order_index=order_index, question_text=question_text)
    db.add(qa)
    db.commit()
    db.refresh(qa)
    return qa


def submit_answer(db: Session, question_id: str, answer_text: str) -> QuestionAnswer | None:
    qa = db.query(QuestionAnswer).filter(QuestionAnswer.id == question_id).first()
    if not qa:
        return None
    qa.answer_text = answer_text
    qa.answered_at = datetime.utcnow()
    db.commit()
    db.refresh(qa)
    return qa


def mark_session_complete(db: Session, session: InterviewSession) -> InterviewSession:
    session.status = "completed"
    session.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(session)
    return session
