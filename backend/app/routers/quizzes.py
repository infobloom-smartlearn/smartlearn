"""
Quizzes Router Module

Provides endpoints for managing quizzes, quiz attempts, and assessment tracking.
Quizzes are assessments linked to lessons that test user knowledge and track progress.

Endpoints:
- GET /api/quizzes - List all quizzes with optional filtering
- GET /api/quizzes/{quiz_id} - Get specific quiz details
- POST /api/quizzes/{quiz_id}/attempts - Create a new quiz attempt
- GET /api/quizzes/{quiz_id}/attempts - List user's attempts for a quiz

Dependencies:
- FastAPI for routing and HTTP handling
- SQLAlchemy for async database queries
- Authentication for user-specific operations
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from backend.app.db.session import get_db
from backend.app import schemas, models
from backend.app.core.deps import get_current_user
from typing import List, Optional

router = APIRouter()


@router.get("", response_model=List[schemas.QuizRead])
async def list_quizzes(
    subject: Optional[str] = Query(None, description="Filter by subject (e.g., 'Math', 'Science')"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty ('Easy', 'Medium', 'Hard')"),
    status: Optional[str] = Query(None, description="Filter by user's attempt status ('not_started', 'in_progress', 'completed')"),
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    List all available quizzes with optional filtering.
    
    Features:
    - Filter by subject and difficulty level
    - Automatically determine quiz status based on user's previous attempts
    - Distinguish between not_started, in_progress (started but not completed), and completed
    
    Query Parameters:
    - subject: (optional) Filter by subject name from quiz metadata
    - difficulty: (optional) Filter by difficulty level ('Easy', 'Medium', 'Hard')
    - status: (optional) Filter by user's attempt status:
      * 'not_started' - User has no attempts for this quiz
      * 'in_progress' - User has started but not completed the quiz
      * 'completed' - User has completed at least one attempt
    
    Returns:
    - List[QuizRead]: Array of quiz objects matching specified filters
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK on success
    """
    # Get all quizzes
    q = select(models.Quiz)
    
    # Build filter list for quiz metadata fields
    filters = []
    
    # Add subject filter if provided
    if subject:
        filters.append(models.Quiz.metadata["subject"].astext == subject)
    
    # Add difficulty filter if provided
    if difficulty:
        filters.append(models.Quiz.metadata["difficulty"].astext == difficulty)
    
    # Apply filters to query
    if filters:
        q = q.where(and_(*filters))
    
    # Execute query
    res = await db.execute(q)
    quizzes = res.scalars().all()
    
    # If status filter requested, determine status from user's attempts
    if status:
        # Fetch all quiz attempts for current user
        user_attempts = {}
        attempts_q = select(models.QuizAttempt).where(models.QuizAttempt.user_id == current_user.id)
        attempts_res = await db.execute(attempts_q)
        
        # Build dictionary of quiz_id -> status based on attempts
        for attempt in attempts_res.scalars().all():
            quiz_id = str(attempt.quiz_id)
            # Determine status: in_progress if not completed, completed if completed_at is set
            if quiz_id not in user_attempts:
                user_attempts[quiz_id] = "in_progress" if attempt.completed_at is None else "completed"
        
        # Filter quizzes by status
        if status == "not_started":
            # Keep only quizzes with no attempts
            quizzes = [q for q in quizzes if str(q.id) not in user_attempts]
        else:
            # Keep only quizzes where status matches requested status
            quizzes = [q for q in quizzes if str(q.id) in user_attempts and user_attempts[str(q.id)] == status]
    
    return quizzes


@router.get("/{quiz_id}", response_model=schemas.QuizRead)
async def get_quiz(
    quiz_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve a specific quiz by its ID.
    
    Features:
    - Get complete quiz details including title, description, and metadata
    - Includes associated lesson reference
    - Returns all quiz configuration (passing score, duration, etc.)
    
    Path Parameters:
    - quiz_id: (required) The UUID of the quiz to retrieve
    
    Returns:
    - QuizRead: Complete quiz object with all details
    
    Raises:
    - HTTPException (404): If quiz with given ID does not exist
    
    Authentication: Not required (public endpoint)
    HTTP Status: 200 OK on success, 404 Not Found if quiz doesn't exist
    
    Note: Use POST /api/quizzes/{quiz_id}/attempts to start taking the quiz
    """
    # Query for quiz by ID
    q = select(models.Quiz).where(models.Quiz.id == quiz_id)
    res = await db.execute(q)
    
    # Fetch single result
    quiz = res.scalar_one_or_none()
    
    # Return 404 if not found
    if not quiz:
        raise HTTPException(
            status_code=404,
            detail=f"Quiz with ID '{quiz_id}' not found"
        )
    
    return quiz


@router.post("/{quiz_id}/attempts", response_model=schemas.QuizAttemptRead, status_code=status.HTTP_201_CREATED)
async def post_attempt(
    quiz_id: str,
    payload: schemas.QuizAttemptCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Create a new quiz attempt for the current user.
    
    Features:
    - Start a new quiz attempt with initial answers
    - Creates timestamp records for attempt tracking
    - Stores answers in JSONB format for flexibility
    - Scoring is currently not implemented (score left as None)
    
    Path Parameters:
    - quiz_id: (required) The UUID of the quiz to attempt
    
    Request Body:
    - answers: (required) Dictionary/object containing user's answers to quiz questions
      Format: Can be flexible depending on quiz question types
    
    Returns:
    - QuizAttemptRead: Created attempt object with:
      * id - Unique attempt ID
      * user_id - Current user's ID
      * quiz_id - Associated quiz ID
      * answers - Submitted answers
      * started_at - Timestamp when attempt began
      * score - NULL (scoring not yet implemented)
      * completed_at - NULL (attempt is in progress)
    
    Authentication: Required (current_user)
    HTTP Status: 201 Created on success
    
    Notes:
    - This endpoint initializes the attempt; it doesn't validate answers
    - Score calculation is a TODO for future implementation
    - Use GET /api/quizzes/{quiz_id}/attempts to retrieve this attempt later
    """
    # Create new quiz attempt record
    # Note: We don't validate the quiz exists here; DB will handle that via FK constraint
    attempt = models.QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz_id,
        answers=payload.answers
    )
    
    # Add to session and flush to get ID
    db.add(attempt)
    await db.flush()
    
    # Commit transaction
    await db.commit()
    
    # Refresh to get all default values (timestamps, etc.)
    await db.refresh(attempt)
    
    return attempt


@router.get("/{quiz_id}/attempts", response_model=List[schemas.QuizAttemptRead])
async def list_attempts(
    quiz_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieve all attempts by the current user for a specific quiz.
    
    Features:
    - Get all attempts for a quiz ordered by most recent first
    - Shows attempt history, status (completed or in_progress), and scores
    - Allows user to track their quiz performance over time
    
    Path Parameters:
    - quiz_id: (required) The UUID of the quiz to fetch attempts for
    
    Returns:
    - List[QuizAttemptRead]: Array of all user's attempts for the quiz, ordered by date DESC
      Each attempt includes:
      * id - Unique attempt ID
      * started_at - When the attempt began
      * completed_at - When it was submitted (NULL if still in progress)
      * score - User's score (NULL if not yet graded)
      * answers - Submitted answers
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK on success
    
    Notes:
    - Only returns attempts by the current user (filtered by user_id)
    - Returns empty list if user has no attempts for this quiz
    - Ordered by started_at DESC (most recent first)
    """
    # Query for all attempts by current user for this quiz
    # Order by most recent first (DESC)
    q = select(models.QuizAttempt).where(
        models.QuizAttempt.quiz_id == quiz_id,
        models.QuizAttempt.user_id == current_user.id
    ).order_by(models.QuizAttempt.started_at.desc())
    
    # Execute query
    res = await db.execute(q)
    
    # Return all matching attempts
    return res.scalars().all()
