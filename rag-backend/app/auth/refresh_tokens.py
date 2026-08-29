from datetime import datetime, timezone

from app.database import get_refresh_tokens_collection


def store_refresh_token(
    token: str,
    user_id: str,
    expires_at: datetime,
):
    """
    Store a refresh token in MongoDB.
    """

    refresh_tokens = get_refresh_tokens_collection()

    refresh_tokens.insert_one({
        "token": token,
        "user_id": user_id,
        "expires_at": expires_at,
        "revoked": False,
        "created_at": datetime.now(timezone.utc),
    })


def find_refresh_token(token: str):
    """
    Find an active refresh token.
    """

    refresh_tokens = get_refresh_tokens_collection()

    return refresh_tokens.find_one({
        "token": token,
        "revoked": False,
    })


def revoke_refresh_token(token: str):
    """
    Revoke a refresh token.
    """

    refresh_tokens = get_refresh_tokens_collection()

    refresh_tokens.update_one(
        {"token": token},
        {
            "$set": {
                "revoked": True,
                "revoked_at": datetime.now(timezone.utc),
            }
        },
    )