from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.db.session import get_db
from backend.app import schemas, models
from backend.app.core.deps import get_current_user

router = APIRouter()


@router.get("/users/me/progress", response_model=list[schemas.ProgressRead])
async def get_my_progress(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    q = select(models.Progress).where(models.Progress.user_id == current_user.id)
    res = await db.execute(q)
    return res.scalars().all()


@router.post("/progress", response_model=schemas.ProgressRead)
async def update_progress(payload: schemas.ProgressUpdate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # upsert progress for user + lesson
    q = select(models.Progress).where(models.Progress.user_id == current_user.id, models.Progress.lesson_id == payload.lesson_id)
    res = await db.execute(q)
    p = res.scalar_one_or_none()
    if not p:
        p = models.Progress(user_id=current_user.id, lesson_id=payload.lesson_id)
        db.add(p)
        await db.flush()

    if payload.status is not None:
        p.status = payload.status
    if payload.progress_pct is not None:
        p.progress_pct = payload.progress_pct

    await db.commit()
    await db.refresh(p)
    return p
