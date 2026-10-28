from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.user import UserRegister
from app.schemas.login import UserLogin

from app.core.dependencies import get_db

from app.services.auth_service import (
    create_user,
    login_user,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db),
):
    new_user = create_user(
        db,
        user.full_name,
        user.email,
        user.password,
    )

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.full_name,
            "email": new_user.email,
        },
    }


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db),
):
    logged_in_user, access_token = login_user(
        db,
        user.email,
        user.password,
    )

    return {
        "message": "Login successful",
        "token": access_token,
        "user": {
            "id": logged_in_user.id,
            "name": logged_in_user.full_name,
            "email": logged_in_user.email,
        },
    }