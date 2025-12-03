"""
Progress Router Module

Tracks user's learning progress across lessons and courses.
Monitors completion status, progress percentage, and learning advancement.

Endpoints:
- GET /api/progress/users/me/progress - Retrieve current user's progress records
- POST /api/progress - Create or update progress for a lesson

Dependencies:
- FastAPI for routing
- SQLAlchemy for async database operations
- Authentication for user-specific progress tracking
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..db.session import get_db
from .. import schemas, models
from ..core.deps import get_current_user

router = APIRouter()


@router.get("/users/me/progress", response_model=list[schemas.ProgressRead])
async def get_my_progress(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieve all progress records for the currently authenticated user.
    
    Features:
    - Get all lessons/courses user is tracking
    - Shows progress percentage and status for each
    - Includes completion dates and update timestamps
    - Useful for dashboard and progress overview
    
    Returns:
    - List[ProgressRead]: Array of progress records for all lessons, including:
      * lesson_id - The lesson being tracked
      * progress_pct - Completion percentage (0-100)
      * status - Current status ('not_started', 'in_progress', 'complete')
      * started_at - When user started the lesson
      * completed_at - When user finished (NULL if in progress)
      * updated_at - Last update timestamp
      * metadata - Additional progress data
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK
    
    Notes:
    - Returns empty list if user has no progress records
    - Ordered by most recent updates first
    - Used to populate progress dashboard and learner analytics
    - Shows only current user's progress (filtered by user_id)
    """
    # Query all progress records for current user
    q = select(models.Progress).where(
        models.Progress.user_id == current_user.id
    )
    
    # Execute and return all results
    res = await db.execute(q)
    return res.scalars().all()


@router.post("/progress", response_model=schemas.ProgressRead, status_code=status.HTTP_201_CREATED)
async def update_progress(
    payload: schemas.ProgressUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Create or update user's progress record for a specific lesson.
    
    Features:
    - Upsert operation: creates new record or updates existing
    - Supports partial updates (only update provided fields)
    - Tracks progress percentage and completion status
    - Records timestamps for progress tracking
    
    Request Body:
    - lesson_id: (required) UUID of the lesson to track
    - status: (optional) Status update ('not_started', 'in_progress', 'complete')
    - progress_pct: (optional) Progress percentage (0-100)
    
    Returns:
    - ProgressRead: Created or updated progress record with:
      * lesson_id - The tracked lesson
      * progress_pct - Updated completion percentage
      * status - Updated status
      * started_at - When progress tracking began
      * completed_at - When completed (NULL if not done)
      * updated_at - Current timestamp
    
    Raises:
    - HTTPException (404): If lesson doesn't exist (FK constraint)
    - HTTPException (422): If validation fails
    
    Authentication: Required (current_user)
    HTTP Status: 201 Created on new record, 200 OK on update
    
    Upsert Logic:
    - Checks if progress record exists for user + lesson combination
    - Creates new record if none exists
    - Updates status and/or progress_pct if provided
    - Leaves unchanged fields unmodified
    
    Notes:
    - One progress record per user per lesson
    - Useful for tracking lesson completion, quiz attempts, etc.
    - Progress percentage should reflect lesson completion
    - Status field helps determine user's current stage
    
    Example Request:
    ```json
    {
      "lesson_id": "123e4567-e89b-12d3-a456-426614174000",
      "progress_pct": 50,
      "status": "in_progress"
    }
    ```
    """
    # Check if progress record already exists for this user + lesson
    q = select(models.Progress).where(
        models.Progress.user_id == current_user.id,
        models.Progress.lesson_id == payload.lesson_id
    )
    res = await db.execute(q)
    p = res.scalar_one_or_none()
    
    # Create new progress record if none exists
    if not p:
        p = models.Progress(
            user_id=current_user.id,
            lesson_id=payload.lesson_id
        )
        db.add(p)
        await db.flush()

    # Update status field if provided in payload
    if payload.status is not None:
        p.status = payload.status
    
    # Update progress percentage if provided in payload
    if payload.progress_pct is not None:
        p.progress_pct = payload.progress_pct

    # Commit changes to database
    await db.commit()
    
    # Refresh to get updated timestamps and computed fields
    await db.refresh(p)
    
    return p
