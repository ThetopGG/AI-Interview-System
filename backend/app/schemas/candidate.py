from pydantic import BaseModel, ConfigDict


class CandidateBase(BaseModel):
    name: str
    email: str | None = None


class CandidateCreate(CandidateBase):
    pass


class CandidateOut(CandidateBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
