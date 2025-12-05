"""
Users Router Module

Manages user profile operations and user information retrieval.
Handles getting and updating user details including profile information,
preferences, and other user-specific settings.

Endpoints:
- GET /api/users/me - Retrieve current authenticated user's information
- PATCH /api/users/me - Update current user's profile information
- GET /api/users/{user_id} - Retrieve public user information (by ID)

Dependencies:
- FastAPI for routing and HTTP handling
- SQLAlchemy for async database operations
- Authentication for user-specific operations
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from ..db.session import get_db
from .. import schemas, models
from ..core.deps import get_current_user
from ..core import security
from uuid import UUID

router = APIRouter()


@router.post("/", response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED, tags=["users"])
async def create_user(
    payload: schemas.UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new user account for testing purposes.

    This endpoint is primarily intended for Swagger UI testing and development.
    It allows creating user accounts without requiring authentication, which can
    then be used to test other authenticated endpoints.

    Features:
    - Create new user account with email and password
    - Validate email uniqueness
    - Hash password securely with bcrypt
    - Return created user object

    Request Body:
    - email: (required) User's email address (must be unique)
    - password: (required) User's password (minimum length enforced)

    Returns:
    - UserRead: Created user object with:
      * id - Generated UUID for user
      * email - User's email address
      * created_at - Account creation timestamp
      * is_active - Always True for new users

    Raises:
    - HTTPException (400): If email already registered
    - HTTPException (422): If validation fails

    Authentication: Not required (public endpoint for testing)
    HTTP Status: 201 Created on success, 400 Bad Request if email exists

    Note:
    - This endpoint is for development/testing purposes
    - In production, consider removing or restricting this endpoint
    - Use the created user credentials with POST /api/auth/login for authentication
    """
    # Check if email already registered
    q = select(models.User).where(models.User.email == payload.email)
    res = await db.execute(q)
    existing = res.scalar_one_or_none()

    # Reject if email already in use
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user with hashed password
    user = models.User(
        email=payload.email,
        hashed_password=security.hash_password(payload.password)
    )

    # Add to session and flush to get ID
    db.add(user)
    await db.flush()

    # Commit transaction
    await db.commit()

    # Refresh to get all defaults (created_at, etc.)
    await db.refresh(user)

    return user


@router.get("/me", response_model=schemas.UserRead)
async def get_me(
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieve the currently authenticated user's full profile.
    
    Features:
    - Get current user's account information
    - Include linked profile with preferences and roles
    - Get user metadata and settings
    - Alias for GET /api/auth/me (both work identically)
    
    Returns:
    - UserRead: Current user's complete object including:
      * id - User's UUID
      * email - Email address
      * is_active - Account status
      * created_at - Account creation timestamp
      * profile - Linked Profile object with:
        - first_name, last_name - User's name
        - avatar_url - Profile picture
        - bio - User biography
        - roles - JSON array of assigned roles
        - preferences - JSON with learning preferences (subjects, styles, etc.)
        - metadata - Additional flexible data storage
    
    Authentication: Required (JWT bearer token)
    HTTP Status: 200 OK on success, 401 Unauthorized if token invalid
    
    Notes:
    - Returns same data as GET /api/auth/me (both endpoints work)
    - Used to fetch fresh user data and verify authentication
    - Profile data auto-created on first update
    """
    # get_current_user dependency validates JWT and returns authenticated user
    return current_user


@router.patch("/me", response_model=schemas.UserRead)
async def update_me(
    payload: schemas.UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Update the currently authenticated user's profile information.
    
    Features:
    - Update profile fields (name, avatar, bio, preferences)
    - Auto-create Profile record if doesn't exist
    - Only update fields provided (partial update supported)
    - Returns updated user with all linked profile data
    
    Request Body (all fields optional):
    - first_name: (optional) User's first name
    - last_name: (optional) User's last name
    - avatar_url: (optional) URL to profile picture
    - bio: (optional) User biography/about section
    - roles: (optional) JSON array of role assignments
    - preferences: (optional) JSON object with learning preferences
      Format: {"age_range": "13-18", "subjects": ["Math", "Science"], ...}
    - metadata: (optional) Flexible JSON for custom data
    
    Returns:
    - UserRead: Updated user object with:
      * All fields from previous response
      * Profile with all updated values
    
    Raises:
    - HTTPException (404): If user somehow not found (shouldn't happen)
    - HTTPException (422): If validation fails on input data
    
    Authentication: Required (JWT bearer token)
    HTTP Status: 200 OK on success
    
    Notes:
    - Only updates provided fields; omitted fields remain unchanged
    - Profile record auto-created on first update if missing
    - Returns full user object with linked profile
    - Suitable for updating name, bio, preferences, roles
    
    Example Request:
    ```json
    {
      "first_name": "John",
      "last_name": "Doe",
      "preferences": {
        "subjects": ["Math", "English"],
        "learning_style": "visual"
      }
    }
    ```
    """
    # Fetch or create Profile record for current user
    q = select(models.Profile).where(models.Profile.user_id == current_user.id)
    res = await db.execute(q)
    profile = res.scalar_one_or_none()
    
    # Create profile if it doesn't exist yet
    if not profile:
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
        await db.flush()

    # Extract only provided fields from payload (exclude_unset=True)
    # This allows partial updates without overwriting missing fields
    update_data = payload.dict(exclude_unset=True)
    
    # Apply updates to profile object
    for k, v in update_data.items():
        setattr(profile, k, v)

    # Commit changes to database
    await db.commit()
    
    # Refresh current_user to get updated profile relationship
    await db.refresh(current_user)
    
    return current_user


@router.get("/{user_id}", response_model=schemas.UserRead)
async def get_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve a user's public profile information by ID.
    
    Features:
    - Get user profile by UUID
    - Access public user information
    - Retrieve linked profile with preferences and roles
    - No authentication required (public endpoint)
    
    Path Parameters:
    - user_id: (required) The UUID of the user to retrieve
    
    Returns:
    - UserRead: User's object including:
      * id - User's UUID
      * email - Email address (might be redacted in production)
      * created_at - Account creation date
      * profile - Full Profile with name, avatar, bio, preferences
    
    Raises:
    - HTTPException (404): If user with given ID doesn't exist
    
    Authentication: Not required (public endpoint)
    HTTP Status: 200 OK on success, 404 Not Found if user doesn't exist
    
    Notes:
    - Consider restricting email visibility for privacy
    - Could filter sensitive fields (preferences, metadata) in production
    - Useful for displaying public user profiles/about pages
    - Can be accessed by any user without authentication
    """
    # Query for user by ID
    q = select(models.User).where(models.User.id == user_id)
    res = await db.execute(q)
    
    # Fetch user or return 404
    user = res.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID '{user_id}' not found"
        )
    
    return user
