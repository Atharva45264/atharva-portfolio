from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.auth.jwt import verify_access_token
from app.database import get_users_collection


security = HTTPBearer(
    auto_error=False
)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
):

    # =========================================
    # CHECK AUTHORIZATION HEADER
    # =========================================

    if not credentials:

        raise HTTPException(
            status_code=401,
            detail="Authentication required.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    token = credentials.credentials

    # =========================================
    # VERIFY ACCESS TOKEN
    # =========================================

    payload = verify_access_token(
        token
    )

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # =========================================
    # GET USER ID
    # =========================================

    user_id = payload.get("sub")

    if not user_id:

        raise HTTPException(
            status_code=401,
            detail="Invalid access token.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # =========================================
    # CONVERT USER ID
    # =========================================

    from bson import ObjectId

    try:

        object_id = ObjectId(
            user_id
        )

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid user ID.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # =========================================
    # FIND USER
    # =========================================

    users = get_users_collection()

    user = users.find_one({
        "_id": object_id
    })

    if not user:

        raise HTTPException(
            status_code=401,
            detail="User no longer exists.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    return user