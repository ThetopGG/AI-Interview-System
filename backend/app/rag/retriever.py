from app.rag.chroma_client import get_or_create_collection
from app.rag.document_loader import chunk_text, load_role_documents
from app.rag.embedder import embed_text, embed_texts

ROLE_KB_COLLECTION = "role_knowledge_base"


def index_role_knowledge_base(force: bool = False) -> None:
    collection = get_or_create_collection(ROLE_KB_COLLECTION)

    if not force and collection.count() > 0:
        return

    if force:
        existing_ids = collection.get().get("ids", [])
        if existing_ids:
            collection.delete(ids=existing_ids)

    docs = load_role_documents()
    ids: list[str] = []
    texts: list[str] = []
    metadatas: list[dict] = []

    for role_id, content in docs.items():
        chunks = chunk_text(content)
        for i, chunk in enumerate(chunks):
            ids.append(f"{role_id}_{i}")
            texts.append(chunk)
            metadatas.append({"role_id": role_id})

    if not texts:
        return

    embeddings = embed_texts(texts)
    collection.add(ids=ids, embeddings=embeddings, documents=texts, metadatas=metadatas)


def retrieve_role_context(role_id: str, query_text: str, top_k: int = 4) -> list[str]:
    collection = get_or_create_collection(ROLE_KB_COLLECTION)

    available = collection.count()
    if available == 0:
        return []

    query_embedding = embed_text(query_text)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(top_k, available),
        where={"role_id": role_id},
    )
    documents = results.get("documents", [[]])
    return documents[0] if documents else []
