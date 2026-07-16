from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_NAME: str = "AI Interview System"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True

    DATABASE_URL: str = f"sqlite:///{BASE_DIR / 'interview.db'}"

    RESUME_UPLOAD_DIR: Path = BASE_DIR / "data" / "resumes"
    CHROMA_PERSIST_DIR: Path = BASE_DIR / "data" / "chroma_db"
    ROLE_KB_DIR: Path = BASE_DIR / "data" / "role_knowledge_base"

    EMBEDDING_MODEL_NAME: str = r"C:\Users\pc\bge-small-en-v1.5"

    GROQ_API_KEY: str = ""
    GROQ_MODEL_NAME: str = "llama-3.3-70b-versatile"
    

    QUESTIONS_PER_INTERVIEW: int = 5

    CORS_ORIGINS: list[str] = ["http://localhost:5173"]


settings = Settings()
settings.RESUME_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
settings.CHROMA_PERSIST_DIR.mkdir(parents=True, exist_ok=True)
settings.ROLE_KB_DIR.mkdir(parents=True, exist_ok=True)
