"""
Settings Router Module

Manages user settings and preferences for the SmartLearn platform.
Combines user account settings with profile preferences in a unified endpoint.

Endpoints:
- GET /api/settings - Retrieve current user's settings and preferences
- PATCH /api/settings - Update settings, preferences, and profile information

Dependencies:
- FastAPI for routing
- SQLAlchemy for async database operations
- Authentication for user-specific settings access
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..db.session import get_db
from .. import schemas, models
from ..core.deps import get_current_user
from typing import Optional

router = APIRouter()


@router.get("/", response_model=schemas.SettingsRead)
async def get_settings(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieve current user's settings and preferences.
    
    Features:
    - Get user account settings (email)
    - Retrieve profile information (name, avatar, age, grade)
    - Get user's learning preferences (subjects, learning style, etc.)
    - Aggregates data from User and Profile tables
    
    Returns:
    - SettingsRead: User's settings object including:
      * email - User's email address
      * display_name - Full name or display name
      * avatar_url - URL to profile picture
      * grade - User's current grade level
      * age - User's age
      * preferences - JSON object with learning preferences:
        - subjects: List of favorite subjects
        - learning_style: Preferred learning style (visual, audio, hands-on)
        - notification_level: How many notifications to send
        - theme: UI theme preference (light/dark)
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK
    
    Notes:
    - Aggregates data from both User and Profile tables
    - Returns default values if profile doesn't exist yet
    - Preferences field is optional JSON, defaults to empty object
    - Used by settings page in frontend
    - User is returned in response for consistency
    """
    # Query for user's profile (if it exists)
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()

    # Build response data combining User and Profile information
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
async def update_settings(
    payload: schemas.SettingsUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Update current user's settings, preferences, and profile information.
    
    Features:
    - Update email (with uniqueness validation)
    - Update profile fields (name, avatar, age, grade)
    - Update or merge learning preferences
    - Auto-create profile if doesn't exist
    - Support partial updates (only update provided fields)
    
    Request Body (all fields optional):
    - email: Updated email address (must be unique if changed)
    - display_name: Updated display name
    - avatar_url: Updated profile picture URL
    - grade: Updated grade level
    - age: Updated age
    - preferences: Learning preferences object
      * Preferences are merged (not replaced) for flexibility
      * Can update subset of preference fields
    
    Returns:
    - SettingsRead: Updated settings object with all changes applied
    
    Raises:
    - HTTPException (400): If new email already in use
    - HTTPException (422): If validation fails
    
    Authentication: Required (current_user)
    HTTP Status: 200 OK on success
    
    Update Logic:
    - Email: Validated against existing users before updating
    - Profile fields: Updated directly on Profile record
    - Preferences: Merged with existing preferences (not overwritten)
    - Profile: Auto-created if doesn't exist
    
    Notes:
    - Allows email changes if new email is unique
    - Preferences are shallow-merged (existing prefs preserved if not updated)
    - Useful for Settings page where user updates multiple fields
    - Can update settings incrementally
    
    Example Request:
    ```json
    {
      "display_name": "John Smith",
      "grade": "10th",
      "preferences": {
        "learning_style": "visual",
        "notification_level": "medium"
      }
    }
    ```
    
    Implementation Notes:
    - Email changes check for uniqueness in User table
    - Preferences use shallow merge to preserve unmodified fields
    - Profile record created if missing on first update
    - Both User and Profile refreshed after commit
    """
    # Update email if provided and different from current email
    if payload.email and payload.email != current_user.email:
        # Check if new email already in use by another user
        q = select(models.User).where(models.User.email == payload.email)
        res = await db.execute(q)
        existing = res.scalar_one_or_none()
        
        # Reject if email taken
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
        
        # Update email on User model
        current_user.email = payload.email

    # Ensure Profile record exists (auto-create if missing)
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()
    
    # Create profile if it doesn't exist yet
    if not profile:
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
        await db.flush()

    # Extract update data excluding email (handled separately)
    update_data = payload.dict(exclude_unset=True)
    update_data.pop("email", None)

    # Apply updates to profile
    for k, v in update_data.items():
        # Special handling for preferences: merge instead of overwrite
        if k == "preferences" and v is not None:
            # Get existing preferences
            current_prefs = profile.preferences or {}
            # Shallow merge: combine old and new preferences
            merged = {**current_prefs, **v}
            profile.preferences = merged
        else:
            # Direct assignment for other fields
            setattr(profile, k, v)

    # Commit changes to database
    await db.commit()
    
    # Refresh both User and Profile to get updated state
    await db.refresh(current_user)
    await db.refresh(profile)

    # Build response data with updated values
    data = {
        "email": current_user.email,
        "display_name": profile.display_name,
        "avatar_url": profile.avatar_url,
        "grade": profile.grade,
        "age": profile.age,
        "preferences": profile.preferences or {},
    }
    
    return data
