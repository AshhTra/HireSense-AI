
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


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(String(36), primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    resume_filename = Column(String(255), nullable=False)
    resume_file = Column(LargeBinary, nullable=False)
    resume_size = Column(Integer, nullable=False)

    interview_mode = Column(String(30), nullable=False)

    job_role = Column(String(100), nullable=True)
    job_description = Column(Text, nullable=True)

    questions = Column(JSONB, nullable=False, default=list)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
