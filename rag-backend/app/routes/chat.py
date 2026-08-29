from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.services.retrieval import retrieve_relevant_chunks
from app.services.llm import generate_answer
from app.auth.dependencies import get_current_user


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
async def chat(
    request: ChatRequest,
    current_user=Depends(
        get_current_user
    ),
):

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
        # RETRIEVE KNOWLEDGE
        # ---------------------------------

        results = retrieve_relevant_chunks(
            query=question,
            limit=request.limit,
        )

        # ---------------------------------
        # NO RESULTS
        # ---------------------------------

        if not results:

            return {
                "success": True,
                "question": question,
                "answer": (
                    "I don't have enough information "
                    "in my portfolio data to answer that."
                ),
                "sources": [],
            }

        # ---------------------------------
        # BUILD STRUCTURED CONTEXT
        # ---------------------------------

        context_parts = []

        for result in results:

            title = result.get(
                "title",
                "Unknown",
            )

            category = result.get(
                "category",
                "general",
            )

            source = result.get(
                "source",
                "unknown",
            )

            text = result.get(
                "text",
                "",
            )

            context_parts.append(
                f"""
TITLE: {title}
CATEGORY: {category}
SOURCE: {source}

CONTENT:
{text}
""".strip()
            )

        context = "\n\n---\n\n".join(
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
        # RETURN SOURCES
        # ---------------------------------

        sources = []

        for result in results:

            sources.append(
                {
                    "title": result.get(
                        "title"
                    ),
                    "category": result.get(
                        "category"
                    ),
                    "source": result.get(
                        "source"
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