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
        # CONVERSATION SETUP
        # ---------------------------------

        conversations = get_conversations_collection()

        conversation = None

        # Always initialize history
        conversation_history = []

        # ---------------------------------
        # LOAD EXISTING CONVERSATION
        # ---------------------------------

        if request.conversation_id:

            try:

                conversation = conversations.find_one({
                    "_id": ObjectId(
                        request.conversation_id
                    ),
                    "user_id": current_user["_id"],
                })

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

            conversation_history = conversation.get(
                "messages",
                []
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

            # Save conversation even when no RAG result
            if conversation:

                now = datetime.now(timezone.utc)

                conversations.update_one(
                    {
                        "_id": conversation["_id"],
                        "user_id": current_user["_id"],
                    },
                    {
                        "$push": {
                            "messages": {
                                "$each": [
                                    {
                                        "role": "user",
                                        "content": question,
                                    },
                                    {
                                        "role": "assistant",
                                        "content": answer,
                                    },
                                ]
                            }
                        },
                        "$set": {
                            "updated_at": now,
                        },
                    },
                )

            else:

                now = datetime.now(timezone.utc)

                new_conversation = {
                    "user_id": current_user["_id"],
                    "messages": [
                        {
                            "role": "user",
                            "content": question,
                        },
                        {
                            "role": "assistant",
                            "content": answer,
                        },
                    ],
                    "created_at": now,
                    "updated_at": now,
                }

                result = conversations.insert_one(
                    new_conversation
                )

                conversation = new_conversation
                conversation["_id"] = result.inserted_id

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
    conversation_history=conversation_history,
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
        # SAVE CONVERSATION
        # ---------------------------------

        now = datetime.now(timezone.utc)

        user_message = {
            "role": "user",
            "content": question,
        }

        assistant_message = {
            "role": "assistant",
            "content": answer,
        }

        # Existing conversation
        if conversation:

            conversations.update_one(
                {
                    "_id": conversation["_id"],
                    "user_id": current_user["_id"],
                },
                {
                    "$push": {
                        "messages": {
                            "$each": [
                                user_message,
                                assistant_message,
                            ]
                        }
                    },
                    "$set": {
                        "updated_at": now,
                    },
                },
            )

        # New conversation
        else:

            new_conversation = {
                "user_id": current_user["_id"],
                "messages": [
                    user_message,
                    assistant_message,
                ],
                "created_at": now,
                "updated_at": now,
            }

            result = conversations.insert_one(
                new_conversation
            )

            conversation = new_conversation
            conversation["_id"] = result.inserted_id

        # ---------------------------------
        # RESPONSE
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

    # -------------------------------------
    # HTTP ERRORS
    # -------------------------------------

    except HTTPException:

        raise

    # -------------------------------------
    # UNEXPECTED ERRORS
    # -------------------------------------

    except Exception as error:

        print(
            "Chat endpoint error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate answer.",
        )