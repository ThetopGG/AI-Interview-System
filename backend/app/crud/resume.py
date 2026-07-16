from sqlalchemy.orm import Session

from app.models.resume import Resume


def create_resume(
    db: Session, candidate_id: str, file_name: str, file_path: str, raw_text: str
) -> Resume:
    resume = Resume(
        candidate_id=candidate_id, file_name=file_name, file_path=file_path, raw_text=raw_text
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


def get_resume(db: Session, resume_id: str) -> Resume | None:
    return db.query(Resume).filter(Resume.id == resume_id).first()
