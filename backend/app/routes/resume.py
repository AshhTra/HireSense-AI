
from io import BytesIO

import pymupdf
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.models.resume_analysis import ResumeAnalysis
from app.models.user import User
from app.services.ai_service import analyze_resume

router = APIRouter(
    prefix="/resume",
    tags=["Resume"],
)

MAX_RESUME_SIZE = 5 * 1024 * 1024  # 5 MB
MAX_SAVED_ANALYSES = 10


@router.post("/upload")
async def upload_resume(
    resume: UploadFile = File(...),
    analysis_mode: str = Form("ats"),
    job_role: str = Form(""),
    job_description: str = Form(""),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not resume.filename or not resume.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF resume.",
        )

    if analysis_mode not in {
        "ats",
        "role_match",
        "career_recommendation",
    }:
        raise HTTPException(
            status_code=400,
            detail="Invalid analysis mode.",
        )

    job_role = job_role.strip()
    job_description = job_description.strip()

    if analysis_mode == "ats":
        if not 100 <= len(job_description) <= 5000:
            raise HTTPException(
                status_code=400,
                detail="Job description must contain between 100 and 5000 characters.",
            )
        job_role = ""
    elif analysis_mode == "role_match":
        if not job_role or len(job_role) > 100:
            raise HTTPException(
                status_code=400,
                detail="Please provide a job role of at most 100 characters.",
            )
        job_description = ""
    else:
        job_role = ""
        job_description = ""

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

    # ATS analysis is the only implemented mode for now.
    if analysis_mode != "ats":
        raise HTTPException(
            status_code=501,
            detail="This analysis mode is not implemented yet.",
        )

    try:
        analysis = await analyze_resume(
            resume_text=resume_text,
            job_description=job_description,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    record = ResumeAnalysis(
        user_id=current_user.id,
        resume_filename=resume.filename,
        resume_file=contents,
        analysis_mode=analysis_mode,
        job_role=job_role or None,
        job_description=job_description or None,
        ats_score=analysis["ats_score"],
        matched_skills=analysis["matched_skills"],
        missing_skills=analysis["missing_skills"],
        suggestions=analysis["suggestions"],
        recommended_roles=analysis["recommended_roles"],
    )

    try:
        # Insert the new analysis before calculating the retention limit.
        db.add(record)
        db.flush()

        # Keep the 10 newest analyses belonging to this user.
        older_ids = (
            db.query(ResumeAnalysis.id)
            .filter(ResumeAnalysis.user_id == current_user.id)
            .order_by(
                ResumeAnalysis.created_at.desc(),
                ResumeAnalysis.id.desc(),
            )
            .offset(MAX_SAVED_ANALYSES)
            .all()
        )

        for (older_id,) in older_ids:
            db.query(ResumeAnalysis).filter(
                ResumeAnalysis.id == older_id,
                ResumeAnalysis.user_id == current_user.id,
            ).delete(synchronize_session=False)

        db.commit()
        db.refresh(record)

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to save the resume analysis.",
        )

    return {
        "id": record.id,
        "resume_filename": record.resume_filename,
        "analysis_mode": record.analysis_mode,
        "job_role": record.job_role,
        "job_description": record.job_description,
        **analysis,
    }


@router.get("/history")
def get_resume_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    analyses = (
        db.query(ResumeAnalysis)
        .filter(ResumeAnalysis.user_id == current_user.id)
        .order_by(
            ResumeAnalysis.created_at.desc(),
            ResumeAnalysis.id.desc(),
        )
        .limit(MAX_SAVED_ANALYSES)
        .all()
    )

    return [
        {
            "id": item.id,
            "resume_filename": item.resume_filename,
            "analysis_mode": item.analysis_mode,
            "job_role": item.job_role,
            "job_description": item.job_description,
            "ats_score": item.ats_score,
            "matched_skills": item.matched_skills,
            "missing_skills": item.missing_skills,
            "suggestions": item.suggestions,
            "recommended_roles": item.recommended_roles,
            "created_at": item.created_at,
        }
        for item in analyses
    ]


@router.get("/history/{analysis_id}/file")
def get_saved_resume_file(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    analysis = (
        db.query(ResumeAnalysis)
        .filter(
            ResumeAnalysis.id == analysis_id,
            ResumeAnalysis.user_id == current_user.id,
        )
        .first()
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Resume analysis not found.",
        )

    if not analysis.resume_file:
        raise HTTPException(
            status_code=404,
            detail="The original PDF is not available for this analysis.",
        )

    return StreamingResponse(
        BytesIO(analysis.resume_file),
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'inline; filename="resume.pdf"',
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
        },
    )


@router.get("/history/{analysis_id}")
def get_resume_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    analysis = (
        db.query(ResumeAnalysis)
        .filter(
            ResumeAnalysis.id == analysis_id,
            ResumeAnalysis.user_id == current_user.id,
        )
        .first()
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Resume analysis not found.",
        )

    return {
        "id": analysis.id,
        "resume_filename": analysis.resume_filename,
        "analysis_mode": analysis.analysis_mode,
        "job_role": analysis.job_role,
        "job_description": analysis.job_description,
        "ats_score": analysis.ats_score,
        "matched_skills": analysis.matched_skills,
        "missing_skills": analysis.missing_skills,
        "suggestions": analysis.suggestions,
        "recommended_roles": analysis.recommended_roles,
        "created_at": analysis.created_at,
    }
