from datetime import datetime

from pydantic import BaseModel, ConfigDict


class InterviewStartRequest(BaseModel):
    resume_id: str
    role_id: str


class QuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    order_index: int
    question_text: str
    answer_text: str | None = None


class InterviewSessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    candidate_id: str
    resume_id: str
    role_id: str
    status: str
    created_at: datetime
    questions: list[QuestionOut] = []


class AnswerSubmitRequest(BaseModel):
    question_id: str
    answer_text: str


class NextQuestionResponse(BaseModel):
    session_id: str
    question: QuestionOut | None
    is_complete: bool
