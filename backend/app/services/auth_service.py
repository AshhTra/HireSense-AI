from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.utils.security import hash_password

from app.utils.security import verify_password


def create_user(
    db: Session,
    full_name: str,
    email: str,
    password: str,
):
    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered.",
        )

    user = User(
        full_name=full_name,
        email=email,
        password=hash_password(password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login_user(
    db: Session,
    email: str,
    password: str,
):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    if not verify_password(
        password,
        user.password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password.",
        )

    return user