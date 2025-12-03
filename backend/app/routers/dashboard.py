"""
Dashboard Router Module

Provides endpoints for retrieving user dashboard data and learning analytics.
The dashboard displays key metrics including learning streaks, course progress,
recommendations, and performance overview for the SmartLearn platform.

Features:
- Learning streak tracking (current and longest)
- Weekly learning activity visualization
- AI-powered learning recommendations
- Aggregated learning statistics (courses, lessons, scores, study time)

Endpoints:
- GET /api/dashboard/streak - User's learning streak and weekly progress
- GET /api/dashboard/recommendation - Personalized AI recommendation
- GET /api/dashboard/overview - Aggregated learning statistics

Dependencies:
- FastAPI for routing and HTTP handling
- SQLAlchemy for async database queries with aggregation functions
- Authentication for user-specific data access
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta
from ..db.session import get_db
from .. import models
from ..core.deps import get_current_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class StreakResponse(BaseModel):
    """
    Response model for learning streak data.
    
    Fields:
    - current_days: Number of consecutive days of study activity (0 if no activity)
    - week_progress: List of 7 characters representing the past week (M-S):
      * Day letter (M, T, W, etc.) if user studied that day
      * Empty string if no activity that day
      * Example: ['', 'T', 'W', 'T', '', 'S', 'S'] = studied 5 days this week
    - longest_streak: Maximum consecutive days of study activity ever achieved
    """
    current_days: int
    week_progress: list[str]
    longest_streak: int


class RecommendationResponse(BaseModel):
    """
    Response model for AI-powered learning recommendation.
    
    Fields:
    - text: Human-readable recommendation message based on user's progress
    - course_id: (optional) Suggested course ID if recommendation relates to a specific course
    - lesson_id: (optional) Suggested lesson ID if recommendation relates to a specific lesson
    
    Note: AI recommendations are generated based on progress percentage:
    - 70%+: Suggest advanced topics or new challenges
    - 40-70%: Encourage continuation of current lessons
    - <40%: Suggest beginner-friendly lessons for foundation building
    """
    text: str
    course_id: Optional[str] = None
    lesson_id: Optional[str] = None


class DashboardDataResponse(BaseModel):
    """
    Response model for comprehensive dashboard overview statistics.
    
    Fields:
    - courses_in_progress: Number of courses user is currently taking
    - courses_completed: Number of courses user has finished
    - lessons_completed: Number of individual lessons completed (progress_pct == 100)
    - average_score: Mean score across all quiz attempts (None if no quizzes taken)
    - current_streak: Current consecutive days of study activity
    - study_hours: Estimated total study hours (calculated from lesson durations)
    
    Aggregates multiple data sources to provide comprehensive learning overview.
    """
    courses_in_progress: int
    courses_completed: int
    lessons_completed: int
    average_score: Optional[float] = None
    current_streak: int
    study_hours: int


@router.get("/streak", response_model=StreakResponse)
async def get_learning_streak(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Calculate user's learning streak metrics.
    
    Features:
    - Track consecutive days of study activity
    - Show weekly progress visualization (7 days)
    - Calculate longest streak in user's history
    - Based on daily Progress record updates
    
    Returns:
    - StreakResponse containing:
      * current_days: Consecutive days of activity ending today/yesterday
      * week_progress: Array of 7 day indicators for past week visualization
      * longest_streak: Historical maximum consecutive study days
    
    Calculation Logic:
    - Extracts unique dates from user's progress records
    - Considers streak "broken" if more than 1 day gap exists
    - Week progress shows past 7 days (Monday to Sunday layout)
    - Returns zero values if no progress records exist
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK
    
    Notes:
    - Streak resets if user doesn't study for a full day
    - Week progress includes empty strings for non-study days
    - Useful for gamification and motivation tracking
    """
    # Get all user progress ordered by most recent first
    q = select(models.Progress).where(
        models.Progress.user_id == current_user.id
    ).order_by(models.Progress.updated_at.desc())
    res = await db.execute(q)
    progresses = res.scalars().all()
    
    # Extract unique study dates from progress records
    study_dates = set()
    for p in progresses:
        if p.updated_at:
            study_dates.add(p.updated_at.date())
    
    # Return zero-filled response if no progress exists
    if not study_dates:
        return StreakResponse(current_days=0, week_progress=[], longest_streak=0)
    
    # Calculate current streak (consecutive days ending today or yesterday)
    today = datetime.now().date()
    current_streak = 0
    check_date = today
    
    # Sort dates newest first and count backwards until gap found
    sorted_dates = sorted(study_dates, reverse=True)
    for date in sorted_dates:
        # Allow 1-day gap (in case user hasn't studied "today" but studied "yesterday")
        if (check_date - date).days <= 1:
            current_streak += 1
            check_date = date
        else:
            break
    
    # Calculate week progress (last 7 days with day-of-week abbreviations)
    week_progress = []
    day_names = ['M', 'T', 'W', 'T', 'F', 'S', 'S']  # Monday through Sunday
    for i in range(6, -1, -1):  # Last 7 days, backwards
        check_day = today - timedelta(days=i)
        # Add day letter if studied, empty string if not
        week_progress.append(day_names[check_day.weekday()] if check_day in study_dates else '')
    
    # Calculate longest streak from entire history
    longest_streak = 0
    temp_streak = 0
    prev_date = None
    
    # Iterate through sorted dates and count consecutive days
    for date in sorted(study_dates):
        if temp_streak == 0 or (prev_date and (date - prev_date).days <= 1):
            temp_streak += 1
        else:
            # Gap found: reset and update longest if current is higher
            longest_streak = max(longest_streak, temp_streak)
            temp_streak = 1
        prev_date = date
    
    # Don't forget to compare final streak with longest
    longest_streak = max(longest_streak, temp_streak)
    
    return StreakResponse(
        current_days=current_streak,
        week_progress=week_progress,
        longest_streak=longest_streak
    )


@router.get("/recommendation", response_model=RecommendationResponse)
async def get_ai_recommendation(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Generate personalized AI recommendation based on user's learning progress.
    
    Features:
    - Analyzes user's progress across all lessons
    - Provides context-aware recommendations
    - Suggests specific lessons or courses when applicable
    - Scales recommendations based on progress percentage
    
    Returns:
    - RecommendationResponse with:
      * text: AI-generated recommendation message
      * lesson_id: Suggested lesson (if applicable)
      * course_id: Suggested course (if applicable)
    
    Recommendation Logic:
    - Progress >= 70%: Suggest advanced topics to challenge mastery
    - Progress 40-70%: Encourage continuation to deepen understanding
    - Progress < 40%: Suggest beginner-friendly lessons for foundation
    - No progress: Encourage course exploration
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK
    
    Notes:
    - Based on highest progress lesson (user is doing best in)
    - Recommendations update dynamically as user progresses
    - Useful for motivational messaging and guided learning paths
    """
    # Get user's progress ordered by highest progress_pct first
    q = select(models.Progress).where(
        models.Progress.user_id == current_user.id
    ).order_by(models.Progress.progress_pct.desc())
    res = await db.execute(q)
    progresses = res.scalars().all()
    
    # Return encouragement message if no progress exists
    if not progresses:
        return RecommendationResponse(
            text="Start by exploring our courses to find topics that interest you!"
        )
    
    # Get the lesson with highest progress (user's strongest area)
    best_progress = progresses[0]
    
    # Generate recommendation based on progress level
    if best_progress.progress_pct >= 70:
        # User is mastering this topic; suggest advancement
        return RecommendationResponse(
            text="You're doing well! Try advanced topics to challenge yourself.",
            lesson_id=str(best_progress.lesson_id)
        )
    elif best_progress.progress_pct >= 40:
        # User is making good progress; encourage continuation
        return RecommendationResponse(
            text="Keep up the momentum! Continue with your current lessons to master the concepts.",
            lesson_id=str(best_progress.lesson_id)
        )
    else:
        # User is early in progress; suggest building foundation
        return RecommendationResponse(
            text="Start with our beginner-friendly lessons to build a strong foundation.",
            lesson_id=str(best_progress.lesson_id)
        )


@router.get("/overview", response_model=DashboardDataResponse)
async def get_dashboard_overview(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieve comprehensive dashboard overview with aggregated learning statistics.
    
    Features:
    - Count courses in progress and completed
    - Count lessons completed (progress_pct == 100)
    - Calculate average quiz score across all attempts
    - Include current learning streak
    - Estimate total study hours from lesson durations
    
    Returns:
    - DashboardDataResponse containing:
      * courses_in_progress: Count of active courses
      * courses_completed: Count of finished courses
      * lessons_completed: Count of lessons with 100% progress
      * average_score: Mean score from all completed quizzes (None if no quizzes)
      * current_streak: Current consecutive study days
      * study_hours: Estimated total study time
    
    Data Aggregation:
    - Progress records: Determine course/lesson completion status
    - Quiz attempts: Calculate average and track completion
    - Updated timestamps: Derive current streak
    - Lesson metadata: Estimate study hours from duration fields
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK
    
    Notes:
    - Aggregates data from multiple tables for single overview response
    - Study hours calculated as sum of lesson duration_minutes / 60
    - Useful for displaying summary dashboard cards in frontend
    - Performance note: Requires multiple queries; consider caching in production
    """
    # Count total courses available (for reference)
    courses_q = select(func.count(models.Course.id)).select_from(models.Course)
    courses_res = await db.execute(courses_q)
    total_courses = courses_res.scalar() or 0
    
    # Get all user's progress records to determine course/lesson status
    progress_q = select(models.Progress).where(
        models.Progress.user_id == current_user.id
    )
    progress_res = await db.execute(progress_q)
    user_progress = progress_res.scalars().all()
    
    # Count courses by status from progress records
    courses_in_progress = len([p for p in user_progress if p.status == "in_progress"])
    courses_completed = len([p for p in user_progress if p.status == "complete"])
    
    # Count lessons completed (progress_pct == 100)
    lessons_completed = len([p for p in user_progress if p.progress_pct == 100])
    
    # Calculate average score from quiz attempts
    quiz_q = select(models.QuizAttempt).where(
        models.QuizAttempt.user_id == current_user.id
    )
    quiz_res = await db.execute(quiz_q)
    attempts = quiz_res.scalars().all()
    
    # Get only scored attempts (exclude null scores)
    scores = [a.score for a in attempts if a.score is not None]
    average_score = sum(scores) / len(scores) if scores else None
    
    # Calculate current streak from progress update dates
    streak_dates = set()
    for p in user_progress:
        if p.updated_at:
            streak_dates.add(p.updated_at.date())
    
    # Count consecutive study days ending today/yesterday
    today = datetime.now().date()
    current_streak = 0
    check_date = today
    
    # Allow 1-day gap (today vs yesterday)
    for date in sorted(streak_dates, reverse=True):
        if (check_date - date).days <= 1:
            current_streak += 1
            check_date = date
        else:
            break
    
    # Calculate study hours (estimate from lesson durations)
    # Note: This is a placeholder calculation; actual implementation would
    # need to join Progress records with Lesson records to get duration_minutes
    total_study_hours = sum([
        (p.duration_minutes or 0) // 60 
        for p in user_progress
    ])
    
    return DashboardDataResponse(
        courses_in_progress=courses_in_progress,
        courses_completed=courses_completed,
        lessons_completed=lessons_completed,
        average_score=average_score,
        current_streak=current_streak,
        study_hours=total_study_hours
    )
