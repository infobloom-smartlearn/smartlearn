from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.db.session import get_db
from backend.app import schemas, models
from backend.app.core.deps import get_current_user
from typing import List

router = APIRouter()


@router.get("/", response_model=List[schemas.NotificationRead])
async def list_notifications(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    q = select(models.Notification).where(models.Notification.user_id == current_user.id).order_by(models.Notification.created_at.desc())
    res = await db.execute(q)
    return res.scalars().all()


@router.patch("/{notification_id}/read")
async def mark_read(notification_id: str, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    q = select(models.Notification).where(models.Notification.id == notification_id, models.Notification.user_id == current_user.id)
    res = await db.execute(q)
    n = res.scalar_one_or_none()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    n.is_read = True
    await db.commit()
    return {"ok": True}


@router.get("/achievements", response_model=List[schemas.AchievementRead])
async def get_achievements(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    q = select(models.Achievement).where(models.Achievement.user_id == current_user.id).order_by(models.Achievement.unlocked_at.desc())
    res = await db.execute(q)
    return res.scalars().all()
