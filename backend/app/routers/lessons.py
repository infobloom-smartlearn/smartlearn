"""
Lessons Router Module

Provides endpoints for retrieving and managing lesson content.
Lessons are the core learning units within courses, containing educational material
and structured content that users progress through.

Endpoints:
- GET /api/lessons - List lessons with optional filtering
- GET /api/lessons/{lesson_id} - Get specific lesson details

Dependencies:
- FastAPI for routing and request handling
- SQLAlchemy for async database operations
- Authentication (get_current_user) for some endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from backend.app.db.session import get_db
from backend.app import schemas, models
from backend.app.core.deps import get_current_user
from typing import List, Optional

router = APIRouter()


@router.get("", response_model=List[schemas.LessonRead])
async def list_lessons(
    subject: Optional[str] = Query(None, description="Filter by subject (e.g., 'Math', 'Science')"),
    topic: Optional[str] = Query(None, description="Filter by topic (e.g., 'Algebra', 'Biology')"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty level ('Easy', 'Medium', 'Hard')"),
    status: Optional[str] = Query(None, description="Filter by user progress status ('not_started', 'in_progress', 'complete')"),
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    List all lessons with optional filtering by multiple criteria.
    
    Features:
    - Filter by subject, topic, and difficulty level
    - Filter by user's progress status on the lesson
    - Returns lessons matching all specified filters
    
    Query Parameters:
    - subject: (optional) Filter by subject name stored in lesson metadata
    - topic: (optional) Filter by topic name stored in lesson metadata
    - difficulty: (optional) Filter by difficulty ('Easy', 'Medium', 'Hard')
    - status: (optional) Filter by user's progress status on the lesson
      Valid values: 'not_started', 'in_progress', 'complete'
    
    Returns:
    - List[LessonRead]: Array of lesson objects matching the filters
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK on success
    """
    # Initialize base query to select all lessons
    q = select(models.Lesson)
    
    # Build filter conditions list for metadata fields
    # Metadata is stored as JSONB in the database for flexible schema
    filters = []
    
    # Add subject filter if provided
    if subject:
        filters.append(models.Lesson.metadata["subject"].astext == subject)
    
    # Add topic filter if provided
    if topic:
        filters.append(models.Lesson.metadata["topic"].astext == topic)
    
    # Add difficulty filter if provided
    if difficulty:
        filters.append(models.Lesson.metadata["difficulty"].astext == difficulty)
    
    # Apply all metadata filters to query using AND logic
    # (lesson must match all specified filters)
    if filters:
        q = q.where(and_(*filters))
    
    # Execute the query and fetch all matching lessons
    res = await db.execute(q)
    lessons = res.scalars().all()
    
    # If status filter is requested, filter by user's progress status
    # Status filter works differently: requires joining with Progress table
    if status:
        # Build dictionary of lesson_id -> progress status for current user
        user_progress = {}
        prog_q = select(models.Progress).where(models.Progress.user_id == current_user.id)
        prog_res = await db.execute(prog_q)
        
        # Populate progress dictionary
        for p in prog_res.scalars().all():
            user_progress[str(p.lesson_id)] = p.status
        
        # Filter lessons to only those with matching progress status
        # Lessons without progress records are excluded (considered "not_started")
        lessons = [l for l in lessons if str(l.id) in user_progress and user_progress[str(l.id)] == status]
    
    return lessons


@router.get("/{lesson_id}", response_model=schemas.LessonRead)
async def get_lesson(
    lesson_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve a specific lesson by its ID.
    
    Features:
    - Get complete lesson details including content, duration, and metadata
    - Includes course association and all lesson attributes
    
    Path Parameters:
    - lesson_id: (required) The UUID of the lesson to retrieve
    
    Returns:
    - LessonRead: Complete lesson object with all details
    
    Raises:
    - HTTPException (404): If lesson with given ID does not exist
    
    Authentication: Not required (public endpoint)
    HTTP Status: 200 OK on success, 404 Not Found if lesson doesn't exist
    """
    # Query for lesson by ID
    q = select(models.Lesson).where(models.Lesson.id == lesson_id)
    res = await db.execute(q)
    
    # Fetch single result (None if not found)
    lesson = res.scalar_one_or_none()
    
    # Return 404 error if lesson not found
    if not lesson:
        raise HTTPException(
            status_code=404,
            detail=f"Lesson with ID '{lesson_id}' not found"
        )
    
    return lesson
