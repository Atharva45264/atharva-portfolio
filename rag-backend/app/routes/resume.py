from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile


router = APIRouter(prefix="/api/resume", tags=["Resume"])


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    # Check that a file was provided
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file provided."
        )

    # Check file extension
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    # Read file
    file_content = await file.read()

    # Basic empty-file check
    if not file_content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

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