import json

from sqlalchemy.orm import Session

from app.llm.groq_client import get_groq_llm
from app.llm.prompts.summary_prompt import summary_generation_prompt
from app.models.interview_session import InterviewSession
from app.models.interview_summary import InterviewSummary
from app.models.role import Role


def _build_transcript(session: InterviewSession) -> str:
    lines = []
    for qa in session.questions:
        lines.append(f"Q{qa.order_index + 1}: {qa.question_text}")
        lines.append(f"A{qa.order_index + 1}: {qa.answer_text or '(no answer provided)'}")
    return "\n".join(lines)


def _strip_code_fence(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.strip("`")
        if raw.lower().startswith("json"):
            raw = raw[4:]
    return raw.strip()


def generate_summary(db: Session, session: InterviewSession) -> InterviewSummary:
    role = db.query(Role).filter(Role.id == session.role_id).first()
    transcript = _build_transcript(session)

    llm = get_groq_llm(temperature=0.2)
    chain = summary_generation_prompt | llm

    result = chain.invoke(
        {
            "role_title": role.title if role else session.role_id,
            "qa_transcript": transcript,
        }
    )

    raw = _strip_code_fence(result.content)

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        parsed = {
            "overall_score": None,
            "strengths": "",
            "weaknesses": "",
            "summary_text": raw,
        }

    summary = InterviewSummary(
        session_id=session.id,
        overall_score=parsed.get("overall_score"),
        strengths=parsed.get("strengths"),
        weaknesses=parsed.get("weaknesses"),
        summary_text=parsed.get("summary_text", raw),
    )
    db.add(summary)
    db.commit()
    db.refresh(summary)
    return summary
