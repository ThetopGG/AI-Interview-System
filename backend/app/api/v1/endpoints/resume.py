from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.crud.candidate import create_candidate
from app.crud.resume import create_resume
from app.db.session import get_db
from app.schemas.resume import ResumeUploadResponse
from app.services.resume_parser_service import extract_text_from_pdf, save_uploaded_file

router = APIRouter()


@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    name: str = Form(...),
    email: str | None = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    file_path, _ = save_uploaded_file(file_bytes, file.filename)

    raw_text = extract_text_from_pdf(file_path)
    if not raw_text:
        raise HTTPException(status_code=422, detail="Could not extract text from the uploaded PDF.")

    candidate = create_candidate(db, name=name, email=email)
    resume = create_resume(
        db,
        candidate_id=candidate.id,
        file_name=file.filename,
        file_path=file_path,
        raw_text=raw_text,
    )
    return resume
