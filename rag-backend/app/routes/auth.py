from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.database import get_users_collection
from app.auth.password import (
    hash_password,
    verify_password,
)
from app.auth.jwt import (
    create_access_token,
    create_refresh_token,
)


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


# =========================================
# REGISTER
# =========================================

@router.post("/register")
async def register(request: RegisterRequest):

    users = get_users_collection()

    email = request.email.lower().strip()

    # -----------------------------------------
    # CHECK EXISTING USER
    # -----------------------------------------

    existing_user = users.find_one({
        "email": email
    })

    if existing_user:

        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists.",
        )

    # -----------------------------------------
    # PASSWORD VALIDATION
    # -----------------------------------------

    if len(request.password) < 8:

        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long.",
        )

    # -----------------------------------------
    # CREATE USER
    # -----------------------------------------

    now = datetime.now(timezone.utc)

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

    user_id = str(result.inserted_id)

    # -----------------------------------------
    # CREATE TOKENS
    # -----------------------------------------

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
async def login(request: LoginRequest):

    users = get_users_collection()

    email = request.email.lower().strip()

    # -----------------------------------------
    # FIND USER
    # -----------------------------------------

    user = users.find_one({
        "email": email
    })

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    # -----------------------------------------
    # VERIFY PASSWORD
    # -----------------------------------------

    password_valid = verify_password(
        request.password,
        user["password_hash"],
    )

    if not password_valid:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    # -----------------------------------------
    # CREATE TOKENS
    # -----------------------------------------

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