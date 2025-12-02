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
    subject: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """List quizzes with optional filtering. Status can be: 'not_started', 'in_progress', 'completed'"""
    # Get all quizzes
    q = select(models.Quiz)
    filters = []
    if subject:
        filters.append(models.Quiz.metadata["subject"].astext == subject)
    if difficulty:
        filters.append(models.Quiz.metadata["difficulty"].astext == difficulty)
    
    if filters:
        q = q.where(and_(*filters))
    
    res = await db.execute(q)
    quizzes = res.scalars().all()
    
    # Filter by user attempt status if requested
    if status:
        user_attempts = {}
        attempts_q = select(models.QuizAttempt).where(models.QuizAttempt.user_id == current_user.id)
        attempts_res = await db.execute(attempts_q)
        for attempt in attempts_res.scalars().all():
            if str(attempt.quiz_id) not in user_attempts:
                user_attempts[str(attempt.quiz_id)] = "in_progress" if attempt.completed_at is None else "completed"
        
        if status == "not_started":
            quizzes = [q for q in quizzes if str(q.id) not in user_attempts]
        else:
            quizzes = [q for q in quizzes if str(q.id) in user_attempts and user_attempts[str(q.id)] == status]
    
    return quizzes


@router.get("/{quiz_id}", response_model=schemas.QuizRead)
async def get_quiz(quiz_id: str, db: AsyncSession = Depends(get_db)):
    q = select(models.Quiz).where(models.Quiz.id == quiz_id)
    res = await db.execute(q)
    quiz = res.scalar_one_or_none()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz


@router.post("/{quiz_id}/attempts", response_model=schemas.QuizAttemptRead, status_code=status.HTTP_201_CREATED)
async def post_attempt(quiz_id: str, payload: schemas.QuizAttemptCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # naive scoring: not implemented — store answers and leave score null for now
    attempt = models.QuizAttempt(user_id=current_user.id, quiz_id=quiz_id, answers=payload.answers)
    db.add(attempt)
    await db.flush()
    await db.commit()
    await db.refresh(attempt)
    return attempt


@router.get("/{quiz_id}/attempts", response_model=List[schemas.QuizAttemptRead])
async def list_attempts(quiz_id: str, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    q = select(models.QuizAttempt).where(models.QuizAttempt.quiz_id == quiz_id, models.QuizAttempt.user_id == current_user.id).order_by(models.QuizAttempt.started_at.desc())
    res = await db.execute(q)
    return res.scalars().all()
