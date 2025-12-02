from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.db.session import get_db
from backend.app import schemas, models
from typing import List

router = APIRouter()


@router.get("/{lesson_id}", response_model=schemas.LessonRead)
async def get_lesson(lesson_id: str, db: AsyncSession = Depends(get_db)):
    q = select(models.Lesson).where(models.Lesson.id == lesson_id)
    res = await db.execute(q)
    lesson = res.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson
