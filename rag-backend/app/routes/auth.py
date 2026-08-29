from datetime import datetime, timedelta, timezone

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
    REFRESH_TOKEN_EXPIRE_DAYS,
)

from app.auth.refresh_tokens import (
    store_refresh_token,
    find_refresh_token,
    revoke_refresh_token,
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

    # =====================================
    # CREATE TOKENS
    # =====================================

    access_token = create_access_token(
        user_id
    )

    refresh_token = create_refresh_token(
        user_id
    )

    # =====================================
    # STORE REFRESH TOKEN
    # =====================================

    refresh_expires_at = datetime.now(
        timezone.utc
    ) + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )

    store_refresh_token(
        token=refresh_token,
        user_id=user_id,
        expires_at=refresh_expires_at,
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

    # =====================================
    # CREATE TOKENS
    # =====================================

    access_token = create_access_token(
        user_id
    )

    refresh_token = create_refresh_token(
        user_id
    )

    # =====================================
    # STORE REFRESH TOKEN
    # =====================================

    refresh_expires_at = datetime.now(
        timezone.utc
    ) + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )

    store_refresh_token(
        token=refresh_token,
        user_id=user_id,
        expires_at=refresh_expires_at,
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

    # =====================================
    # 1. VERIFY JWT
    # =====================================

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

    # =====================================
    # 2. CHECK MONGODB
    # =====================================

    stored_token = find_refresh_token(
        request.refresh_token
    )

    if not stored_token:

        raise HTTPException(
            status_code=401,
            detail="Refresh token has been revoked or does not exist.",
        )

    # =====================================
    # 3. CHECK TOKEN EXPIRATION IN DATABASE
    # =====================================

    expires_at = stored_token.get(
        "expires_at"
    )

    if expires_at:

        if expires_at.tzinfo is None:

            expires_at = expires_at.replace(
                tzinfo=timezone.utc
            )

        if expires_at <= datetime.now(
            timezone.utc
        ):

            revoke_refresh_token(
                request.refresh_token
            )

            raise HTTPException(
                status_code=401,
                detail="Refresh token has expired.",
            )

    # =====================================
    # 4. VERIFY USER ID
    # =====================================

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

        revoke_refresh_token(
            request.refresh_token
        )

        raise HTTPException(
            status_code=401,
            detail="User no longer exists.",
        )

    # =====================================
    # 5. REVOKE OLD REFRESH TOKEN
    # =====================================

    revoke_refresh_token(
        request.refresh_token
    )

    # =====================================
    # 6. CREATE NEW TOKENS
    # =====================================

    new_access_token = create_access_token(
        user_id
    )

    new_refresh_token = create_refresh_token(
        user_id
    )

    # =====================================
    # 7. STORE NEW REFRESH TOKEN
    # =====================================

    new_refresh_expires_at = datetime.now(
        timezone.utc
    ) + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )

    store_refresh_token(
        token=new_refresh_token,
        user_id=user_id,
        expires_at=new_refresh_expires_at,
    )

    # =====================================
    # 8. RETURN NEW TOKENS
    # =====================================

    return {
        "success": True,
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
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
    request: RefreshRequest,
    current_user=Depends(
        get_current_user
    ),
):

    refresh_token = request.refresh_token

    # =====================================
    # REVOKE REFRESH TOKEN
    # =====================================

    stored_token = find_refresh_token(
        refresh_token
    )

    if stored_token:

        revoke_refresh_token(
            refresh_token
        )

    return {
        "success": True,
        "message": "Logged out successfully.",
    }