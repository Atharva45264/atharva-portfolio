from app.database import get_knowledge_collection
from app.services.embeddings import generate_embedding


def retrieve_relevant_chunks(
    query: str,
    limit: int = 5,
):
    """
    Convert the user's query into an embedding
    and retrieve the most relevant resume chunks
    from MongoDB Atlas Vector Search.
    """

    # Generate embedding for the user's question
    query_embedding = generate_embedding(query)

    collection = get_knowledge_collection()

    # MongoDB Atlas Vector Search pipeline
    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": query_embedding,
                "numCandidates": 50,
                "limit": limit,
            }
        },
        {
            "$project": {
                "_id": 0,
                "text": 1,
                "source": 1,
                "chunk_index": 1,
                "score": {
                    "$meta": "vectorSearchScore"
                },
            }
        },
    ]

    results = list(collection.aggregate(pipeline))

    return results