from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.db.session import get_db
from backend.app import schemas, models
from backend.app.core.deps import get_current_user
from typing import Optional

router = APIRouter()


@router.get("/", response_model=schemas.SettingsRead)
async def get_settings(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Return current user's settings (profile + preferences)."""
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()

    data = {
        "email": current_user.email,
        "display_name": profile.display_name if profile else None,
        "avatar_url": profile.avatar_url if profile else None,
        "grade": profile.grade if profile else None,
        "age": profile.age if profile else None,
        "preferences": profile.preferences if profile else {},
    }
    return data


@router.patch("/", response_model=schemas.SettingsRead)
async def update_settings(payload: schemas.SettingsUpdate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Update settings/profile for the current user. Email change is allowed if not taken."""
    # update email if provided and not already in use
    if payload.email and payload.email != current_user.email:
        q = select(models.User).where(models.User.email == payload.email)
        res = await db.execute(q)
        existing = res.scalar_one_or_none()
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        current_user.email = payload.email

    # ensure profile exists
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()
    if not profile:
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
        await db.flush()

    update_data = payload.dict(exclude_unset=True)
    # remove email from profile update handling
    update_data.pop("email", None)

    for k, v in update_data.items():
        # merge preferences dict instead of overwriting if both dicts
        if k == "preferences" and v is not None:
            current_prefs = profile.preferences or {}
            # shallow merge
            merged = {**current_prefs, **v}
            profile.preferences = merged
        else:
            setattr(profile, k, v)

    await db.commit()
    await db.refresh(current_user)
    # refresh profile
    await db.refresh(profile)

    data = {
        "email": current_user.email,
        "display_name": profile.display_name,
        "avatar_url": profile.avatar_url,
        "grade": profile.grade,
        "age": profile.age,
        "preferences": profile.preferences or {},
    }
    return data
