import React from 'react';
import { Link } from 'react-router-dom';
import './TeacherProfile.css';

export default function TeacherProfile() {
  // In a real app, this data should come from the backend,
  // and Save would call an API endpoint to persist changes.
  const [teacher, setTeacher] = React.useState({
    name: 'Mr. Johnson',
    subject: 'Mathematics',
    email: 'mr.johnson@example.com',
    school: 'SmartLearn Academy',
    experienceYears: 7,
    classes: 4,
    students: 120,
  });
  const [saving, setSaving] = React.useState(false);
  const [status, setStatus] = React.useState('');

  function handleChange(field, value) {
    setTeacher((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSave() {
    // Placeholder save handler – replace with real API call.
    setSaving(true);
    setStatus('');
    setTimeout(() => {
      setSaving(false);
      setStatus('Profile updated (demo). Connect this button to your backend API to persist changes.');
    }, 600);
  }

  return (
    <div className="teacher-profile-root">
      <aside className="teacher-profile-sidebar">
        <div>
          <div className="teacher-profile-logo-block">
            <div className="teacher-profile-logo-circle">👩‍🏫</div>
            <div className="teacher-profile-logo-text">SmartLearn</div>
          </div>
          <nav className="teacher-profile-nav">
            <Link className="teacher-profile-link" to="/teacher">
              <span>🏠</span>
              <span>Dashboard</span>
            </Link>
            <Link className="teacher-profile-link" to="/teacher/lessons">
              <span>📄</span>
              <span>Lesson Notes</span>
            </Link>
            <Link className="teacher-profile-link" to="/teacher/courses">
              <span>📚</span>
              <span>Courses</span>
            </Link>
            <Link className="teacher-profile-link" to="/teacher/analytics">
              <span>📊</span>
              <span>Analytics</span>
            </Link>
            <Link className="teacher-profile-link active" to="/teacher/profile">
              <span>👤</span>
              <span>Profile</span>
            </Link>
          </nav>
        </div>
      </aside>

      <main className="teacher-profile-main">
        <header className="teacher-profile-header">
          <div className="teacher-profile-header-title">
            <h1>Teacher Profile</h1>
            <p>Manage your professional details and teaching overview.</p>
          </div>
          <div className="teacher-profile-header-actions">
            <div className="teacher-profile-avatar">👩‍🏫</div>
            <button
              className="teacher-profile-save"
              type="button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </header>

        {status && (
          <div className="teacher-profile-status-banner">
            {status}
          </div>
        )}

        <section className="teacher-profile-grid">
          <article className="teacher-profile-card">
            <h2>Basic Information</h2>
            <div className="teacher-profile-row">
              <div className="teacher-profile-avatar-large">👩‍🏫</div>
              <div className="teacher-profile-fields">
                <div>
                  <div className="teacher-profile-field-label">Full name</div>
                  <input
                    className="teacher-profile-input"
                    type="text"
                    value={teacher.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <div className="teacher-profile-field-label">Primary subject</div>
                  <input
                    className="teacher-profile-input"
                    type="text"
                    value={teacher.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="teacher-profile-meta-row">
              <div className="teacher-profile-meta-item">
                <strong>Email</strong>
                <input
                  className="teacher-profile-input"
                  type="email"
                  value={teacher.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
              <div className="teacher-profile-meta-item">
                <strong>School / Institution</strong>
                <input
                  className="teacher-profile-input"
                  type="text"
                  value={teacher.school}
                  onChange={(e) => handleChange('school', e.target.value)}
                />
              </div>
            </div>

            <div className="teacher-profile-meta-row">
              <div className="teacher-profile-meta-item">
                <strong>Years of experience</strong>
                <input
                  className="teacher-profile-input small"
                  type="number"
                  min="0"
                  value={teacher.experienceYears}
                  onChange={(e) => handleChange('experienceYears', Number(e.target.value) || 0)}
                />{' '}
                years
              </div>
              <div className="teacher-profile-meta-item">
                <strong>Classes you teach</strong>
                <input
                  className="teacher-profile-input small"
                  type="number"
                  min="0"
                  value={teacher.classes}
                  onChange={(e) => handleChange('classes', Number(e.target.value) || 0)}
                />{' '}
                active classes
              </div>
            </div>
          </article>

          <article className="teacher-profile-secondary-card">
            <h3>Teaching Snapshot</h3>
            <div className="teacher-profile-stats">
              <div className="teacher-profile-stat-pill">
                <div className="teacher-profile-stat-label">Total students</div>
                <div className="teacher-profile-stat-value">{teacher.students}</div>
              </div>
              <div className="teacher-profile-stat-pill">
                <div className="teacher-profile-stat-label">Classes</div>
                <div className="teacher-profile-stat-value">{teacher.classes}</div>
              </div>
            </div>

            <h3 style={{ marginTop: 16 }}>Focus Areas</h3>
            <div className="teacher-profile-list">
              <div className="teacher-profile-list-item">• Strengthening foundational algebra skills</div>
              <div className="teacher-profile-list-item">• Preparing students for standardized math tests</div>
              <div className="teacher-profile-list-item">• Supporting struggling learners with targeted practice</div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}


