# Database Migrations

This project uses Alembic for database schema management.

## Setup

Alembic is already configured and integrated with the FastAPI application.

## Running Migrations

Before running the application, ensure the database schema is up to date:

### Apply all pending migrations
```bash
cd backend
alembic upgrade head
```

### Create a new migration (auto-detect schema changes)
```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
```

### Downgrade to a specific revision
```bash
cd backend
alembic downgrade <revision_id>
```

### View migration history
```bash
cd backend
alembic history
```

### View current revision
```bash
cd backend
alembic current
```

## Initial Migration

The initial migration `001_initial_schema.py` creates all core tables:
- `users` — user accounts with email and password hash
- `profiles` — user profile data including `roles` (JSON) and `preferences` (JSON) columns
- `courses`, `lessons` — course and lesson content
- `quizzes`, `quiz_questions`, `quiz_attempts` — quiz infrastructure
- `progress` — lesson progress tracking
- `notifications`, `achievements` — user notifications and achievements
- `conversations`, `messages`, `attachments` — AI tutor conversation history

The `profiles.roles` and `profiles.preferences` columns use PostgreSQL's JSONB type for flexible storage of onboarding selections.

## Docker Integration

When running via docker-compose, the database will be initialized with the latest schema automatically (if configured in the startup script).

To run migrations in Docker:
```bash
docker-compose exec backend alembic upgrade head
```
