from app.database import get_knowledge_collection

from app.services.embeddings import generate_embedding

from app.services.intent import detect_intent


def retrieve_relevant_chunks(
    query: str,
    limit: int = 5,
    retrieval_query: str | None = None,
):
    """
    Retrieve relevant portfolio knowledge using
    MongoDB Atlas Vector Search.

    If retrieval_query contains a specific project name,
    project retrieval is restricted to that project.

    This prevents unrelated projects from appearing in
    follow-up questions such as:

        What is FlowForge?
        What technologies does it use?

    In that case, only FlowForge knowledge should be retrieved.
    """

    # -----------------------------------------
    # USE REWRITTEN QUERY WHEN AVAILABLE
    # -----------------------------------------

    search_query = (
        retrieval_query.strip()
        if retrieval_query
        else query.strip()
    )

    # -----------------------------------------
    # GENERATE QUERY EMBEDDING
    # -----------------------------------------

    query_embedding = generate_embedding(
        search_query
    )

    collection = get_knowledge_collection()

    # -----------------------------------------
    # DETECT QUESTION INTENT
    # -----------------------------------------

    intent = detect_intent(query)

    # -----------------------------------------
    # DETECT SPECIFIC PROJECT
    # -----------------------------------------

    project_titles = [
        "FlowForge",
        "NewsNaut",
        "VisionMeet",
        "Sentinel AI Network IDS",
        "Atharva Portfolio",
    ]

    search_query_lower = search_query.lower()

    target_project = None

    for project in project_titles:

        if project.lower() in search_query_lower:

            target_project = project
            break

    # -----------------------------------------
    # VECTOR SEARCH
    # -----------------------------------------

    vector_search = {
        "$vectorSearch": {
            "index": "vector_index",
            "path": "embedding",
            "queryVector": query_embedding,
            "numCandidates": 100,
            "limit": 30,
        }
    }

    # -----------------------------------------
    # PROJECT FILTER
    # -----------------------------------------

    if target_project:

        vector_search["$vectorSearch"]["filter"] = {
            "title": target_project
        }

    pipeline = [
        vector_search,

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

    # -----------------------------------------
    # EXECUTE VECTOR SEARCH
    # -----------------------------------------

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
    # PROJECT RESULTS
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
    # TARGET PROJECT SAFETY FILTER
    # -----------------------------------------

    if target_project:

        results = [
            result
            for result in results
            if result.get("title") == target_project
        ]

    # -----------------------------------------
    # DEFAULT RESULT
    # -----------------------------------------

    return results[:limit]