SmartLearn backend scaffold

This folder contains a minimal FastAPI + SQLAlchemy scaffold to start backend development.

Quick start (Docker):

1. From project root run:

   docker-compose -f backend/docker-compose.yml up --build

2. Open http://localhost:8000/api/health

Notes:
- The auth dependency in `ai_tutor` is a stub for development. Implement JWT auth next.
- Run Alembic migrations after models are finalized.
