from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime, timezone

from app.services.retrieval import retrieve_relevant_chunks
from app.services.llm import generate_answer
from app.auth.dependencies import get_current_user
from app.database import get_conversations_collection


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
    conversation_id: str | None = None


# =========================================
# CHAT ENDPOINT
# =========================================

@router.post("")
async def chat(
    request: ChatRequest,
    current_user=Depends(get_current_user),
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
        # GET CONVERSATIONS COLLECTION
        # ---------------------------------

        conversations = get_conversations_collection()

        conversation = None

        # ---------------------------------
        # LOAD EXISTING CONVERSATION
        # ---------------------------------

        if request.conversation_id:

            try:

                conversation = conversations.find_one(
                    {
                        "_id": ObjectId(
                            request.conversation_id
                        ),
                        "user_id": current_user["_id"],
                    }
                )

            except Exception:

                raise HTTPException(
                    status_code=400,
                    detail="Invalid conversation ID.",
                )

            if not conversation:

                raise HTTPException(
                    status_code=404,
                    detail="Conversation not found.",
                )

        # ---------------------------------
        # CREATE NEW CONVERSATION
        # ---------------------------------

        now = datetime.now(timezone.utc)

        if conversation is None:

            conversation = {
                "user_id": current_user["_id"],
                "messages": [],
                "created_at": now,
                "updated_at": now,
            }

            result = conversations.insert_one(
                conversation
            )

            conversation["_id"] = result.inserted_id

        # ---------------------------------
        # SAVE USER MESSAGE
        # ---------------------------------

        conversations.update_one(
            {
                "_id": conversation["_id"],
                "user_id": current_user["_id"],
            },
            {
                "$push": {
                    "messages": {
                        "role": "user",
                        "content": question,
                    }
                },
                "$set": {
                    "updated_at": now,
                },
            },
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

            answer = (
                "I don't have enough information "
                "in my portfolio data to answer that."
            )

            # Save assistant response
            conversations.update_one(
                {
                    "_id": conversation["_id"],
                    "user_id": current_user["_id"],
                },
                {
                    "$push": {
                        "messages": {
                            "role": "assistant",
                            "content": answer,
                        }
                    },
                    "$set": {
                        "updated_at": datetime.now(
                            timezone.utc
                        ),
                    },
                },
            )

            return {
                "success": True,
                "question": question,
                "answer": answer,
                "sources": [],
                "conversation_id": str(
                    conversation["_id"]
                ),
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
        # SAVE ASSISTANT MESSAGE
        # ---------------------------------

        conversations.update_one(
            {
                "_id": conversation["_id"],
                "user_id": current_user["_id"],
            },
            {
                "$push": {
                    "messages": {
                        "role": "assistant",
                        "content": answer,
                    }
                },
                "$set": {
                    "updated_at": datetime.now(
                        timezone.utc
                    ),
                },
            },
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
                    "url": result.get(
                        "url"
                    ),
                    "score": result.get(
                        "score"
                    ),
                }
            )

        # ---------------------------------
        # FINAL RESPONSE
        # ---------------------------------

        return {
            "success": True,
            "question": question,
            "answer": answer,
            "sources": sources,
            "conversation_id": str(
                conversation["_id"]
            ),
        }

    # =====================================
    # HTTP EXCEPTIONS
    # =====================================

    except HTTPException:

        raise

    # =====================================
    # UNEXPECTED ERRORS
    # =====================================

    except Exception as error:

        print(
            "Chat endpoint error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate answer.",
        )