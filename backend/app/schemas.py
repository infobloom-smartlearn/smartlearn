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


class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    grade: Optional[str] = None
    age: Optional[int] = None
    preferences: Optional[dict] = None

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


# Courses & Lessons
class LessonRead(BaseModel):
    id: UUID
    course_id: UUID
    title: str
    content: Optional[str]
    order: Optional[int]
    duration_minutes: Optional[int]

    class Config:
        orm_mode = True


class CourseRead(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    slug: str
    metadata: Optional[dict]
    is_published: bool

    class Config:
        orm_mode = True


# Quizzes
class QuizRead(BaseModel):
    id: UUID
    lesson_id: UUID
    title: str
    passing_score: Optional[int]

    class Config:
        orm_mode = True


class QuizAttemptCreate(BaseModel):
    answers: Any


class QuizAttemptRead(BaseModel):
    id: UUID
    user_id: UUID
    quiz_id: UUID
    score: Optional[int]
    started_at: datetime
    completed_at: Optional[datetime]
    answers: Any

    class Config:
        orm_mode = True


# Progress & Notifications
class ProgressRead(BaseModel):
    id: UUID
    user_id: UUID
    lesson_id: UUID
    status: str
    progress_pct: int
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True


class ProgressUpdate(BaseModel):
    lesson_id: UUID
    status: Optional[str] = None
    progress_pct: Optional[int] = None


class NotificationRead(BaseModel):
    id: UUID
    user_id: UUID
    type: str
    payload: Optional[dict]
    is_read: bool
    created_at: datetime

    class Config:
        orm_mode = True


class AchievementRead(BaseModel):
    id: UUID
    user_id: UUID
    key: str
    title: str
    description: Optional[str]
    unlocked_at: datetime

    class Config:
        orm_mode = True


# Settings schema (for user settings page)
class SettingsRead(BaseModel):
    email: EmailStr
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    grade: Optional[str] = None
    age: Optional[int] = None
    preferences: Optional[dict] = {}

    class Config:
        orm_mode = True


class SettingsUpdate(BaseModel):
    email: Optional[EmailStr] = None
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    grade: Optional[str] = None
    age: Optional[int] = None
    preferences: Optional[dict] = None

    class Config:
        orm_mode = True


class OnboardingRolesRead(BaseModel):
    roles: list[str]

    class Config:
        orm_mode = True


class OnboardingRolesUpdate(BaseModel):
    roles: list[str]

    class Config:
        orm_mode = True


# Onboarding step 1 (basic profile info)
class OnboardingInfoCreate(BaseModel):
    name: str
    ageRange: str
    grade: Optional[str] = None


class OnboardingInfoRead(BaseModel):
    name: str
    ageRange: str
    grade: Optional[str] = None

    class Config:
        orm_mode = True


# Onboarding step 2 (subjects & learning styles)
class OnboardingStep2Create(BaseModel):
    subjects: dict[str, bool]
    styles: dict[str, bool]


class OnboardingStep2Read(BaseModel):
    subjects: dict[str, bool]
    styles: dict[str, bool]

    class Config:
        orm_mode = True
