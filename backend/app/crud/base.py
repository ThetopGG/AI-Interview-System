from typing import Generic, TypeVar

from sqlalchemy.orm import Session

from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class CRUDBase(Generic[ModelType]):
    def __init__(self, model: type[ModelType]):
        self.model = model

    def get(self, db: Session, id: str) -> ModelType | None:
        return db.query(self.model).filter(self.model.id == id).first()

    def get_all(self, db: Session) -> list[ModelType]:
        return db.query(self.model).all()

    def delete(self, db: Session, id: str) -> None:
        obj = self.get(db, id)
        if obj:
            db.delete(obj)
            db.commit()
