from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
from typing import List
import os
from pathlib import Path


class Settings(BaseSettings):
    PROJECT_NAME: str = "SmartLearn API"
    DEBUG: bool = True
    DATABASE_URL: str = "postgresql+asyncpg://postgres:infobloom@localhost:5432/smartlearn"
    REDIS_URL: str = "redis://redis:6379/0"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = str(Path(__file__).parent.parent.parent / ".env")


settings = Settings()
