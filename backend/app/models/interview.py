
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    LargeBinary,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB

from app.core.database import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Original resume information
    resume_filename = Column(String(255), nullable=False)
    resume_file = Column(LargeBinary, nullable=True)
    resume_size = Column(Integer, nullable=True)

    # job-description, role, or resume-only
    interview_mode = Column(String(30), nullable=False)

    # Job information
    job_role = Column(String(100), nullable=True)
    job_description = Column(Text, nullable=True)

    # Complete interview questions and answers
    questions_answers = Column(JSONB, nullable=False, default=list)

    # Overall AI evaluation
    overall_score = Column(Integer, nullable=False)
    summary = Column(Text, nullable=False)

    strengths = Column(JSONB, nullable=False, default=list)
    improvements = Column(JSONB, nullable=False, default=list)

    # Question-wise evaluation
    question_feedback = Column(JSONB, nullable=False, default=list)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
