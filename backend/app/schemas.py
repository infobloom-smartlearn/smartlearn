from pydantic import BaseModel, EmailStr
from typing import Optional, Any
from uuid import UUID
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserRead(BaseModel):
    id: UUID
    email: EmailStr
    is_active: bool

    class Config:
        orm_mode = True


class ConversationCreate(BaseModel):
    title: Optional[str] = None
    metadata: Optional[dict] = {}


class ConversationRead(BaseModel):
    id: UUID
    user_id: UUID
    title: Optional[str]
    last_message_at: Optional[datetime]

    class Config:
        orm_mode = True


class MessageCreate(BaseModel):
    sender: str
    content: Any


class MessageRead(BaseModel):
    id: UUID
    conversation_id: UUID
    sender: str
    content: Any
    created_at: datetime

    class Config:
        orm_mode = True
