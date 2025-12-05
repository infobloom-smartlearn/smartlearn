"""
Achievements Router Module

Manages user achievements, badges, and learning milestones for the SmartLearn platform.
Achievements motivate users by recognizing their learning progress and accomplishments.

Endpoints:
- GET /api/achievements - List user's unlocked achievements
- GET /api/achievements/streak - Get user's current learning streak

Dependencies:
- FastAPI for routing and HTTP handling
- SQLAlchemy for async database operations
- Authentication for user-specific operations
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
from ..db.session import get_db
from .. import schemas, models
from ..core.deps import get_current_user
from pydantic import BaseModel
from typing import List

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


@router.get("/", response_model=List[schemas.AchievementRead])
async def list_achievements(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieve all achievements unlocked by the current user.

    Features:
    - Get complete list of user's unlocked achievements
    - Shows achievement details including title, description, icon/badge
    - Ordered by most recently unlocked first
    - Includes unlock timestamps

    Returns:
    - List[AchievementRead]: Array of achievement objects for current user

    Authentication: Required (current_user)
    HTTP Status: 200 OK on success
    """
    # Query for all achievements earned by current user
    q = select(models.Achievement).where(
        models.Achievement.user_id == current_user.id
    ).order_by(models.Achievement.unlocked_at.desc())

    # Execute query and return all achievements
    res = await db.execute(q)
    return res.scalars().all()


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

    Authentication: Required (current_user)
    HTTP Status: 200 OK
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
