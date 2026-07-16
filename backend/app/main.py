from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.init_db import init_db
from app.db.session import SessionLocal
from app.models.role import Role

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


def seed_roles() -> None:
    db = SessionLocal()
    try:
        existing_ids = {r.id for r in db.query(Role).all()}
        for kb_file in sorted(Path(settings.ROLE_KB_DIR).glob("*.txt")):
            role_id = kb_file.stem
            if role_id in existing_ids:
                continue

            lines = kb_file.read_text(encoding="utf-8").splitlines()
            title = role_id.replace("_", " ").title()
            description = ""
            for line in lines:
                if line.lower().startswith("title:"):
                    title = line.split(":", 1)[1].strip()
                elif line.lower().startswith("description:"):
                    description = line.split(":", 1)[1].strip()

            db.add(
                Role(id=role_id, title=title, description=description, knowledge_file=str(kb_file))
            )
        db.commit()
    finally:
        db.close()


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    seed_roles()


@app.get("/health")
def health_check():
    return {"status": "ok"}
