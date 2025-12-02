from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.db.session import get_db
from backend.app import schemas, models
from backend.app.core.deps import get_current_user
from typing import List

router = APIRouter()


@router.get("/", response_model=List[schemas.CourseRead])
async def list_courses(db: AsyncSession = Depends(get_db)):
    q = select(models.Course).where(models.Course.is_published == True)
    res = await db.execute(q)
    return res.scalars().all()


@router.get("/{course_id}", response_model=schemas.CourseRead)
async def get_course(course_id: str, db: AsyncSession = Depends(get_db)):
    q = select(models.Course).where(models.Course.id == course_id)
    res = await db.execute(q)
    course = res.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.get("/{course_id}/lessons", response_model=List[schemas.LessonRead])
async def get_course_lessons(course_id: str, db: AsyncSession = Depends(get_db)):
    q = select(models.Lesson).where(models.Lesson.course_id == course_id).order_by(models.Lesson.order)
    res = await db.execute(q)
    return res.scalars().all()


def is_admin(user: models.User):
    return getattr(user, "is_superuser", False)


@router.post("/", response_model=schemas.CourseRead, status_code=status.HTTP_201_CREATED)
async def create_course(payload: schemas.CourseRead, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not is_admin(current_user):
        raise HTTPException(status_code=403, detail="Requires admin")
    c = models.Course(title=payload.title, description=payload.description, slug=payload.slug, metadata=payload.metadata, is_published=payload.is_published, created_by=current_user.id)
    db.add(c)
    await db.flush()
    await db.commit()
    await db.refresh(c)
    return c


@router.put("/{course_id}", response_model=schemas.CourseRead)
async def update_course(course_id: str, payload: schemas.CourseRead, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not is_admin(current_user):
        raise HTTPException(status_code=403, detail="Requires admin")
    q = select(models.Course).where(models.Course.id == course_id)
    res = await db.execute(q)
    course = res.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    for k, v in payload.dict(exclude_unset=True).items():
        setattr(course, k, v)
    await db.commit()
    await db.refresh(course)
    return course


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(course_id: str, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not is_admin(current_user):
        raise HTTPException(status_code=403, detail="Requires admin")
    q = select(models.Course).where(models.Course.id == course_id)
    res = await db.execute(q)
    course = res.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    await db.delete(course)
    await db.commit()
    return None
