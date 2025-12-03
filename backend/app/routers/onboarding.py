"""
Onboarding Router Module

Manages the user onboarding flow for the SmartLearn platform.
Guides new users through role selection, profile setup, and learning preferences configuration.

Onboarding Flow:
1. Select role(s) - student, tutor, parent, teacher
2. Enter basic info - name, age range, grade level
3. Configure learning preferences - favorite subjects, learning style
4. Complete onboarding - ready to use platform

Features:
- Role selection and validation
- Profile information collection
- Learning preference configuration
- Server-side validation for all inputs
- Preferences stored as flexible JSON

Endpoints:
- GET /api/onboarding/roles - List available roles
- GET /api/onboarding/me/roles - Get user's selected roles
- POST /api/onboarding/me/roles - Save selected roles
- GET /api/onboarding/me/info - Get user's step-1 info
- POST /api/onboarding/me/info - Save step-1 info (name, age, grade)
- GET /api/onboarding/me/step2 - Get user's step-2 preferences
- POST /api/onboarding/me/step2 - Save step-2 preferences (subjects, styles)

Dependencies:
- FastAPI for routing
- SQLAlchemy for async database operations
- Authentication for user-specific onboarding
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..db.session import get_db
from .. import schemas, models
from ..core.deps import get_current_user

router = APIRouter()

# Static list of available roles for onboarding. Adjust as needed.
AVAILABLE_ROLES = [
    {"key": "student", "label": "Student"},
    {"key": "tutor", "label": "Tutor"},
    {"key": "parent", "label": "Parent / Guardian"},
    {"key": "teacher", "label": "Teacher"},
]

# Allowed subject keys for validation (restricted set)
ALLOWED_SUBJECTS = {"reading", "science", "english", "math"}

# Allowed learning style keys for validation (restricted set)
ALLOWED_STYLES = {"visual", "audio", "handsOn"}


@router.get("/roles")
async def get_available_roles():
    """
    Get list of available user roles for onboarding.
    
    Features:
    - Return static list of role options
    - Each role has key (identifier) and label (display name)
    - Used to populate role selection UI
    
    Returns:
    - Array of role objects with:
      * key - Role identifier (e.g., "student", "teacher")
      * label - Human-readable role name (e.g., "Student", "Teacher")
    
    Example Response:
    ```json
    [
      {"key": "student", "label": "Student"},
      {"key": "tutor", "label": "Tutor"},
      {"key": "parent", "label": "Parent / Guardian"},
      {"key": "teacher", "label": "Teacher"}
    ]
    ```
    
    Authentication: Not required (public endpoint)
    HTTP Status: 200 OK
    
    Notes:
    - Static list; modify AVAILABLE_ROLES constant to add/remove roles
    - Used during onboarding step-0 (role selection)
    - No database query needed (hardcoded options)
    """
    return AVAILABLE_ROLES


@router.get("/me/roles", response_model=schemas.OnboardingRolesRead)
async def get_my_roles(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieve user's selected roles from onboarding.
    
    Features:
    - Get roles previously saved during onboarding
    - Returns empty list if no roles selected yet
    - Used to display user's role selection
    
    Returns:
    - OnboardingRolesRead object with:
      * roles - Array of selected role keys (e.g., ["student", "tutor"])
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK
    
    Notes:
    - Roles stored in profile.roles as JSON array
    - Empty array returned if user hasn't completed step-0
    - Useful for displaying selected roles on profile/settings
    """
    # Query for user's profile
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()
    
    # Get roles from profile, default to empty list
    roles = profile.roles if profile and profile.roles else []
    
    return {"roles": roles}


@router.post("/me/roles", response_model=schemas.OnboardingRolesRead)
async def set_my_roles(
    payload: schemas.OnboardingRolesUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Save user's selected roles during onboarding (step-0).
    
    Features:
    - Validate selected roles against available options
    - Store roles in user's profile
    - Support multiple role selection
    - Overwrites previous role selection
    
    Request Body:
    - roles: (required) Array of role keys to assign
      Example: ["student"] or ["parent", "teacher"]
    
    Returns:
    - OnboardingRolesRead with saved roles:
      * roles - Array of selected role keys
    
    Raises:
    - HTTPException (400): If any role is invalid
    - HTTPException (422): If validation fails
    
    Validation:
    - Each role key checked against AVAILABLE_ROLES
    - Rejects unrecognized role keys
    - Empty array is valid (user can skip role selection)
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK on success, 400 Bad Request on invalid role
    
    Notes:
    - Roles are stored in profile.roles as JSON array
    - Auto-creates profile if doesn't exist
    - Called during onboarding step-0 (role selection)
    - Multiple roles allowed (e.g., student and tutor)
    
    Example Request:
    ```json
    {
      "roles": ["student", "tutor"]
    }
    ```
    
    Example Response:
    ```json
    {
      "roles": ["student", "tutor"]
    }
    ```
    """
    # Extract valid role keys from available roles
    valid_keys = {r["key"] for r in AVAILABLE_ROLES}
    
    # Validate each provided role
    for r in payload.roles:
        if r not in valid_keys:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid role: '{r}'. Allowed roles: {valid_keys}"
            )

    # Query or create profile for current user
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()
    
    # Create profile if doesn't exist
    if not profile:
        profile = models.Profile(user_id=current_user.id, roles=payload.roles)
        db.add(profile)
        await db.flush()
    else:
        # Update existing profile's roles
        profile.roles = payload.roles

    # Commit changes
    await db.commit()
    
    return {"roles": payload.roles}


@router.get("/me/info", response_model=schemas.OnboardingInfoRead)
async def get_my_onboarding_info(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieve user's onboarding step-1 information.
    
    Features:
    - Get previously saved basic profile info
    - Returns name, age range, grade level
    - Returns defaults if info not yet saved
    
    Returns:
    - OnboardingInfoRead with:
      * name - User's full name (from profile.display_name)
      * ageRange - Age range (from profile.preferences.age_range)
      * grade - Grade level (from profile.grade)
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK
    
    Notes:
    - Fetches from profile.display_name, profile.preferences, profile.grade
    - Empty strings/nulls returned if not yet set
    - Called on onboarding step-1 page load
    - Allows users to resume incomplete onboarding
    """
    # Query for user's profile
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()
    
    # Extract fields with defaults for missing data
    name = profile.display_name if profile and profile.display_name else ""
    prefs = profile.preferences if profile and profile.preferences else {}
    age_range = prefs.get("age_range") if prefs else ""
    grade = profile.grade if profile and profile.grade else None
    
    return {"name": name, "ageRange": age_range, "grade": grade}


@router.post("/me/info", response_model=schemas.OnboardingInfoRead)
async def set_my_onboarding_info(
    payload: schemas.OnboardingInfoCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Save user's onboarding step-1 information (name, age range, grade).
    
    Features:
    - Store basic profile information
    - Save to database for persistence
    - Auto-create profile if needed
    - Support step-1 completion
    
    Request Body:
    - name: (required) User's full name
    - ageRange: (required) Age range selection
    - grade: (required) Grade level
    
    Returns:
    - OnboardingInfoRead with saved info:
      * name - Saved name
      * ageRange - Saved age range
      * grade - Saved grade level
    
    Raises:
    - HTTPException (422): If validation fails
    
    Storage Locations:
    - profile.display_name stores name
    - profile.preferences.age_range stores age_range
    - profile.grade stores grade
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK on success
    
    Notes:
    - Called during onboarding step-1 completion
    - Auto-creates profile if doesn't exist
    - Overwrites previous values (not merged)
    - Flexible age_range field (any string accepted)
    - Grade can be null if not applicable
    
    Example Request:
    ```json
    {
      "name": "John Smith",
      "ageRange": "13-18",
      "grade": "10"
    }
    ```
    
    Implementation Notes:
    - age_range stored in preferences to avoid schema modification
    - preferences dict merged (not replaced) to preserve existing data
    - Useful for step-1 form submission in onboarding flow
    """
    # Query or create profile for current user
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()
    
    # Create profile if doesn't exist
    if not profile:
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
        await db.flush()

    # Set display_name field
    profile.display_name = payload.name
    
    # Set grade field
    profile.grade = payload.grade
    
    # Merge age_range into preferences JSON
    prefs = profile.preferences or {}
    prefs.update({"age_range": payload.ageRange})
    profile.preferences = prefs

    # Commit changes to database
    await db.commit()
    
    return {
        "name": profile.display_name,
        "ageRange": profile.preferences.get("age_range"),
        "grade": profile.grade
    }


@router.get("/me/step2", response_model=schemas.OnboardingStep2Read)
async def get_my_onboarding_step2(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieve user's onboarding step-2 preferences (subjects and learning styles).
    
    Features:
    - Get previously saved learning preferences
    - Returns selected subjects and learning styles
    - Returns empty objects if not yet saved
    
    Returns:
    - OnboardingStep2Read with:
      * subjects - Object/dict of selected subjects
        Format: {"math": true, "science": true, ...}
      * styles - Object/dict of selected learning styles
        Format: {"visual": true, "audio": false, ...}
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK
    
    Notes:
    - Fetches from profile.preferences.subjects and .styles
    - Empty objects returned if not yet set
    - Called on step-2 page load for form pre-population
    - Allows resuming incomplete onboarding
    """
    # Query for user's profile
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()
    
    # Extract preferences with defaults
    prefs = profile.preferences if profile and profile.preferences else {}
    subjects = prefs.get("subjects") if prefs else {}
    styles = prefs.get("styles") if prefs else {}
    
    # Ensure we return dicts (not None)
    return {"subjects": subjects or {}, "styles": styles or {}}


@router.post("/me/step2", response_model=schemas.OnboardingStep2Read)
async def set_my_onboarding_step2(
    payload: schemas.OnboardingStep2Create,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Save user's onboarding step-2 preferences (subjects and learning styles).
    
    Features:
    - Store learning preference selections
    - Validate against whitelist of allowed subjects/styles
    - Support learning customization
    - Auto-create profile if needed
    
    Request Body:
    - subjects: (required) Object with subject selections
      Keys must be from ALLOWED_SUBJECTS: {reading, science, english, math}
      Example: {"math": true, "science": true}
    - styles: (required) Object with learning style selections
      Keys must be from ALLOWED_STYLES: {visual, audio, handsOn}
      Example: {"visual": true, "audio": false, "handsOn": true}
    
    Returns:
    - OnboardingStep2Read with saved preferences:
      * subjects - Saved subject selections
      * styles - Saved style selections
    
    Raises:
    - HTTPException (400): If invalid subject key provided
    - HTTPException (400): If invalid learning style key provided
    - HTTPException (422): If validation fails
    
    Allowed Subjects:
    - reading - Reading and literature
    - science - General science
    - english - English language arts
    - math - Mathematics
    
    Allowed Learning Styles:
    - visual - Visual/diagram-based learning
    - audio - Audio/listening-based learning
    - handsOn - Hands-on/practical learning
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK on success, 400 Bad Request on invalid selections
    
    Notes:
    - Called during onboarding step-2 completion
    - Validates all subject keys against ALLOWED_SUBJECTS
    - Validates all style keys against ALLOWED_STYLES
    - Auto-creates profile if doesn't exist
    - Overwrites previous preferences (not merged)
    - Stored in profile.preferences JSON
    
    Example Request:
    ```json
    {
      "subjects": {
        "math": true,
        "science": true,
        "reading": false,
        "english": false
      },
      "styles": {
        "visual": true,
        "audio": true,
        "handsOn": false
      }
    }
    ```
    
    Validation Details:
    - Each subject key must exist in ALLOWED_SUBJECTS
    - Each style key must exist in ALLOWED_STYLES
    - Invalid keys trigger 400 Bad Request
    - Empty objects are valid (user can deselect all)
    
    Implementation Notes:
    - Validates subject keys from payload.subjects
    - Validates style keys from payload.styles
    - Stores as preferences.subjects and preferences.styles
    - Useful for personalizing course recommendations
    """
    # Validate subject keys against whitelist
    for key in payload.subjects.keys():
        if key not in ALLOWED_SUBJECTS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid subject: '{key}'. Allowed subjects: {ALLOWED_SUBJECTS}"
            )
    
    # Validate learning style keys against whitelist
    for key in payload.styles.keys():
        if key not in ALLOWED_STYLES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid style: '{key}'. Allowed styles: {ALLOWED_STYLES}"
            )
    
    # Query or create profile for current user
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()
    
    # Create profile if doesn't exist
    if not profile:
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
        await db.flush()

    # Get existing preferences
    prefs = profile.preferences or {}
    
    # Update preferences with subjects and styles
    # (overwrites any previous subjects/styles but preserves other preference fields)
    prefs.update({"subjects": payload.subjects, "styles": payload.styles})
    profile.preferences = prefs

    # Commit changes to database
    await db.commit()
    
    return {
        "subjects": profile.preferences.get("subjects") or {},
        "styles": profile.preferences.get("styles") or {}
    }
