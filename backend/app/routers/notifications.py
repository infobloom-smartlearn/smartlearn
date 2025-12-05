"""
Notifications Router Module

Manages user notifications and engagement alerts for the SmartLearn platform.
Notifications keep users informed about:
- AI tutor insights and recommendations
- Course updates and new content
- Achievement unlocks and milestones
- Reminders for pending activities
- General messages and platform updates

Endpoints:
- GET /api/notifications - List user's notifications with optional type and read status filtering
- PATCH /api/notifications/{notification_id}/read - Mark notification as read
- GET /api/notifications/achievements - List user's unlocked achievements

Dependencies:
- FastAPI for routing and HTTP handling
- SQLAlchemy for async database operations
- Authentication for user-specific operations
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from ..db.session import get_db
from .. import schemas, models
from ..core.deps import get_current_user
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter()


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


@router.get("/", response_model=List[schemas.NotificationRead])
async def list_notifications(
    filter_type: Optional[str] = Query(None, alias="type", description="Filter by type: 'unread', 'ai_insights', 'course_updates', 'achievements', 'reminders'"),
    unread_only: Optional[bool] = Query(False, description="If true, only show unread notifications"),
    db: AsyncSession = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    """
    List all notifications for the current user with optional filtering.
    
    Features:
    - Filter by notification type (AI insights, course updates, achievements, reminders)
    - Filter by read status (unread notifications only)
    - Ordered by most recent first
    - Includes notification metadata (title, description, related IDs)
    
    Query Parameters:
    - type: (optional) Filter by notification type:
      * 'unread' - Only unread notifications
      * 'ai_insights' - AI tutor recommendations and insights
      * 'course_updates' - Course content and course-related updates
      * 'achievements' - Achievement and milestone unlocks
      * 'reminders' - Reminders and pending activity alerts
    - unread_only: (optional) Boolean flag to show only unread notifications (overrides 'all' filter)
    
    Returns:
    - List[NotificationRead]: Array of notification objects matching filters, ordered by most recent first
      Each notification includes:
      * id - Unique notification ID
      * user_id - Current user's ID
      * title - Notification title/headline
      * description - Detailed message content
      * type - Notification type
      * is_read - Boolean indicating read status
      * created_at - Timestamp when notification was created
      * metadata - Additional data (e.g., lesson_id, course_id for related content)
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK on success
    
    Notes:
    - Returns empty list if no notifications match the filters
    - unread_only parameter takes precedence over filter_type='all'
    - Notifications ordered by created_at DESC (most recent first)
    - Type field is stored in model.type, not metadata (unlike quizzes/lessons)
    """
    # Build filter list starting with user ownership check
    filters = [models.Notification.user_id == current_user.id]
    
    # Apply unread filter if requested
    # unread_only parameter OR filter_type='unread' will show only unread notifications
    if unread_only or filter_type == "unread":
        filters.append(models.Notification.is_read == False)
    
    # Apply type filter if provided (skip if it's 'all' or 'unread' which are handled separately)
    if filter_type and filter_type not in ("all", "unread"):
        # Filter by notification type (ai_insights, course_updates, achievements, reminders)
        filters.append(models.Notification.type == filter_type)
    
    # Build query with all filters
    q = select(models.Notification).where(and_(*filters)).order_by(models.Notification.created_at.desc())
    
    # Execute and return results
    res = await db.execute(q)
    return res.scalars().all()


@router.patch("/{notification_id}/read", response_model=schemas.NotificationRead)
async def mark_read(
    notification_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Mark a specific notification as read by the current user.
    
    Features:
    - Updates notification's is_read status to True
    - Records engagement with the notification
    - Returns updated notification object with current state
    - User can only mark their own notifications as read
    
    Path Parameters:
    - notification_id: (required) The UUID of the notification to mark as read
    
    Returns:
    - NotificationRead: Updated notification object with:
      * is_read set to True
      * All other fields unchanged
      * Timestamp updated to current time
    
    Raises:
    - HTTPException (404): If notification with given ID doesn't exist
    - HTTPException (403): If notification belongs to another user
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK on success, 404 Not Found, 403 Forbidden
    
    Notes:
    - Idempotent: marking already-read notification again is safe
    - Ownership check ensures users can only mark their own notifications
    - Useful for implementing "mark as read" button in UI
    """
    # Query for notification by ID and verify it belongs to current user
    q = select(models.Notification).where(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user.id
    )
    res = await db.execute(q)
    
    # Fetch notification or return 404
    n = res.scalar_one_or_none()
    if not n:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notification with ID '{notification_id}' not found or does not belong to you"
        )
    
    # Update is_read status to True
    n.is_read = True
    
    # Commit transaction to persist change
    await db.commit()
    
    # Refresh to get updated record with any database-side changes
    await db.refresh(n)
    
    return n


@router.get("/achievements", response_model=List[schemas.AchievementRead])
async def get_achievements(
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
      Each achievement includes:
      * id - Unique achievement ID
      * user_id - Current user's ID
      * title - Achievement name (e.g., "First Lesson", "Math Master")
      * description - Achievement details and unlock criteria
      * icon/badge_url - Visual representation of achievement
      * unlocked_at - Timestamp when achievement was earned
      * metadata - Additional achievement data (points, category, etc.)

    Authentication: Required (current_user)
    HTTP Status: 200 OK on success

    Notes:
    - Returns empty list if user has not unlocked any achievements yet
    - Ordered by unlocked_at DESC (most recent first)
    - Use this endpoint to display "Achievements" section on profile/dashboard
    - See POST /api/achievements to grant new achievements programmatically
    """
    # Query for all achievements earned by current user
    q = select(models.Achievement).where(
        models.Achievement.user_id == current_user.id
    ).order_by(models.Achievement.unlocked_at.desc())

    # Execute query and return all achievements
    res = await db.execute(q)
    return res.scalars().all()


@router.get("/recommendations", response_model=RecommendationResponse)
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
