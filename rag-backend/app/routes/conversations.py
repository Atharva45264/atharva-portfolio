from fastapi import APIRouter, Depends, HTTPException, Header

from pydantic import BaseModel, Field

from bson import ObjectId

from app.auth.dependencies import get_current_user

from app.database import get_conversations_collection

from app.services.public_session import (
    verify_conversation_token,
)


router = APIRouter(
    prefix="/api/conversations",
    tags=["Conversations"],
)


# =========================================
# REQUEST MODEL
# =========================================

class RenameConversationRequest(BaseModel):

    title: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )


# =========================================
# LIST CONVERSATIONS
# =========================================

@router.get("")
async def list_conversations(
    current_user=Depends(get_current_user),
):

    try:

        conversations = get_conversations_collection()

        user_id = current_user["_id"]

        cursor = conversations.find(
            {
                "user_id": user_id,
            },
            {
                "messages": 0,
            },
        ).sort(
            "updated_at",
            -1,
        )

        results = []

        for conversation in cursor:

            messages = conversation.get(
                "messages",
                [],
            )

            results.append(
                {
                    "conversation_id": str(
                        conversation["_id"]
                    ),
                    "title": conversation.get(
                        "title",
                        "New conversation",
                    ),
                    "message_count": len(
                        messages
                    ),
                    "created_at": conversation.get(
                        "created_at"
                    ),
                    "updated_at": conversation.get(
                        "updated_at"
                    ),
                }
            )

        return {
            "success": True,
            "conversations": results,
        }

    except Exception as error:

        print(
            "List conversations error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve conversations.",
        )


# =========================================
# PUBLIC CONVERSATION HELPER
# =========================================

def get_public_conversation(
    conversation_id: str,
    conversation_token: str | None,
):

    if not conversation_token:

        raise HTTPException(
            status_code=401,
            detail="Conversation token required.",
        )

    try:

        object_id = ObjectId(
            conversation_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid conversation ID.",
        )

    conversations = get_conversations_collection()

    conversation = conversations.find_one(
        {
            "_id": object_id,
        }
    )

    if not conversation:

        raise HTTPException(
            status_code=404,
            detail="Conversation not found.",
        )

    stored_token_hash = conversation.get(
        "conversation_token_hash"
    )

    if not stored_token_hash:

        raise HTTPException(
            status_code=401,
            detail=(
                "Conversation token is not configured "
                "for this conversation."
            ),
        )

    token_valid = verify_conversation_token(
        conversation_token,
        stored_token_hash,
    )

    if not token_valid:

        raise HTTPException(
            status_code=403,
            detail="Invalid conversation token.",
        )

    return (
        conversation,
        object_id,
        conversations,
    )


# =========================================
# GET SINGLE CONVERSATION
# =========================================

@router.get("/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    x_conversation_token: str | None = Header(
        default=None,
        alias="X-Conversation-Token",
    ),
):

    try:

        conversation, object_id, conversations = (
            get_public_conversation(
                conversation_id,
                x_conversation_token,
            )
        )

        messages = []

        for message in conversation.get(
            "messages",
            [],
        ):

            messages.append(
                {
                    "role": message.get(
                        "role"
                    ),
                    "content": message.get(
                        "content"
                    ),
                    "created_at": message.get(
                        "created_at"
                    ),
                }
            )

        return {
            "success": True,
            "conversation": {
                "conversation_id": str(
                    conversation["_id"]
                ),
                "title": conversation.get(
                    "title",
                    "New conversation",
                ),
                "messages": messages,
                "created_at": conversation.get(
                    "created_at"
                ),
                "updated_at": conversation.get(
                    "updated_at"
                ),
            },
        }

    except HTTPException:

        raise

    except Exception as error:

        print(
            "Get conversation error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve conversation.",
        )


# =========================================
# RENAME CONVERSATION
# =========================================

@router.patch("/{conversation_id}")
async def rename_conversation(
    conversation_id: str,
    request: RenameConversationRequest,
    x_conversation_token: str | None = Header(
        default=None,
        alias="X-Conversation-Token",
    ),
):

    try:

        conversation, object_id, conversations = (
            get_public_conversation(
                conversation_id,
                x_conversation_token,
            )
        )

        title = request.title.strip()

        if not title:

            raise HTTPException(
                status_code=400,
                detail="Conversation title cannot be empty.",
            )

        result = conversations.update_one(
            {
                "_id": object_id,
            },
            {
                "$set": {
                    "title": title,
                }
            },
        )

        if result.matched_count == 0:

            raise HTTPException(
                status_code=404,
                detail="Conversation not found.",
            )

        return {
            "success": True,
            "conversation_id": conversation_id,
            "title": title,
        }

    except HTTPException:

        raise

    except Exception as error:

        print(
            "Rename conversation error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to rename conversation.",
        )


# =========================================
# DELETE CONVERSATION
# =========================================

@router.delete("/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    x_conversation_token: str | None = Header(
        default=None,
        alias="X-Conversation-Token",
    ),
):

    try:

        conversation, object_id, conversations = (
            get_public_conversation(
                conversation_id,
                x_conversation_token,
            )
        )

        result = conversations.delete_one(
            {
                "_id": object_id,
            }
        )

        if result.deleted_count == 0:

            raise HTTPException(
                status_code=404,
                detail="Conversation not found.",
            )

        return {
            "success": True,
            "message": "Conversation deleted successfully.",
            "conversation_id": conversation_id,
        }

    except HTTPException:

        raise

    except Exception as error:

        print(
            "Delete conversation error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to delete conversation.",
        )