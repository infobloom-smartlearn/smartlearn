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

# Allowed subject keys for validation
ALLOWED_SUBJECTS = {"reading", "science", "english", "math"}

# Allowed learning style keys for validation
ALLOWED_STYLES = {"visual", "audio", "handsOn"}


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


@router.get("/me/info", response_model=schemas.OnboardingInfoRead)
async def get_my_onboarding_info(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Return saved onboarding step-1 info for the current user."""
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()
    # defaults if not set
    name = profile.display_name if profile and profile.display_name else ""
    prefs = profile.preferences if profile and profile.preferences else {}
    age_range = prefs.get("age_range") if prefs else ""
    grade = profile.grade if profile and profile.grade else None
    return {"name": name, "ageRange": age_range, "grade": grade}


@router.post("/me/info", response_model=schemas.OnboardingInfoRead)
async def set_my_onboarding_info(payload: schemas.OnboardingInfoCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Save onboarding step-1 info (name, ageRange, grade) into the user's profile.
    Stores `ageRange` under `profile.preferences.age_range` to avoid altering schema.
    """
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()
    if not profile:
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
        await db.flush()

    # set display_name
    profile.display_name = payload.name
    # set grade
    profile.grade = payload.grade
    # merge preferences and set age_range
    prefs = profile.preferences or {}
    prefs.update({"age_range": payload.ageRange})
    profile.preferences = prefs

    await db.commit()
    return {"name": profile.display_name, "ageRange": profile.preferences.get("age_range"), "grade": profile.grade}



@router.get("/me/step2", response_model=schemas.OnboardingStep2Read)
async def get_my_onboarding_step2(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Return saved onboarding step-2 preferences (subjects & learning styles) for the current user."""
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()
    prefs = profile.preferences if profile and profile.preferences else {}
    subjects = prefs.get("subjects") if prefs else {}
    styles = prefs.get("styles") if prefs else {}
    # Ensure we return dicts (not None)
    return {"subjects": subjects or {}, "styles": styles or {}}


@router.post("/me/step2", response_model=schemas.OnboardingStep2Read)
async def set_my_onboarding_step2(payload: schemas.OnboardingStep2Create, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Save onboarding step-2 preferences (subjects & learning styles) into the user's profile.preferences."""
    # Validate subject keys
    for key in payload.subjects.keys():
        if key not in ALLOWED_SUBJECTS:
            raise HTTPException(status_code=400, detail=f"Invalid subject: {key}. Allowed subjects: {ALLOWED_SUBJECTS}")
    
    # Validate style keys
    for key in payload.styles.keys():
        if key not in ALLOWED_STYLES:
            raise HTTPException(status_code=400, detail=f"Invalid style: {key}. Allowed styles: {ALLOWED_STYLES}")
    
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()
    if not profile:
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
        await db.flush()

    prefs = profile.preferences or {}
    # overwrite subjects and styles keys with payload
    prefs.update({"subjects": payload.subjects, "styles": payload.styles})
    profile.preferences = prefs

    await db.commit()
    return {"subjects": profile.preferences.get("subjects") or {}, "styles": profile.preferences.get("styles") or {}}
