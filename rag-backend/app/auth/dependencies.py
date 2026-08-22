from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.auth.jwt import verify_access_token
from app.database import get_users_collection


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
):

    token = credentials.credentials

    payload = verify_access_token(
        token
    )

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token.",
        )

    user_id = payload.get("sub")

    if not user_id:

        raise HTTPException(
            status_code=401,
            detail="Invalid access token.",
        )

    from bson import ObjectId

    try:

        object_id = ObjectId(user_id)

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid user ID.",
        )

    users = get_users_collection()

    user = users.find_one({
        "_id": object_id
    })

    if not user:

        raise HTTPException(
            status_code=401,
            detail="User no longer exists.",
        )

    return user