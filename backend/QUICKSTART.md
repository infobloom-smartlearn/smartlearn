# FastAPI Backend Setup & Running Guide

## Prerequisites Checklist
✅ PostgreSQL is running on `localhost:5432`
✅ Database `smartlearn` created
✅ Python 3.8+ installed
✅ All dependencies in `requirements.txt` installed

## Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Step 2: Run Database Migrations

```bash
# Navigate to backend directory
cd backend

# Apply Alembic migrations to create tables
alembic upgrade head
```

If you want to see the migration status:
```bash
alembic current
alembic history --verbose
```

## Step 3: Start the FastAPI Server

### Option A: Run with Uvicorn (Default)
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Option B: Run with custom settings
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

## Step 4: Access FastAPI Documentation

Once the server is running, you can access the interactive API documentation:

### **Swagger UI (Interactive)**
- **URL:** http://localhost:8000/docs
- **Features:**
  - Try out endpoints directly
  - See request/response models
  - Authorize with JWT tokens
  - View all available routes

### **ReDoc (Alternative)**
- **URL:** http://localhost:8000/redoc
- **Features:**
  - Clean, organized API documentation
  - Better for reading specifications
  - Search and navigation features

### **OpenAPI Schema (JSON)**
- **URL:** http://localhost:8000/openapi.json
- **Features:**
  - Raw OpenAPI specification
  - Useful for code generation
  - API documentation in machine-readable format

## Available API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Sign in and get JWT token
- `GET /api/auth/me` - Get current user info

### User Routes
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update user profile
- `GET /api/users/{user_id}` - Get user by ID

### Onboarding Routes
- `GET /api/onboarding/roles` - Get available roles
- `GET /api/onboarding/me/roles` - Get user's selected roles
- `POST /api/onboarding/me/roles` - Save selected roles
- `GET /api/onboarding/me/info` - Get step-1 info
- `POST /api/onboarding/me/info` - Save step-1 info
- `GET /api/onboarding/me/step2` - Get step-2 preferences
- `POST /api/onboarding/me/step2` - Save step-2 preferences

### Courses Routes
- `GET /api/courses` - List all published courses
- `GET /api/courses/{course_id}` - Get course details
- `GET /api/courses/{course_id}/lessons` - Get course lessons
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/{course_id}` - Update course
- `DELETE /api/courses/{course_id}` - Delete course

### Lessons Routes
- `GET /api/lessons` - List lessons with filters
- `GET /api/lessons/{lesson_id}` - Get lesson details

### Quizzes Routes
- `GET /api/quizzes` - List quizzes with filters
- `GET /api/quizzes/{quiz_id}` - Get quiz details
- `POST /api/quizzes/{quiz_id}/attempts` - Create quiz attempt
- `GET /api/quizzes/{quiz_id}/attempts` - Get user's attempts

### Progress Routes
- `GET /api/progress/users/me/progress` - Get user's progress
- `POST /api/progress` - Update progress for a lesson

### Notifications Routes
- `GET /api/notifications` - List user's notifications
- `PATCH /api/notifications/{notification_id}/read` - Mark as read
- `DELETE /api/notifications/{notification_id}` - Delete notification
- `GET /api/notifications/achievements` - Get user's achievements

### Dashboard Routes
- `GET /api/dashboard/streak` - Get learning streak
- `GET /api/dashboard/recommendation` - Get AI recommendation
- `GET /api/dashboard/overview` - Get dashboard overview

### AI Tutor Routes
- `POST /api/ai/conversations` - Create conversation
- `GET /api/ai/conversations` - List conversations
- `GET /api/ai/conversations/{conv_id}` - Get conversation
- `GET /api/ai/conversations/{conv_id}/messages` - Get messages
- `POST /api/ai/conversations/{conv_id}/messages` - Post message

### Settings Routes
- `GET /api/settings` - Get user settings
- `PATCH /api/settings` - Update user settings

### Health Check
- `GET /api/health` - Server health check

## Testing the API

### 1. Test Health Check (No Auth Required)
```bash
curl http://localhost:8000/api/health
```

Expected Response:
```json
{"status":"ok"}
```

### 2. Register a New User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Login User
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=SecurePass123!"
```

Expected Response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### 4. Get Current User (Requires Auth)
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Environment Variables Reference

Located in `.env` file:

```
DATABASE_URL=postgresql+asyncpg://smartlearn:infobloom@localhost:5432/smartlearn
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=15
```

### To change settings:
1. Edit `.env` file
2. Restart the server

## Troubleshooting

### Issue: Connection refused to database
**Solution:**
```bash
# Check PostgreSQL is running
psql -U smartlearn -h localhost -d smartlearn

# Check .env DATABASE_URL is correct
# Default: postgresql+asyncpg://smartlearn:infobloom@localhost:5432/smartlearn
```

### Issue: ModuleNotFoundError
**Solution:**
```bash
# Make sure you're in backend directory
cd backend

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: Alembic migrations won't apply
**Solution:**
```bash
# Check current migration status
alembic current

# View migration history
alembic history --verbose

# Try applying migrations
alembic upgrade head
```

### Issue: CORS errors from frontend
**Check:** `app/core/config.py` CORS settings are correct

### Issue: JWT token errors
**Check:** 
- `SECRET_KEY` in `.env` is set
- `ACCESS_TOKEN_EXPIRE_MINUTES` is appropriate

## File Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app initialization
│   ├── models.py               # SQLAlchemy models
│   ├── schemas.py              # Pydantic schemas
│   ├── core/
│   │   ├── config.py           # Configuration
│   │   ├── security.py         # JWT & password hashing
│   │   └── deps.py             # Dependencies
│   ├── db/
│   │   ├── base.py             # Base classes
│   │   └── session.py          # Database session
│   ├── routers/
│   │   ├── auth.py             # Auth endpoints
│   │   ├── users.py            # User endpoints
│   │   ├── courses.py          # Course endpoints
│   │   ├── lessons.py          # Lesson endpoints
│   │   ├── quizzes.py          # Quiz endpoints
│   │   ├── progress.py         # Progress endpoints
│   │   ├── notifications.py    # Notification endpoints
│   │   ├── ai_tutor.py         # AI Tutor endpoints
│   │   ├── settings.py         # Settings endpoints
│   │   ├── onboarding.py       # Onboarding endpoints
│   │   └── dashboard.py        # Dashboard endpoints
│   └── services/
│       ├── ai_client.py        # AI service
│       └── user_service.py     # User service
├── alembic/
│   ├── env.py                  # Alembic environment
│   └── versions/               # Migration files
├── .env                        # Environment variables
├── requirements.txt            # Python dependencies
├── alembic.ini                 # Alembic configuration
└── README.md
```

## Next Steps

1. ✅ Start the server: `uvicorn app.main:app --reload`
2. ✅ Access docs: http://localhost:8000/docs
3. ✅ Test endpoints in Swagger UI
4. ✅ Integrate with frontend (already set up with API calls)

## Frontend Integration

The frontend is already configured to call your backend:
- **API URL:** http://localhost:8000/api
- **Environment Variable:** `REACT_APP_API_URL`
- **Authentication:** JWT tokens stored in localStorage

All Sign In/Sign Up pages are ready to communicate with these endpoints!

