from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID
from backend.app import schemas, models
from backend.app.db.session import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

router = APIRouter()


async def get_current_user():
    # Temporary stub for development. Replace with real auth dependency.
    class UserObj:
        id = uuid.UUID(int=0)

    return UserObj()


@router.post("/conversations", response_model=schemas.ConversationRead)
async def create_conversation(payload: schemas.ConversationCreate, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    conv = models.Conversation(user_id=user.id, title=payload.title, metadata=payload.metadata)
    db.add(conv)
    await db.flush()
    await db.commit()
    await db.refresh(conv)
    return conv


@router.get("/conversations", response_model=List[schemas.ConversationRead])
async def list_conversations(db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    q = select(models.Conversation).where(models.Conversation.user_id == user.id).order_by(models.Conversation.last_message_at.desc())
    res = await db.execute(q)
    rows = res.scalars().all()
    return rows



@router.get("/conversations/{conv_id}", response_model=schemas.ConversationRead)
async def get_conversation(conv_id: UUID, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    q = select(models.Conversation).where(models.Conversation.id == conv_id)
    res = await db.execute(q)
    conv = res.scalar_one_or_none()
    if not conv or conv.user_id != user.id:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv


@router.get("/conversations/{conv_id}/messages", response_model=List[schemas.MessageRead])
async def list_messages(conv_id: UUID, limit: int = 50, after: str | None = None, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    # optional after param is ISO timestamp
    q_conv = select(models.Conversation).where(models.Conversation.id == conv_id)
    res = await db.execute(q_conv)
    conv = res.scalar_one_or_none()
    if not conv or conv.user_id != user.id:
        raise HTTPException(status_code=404, detail="Conversation not found")

    q = select(models.Message).where(models.Message.conversation_id == conv_id).order_by(models.Message.created_at.asc()).limit(limit)
    if after:
        try:
            from datetime import datetime
            after_dt = datetime.fromisoformat(after)
            q = select(models.Message).where(models.Message.conversation_id == conv_id, models.Message.created_at > after_dt).order_by(models.Message.created_at.asc()).limit(limit)
        except Exception:
            pass
    res = await db.execute(q)
    return res.scalars().all()


@router.post("/conversations/{conv_id}/messages", response_model=schemas.MessageRead, status_code=status.HTTP_201_CREATED)
async def post_message(conv_id: UUID, payload: schemas.MessageCreate, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    q = select(models.Conversation).where(models.Conversation.id == conv_id)
    res = await db.execute(q)
    conv = res.scalar_one_or_none()
    if not conv or conv.user_id != user.id:
        raise HTTPException(status_code=404, detail="Conversation not found")
    msg = models.Message(conversation_id=conv_id, sender=payload.sender, content=payload.content)
    db.add(msg)
    await db.flush()
    # enqueue AI response job here (Redis/Celery) in a next step
    await db.commit()
    await db.refresh(msg)
    return msg
