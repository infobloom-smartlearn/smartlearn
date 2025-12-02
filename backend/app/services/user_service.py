from backend.app.models import User
from backend.app.core.security import hash_password, verify_password
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select


async def get_user_by_email(db: AsyncSession, email: str):
    q = select(User).where(User.email == email)
    res = await db.execute(q)
    return res.scalar_one_or_none()


async def create_user(db: AsyncSession, email: str, password: str) -> User:
    user = User(email=email, hashed_password=hash_password(password))
    db.add(user)
    await db.flush()
    await db.commit()
    await db.refresh(user)
    return user
