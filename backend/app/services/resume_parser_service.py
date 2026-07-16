import uuid
from pathlib import Path

import fitz  # PyMuPDF

from app.core.config import settings


def save_uploaded_file(file_bytes: bytes, original_filename: str) -> tuple[str, str]:
    ext = Path(original_filename).suffix or ".pdf"
    unique_name = f"{uuid.uuid4()}{ext}"
    file_path = settings.RESUME_UPLOAD_DIR / unique_name
    file_path.write_bytes(file_bytes)
    return str(file_path), unique_name


def extract_text_from_pdf(file_path: str) -> str:
    text_parts: list[str] = []
    with fitz.open(file_path) as doc:
        for page in doc:
            text_parts.append(page.get_text())
    return "\n".join(text_parts).strip()
