from app.rag.retriever import index_role_knowledge_base, retrieve_role_context
from app.services.vector_store_service import retrieve_resume_context


def build_context(role_id: str, session_id: str, query: str) -> tuple[str, str]:
    index_role_knowledge_base()

    role_chunks = retrieve_role_context(role_id, query)
    resume_chunks = retrieve_resume_context(session_id, query)

    role_context = "\n".join(role_chunks) if role_chunks else "No additional role context available."
    resume_context = (
        "\n".join(resume_chunks) if resume_chunks else "No additional resume context available."
    )
    return role_context, resume_context
