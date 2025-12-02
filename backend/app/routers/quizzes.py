from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.db.session import get_db
from backend.app import schemas, models
from backend.app.core.deps import get_current_user
from typing import List

router = APIRouter()


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
