from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from app.services.pdf import extract_text_from_pdf
from app.services.chunking import chunk_text

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
