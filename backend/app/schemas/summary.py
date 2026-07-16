from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SummaryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    session_id: str
    overall_score: float | None
    strengths: str | None
    weaknesses: str | None
    summary_text: str
    created_at: datetime
