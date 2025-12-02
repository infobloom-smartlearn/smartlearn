from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from backend.app.db.session import get_db
from backend.app import schemas, models
from backend.app.core.deps import get_current_user
from uuid import UUID

router = APIRouter()


@router.get("/me", response_model=schemas.UserRead)
async def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=schemas.UserRead)
async def update_me(payload: schemas.UserUpdate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # update profile fields on Profile table; create profile if missing
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()
    if not profile:
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
        await db.flush()

    # apply updates
    update_data = payload.dict(exclude_unset=True)
    for k, v in update_data.items():
        setattr(profile, k, v)

    await db.commit()
    await db.refresh(current_user)
    return current_user


@router.get("/{user_id}", response_model=schemas.UserRead)
async def get_user(user_id: UUID, db: AsyncSession = Depends(get_db)):
    q = select(models.User).where(models.User.id == user_id)
    res = await db.execute(q)
    user = res.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
