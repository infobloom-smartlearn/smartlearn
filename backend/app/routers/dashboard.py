from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta
from backend.app.db.session import get_db
from backend.app import models
from backend.app.core.deps import get_current_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class StreakResponse(BaseModel):
    current_days: int
    week_progress: list[str]
    longest_streak: int


class RecommendationResponse(BaseModel):
    text: str
    course_id: Optional[str] = None
    lesson_id: Optional[str] = None


class DashboardDataResponse(BaseModel):
    courses_in_progress: int
    courses_completed: int
    lessons_completed: int
    average_score: Optional[float] = None
    current_streak: int
    study_hours: int


@router.get("/streak", response_model=StreakResponse)
async def get_learning_streak(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Calculate user's learning streak.
    Streak is based on daily progress records.
    """
    # Get all user progress ordered by date
    q = select(models.Progress).where(models.Progress.user_id == current_user.id).order_by(models.Progress.updated_at.desc())
    res = await db.execute(q)
    progresses = res.scalars().all()
    
    # Get unique dates of progress updates (represents days studied)
    study_dates = set()
    for p in progresses:
        if p.updated_at:
            study_dates.add(p.updated_at.date())
    
    if not study_dates:
        return StreakResponse(current_days=0, week_progress=[], longest_streak=0)
    
    # Calculate current streak
    today = datetime.now().date()
    current_streak = 0
    check_date = today
    
    sorted_dates = sorted(study_dates, reverse=True)
    for date in sorted_dates:
        if (check_date - date).days <= 1:
            current_streak += 1
            check_date = date
        else:
            break
    
    # Calculate week progress (last 7 days)
    week_progress = []
    day_names = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    for i in range(6, -1, -1):
        check_day = today - timedelta(days=i)
        week_progress.append(day_names[check_day.weekday()] if check_day in study_dates else '')
    
    # Calculate longest streak from historical data
    longest_streak = 0
    temp_streak = 0
    for date in sorted(study_dates):
        if temp_streak == 0 or (date - prev_date).days <= 1:
            temp_streak += 1
        else:
            longest_streak = max(longest_streak, temp_streak)
            temp_streak = 1
        prev_date = date
    longest_streak = max(longest_streak, temp_streak)
    
    return StreakResponse(current_days=current_streak, week_progress=week_progress, longest_streak=longest_streak)


@router.get("/recommendation", response_model=RecommendationResponse)
async def get_ai_recommendation(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Get AI-generated recommendation based on user progress.
    Returns a recommendation based on strongest subject or next suggested course.
    """
    # Get user's progress data
    q = select(models.Progress).where(models.Progress.user_id == current_user.id).order_by(models.Progress.progress_pct.desc())
    res = await db.execute(q)
    progresses = res.scalars().all()
    
    if not progresses:
        return RecommendationResponse(text="Start by exploring our courses to find topics that interest you!")
    
    # Find highest progress subject
    best_progress = progresses[0]
    if best_progress.progress_pct >= 70:
        return RecommendationResponse(
            text=f"You're doing well! Try advanced topics to challenge yourself.",
            lesson_id=str(best_progress.lesson_id)
        )
    elif best_progress.progress_pct >= 40:
        return RecommendationResponse(
            text=f"Keep up the momentum! Continue with your current lessons to master the concepts.",
            lesson_id=str(best_progress.lesson_id)
        )
    else:
        return RecommendationResponse(
            text="Start with our beginner-friendly lessons to build a strong foundation.",
            lesson_id=str(best_progress.lesson_id)
        )


@router.get("/overview", response_model=DashboardDataResponse)
async def get_dashboard_overview(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Get dashboard overview: courses count, lessons, average score, streak, study hours.
    """
    # Count courses in progress
    courses_q = select(func.count(models.Course.id)).select_from(models.Course)
    courses_res = await db.execute(courses_q)
    total_courses = courses_res.scalar() or 0
    
    # Get user progress
    progress_q = select(models.Progress).where(models.Progress.user_id == current_user.id)
    progress_res = await db.execute(progress_q)
    user_progress = progress_res.scalars().all()
    
    courses_in_progress = len([p for p in user_progress if p.status == "in_progress"])
    courses_completed = len([p for p in user_progress if p.status == "complete"])
    lessons_completed = len([p for p in user_progress if p.progress_pct == 100])
    
    # Calculate average score from quiz attempts
    quiz_q = select(models.QuizAttempt).where(models.QuizAttempt.user_id == current_user.id)
    quiz_res = await db.execute(quiz_q)
    attempts = quiz_res.scalars().all()
    scores = [a.score for a in attempts if a.score is not None]
    average_score = sum(scores) / len(scores) if scores else None
    
    # Get current streak
    streak_dates = set()
    for p in user_progress:
        if p.updated_at:
            streak_dates.add(p.updated_at.date())
    
    today = datetime.now().date()
    current_streak = 0
    check_date = today
    for date in sorted(streak_dates, reverse=True):
        if (check_date - date).days <= 1:
            current_streak += 1
            check_date = date
        else:
            break
    
    # Calculate study hours (estimate based on lesson duration)
    total_study_hours = sum([
        (l.duration_minutes or 0) // 60 
        for p in user_progress 
        for l in [p]  # placeholder, would need to join with lessons
    ])
    
    return DashboardDataResponse(
        courses_in_progress=courses_in_progress,
        courses_completed=courses_completed,
        lessons_completed=lessons_completed,
        average_score=average_score,
        current_streak=current_streak,
        study_hours=total_study_hours
    )
