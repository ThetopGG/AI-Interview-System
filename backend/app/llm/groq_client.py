from langchain_groq import ChatGroq

from app.core.config import settings

_llm_cache: dict[float, ChatGroq] = {}


def get_groq_llm(temperature: float = 0.4) -> ChatGroq:
    if not settings.GROQ_API_KEY:
        raise RuntimeError(
            "GROQ_API_KEY is not set. Add it to backend/.env before starting the server."
        )

    if temperature not in _llm_cache:
        _llm_cache[temperature] = ChatGroq(
            model=settings.GROQ_MODEL_NAME,
            api_key=settings.GROQ_API_KEY,
            temperature=temperature,
        )

    return _llm_cache[temperature]