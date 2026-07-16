from pathlib import Path

from app.core.config import settings


def load_role_documents() -> dict[str, str]:
    """Load all role knowledge base .txt files keyed by role_id (filename stem)."""
    docs: dict[str, str] = {}
    for path in Path(settings.ROLE_KB_DIR).glob("*.txt"):
        docs[path.stem] = path.read_text(encoding="utf-8")
    return docs


def chunk_text(text: str, chunk_size: int = 200, overlap: int = 30) -> list[str]:
    words = text.split()
    if not words:
        return []
    chunks: list[str] = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunks.append(" ".join(words[start:end]))
        if end >= len(words):
            break
        start = end - overlap
    return chunks
