from app.db.base import Base
from app.db.session import engine
from app.models import (  # noqa: F401
    candidate,
    resume,
    role,
    interview_session,
    question_answer,
    interview_summary,
)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
