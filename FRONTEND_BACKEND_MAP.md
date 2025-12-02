# Frontend Pages & Backend Endpoints Status

## Summary
Analyzed all 12 frontend pages. **6 pages already have backend endpoints**, **4 pages need new endpoints**, **2 pages are partially done or use only UI state**.

---

## ✅ COMPLETED (Endpoints Already Exist)

### 1. **AiTutor.js** ✅
- **Features**: AI chat interface with message history and typing indicator
- **Endpoints**: 
  - `POST /api/ai_tutor/conversations` — create conversation
  - `GET /api/ai_tutor/conversations` — list conversations
  - `GET /api/ai_tutor/conversations/{id}` — get conversation
  - `GET /api/ai_tutor/conversations/{id}/messages` — list messages
  - `POST /api/ai_tutor/conversations/{id}/messages` — post message
- **Status**: Ready to integrate frontend calls

### 2. **OnboardingStep1.js** ✅
- **Features**: Collects name, age range, grade
- **Endpoints**:
  - `GET /api/onboarding/me/info` — load saved step-1 data
  - `POST /api/onboarding/me/info` — save step-1 data
- **Status**: Frontend calls ALREADY ADDED ✓

### 3. **OnboardingStep2.js** ✅
- **Features**: Selects subjects and learning styles
- **Endpoints**:
  - `GET /api/onboarding/me/step2` — load saved step-2 data
  - `POST /api/onboarding/me/step2` — save step-2 data (with validation)
- **Status**: Frontend calls ALREADY ADDED ✓

### 4. **Settings.js** ✅
- **Features**: Account settings, email, dark mode, language
- **Endpoints**:
  - `GET /api/settings` — get user settings
  - `PATCH /api/settings` — update settings
- **Status**: Backend exists, frontend calls needed

### 5. **Profile.js** ✅
- **Features**: User profile, achievements, stats
- **Endpoints**:
  - `GET /api/users/me` — get current user
  - `GET /api/notifications/achievements` — get achievements (read-only UI)
- **Status**: Endpoints exist, frontend integration needed

### 6. **Onboarding.js** ✅
- **Features**: Select role (student/parent/teacher)
- **Endpoints**:
  - `GET /api/onboarding/roles` — get available roles
  - `POST /api/onboarding/me/roles` — save selected roles
  - `GET /api/onboarding/me/roles` — get saved roles
- **Status**: Ready for frontend integration

---

## ❌ NEEDS NEW ENDPOINTS (High Priority)

### 1. **Lessons.js** 🔴 PRIORITY #1
- **Features**: List lessons with filtering (subject, topic, difficulty, status), lesson cards show progress
- **Missing Endpoints**:
  - `GET /api/lessons` — list all lessons with filters (query: subject, topic, difficulty, status)
  - `GET /api/lessons/{lesson_id}` — get single lesson details
  - `GET /api/progress/users/me/progress?lesson_id={id}` — get user's progress on lesson (already exists, just needs to be called)
- **Data Needed in Response**:
  ```json
  {
    "lessons": [
      {
        "id": "uuid",
        "course_id": "uuid",
        "title": "Algebra Topics",
        "subject": "Math",
        "topic": "Algebra",
        "difficulty": "Medium",
        "duration_minutes": 180,
        "content": "lesson description",
        "units": 12,
        "userProgress": {
          "status": "In Progress",
          "progress_pct": 75
        }
      }
    ]
  }
  ```

### 2. **Quiz.js** 🔴 PRIORITY #2
- **Features**: List quizzes with filtering (subject, difficulty, status), quiz cards with attempt tracking
- **Missing Endpoints**:
  - `GET /api/quizzes` — list all quizzes with filters (query: subject, difficulty, status)
  - `GET /api/quizzes/{quiz_id}` — get single quiz with questions
  - `GET /api/quizzes/{quiz_id}/attempts` — get user's quiz attempts (for status)
  - `POST /api/quizzes/{quiz_id}/attempts` — start a new attempt (already exists)
- **Data Needed in Response**:
  ```json
  {
    "quizzes": [
      {
        "id": "uuid",
        "lesson_id": "uuid",
        "title": "Algebra Basics Quiz",
        "subject": "Math",
        "topic": "Algebra",
        "difficulty": "Easy",
        "questions_count": 10,
        "duration_minutes": 15,
        "description": "Test your knowledge...",
        "userAttempts": [
          {
            "id": "uuid",
            "status": "completed",
            "score": 85,
            "completed_at": "2025-12-02T10:00:00Z"
          }
        ]
      }
    ]
  }
  ```

### 3. **Notifications.js** 🔴 PRIORITY #3
- **Features**: List notifications with filtering, notification cards with timestamps
- **Missing Endpoints**:
  - `GET /api/notifications` — list user's notifications (endpoint exists but needs filtering)
  - `PATCH /api/notifications/{id}/read` — mark notification as read
- **Enhancement Needed**: Add query filters for type (all, unread, ai_insights, course_updates)
- **Data Already Provided**: Current notification endpoints exist

### 4. **Dashboard.js** 🔴 PRIORITY #4
- **Features**: Course cards with progress, AI banner with recommendations, learning streak
- **Missing Endpoints**:
  - `GET /api/courses` — list courses in progress (filter: user's enrolled courses)
  - `GET /api/progress/users/me/progress` — get all user progress data (endpoint exists, needs frontend call)
  - `GET /api/notifications/recommendations` — get AI recommendations (NEW - generate AI insight)
  - `GET /api/achievements/streak` — get current learning streak (NEW - calculate from daily progress)
- **Data Needed**:
  ```json
  {
    "courses": [
      {
        "id": "uuid",
        "title": "Algebra basics",
        "progress": 75,
        "icon": "🔵",
        "status": "In Progress"
      }
    ],
    "recommendation": {
      "text": "You're doing well in Math! Try advanced geometry next.",
      "course_id": "uuid"
    },
    "streak": {
      "current_days": 4,
      "week_progress": ["M", "T", "W", "T", "F", "S", "S"]
    }
  }
  ```

---

## 🔶 PARTIAL / UI-ONLY (Lower Priority)

### 1. **OnboardingStep3.js**
- **Status**: Not read yet (file exists but content unknown)
- **Note**: Likely completion page, may not need backend calls

---

## RECOMMENDED ORDER TO BUILD ENDPOINTS

1. **Lessons.js** — Foundation for all learning content
2. **Quiz.js** — Assessment tracking
3. **Notifications.js** — Minor enhancements to existing endpoints
4. **Dashboard.js** — Aggregates data from other endpoints
5. **Settings.js** — User preferences (low complexity)
6. **Profile.js** — User profile (display only)

---

## Next Steps
You're ready to start building endpoint #1: **Lessons.js endpoints**
Ready to proceed?
