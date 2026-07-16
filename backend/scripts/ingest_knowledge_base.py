"""
Standalone script to ingest role knowledge base documents into ChromaDB.

Usage:
    python -m scripts.ingest_knowledge_base
    python -m scripts.ingest_knowledge_base --force   # re-index from scratch
"""

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.rag.chroma_client import get_or_create_collection  # noqa: E402
from app.rag.retriever import ROLE_KB_COLLECTION, index_role_knowledge_base  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description="Ingest role knowledge base into ChromaDB.")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Delete existing embeddings and re-index from scratch.",
    )
    args = parser.parse_args()

    print("Indexing role knowledge base...")
    index_role_knowledge_base(force=args.force)

    collection = get_or_create_collection(ROLE_KB_COLLECTION)
    count = collection.count()
    print(f"Done. '{ROLE_KB_COLLECTION}' collection now has {count} chunks indexed.")


if __name__ == "__main__":
    main()
