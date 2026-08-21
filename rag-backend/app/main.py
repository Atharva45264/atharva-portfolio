from fastapi import FastAPI
from dotenv import load_dotenv
from app.database import get_database
from app.routes.resume import router as resume_router
from app.routes.chat import router as chat_router
from app.routes.auth import router as auth_router
from pydantic import BaseModel
from app.services.llm import generate_answer

load_dotenv()

app = FastAPI(
    title="Atharva Portfolio RAG API",
    description="RAG-powered portfolio assistant",
    version="1.0.0",
)

class LLMTestRequest(BaseModel):
    question: str

app.include_router(resume_router)
app.include_router(chat_router)
app.include_router(auth_router)


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
        
@app.post("/test-llm")
async def test_llm(request: LLMTestRequest):

    context = """
    Atharva Phanse is an Information Technology graduate.

    He has experience building full-stack applications,
    AI-powered applications and automated workflows.

    His projects include FlowForge, NewsNaut and VisionMeet.
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