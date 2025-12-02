from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routers import ai_tutor, auth, users, courses, lessons, quizzes, progress, notifications, settings, onboarding, dashboard
from backend.app.core.config import settings

app = FastAPI(title="SmartLearn API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(courses.router, prefix="/api/courses", tags=["courses"])
app.include_router(lessons.router, prefix="/api/lessons", tags=["lessons"])
app.include_router(quizzes.router, prefix="/api/quizzes", tags=["quizzes"])
app.include_router(progress.router, prefix="/api", tags=["progress"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(ai_tutor.router, prefix="/api/ai", tags=["ai"])
app.include_router(settings.router, prefix="/api/settings", tags=["settings"])
app.include_router(onboarding.router, prefix="/api/onboarding", tags=["onboarding"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}
