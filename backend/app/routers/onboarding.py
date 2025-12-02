from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.db.session import get_db
from backend.app import schemas, models
from backend.app.core.deps import get_current_user

router = APIRouter()

# Static list of available roles for onboarding. Adjust as needed.
AVAILABLE_ROLES = [
    {"key": "student", "label": "Student"},
    {"key": "tutor", "label": "Tutor"},
    {"key": "parent", "label": "Parent / Guardian"},
    {"key": "teacher", "label": "Teacher"},
]


@router.get("/roles")
async def get_available_roles():
    """Return available roles for onboarding (static list)."""
    return AVAILABLE_ROLES


@router.get("/me/roles", response_model=schemas.OnboardingRolesRead)
async def get_my_roles(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()
    roles = profile.roles if profile and profile.roles else []
    return {"roles": roles}


@router.post("/me/roles", response_model=schemas.OnboardingRolesRead)
async def set_my_roles(payload: schemas.OnboardingRolesUpdate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Save onboarding-selected roles to the user's profile.roles (overwrites previous roles)."""
    # validate incoming roles against available keys
    valid_keys = {r["key"] for r in AVAILABLE_ROLES}
    for r in payload.roles:
        if r not in valid_keys:
            raise HTTPException(status_code=400, detail=f"Invalid role: {r}")

    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()
    if not profile:
        profile = models.Profile(user_id=current_user.id, roles=payload.roles)
        db.add(profile)
        await db.flush()
    else:
        profile.roles = payload.roles

    await db.commit()
    return {"roles": payload.roles}
