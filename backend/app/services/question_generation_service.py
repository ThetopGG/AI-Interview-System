from app.llm.groq_client import get_groq_llm
from app.llm.prompts.question_prompt import question_generation_prompt
from app.services.rag_service import build_context


def generate_next_question(
    role_id: str,
    role_title: str,
    session_id: str,
    previous_questions: list[str],
) -> str:
    query = previous_questions[-1] if previous_questions else f"Interview questions for {role_title}"
    role_context, resume_context = build_context(role_id, session_id, query)

    llm = get_groq_llm()
    chain = question_generation_prompt | llm

    result = chain.invoke(
        {
            "role_title": role_title,
            "role_context": role_context,
            "resume_context": resume_context,
            "previous_questions": "\n".join(previous_questions) if previous_questions else "None",
        }
    )
    return result.content.strip()
