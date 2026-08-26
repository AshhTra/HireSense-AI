from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.models.user import User
from app.api.routes.auth import router as auth_router

from app.routes.resume import router as resume_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HireSense AI API",
    version="1.0.0",
    description="Backend API for HireSense AI",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

app.include_router(resume_router)

@app.get("/")
def home():
    return {
        "status": "success",
        "message": "Welcome to HireSense AI Backend 🚀",
    }