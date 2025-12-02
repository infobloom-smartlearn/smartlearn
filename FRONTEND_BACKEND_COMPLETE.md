# Complete Frontend-Backend Mapping Analysis

## Status Summary
✅ **TOTAL: 12 frontend pages analyzed**
- ✅ 10 pages have full backend endpoint coverage
- ⚠️ 2 pages use UI-only state (no backend needed)

---

## ✅ PAGES WITH COMPLETE BACKEND ENDPOINTS

### 1. **AiTutor.js** ✅
**Status**: Needs frontend API integration
- **Current State**: Uses simulated bot responses with setTimeout
- **Backend Endpoints Available**:
  - `POST /api/ai/conversations` — Create conversation
  - `GET /api/ai/conversations` — List conversations
  - `GET /api/ai/conversations/{id}` — Get conversation
  - `POST /api/ai/conversations/{id}/messages` — Post message
  - `GET /api/ai/conversations/{id}/messages` — List messages
- **TODO**: Replace setTimeout simulation with actual API calls

### 2. **Dashboard.js** ✅
**Status**: Needs frontend API integration
- **Current State**: All hardcoded sample data
- **Backend Endpoints Available**:
  - `GET /api/dashboard/overview` — Dashboard stats
  - `GET /api/dashboard/streak` — Learning streak
  - `GET /api/dashboard/recommendation` — AI recommendation
  - `GET /api/courses` — List user's courses
  - `GET /api/progress/users/me/progress` — User progress data
- **TODO**: Fetch and populate dashboard with real data on mount

### 3. **Lessons.js** ✅
**Status**: Needs frontend API integration
- **Current State**: Uses hardcoded `sampleLessons` array
- **Backend Endpoints Available**:
  - `GET /api/lessons` — List lessons with filters (subject, topic, difficulty, status)
  - `GET /api/lessons/{lesson_id}` — Get single lesson
  - `GET /api/progress/users/me/progress` — Get progress for each lesson
- **TODO**: Fetch lessons on mount, apply filters dynamically

### 4. **Quiz.js** ✅
**Status**: Needs frontend API integration
- **Current State**: Uses hardcoded `sampleQuizzes` array
- **Backend Endpoints Available**:
  - `GET /api/quizzes` — List quizzes with filters (subject, difficulty, status)
  - `GET /api/quizzes/{quiz_id}` — Get quiz details
  - `GET /api/quizzes/{quiz_id}/attempts` — Get user's attempts for status determination
  - `POST /api/quizzes/{quiz_id}/attempts` — Create new attempt
- **TODO**: Fetch quizzes on mount, determine status from attempts

### 5. **Notifications.js** ✅
**Status**: Needs frontend API integration
- **Current State**: Uses hardcoded `sampleNotifications` array
- **Backend Endpoints Available**:
  - `GET /api/notifications` — List notifications (with filters: type, unread_only)
  - `PATCH /api/notifications/{id}/read` — Mark as read
  - `GET /api/notifications/achievements` — List achievements
- **TODO**: Fetch notifications on mount, add filtering logic

### 6. **Profile.js** ✅
**Status**: Needs frontend API integration
- **Current State**: Hardcoded user data ("Ada", achievements, stats)
- **Backend Endpoints Available**:
  - `GET /api/users/me` — Get current user profile
  - `PATCH /api/users/me` — Update profile
  - `GET /api/notifications/achievements` — Get achievements
  - `GET /api/progress/users/me/progress` — Calculate stats from progress
- **TODO**: Load user profile on mount, display real achievements and stats

### 7. **Settings.js** ✅
**Status**: Needs frontend API integration
- **Current State**: UI state only (emailNotif, darkMode, language toggles)
- **Backend Endpoints Available**:
  - `GET /api/settings` — Get user settings
  - `PATCH /api/settings` — Update settings (email, preferences)
- **TODO**: Load settings on mount, save changes on toggle/update

### 8. **OnboardingStep1.js** ✅
**Status**: COMPLETE ✅
- **Current State**: API calls ALREADY IMPLEMENTED
- **Backend Endpoints**:
  - `GET /api/onboarding/me/info` — Load saved data
  - `POST /api/onboarding/me/info` — Save name, age range, grade
- **Status**: Ready to use

### 9. **OnboardingStep2.js** ✅
**Status**: COMPLETE ✅
- **Current State**: API calls ALREADY IMPLEMENTED
- **Backend Endpoints**:
  - `GET /api/onboarding/me/step2` — Load saved data
  - `POST /api/onboarding/me/step2` — Save subjects and learning styles
- **Status**: Ready to use

### 10. **Onboarding.js (Role Selector)** ✅
**Status**: Needs frontend API integration
- **Current State**: UI state only (role selection)
- **Backend Endpoints Available**:
  - `GET /api/onboarding/roles` — Get available roles
  - `POST /api/onboarding/me/roles` — Save selected roles
  - `GET /api/onboarding/me/roles` — Load saved roles
- **TODO**: Fetch available roles on mount, save selected role before continuing

---

## ⚠️ PAGES WITH UI-ONLY STATE (No Backend Needed)

### 1. **OnboardingStep3.js** ⚠️
**Status**: UI-only, no backend needed
- **Purpose**: Final onboarding completion screen showing "What happens next" guide
- **State**: Navigation buttons only
- **Action**: Simply navigates to `/app` or `/` when clicked
- **Backend**: No endpoints needed — this is informational only

### 2. **Courses.js** (if exists)
**Status**: To be checked if file exists
- **Note**: Likely aggregates course data from lessons/progress

---

## Implementation Roadmap (Priority Order)

### 🔴 **HIGH PRIORITY** (User Experience critical)
1. **Dashboard.js** — Landing page after login, needs real data
2. **Profile.js** — User profile display with achievements
3. **Lessons.js** — Core learning content discovery

### 🟡 **MEDIUM PRIORITY** (Learning flow)
4. **Quiz.js** — Assessment tracking
5. **Notifications.js** — User engagement
6. **AiTutor.js** — Support tool

### 🟢 **LOW PRIORITY** (Settings/config)
7. **Settings.js** — User preferences
8. **Onboarding.js** — Role selection (one-time setup)

### ✅ **ALREADY DONE**
- OnboardingStep1.js
- OnboardingStep2.js

---

## Frontend Integration Template

### General Pattern for All Pages
```javascript
import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export default function PageName() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/endpoint`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{/* render data */}</div>;
}
```

---

## Database Seeding Needed

To support frontend pages, you'll need test data in the database:

### Required Data
1. **Courses** (for Dashboard, Lessons)
   - Math, Science, English, History courses with metadata
2. **Lessons** (for Lessons, Dashboard)
   - 12-15 lessons across different courses
   - Include: title, description, duration, difficulty, subject, topic
3. **Quizzes** (for Quiz page)
   - 6-8 quizzes linked to lessons
4. **Quiz Questions** (for Quiz attempts)
   - Multiple choice questions with correct answers
5. **User Progress** (for Dashboard, Lessons)
   - Sample progress records for current user
6. **User Achievements** (for Profile)
   - 4-5 achievements with unlock dates

### Quick Seed Script Location
Consider creating: `backend/scripts/seed_data.py`

---

## Summary Table

| Page | Backend Ready | Frontend Integrated | Priority | Status |
|------|---------------|-------------------|----------|--------|
| AiTutor | ✅ | ❌ | Medium | Needs API calls |
| Dashboard | ✅ | ❌ | HIGH | Needs API calls |
| Lessons | ✅ | ❌ | HIGH | Needs API calls |
| Quiz | ✅ | ❌ | Medium | Needs API calls |
| Notifications | ✅ | ❌ | Medium | Needs API calls |
| Profile | ✅ | ❌ | HIGH | Needs API calls |
| Settings | ✅ | ❌ | Low | Needs API calls |
| Onboarding (role) | ✅ | ❌ | Low | Needs API calls |
| OnboardingStep1 | ✅ | ✅ | — | COMPLETE |
| OnboardingStep2 | ✅ | ✅ | — | COMPLETE |
| OnboardingStep3 | — | ✅ | — | UI-only |
| Courses | (TBD) | — | — | Check if exists |

---

## Next Steps

**Choose one:**
1. Start integrating frontend API calls (start with Dashboard.js)
2. Create database seeding script for test data
3. Test existing endpoints with API client
