from app.rag.chroma_client import get_or_create_collection
from app.rag.embedder import embed_text

RESUME_COLLECTION = "resume_context"


def index_resume_text(session_id: str, resume_text: str, chunk_size: int = 800) -> None:
    collection = get_or_create_collection(RESUME_COLLECTION)

    existing = collection.get(where={"session_id": session_id})
    if existing.get("ids"):
        collection.delete(ids=existing["ids"])

    chunks = [
        resume_text[i : i + chunk_size] for i in range(0, len(resume_text), chunk_size)
    ] or [resume_text]

    ids = [f"{session_id}_{i}" for i in range(len(chunks))]
    embeddings = [embed_text(c) for c in chunks]
    metadatas = [{"session_id": session_id} for _ in chunks]

    collection.add(ids=ids, embeddings=embeddings, documents=chunks, metadatas=metadatas)


def retrieve_resume_context(session_id: str, query_text: str, top_k: int = 3) -> list[str]:
    collection = get_or_create_collection(RESUME_COLLECTION)

    available = collection.count()
    if available == 0:
        return []

    query_embedding = embed_text(query_text)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(top_k, available),
        where={"session_id": session_id},
    )
    documents = results.get("documents", [[]])
    return documents[0] if documents else []
