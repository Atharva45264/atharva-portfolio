from app.database import get_knowledge_collection
from app.services.embeddings import generate_embedding
from app.services.intent import detect_intent


def retrieve_relevant_chunks(
    query: str,
    limit: int = 5,
):
    """
    Retrieve relevant portfolio knowledge using
    MongoDB Atlas Vector Search.

    Results are prioritized according to the detected
    intent of the user's question.
    """

    query_embedding = generate_embedding(query)

    collection = get_knowledge_collection()

    # -----------------------------------------
    # DETECT QUESTION INTENT
    # -----------------------------------------

    intent = detect_intent(query)

    # -----------------------------------------
    # GET MORE VECTOR CANDIDATES
    # -----------------------------------------

    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": query_embedding,
                "numCandidates": 100,
                "limit": 20,
            }
        },
        {
            "$project": {
                "_id": 0,
                "title": 1,
                "category": 1,
                "source": 1,
                "text": 1,
                "chunk_index": 1,
                "score": {
                    "$meta": "vectorSearchScore"
                },
            }
        },
    ]

    results = list(
        collection.aggregate(pipeline)
    )

    # -----------------------------------------
    # PRIORITIZE INTENT CATEGORY
    # -----------------------------------------

    if intent != "general":

        matching = [
            result
            for result in results
            if result.get("category") == intent
        ]

        non_matching = [
            result
            for result in results
            if result.get("category") != intent
        ]

        # Matching category comes first.
        results = matching + non_matching

    # -----------------------------------------
    # RETURN FINAL RESULTS
    # -----------------------------------------

    return results[:limit]