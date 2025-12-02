#!/usr/bin/env python
"""
Standalone script to initialize the database schema using Alembic.
Run this before starting the application.

Usage:
    python init_db.py
"""
import os
import sys
from pathlib import Path

# Add the backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Load environment variables
from dotenv import load_dotenv
load_dotenv(backend_dir / ".env")

# Now we can import Alembic and run migrations
from alembic.config import Config
from alembic import command

def init_db():
    """Initialize the database by running all pending migrations."""
    # Get the alembic config
    alembic_cfg = Config(backend_dir / "alembic.ini")
    
    # Ensure the sqlalchemy.url is set from environment
    database_url = os.getenv("DATABASE_URL", "")
    if not database_url:
        print("❌ ERROR: DATABASE_URL not set in .env")
        sys.exit(1)
    
    # Convert async URL to sync for migrations
    database_url = database_url.replace("postgresql+asyncpg://", "postgresql://")
    alembic_cfg.set_main_option("sqlalchemy.url", database_url)
    
    print("📦 Running database migrations...")
    print(f"Database: {database_url.split('@')[1] if '@' in database_url else 'unknown'}")
    
    try:
        # Run the upgrade to the latest revision
        command.upgrade(alembic_cfg, "head")
        print("✅ Database initialized successfully!")
    except Exception as e:
        print(f"❌ ERROR: Failed to initialize database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_db()
