from pathlib import Path

from pypdf import PdfReader


def extract_text_from_pdf(file_path: str | Path) -> str:
    """
    Extract text from every page of a PDF.
    """

    reader = PdfReader(str(file_path))

    pages = []

    for page in reader.pages:
        text = page.extract_text()

        if text:
            pages.append(text)

    return "\n\n".join(pages).strip()