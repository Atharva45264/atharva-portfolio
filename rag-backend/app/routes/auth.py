from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr

from app.database import get_users_collection
from app.auth.password import (
    hash_password,
    verify_password,
)
from app.auth.jwt import (
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
)
from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


# =========================================
# REQUEST MODELS
# =========================================

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


# =========================================
# REGISTER
# =========================================

@router.post("/register")
async def register(
    request: RegisterRequest,
):

    users = get_users_collection()

    email = request.email.lower().strip()

    existing_user = users.find_one({
        "email": email
    })

    if existing_user:

        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists.",
        )

    if len(request.password) < 8:

        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long.",
        )

    now = datetime.now(
        timezone.utc
    )

    user = {
        "name": request.name.strip(),
        "email": email,
        "password_hash": hash_password(
            request.password
        ),
        "created_at": now,
        "updated_at": now,
    }

    result = users.insert_one(user)

    user_id = str(
        result.inserted_id
    )

    access_token = create_access_token(
        user_id
    )

    refresh_token = create_refresh_token(
        user_id
    )

    return {
        "success": True,
        "message": "Account created successfully.",
        "user": {
            "id": user_id,
            "name": user["name"],
            "email": user["email"],
        },
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


# =========================================
# LOGIN
# =========================================

@router.post("/login")
async def login(
    request: LoginRequest,
):

    users = get_users_collection()

    email = request.email.lower().strip()

    user = users.find_one({
        "email": email
    })

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    password_valid = verify_password(
        request.password,
        user["password_hash"],
    )

    if not password_valid:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    user_id = str(
        user["_id"]
    )

    access_token = create_access_token(
        user_id
    )

    refresh_token = create_refresh_token(
        user_id
    )

    return {
        "success": True,
        "message": "Login successful.",
        "user": {
            "id": user_id,
            "name": user["name"],
            "email": user["email"],
        },
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


# =========================================
# REFRESH ACCESS TOKEN
# =========================================

@router.post("/refresh")
async def refresh(
    request: RefreshRequest,
):

    payload = verify_refresh_token(
        request.refresh_token
    )

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired refresh token.",
        )

    user_id = payload.get("sub")

    if not user_id:

        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token.",
        )

    try:

        object_id = ObjectId(
            user_id
        )

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

    new_access_token = create_access_token(
        user_id
    )

    return {
        "success": True,
        "access_token": new_access_token,
        "token_type": "bearer",
    }


# =========================================
# CURRENT USER
# =========================================

@router.get("/me")
async def get_me(
    current_user=Depends(
        get_current_user
    ),
):

    return {
        "success": True,
        "user": {
            "id": str(
                current_user["_id"]
            ),
            "name": current_user["name"],
            "email": current_user["email"],
        },
    }


# =========================================
# LOGOUT
# =========================================

@router.post("/logout")
async def logout(
    current_user=Depends(
        get_current_user
    ),
):

    # For now, logout is handled client-side
    # by removing the stored tokens.
    #
    # We will add refresh-token persistence
    # and revocation in the next authentication
    # refinement.

    return {
        "success": True,
        "message": "Logged out successfully.",
    }