from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.pdf import extract_text_from_pdf
from app.services.chunking import chunk_text
from app.services.embeddings import generate_embeddings
from app.database import get_knowledge_collection
from pydantic import BaseModel

class RetrievalRequest(BaseModel):
    query: str
    limit: int = 5

router = APIRouter(prefix="/api/resume", tags=["Resume"])


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    # Check that a file was provided
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided.")

    # Check file extension
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # Read file
    file_content = await file.read()

    # Basic empty-file check
    if not file_content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Save the PDF
    file_path = UPLOAD_DIR / "resume.pdf"

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    return {
        "success": True,
        "message": "Resume uploaded successfully.",
        "filename": file.filename,
        "size": len(file_content),
    }


@router.get("/extract")
async def extract_resume_text():
    file_path = UPLOAD_DIR / "resume.pdf"

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Resume has not been uploaded yet.")

    try:
        text = extract_text_from_pdf(file_path)

        if not text:
            raise HTTPException(
                status_code=400, detail="Could not extract any text from the resume."
            )

        return {
            "success": True,
            "message": "Resume text extracted successfully.",
            "characters": len(text),
            "text": text,
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to extract resume text: {str(e)}"
        )


@router.get("/chunks")
async def get_resume_chunks():
    file_path = UPLOAD_DIR / "resume.pdf"

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Resume has not been uploaded yet.")

    try:
        text = extract_text_from_pdf(file_path)

        if not text:
            raise HTTPException(
                status_code=400, detail="Could not extract any text from the resume."
            )

        chunks = chunk_text(
            text,
            chunk_size=500,
            chunk_overlap=100,
        )

        return {
            "success": True,
            "message": "Resume chunked successfully.",
            "total_chunks": len(chunks),
            "chunks": chunks,
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to chunk resume: {str(e)}")
    
@router.get("/embeddings")
async def generate_resume_embeddings():
    file_path = UPLOAD_DIR / "resume.pdf"

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Resume has not been uploaded yet."
        )

    try:
        text = extract_text_from_pdf(file_path)

        if not text:
            raise HTTPException(
                status_code=400,
                detail="Could not extract any text from the resume."
            )

        chunks = chunk_text(
            text,
            chunk_size=500,
            chunk_overlap=100,
        )

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="No chunks were generated."
            )

        embeddings = generate_embeddings(chunks)

        return {
            "success": True,
            "message": "Resume embeddings generated successfully.",
            "total_chunks": len(chunks),
            "embedding_dimensions": len(embeddings[0]),
            "embeddings": embeddings,
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate embeddings: {str(e)}"
        )

@router.post("/ingest")
async def ingest_resume():
    file_path = UPLOAD_DIR / "resume.pdf"

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Resume has not been uploaded yet.",
        )

    try:
        # Extract text
        text = extract_text_from_pdf(file_path)

        if not text:
            raise HTTPException(
                status_code=400,
                detail="Could not extract any text from the resume.",
            )

        # Create chunks
        chunks = chunk_text(
            text,
            chunk_size=500,
            chunk_overlap=100,
        )

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="No chunks were generated.",
            )

        # Generate embeddings
        embeddings = generate_embeddings(chunks)

        # Get MongoDB collection
        collection = get_knowledge_collection()

        # Remove previous resume chunks
        collection.delete_many({
            "source": "resume"
        })

        # Prepare MongoDB documents
        documents = []

        for index, (chunk, embedding) in enumerate(
            zip(chunks, embeddings)
        ):
            documents.append({
                "text": chunk,
                "source": "resume",
                "chunk_index": index,
                "embedding": embedding,
            })

        # Insert all chunks
        result = collection.insert_many(documents)

        return {
            "success": True,
            "message": "Resume ingested successfully.",
            "total_chunks": len(result.inserted_ids),
            "embedding_dimensions": len(embeddings[0]),
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to ingest resume: {str(e)}",
        )
        
@router.post("/retrieve")
async def retrieve_resume_chunks(request: RetrievalRequest):
    try:
        from app.services.retrieval import retrieve_relevant_chunks

        results = retrieve_relevant_chunks(
            request.query,
            request.limit,
        )

        return {
            "success": True,
            "query": request.query,
            "results": results,
            "count": len(results),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Retrieval failed: {str(e)}",
        )