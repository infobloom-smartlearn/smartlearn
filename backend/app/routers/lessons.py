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
    subject: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """List lessons with optional filtering. Status can be: 'not_started', 'in_progress', 'complete'"""
    # Build base query
    q = select(models.Lesson)
    
    # Add filters (metadata stored in lesson model or course)
    filters = []
    if subject:
        filters.append(models.Lesson.metadata["subject"].astext == subject)
    if topic:
        filters.append(models.Lesson.metadata["topic"].astext == topic)
    if difficulty:
        filters.append(models.Lesson.metadata["difficulty"].astext == difficulty)
    
    if filters:
        q = q.where(and_(*filters))
    
    res = await db.execute(q)
    lessons = res.scalars().all()
    
    # Filter by user progress status if requested
    if status:
        user_progress = {}
        prog_q = select(models.Progress).where(models.Progress.user_id == current_user.id)
        prog_res = await db.execute(prog_q)
        for p in prog_res.scalars().all():
            user_progress[str(p.lesson_id)] = p.status
        
        lessons = [l for l in lessons if str(l.id) in user_progress and user_progress[str(l.id)] == status]
    
    return lessons


@router.get("/{lesson_id}", response_model=schemas.LessonRead)
async def get_lesson(lesson_id: str, db: AsyncSession = Depends(get_db)):
    q = select(models.Lesson).where(models.Lesson.id == lesson_id)
    res = await db.execute(q)
    lesson = res.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson
