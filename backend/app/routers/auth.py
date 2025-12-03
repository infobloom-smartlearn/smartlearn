"""
Authentication Router Module

Handles user authentication for the SmartLearn platform including:
- User registration with email and password
- Login with JWT token generation
- Current user retrieval and validation
- Password hashing and token security

Security Features:
- Passwords hashed with bcrypt via passlib
- JWT (JSON Web Tokens) for stateless authentication
- Configurable token expiration (default 24 hours)
- Secure token creation using python-jose

Endpoints:
- POST /api/auth/register - Create new user account
- POST /api/auth/login - Authenticate user and receive JWT token
- GET /api/auth/me - Retrieve current authenticated user info

Dependencies:
- FastAPI for routing
- SQLAlchemy for async database operations
- python-jose for JWT creation and validation
- passlib/bcrypt for password hashing
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..db.session import get_db
from .. import schemas, models
from ..core import security
from ..core.config import settings
from ..core.deps import get_current_user
from datetime import timedelta
from pydantic import EmailStr
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()


@router.post("/register", response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
async def register(
    payload: schemas.UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user account with email and password.
    
    Features:
    - Create new user account
    - Validate email uniqueness (no duplicate registrations)
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
      * (password not returned for security)
    
    Raises:
    - HTTPException (400): If email already registered
    - HTTPException (422): If validation fails (invalid email format, weak password)
    
    Authentication: Not required (public endpoint)
    HTTP Status: 201 Created on success, 400 Bad Request if email exists
    
    Notes:
    - Passwords are hashed before storage; plaintext never persisted
    - Email serves as unique identifier for user account
    - User profile is created separately after registration
    - Use POST /api/auth/login to authenticate after registration
    """
    # Check if email already registered to prevent duplicates
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
    # Note: security.hash_password handles bcrypt hashing
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


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate user and return JWT access token.
    
    Features:
    - Verify user credentials (email and password)
    - Generate JWT access token for authenticated requests
    - Configurable token expiration time
    - Secure password verification with bcrypt
    
    Request Body (Form Data):
    - username: (required) User's email address (standard OAuth2 field)
    - password: (required) User's password (plaintext, hashed for comparison)
    
    Returns:
    - JSON object containing:
      * access_token - JWT token for authenticated API requests
        Format: "eyJhbGc..." (long base64-encoded token)
      * token_type - "bearer" (standard HTTP Bearer token)
    
    Client Usage:
    - Store access_token in localStorage/sessionStorage
    - Include in all authenticated requests:
      Authorization: Bearer {access_token}
    - Token is valid for settings.ACCESS_TOKEN_EXPIRE_MINUTES (default 24 hours)
    
    Raises:
    - HTTPException (401): If email not found or password incorrect
    
    Authentication: Not required (public endpoint)
    HTTP Status: 200 OK on success, 401 Unauthorized on failure
    
    Notes:
    - OAuth2PasswordRequestForm requires form-encoded credentials (not JSON)
    - Use /api/auth/me endpoint to verify token validity
    - Token should be refreshed before expiration (implement refresh token flow)
    - Passwords never logged or returned in responses
    
    Token Payload:
    - Contains subject (user ID) and expiration time
    - Validated on protected endpoints via get_current_user dependency
    - Secret key from settings.SECRET_KEY used for signing
    """
    # Query for user by email (form_data.username contains email per OAuth2 convention)
    q = select(models.User).where(models.User.email == form_data.username)
    res = await db.execute(q)
    user = res.scalar_one_or_none()
    
    # Verify user exists AND password is correct
    # Note: Use constant-time verification to prevent timing attacks
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Create JWT access token with expiration
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    
    # Generate token containing subject (user_id) and expiration
    # security.create_access_token handles JWT encoding with SECRET_KEY
    access_token = security.create_access_token(
        subject=str(user.id),
        expires_delta=access_token_expires
    )
    
    # Return token in OAuth2-standard format
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=schemas.UserRead)
async def me(
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieve the currently authenticated user's information.
    
    Features:
    - Get authenticated user's profile
    - Validate JWT token validity
    - Return current user details
    - Useful for verifying login state
    
    Returns:
    - UserRead: Current user's object including:
      * id - User's UUID
      * email - User's email address
      * created_at - Account creation timestamp
      * is_active - Whether account is active
      * Profile data - Linked profile with roles, preferences, etc.
    
    Raises:
    - HTTPException (401): If token invalid or expired
    - HTTPException (401): If user no longer exists
    
    Authentication: Required (JWT bearer token in Authorization header)
    HTTP Status: 200 OK on success, 401 Unauthorized on auth failure
    
    Usage:
    ```javascript
    // Frontend example
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const user = await response.json();
    ```
    
    Notes:
    - Token validation handled automatically by get_current_user dependency
    - Token expiration is checked; expired tokens return 401
    - Safe endpoint to check if user is still logged in
    - Returns fresh data from database (no caching)
    """
    # get_current_user dependency validates token and returns user
    # If token invalid/expired, dependency raises HTTPException(401)
    return current_user
