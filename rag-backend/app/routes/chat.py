from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime, timezone
from app.services.rate_limiter import limiter

from app.services.retrieval import retrieve_relevant_chunks
from app.services.llm import generate_answer
from app.services.conversation import (
    build_retrieval_query,
    generate_conversation_title,
)
from app.services.public_session import (
    generate_conversation_token,
    hash_conversation_token,
    verify_conversation_token,
)
from app.database import get_conversations_collection


router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"],
)


class ChatRequest(BaseModel):

    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
    )

    conversation_id: str | None = None

    conversation_token: str | None = Field(
        default=None,
        min_length=20,
        max_length=200,
    )

    limit: int = Field(
        default=5,
        ge=1,
        le=10,
    )


@router.post("")
@limiter.limit("10/minute")
async def chat(
    request: Request,
    chat_request: ChatRequest,
):

    try:

        # =========================================
        # VALIDATE MESSAGE
        # =========================================

        message = chat_request.message.strip()

        if not message:

            raise HTTPException(
                status_code=400,
                detail="Message cannot be empty.",
            )


        # =========================================
        # DATABASE
        # =========================================

        conversations = (
            get_conversations_collection()
        )

        conversation = None

        conversation_object_id = None


        # =========================================
        # LOAD EXISTING CONVERSATION
        # =========================================

        if chat_request.conversation_id:

            # -------------------------------------
            # Conversation ID
            # -------------------------------------

            try:

                conversation_object_id = ObjectId(
                    chat_request.conversation_id
                )

            except Exception:

                raise HTTPException(
                    status_code=400,
                    detail="Invalid conversation ID.",
                )


            # -------------------------------------
            # Conversation token required
            # -------------------------------------

            if not chat_request.conversation_token:

                raise HTTPException(
                    status_code=401,
                    detail="Conversation token required.",
                )


            # -------------------------------------
            # Find conversation
            # -------------------------------------

            conversation = conversations.find_one(
                {
                    "_id": conversation_object_id,
                }
            )


            if not conversation:

                raise HTTPException(
                    status_code=404,
                    detail="Conversation not found.",
                )


            # -------------------------------------
            # Verify token
            # -------------------------------------

            stored_token_hash = conversation.get(
                "conversation_token_hash"
            )


            if not stored_token_hash:

                raise HTTPException(
                    status_code=401,
                    detail="Conversation token is not configured for this conversation.",
                )


            token_valid = verify_conversation_token(
                chat_request.conversation_token,
                stored_token_hash,
            )


            if not token_valid:

                raise HTTPException(
                    status_code=403,
                    detail="Invalid conversation token.",
                )


        # =========================================
        # CONVERSATION HISTORY
        # =========================================

        conversation_history = []

        if conversation:

            conversation_history = (
                conversation.get(
                    "messages",
                    [],
                )
            )


        # =========================================
        # BUILD RETRIEVAL QUERY
        # =========================================

        retrieval_query = build_retrieval_query(
            question=message,
            conversation_history=conversation_history,
        )


        # =========================================
        # RETRIEVE KNOWLEDGE
        # =========================================

        results = retrieve_relevant_chunks(
            query=message,
            retrieval_query=retrieval_query,
            limit=chat_request.limit,
        )


        # =========================================
        # BUILD CONTEXT
        # =========================================

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


        # =========================================
        # GENERATE ANSWER
        # =========================================

        if results:

            answer = generate_answer(
                question=message,
                context=context,
                conversation_history=conversation_history,
            )

        else:

            answer = (
                "I don't have that information "
                "in my portfolio data."
            )


        # =========================================
        # BUILD SOURCES
        # =========================================

        sources = []

        seen_sources = set()


        for result in results:

            title = result.get(
                "title"
            )

            category = result.get(
                "category"
            )

            source = result.get(
                "source"
            )

            url = result.get(
                "url"
            )


            source_key = (
                title,
                category,
                source,
                url,
            )


            if source_key in seen_sources:

                continue


            seen_sources.add(
                source_key
            )


            sources.append(
                {
                    "title": title,
                    "category": category,
                    "source": source,
                    "url": url,
                    "score": result.get(
                        "score"
                    ),
                }
            )


        # =========================================
        # CURRENT TIME
        # =========================================

        now = datetime.now(
            timezone.utc
        )


        # =========================================
        # CREATE NEW CONVERSATION
        # =========================================

        if conversation is None:

            # -------------------------------------
            # Generate secure token
            # -------------------------------------

            conversation_token = (
                generate_conversation_token()
            )


            conversation_token_hash = (
                hash_conversation_token(
                    conversation_token
                )
            )


            # -------------------------------------
            # Generate title
            # -------------------------------------

            conversation_title = (
                generate_conversation_title(
                    message
                )
            )


            # -------------------------------------
            # Create document
            # -------------------------------------

            new_conversation = {

                "user_id": None,

                "title": conversation_title,

                "conversation_token_hash":
                    conversation_token_hash,

                "messages": [

                    {
                        "role": "user",
                        "content": message,
                        "created_at": now,
                    },

                    {
                        "role": "assistant",
                        "content": answer,
                        "created_at": now,
                    },

                ],

                "created_at": now,

                "updated_at": now,

            }


            # -------------------------------------
            # Insert
            # -------------------------------------

            result = conversations.insert_one(
                new_conversation
            )


            conversation_object_id = (
                result.inserted_id
            )


        # =========================================
        # UPDATE EXISTING CONVERSATION
        # =========================================

        else:

            conversations.update_one(

                {
                    "_id": conversation_object_id,
                },

                {
                    "$push": {

                        "messages": {

                            "$each": [

                                {
                                    "role": "user",
                                    "content": message,
                                    "created_at": now,
                                },

                                {
                                    "role": "assistant",
                                    "content": answer,
                                    "created_at": now,
                                },

                            ]

                        }

                    },

                    "$set": {

                        "updated_at": now,

                    },

                },

            )


            # Existing conversation already
            # has the token.
            conversation_token = None


        # =========================================
        # RESPONSE
        # =========================================

        response = {

            "success": True,

            "answer": answer,

            "conversation_id":
                str(
                    conversation_object_id
                ),

            "sources": sources,

        }


        # =========================================
        # RETURN TOKEN ONLY FOR NEW CONVERSATION
        # =========================================

        if conversation_token:

            response[
                "conversation_token"
            ] = conversation_token


        return response


    # =============================================
    # HTTP ERRORS
    # =============================================

    except HTTPException:

        raise


    # =============================================
    # UNEXPECTED ERRORS
    # =============================================

    except Exception as error:

        print(
            "Chat endpoint error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate answer.",
        )