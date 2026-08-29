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

    For project-list questions, only one result is
    returned per project.
    """

    query_embedding = generate_embedding(query)

    collection = get_knowledge_collection()

    # -----------------------------------------
    # DETECT QUESTION INTENT
    # -----------------------------------------

    intent = detect_intent(query)

    # -----------------------------------------
    # VECTOR SEARCH
    # -----------------------------------------

    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": query_embedding,
                "numCandidates": 100,
                "limit": 30,
            }
        },
        {
            "$project": {
                "_id": 0,
                "title": 1,
                "category": 1,
                "source": 1,
                "url": 1,
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

        results = matching + non_matching

    # -----------------------------------------
    # REMOVE DUPLICATE PROJECTS
    # -----------------------------------------

    if intent == "project":

        unique_projects = []
        seen_projects = set()

        for result in results:

            title = result.get("title")

            if (
                result.get("category") == "project"
                and title not in seen_projects
            ):
                unique_projects.append(result)
                seen_projects.add(title)

        if unique_projects:

            return unique_projects[:limit]

    # -----------------------------------------
    # DEFAULT RESULT
    # -----------------------------------------

    return results[:limit]