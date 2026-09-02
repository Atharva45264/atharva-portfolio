import os
import logging

from dotenv import load_dotenv

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from app.database import get_database

from app.routes.resume import router as resume_router
from app.routes.chat import router as chat_router
from app.routes.auth import router as auth_router
from app.routes.conversations import router as conversations_router

from app.services.llm import generate_answer
from app.services.rate_limiter import limiter

from slowapi.middleware import SlowAPIMiddleware


# =========================================
# ENVIRONMENT
# =========================================

load_dotenv()

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
)


# =========================================
# LOGGER
# =========================================

logger = logging.getLogger(
    "atharva_portfolio"
)


# =========================================
# FASTAPI APP
# =========================================

app = FastAPI(
    title="Atharva Portfolio RAG API",
    description="RAG-powered portfolio assistant",
    version="1.0.0",
)


# =========================================
# RATE LIMITER
# =========================================

app.state.limiter = limiter

app.add_middleware(
    SlowAPIMiddleware
)


# =========================================
# CORS
# =========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
    ],
    allow_credentials=False,
    allow_methods=[
        "GET",
        "POST",
        "PATCH",
        "DELETE",
    ],
    allow_headers=[
        "Content-Type",
        "Accept",
        "X-Conversation-Token",
    ],
)


# =========================================
# GLOBAL EXCEPTION HANDLER
# =========================================

@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception,
):
    logger.exception(
        "Unhandled exception on %s %s",
        request.method,
        request.url.path,
    )

    return JSONResponse(
        status_code=500,
        content={
            "detail": (
                "An unexpected error occurred. "
                "Please try again later."
            )
        },
    )


# =========================================
# LLM TEST MODEL
# =========================================

class LLMTestRequest(BaseModel):
    question: str


# =========================================
# ROUTERS
# =========================================

app.include_router(
    resume_router
)

app.include_router(
    chat_router
)

app.include_router(
    auth_router
)

app.include_router(
    conversations_router
)


# =========================================
# ROOT
# =========================================

@app.get("/")
def root():
    return {
        "success": True,
        "message": (
            "Atharva Portfolio RAG API "
            "is running"
        ),
    }


# =========================================
# HEALTH
# =========================================

@app.get("/health")
async def health():

    try:

        db = get_database()

        db.command("ping")

        return {
            "status": "healthy",
            "service": "rag-backend",
            "database": "connected",
        }

    except Exception:

        logger.exception(
            "Health check failed"
        )

        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "service": "rag-backend",
                "database": "disconnected",
            },
        )


# =========================================
# TEST DATABASE
# =========================================

@app.post("/test-db")
async def test_database():

    try:

        db = get_database()

        result = db["knowledge"].insert_one(
            {
                "type": "test",
                "message": (
                    "MongoDB connection "
                    "is working"
                ),
            }
        )

        return {
            "success": True,
            "message": (
                "MongoDB connection "
                "successful"
            ),
            "document_id": str(
                result.inserted_id
            ),
        }

    except Exception as e:

        return {
            "success": False,
            "message": (
                "MongoDB connection "
                "failed"
            ),
            "error": str(e),
        }


# =========================================
# TEST LLM
# =========================================

@app.post("/test-llm")
async def test_llm(
    request: LLMTestRequest,
):

    context = """
    Atharva Phanse is an Information
    Technology graduate.

    He has experience building
    full-stack applications,
    AI-powered applications and
    automated workflows.

    His projects include FlowForge,
    NewsNaut and VisionMeet.
    """

    answer = generate_answer(
        question=request.question,
        context=context,
    )

    return {
        "success": True,
        "question": request.question,
        "answer": answer,
    }