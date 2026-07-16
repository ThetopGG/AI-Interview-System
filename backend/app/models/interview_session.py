from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.candidate import gen_uuid

if TYPE_CHECKING:
    from app.models.candidate import Candidate
    from app.models.question_answer import QuestionAnswer
    from app.models.interview_summary import InterviewSummary


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    candidate_id: Mapped[str] = mapped_column(String(36), ForeignKey("candidates.id"), nullable=False)
    resume_id: Mapped[str] = mapped_column(String(36), ForeignKey("resumes.id"), nullable=False)
    role_id: Mapped[str] = mapped_column(String(100), ForeignKey("roles.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="in_progress")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    candidate: Mapped["Candidate"] = relationship(back_populates="interview_sessions")
    questions: Mapped[list["QuestionAnswer"]] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="QuestionAnswer.order_index",
    )
    summary: Mapped["InterviewSummary"] = relationship(
        back_populates="session", uselist=False, cascade="all, delete-orphan"
    )
