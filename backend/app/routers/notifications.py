from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from backend.app.db.session import get_db
from backend.app import schemas, models
from backend.app.core.deps import get_current_user
from typing import List, Optional

router = APIRouter()


@router.get("/", response_model=List[schemas.NotificationRead])
async def list_notifications(
    filter_type: Optional[str] = Query(None, alias="type"),
    unread_only: Optional[bool] = Query(False),
    db: AsyncSession = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    """
    List notifications with optional filtering.
    filter_type options: 'all', 'unread', 'ai_insights', 'course_updates', 'achievements', 'reminders'
    """
    filters = [models.Notification.user_id == current_user.id]
    
    if unread_only or filter_type == "unread":
        filters.append(models.Notification.is_read == False)
    
    if filter_type and filter_type != "all" and filter_type != "unread":
        filters.append(models.Notification.type == filter_type)
    
    q = select(models.Notification).where(and_(*filters)).order_by(models.Notification.created_at.desc())
    res = await db.execute(q)
    return res.scalars().all()


@router.patch("/{notification_id}/read", response_model=schemas.NotificationRead)
async def mark_read(notification_id: str, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    q = select(models.Notification).where(models.Notification.id == notification_id, models.Notification.user_id == current_user.id)
    res = await db.execute(q)
    n = res.scalar_one_or_none()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    n.is_read = True
    await db.commit()
    await db.refresh(n)
    return n


@router.get("/achievements", response_model=List[schemas.AchievementRead])
async def get_achievements(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    q = select(models.Achievement).where(models.Achievement.user_id == current_user.id).order_by(models.Achievement.unlocked_at.desc())
    res = await db.execute(q)
    return res.scalars().all()
