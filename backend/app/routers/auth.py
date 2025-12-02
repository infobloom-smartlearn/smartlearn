from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.db.session import get_db
from backend.app import schemas, models
from backend.app.core import security
from backend.app.core.config import settings
from backend.app.core.deps import get_current_user
from datetime import timedelta
from pydantic import EmailStr
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()


@router.post("/register", response_model=schemas.UserRead)
async def register(payload: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    # ensure email not already registered
    q = select(models.User).where(models.User.email == payload.email)
    res = await db.execute(q)
    existing = res.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(email=payload.email, hashed_password=security.hash_password(payload.password))
    db.add(user)
    await db.flush()
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    # form_data.username contains the email
    q = select(models.User).where(models.User.email == form_data.username)
    res = await db.execute(q)
    user = res.scalar_one_or_none()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # create tokens
    access_token = security.create_access_token(subject=str(user.id), expires_delta=access_token_expires)
    # for simplicity we return only access token; implement refresh token later
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.UserRead)
async def me(current_user: models.User = Depends(get_current_user)):
    return current_user
