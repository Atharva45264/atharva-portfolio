from fastapi import FastAPI
from dotenv import load_dotenv
from app.database import get_database
from app.routes.resume import router as resume_router

load_dotenv()

app = FastAPI(
    title="Atharva Portfolio RAG API",
    description="RAG-powered portfolio assistant",
    version="1.0.0",
)

app.include_router(resume_router)


@app.get("/")
def root():
    return {
        "success": True,
        "message": "Atharva Portfolio RAG API is running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "rag-backend",
    }
    
@app.post("/test-db")
async def test_database():
    try:
        db = get_database()

        result = db["knowledge"].insert_one({
    "type": "test",
    "message": "MongoDB connection is working",
})

        return {
            "success": True,
            "message": "MongoDB connection successful",
            "document_id": str(result.inserted_id),
        }

    except Exception as e:
        return {
            "success": False,
            "message": "MongoDB connection failed",
            "error": str(e),
        }