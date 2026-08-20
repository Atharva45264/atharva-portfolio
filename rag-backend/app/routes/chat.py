from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.embeddings import generate_embedding
from app.services.llm import generate_answer
from app.database import get_database


router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"],
)


# =========================================
# REQUEST MODEL
# =========================================

class ChatRequest(BaseModel):
    question: str
    limit: int = 5


# =========================================
# CHAT ENDPOINT
# =========================================

@router.post("")
async def chat(request: ChatRequest):

    try:

        # ---------------------------------
        # VALIDATE QUESTION
        # ---------------------------------

        question = request.question.strip()

        if not question:
            raise HTTPException(
                status_code=400,
                detail="Question cannot be empty.",
            )

        # ---------------------------------
        # GENERATE QUESTION EMBEDDING
        # ---------------------------------

        query_embedding = generate_embedding(question)

        # ---------------------------------
        # GET DATABASE
        # ---------------------------------

        db = get_database()

        collection = db["knowledge"]

        # ---------------------------------
        # VECTOR SEARCH
        # ---------------------------------

        pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "path": "embedding",
                    "queryVector": query_embedding,
                    "numCandidates": 50,
                    "limit": request.limit,
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

        results = list(
            collection.aggregate(pipeline)
        )

        # ---------------------------------
        # NO RESULTS
        # ---------------------------------

        if not results:

            return {
                "success": True,
                "question": question,
                "answer": (
                    "I don't have enough information in "
                    "my portfolio data to answer that."
                ),
                "sources": [],
            }

        # ---------------------------------
        # BUILD CONTEXT
        # ---------------------------------

        context_parts = []

        for result in results:

            text = result.get("text", "")

            if text:

                context_parts.append(
                    text
                )

        context = "\n\n".join(
            context_parts
        )

        # ---------------------------------
        # GENERATE ANSWER
        # ---------------------------------

        answer = generate_answer(
            question=question,
            context=context,
        )

        # ---------------------------------
        # RETURN RESPONSE
        # ---------------------------------

        sources = []

        for result in results:

            sources.append(
                {
                    "source": result.get(
                        "source"
                    ),
                    "chunk_index": result.get(
                        "chunk_index"
                    ),
                    "score": result.get(
                        "score"
                    ),
                }
            )

        return {
            "success": True,
            "question": question,
            "answer": answer,
            "sources": sources,
        }

    except HTTPException:

        raise

    except Exception as error:

        print(
            "Chat endpoint error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate answer.",
        )