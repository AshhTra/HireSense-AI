
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

import pymupdf
import uuid

from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.interview import Interview

from app.services.ai_service import (
    generate_interview_questions,
    evaluate_interview_answers,
)
from app.models.interview_session import InterviewSession

router = APIRouter(
    prefix="/interview",
    tags=["Interview"],
)

MAX_RESUME_SIZE = 5 * 1024 * 1024
MIN_DESCRIPTION_LENGTH = 100
MAX_DESCRIPTION_LENGTH = 5000


# ---------------- GENERATE INTERVIEW ----------------


@router.post("/generate")
async def generate_interview(
    resume: UploadFile = File(...),
    mode: str = Form("job-description"),
    job_description: str = Form(""),
    job_role: str = Form(""),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not resume.filename or not resume.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF resume.",
        )

    if mode not in {"job-description", "role", "resume-only"}:
        raise HTTPException(
            status_code=400,
            detail="Invalid interview mode.",
        )

    job_description = job_description.strip()
    job_role = job_role.strip()

    if mode == "job-description":
        if not MIN_DESCRIPTION_LENGTH <= len(job_description) <= MAX_DESCRIPTION_LENGTH:
            raise HTTPException(
                status_code=400,
                detail="Job description must contain 100–5000 characters.",
            )
        job_role = ""

    elif mode == "role":
        if not job_role or len(job_role) > 100:
            raise HTTPException(
                status_code=400,
                detail="Please enter a valid job role.",
            )
        job_description = ""

    else:
        job_description = ""
        job_role = ""

    contents = await resume.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="The uploaded PDF is empty.",
        )

    if len(contents) > MAX_RESUME_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Resume PDF must be 5 MB or smaller.",
        )

    try:
        pdf = pymupdf.open(stream=contents, filetype="pdf")
        try:
            resume_text = "".join(page.get_text() for page in pdf)
        finally:
            pdf.close()
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Unable to read this PDF file.",
        )

    if not resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No readable text found in the PDF.",
        )

    try:
        result = await generate_interview_questions(
            resume_text=resume_text,
            job_description=job_description,
            job_role=job_role,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    session_id = str(uuid.uuid4())

    interview_session = InterviewSession(
        id=session_id,
        user_id=current_user.id,
        resume_filename=resume.filename,
        resume_file=contents,
        resume_size=len(contents),
        interview_mode=mode,
        job_role=job_role or None,
        job_description=job_description or None,
        questions=result["questions"],
    )

    try:
        db.add(interview_session)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to create interview session.",
        )

    return {
        "session_id": session_id,
        "mode": mode,
        "resume_filename": resume.filename,
        "job_role": job_role or None,
        "job_description": job_description or None,
        **result,
    }



# ---------------- EVALUATION REQUEST SCHEMAS ----------------

class InterviewAnswerItem(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    category: str = Field(default="General", max_length=100)
    answer: str = Field(default="", max_length=10000)


class InterviewEvaluationRequest(BaseModel):
    session_id: str = Field(min_length=36, max_length=36)

    questions: list[InterviewAnswerItem] = Field(
        min_length=1,
        max_length=10,
    )


# ---------------- EVALUATE AND SAVE INTERVIEW ----------------


@router.post("/evaluate")
async def evaluate_interview(
    payload: InterviewEvaluationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Find the user's interview session
    interview_session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.id == payload.session_id,
            InterviewSession.user_id == current_user.id,
        )
        .first()
    )

    if not interview_session:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found or expired.",
        )

    # 2. Prepare questions and answers
    questions = [
        {
            "question": item.question,
            "category": item.category,
        }
        for item in payload.questions
    ]

    answers = [item.answer for item in payload.questions]

    # 3. Generate AI evaluation
    try:
        result = await evaluate_interview_answers(
            questions=questions,
            answers=answers,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    # 4. Prepare question-answer data
    questions_answers = [
        {
            "question": item.question,
            "category": item.category,
            "answer": item.answer,
        }
        for item in payload.questions
    ]

    # 5. Create final interview record
    interview_record = Interview(
        user_id=current_user.id,
        resume_filename=interview_session.resume_filename,
        resume_file=interview_session.resume_file,
        resume_size=interview_session.resume_size,
        interview_mode=interview_session.interview_mode,
        job_role=interview_session.job_role,
        job_description=interview_session.job_description,
        questions_answers=questions_answers,
        overall_score=result["overall_score"],
        summary=result["summary"],
        strengths=result["strengths"],
        improvements=result["improvements"],
        question_feedback=result["question_feedback"],
    )

    try:
        db.add(interview_record)
        db.flush()

        interview_id = interview_record.id

        # Delete temporary session after successful evaluation
        db.delete(interview_session)

        db.commit()

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to save interview evaluation.",
        )

    return {
        **result,
        "interview_id": interview_id,
        "message": "Interview evaluated and saved successfully.",
    }
