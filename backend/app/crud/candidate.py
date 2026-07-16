from sqlalchemy.orm import Session

from app.models.candidate import Candidate


def create_candidate(db: Session, name: str, email: str | None = None) -> Candidate:
    candidate = Candidate(name=name, email=email)
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate


def get_candidate(db: Session, candidate_id: str) -> Candidate | None:
    return db.query(Candidate).filter(Candidate.id == candidate_id).first()
