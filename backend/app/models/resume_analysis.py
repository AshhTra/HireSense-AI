
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


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    resume_filename = Column(String(255), nullable=False)

    # Original PDF stored directly in PostgreSQL (BYTEA)
    resume_file = Column(LargeBinary, nullable=True)

    # ats, role_match, or career_recommendation
    analysis_mode = Column(
        String(30),
        nullable=False,
        default="ats",
        server_default="ats",
    )

    job_role = Column(String(100), nullable=True)
    job_description = Column(Text, nullable=True)

    ats_score = Column(Integer, nullable=False)

    matched_skills = Column(JSONB, nullable=False, default=list)
    missing_skills = Column(JSONB, nullable=False, default=list)
    suggestions = Column(JSONB, nullable=False, default=list)
    recommended_roles = Column(JSONB, nullable=False, default=list)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
