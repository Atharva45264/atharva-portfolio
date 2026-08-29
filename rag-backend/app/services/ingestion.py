from app.database import get_knowledge_collection
from app.services.chunking import chunk_text
from app.services.embeddings import generate_embeddings


def ingest_portfolio_data(portfolio_data):
    """
    Ingest structured portfolio records into MongoDB.

    Existing records with the same title and source are removed
    before inserting updated versions.
    """

    collection = get_knowledge_collection()

    documents = []

    for item in portfolio_data:

        title = item.get("title", "Unknown")
        category = item.get("category", "general")
        source = item.get("source", "portfolio")
        url = item.get("url", "")
        text = item.get("text", "").strip()

        if not text:
            continue

        # Split long records into chunks
        chunks = chunk_text(
            text,
            chunk_size=500,
            chunk_overlap=100,
        )

        if not chunks:
            continue

        # Generate embeddings for all chunks
        embeddings = generate_embeddings(chunks)

        for index, (chunk, embedding) in enumerate(
            zip(chunks, embeddings)
        ):

            documents.append({
                "title": title,
                "category": category,
                "source": source,
                "url": url,
                "text": chunk,
                "chunk_index": index,
                "embedding": embedding,
            })

    if not documents:
        return 0

    # Remove previous structured portfolio data
    collection.delete_many({
        "source": {
            "$in": [
                "portfolio",
                "github",
                "resume",
            ]
        }
    })

    result = collection.insert_many(documents)

    return len(result.inserted_ids)