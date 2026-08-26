from fastapi import APIRouter, UploadFile, File, Form
import pymupdf

from app.services.ai_service import analyze_resume

router = APIRouter(
    prefix="/resume",
    tags=["Resume"],
)


@router.post("/upload")
async def upload_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):

    print(">>> POST /resume/upload RECEIVED")

    # Read uploaded PDF
    contents = await resume.read()

    print(">>> PDF READ")

    # Extract PDF text
    pdf = pymupdf.open(
        stream=contents,
        filetype="pdf"
    )

    resume_text = ""

    for page in pdf:
        resume_text += page.get_text()

    pdf.close()

    print(">>> PDF TEXT EXTRACTED")
    print(">>> TEXT LENGTH:", len(resume_text))

    # Send resume + job description to Gemini
    analysis = await analyze_resume(
        resume_text=resume_text,
        job_description=job_description,
    )

    # Return AI analysis
    return analysis