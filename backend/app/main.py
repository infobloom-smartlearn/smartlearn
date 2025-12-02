from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routers import ai_tutor
import os

app = FastAPI(title="SmartLearn API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_tutor.router, prefix="/api/ai", tags=["ai"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}
