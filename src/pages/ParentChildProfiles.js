import React from 'react';
import { Link } from 'react-router-dom';
import './ParentDashboard.css';
import { API_URL, getAuthToken } from '../utils/api';

export default function ParentChildProfiles() {
  const [children, setChildren] = React.useState([]);
  const [selectedChild, setSelectedChild] = React.useState(null);
  const [childDetails, setChildDetails] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Mock data - replace with API calls
    const mockChildren = [
      {
        id: 'child-1',
        name: 'Emma Johnson',
        grade: 'Grade 5',
        avatar: '👧',
        age: 10,
        school: 'Riverside Elementary',
        class: '5A',
      },
      {
        id: 'child-2',
        name: 'Lucas Johnson',
        grade: 'Grade 3',
        avatar: '👦',
        age: 8,
        school: 'Riverside Elementary',
        class: '3B',
      },
    ];
    setChildren(mockChildren);
    if (mockChildren.length > 0) {
      setSelectedChild(mockChildren[0]);
      loadChildDetails(mockChildren[0].id);
    }
    setLoading(false);
  }, []);

  async function loadChildDetails(childId) {
    try {
      const token = getAuthToken();
      // TODO: Replace with actual API call
      // const data = await fetch(`${API_URL}/parent/children/${childId}/details`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // }).then(r => r.json());

      // Mock data
      const mockDetails = {
        overallPerformance: 82,
        attendance: 95,
        subjects: [
          {
            name: 'Math',
            score: 88,
            status: 'good',
            teacher: 'Ms. Sarah Williams',
            recentQuizzes: 8,
            improvement: '+5%',
          },
          {
            name: 'Science',
            score: 75,
            status: 'needs-improvement',
            teacher: 'Mr. David Chen',
            recentQuizzes: 6,
            improvement: '-2%',
          },
          {
            name: 'English',
            score: 90,
            status: 'good',
            teacher: 'Ms. Emily Brown',
            recentQuizzes: 10,
            improvement: '+3%',
          },
          {
            name: 'Social Studies',
            score: 85,
            status: 'good',
            teacher: 'Mr. James Wilson',
            recentQuizzes: 5,
            improvement: '+1%',
          },
        ],
        termlyReports: [
          { term: 'Term 1 2024', overall: 80, date: '2024-03-15' },
          { term: 'Term 2 2024', overall: 82, date: '2024-06-20' },
        ],
        achievements: [
          { title: 'Math Master', description: 'Scored above 85% in 5 consecutive Math quizzes', date: '2024-01-10' },
          { title: 'Quiz Champion', description: 'Completed 20 quizzes this month', date: '2024-01-05' },
          { title: 'Consistent Learner', description: 'Logged in 5 days a week for a month', date: '2023-12-20' },
        ],
        studyHabits: {
          averageTime: '2.5 hours/day',
          favoriteSubject: 'Math',
          leastFavoriteSubject: 'Science',
          studyStreak: '12 days',
        },
      };
      setChildDetails(mockDetails);
    } catch (err) {
      console.error('Failed to load child details:', err);
    }
  }

  function handleChildSelect(child) {
    setSelectedChild(child);
    loadChildDetails(child.id);
  }

  if (loading) {
    return <div className="parent-loading">Loading...</div>;
  }

  return (
    <div className="parent-root">
      <aside className="parent-sidebar">
        <div>
          <Link to="/onboarding" className="parent-logo-block" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="parent-logo-circle">👨‍👩‍👧</div>
            <div className="parent-logo-text">SmartLearn</div>
          </Link>

          <div className="parent-child-selector">
            <div className="parent-child-selector-label">Select Child</div>
            {children.map((child) => (
              <button
                key={child.id}
                className={`parent-child-btn ${selectedChild?.id === child.id ? 'active' : ''}`}
                onClick={() => handleChildSelect(child)}
              >
                <span className="parent-child-avatar">{child.avatar}</span>
                <div className="parent-child-info">
                  <div className="parent-child-name">{child.name}</div>
                  <div className="parent-child-grade">{child.grade}</div>
                </div>
              </button>
            ))}
          </div>

          <nav className="parent-nav-links">
            <Link className="parent-nav-link" to="/parent">
              <span className="parent-nav-ico">🏠</span>
              <span className="parent-nav-label">Dashboard</span>
            </Link>
            <button className="parent-nav-link active">
              <span className="parent-nav-ico">👥</span>
              <span className="parent-nav-label">Child Profiles</span>
            </button>
            <Link className="parent-nav-link" to="/parent/quiz-reports">
              <span className="parent-nav-ico">📊</span>
              <span className="parent-nav-label">Quiz Reports</span>
            </Link>
            <Link className="parent-nav-link" to="/parent/messages">
              <span className="parent-nav-ico">💬</span>
              <span className="parent-nav-label">Messages</span>
            </Link>
            <Link className="parent-nav-link" to="/parent/notifications">
              <span className="parent-nav-ico">🔔</span>
              <span className="parent-nav-label">Notifications</span>
            </Link>
            <Link className="parent-nav-link" to="/parent/settings">
              <span className="parent-nav-ico">⚙️</span>
              <span className="parent-nav-label">Settings</span>
            </Link>
          </nav>
        </div>
      </aside>

      <main className="parent-main">
        <header className="parent-header">
          <div className="parent-title-block">
            <h1>Child Profiles</h1>
            <p>
              {selectedChild ? `Detailed profile for ${selectedChild.name}` : 'Select a child to view their profile'}
            </p>
          </div>
          <div className="parent-header-right">
            <button className="parent-download-btn" onClick={() => {/* TODO: Generate PDF */}}>
              📥 Download Profile
            </button>
            <Link to="/parent/profile" className="parent-avatar">
              👨‍👩‍👧
            </Link>
          </div>
        </header>

        {selectedChild && childDetails && (
          <section className="parent-content">
            {/* Child Info Card */}
            <div className="parent-card">
              <div className="parent-card-header">
                <div>
                  <div className="parent-card-title">Child Information</div>
                  <div className="parent-card-subtitle">Basic information and school details</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{ fontSize: '64px' }}>{selectedChild.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#4c2f96', marginBottom: '8px' }}>
                    {selectedChild.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#8a7bbd', marginBottom: '4px' }}>
                    {selectedChild.grade} • Age {selectedChild.age}
                  </div>
                  <div style={{ fontSize: '14px', color: '#8a7bbd' }}>
                    {selectedChild.school} • Class {selectedChild.class}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#8a7bbd', marginBottom: '4px' }}>Overall Performance</div>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent-purple, #AA33F0)' }}>
                    {childDetails.overallPerformance}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#8a7bbd', marginTop: '4px' }}>
                    Attendance: {childDetails.attendance}%
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Details */}
            <div className="parent-card">
              <div className="parent-card-header">
                <div>
                  <div className="parent-card-title">Subject Performance Details</div>
                  <div className="parent-card-subtitle">Detailed breakdown by subject with teacher information</div>
                </div>
              </div>
              <div className="parent-subjects-grid">
                {childDetails.subjects.map((subject) => (
                  <div key={subject.name} className="parent-subject-card">
                    <div className="parent-subject-header">
                      <div className="parent-subject-name">{subject.name}</div>
                      <span className={`parent-subject-badge ${subject.status}`}>
                        {subject.status === 'good' ? '✓ Good' : subject.status === 'needs-improvement' ? '⚠ Needs Help' : '🔴 At Risk'}
                      </span>
                    </div>
                    <div className="parent-subject-score">{subject.score}%</div>
                    <div className="parent-progress-bar">
                      <div
                        className="parent-progress-fill"
                        style={{ width: `${subject.score}%` }}
                      />
                    </div>
                    <div style={{ fontSize: '12px', color: '#6c4bb6', marginTop: '8px' }}>
                      <div><strong>Teacher:</strong> {subject.teacher}</div>
                      <div style={{ marginTop: '4px' }}>
                        <strong>Recent Quizzes:</strong> {subject.recentQuizzes}
                      </div>
                      <div style={{ marginTop: '4px', color: subject.improvement.startsWith('+') ? '#059669' : '#dc2626' }}>
                        <strong>Change:</strong> {subject.improvement}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Termly Reports */}
            <div className="parent-card">
              <div className="parent-card-header">
                <div>
                  <div className="parent-card-title">Termly Report Cards</div>
                  <div className="parent-card-subtitle">Historical performance reports by term</div>
                </div>
              </div>
              <div className="parent-list">
                {childDetails.termlyReports.map((report, idx) => (
                  <div key={idx} className="parent-list-row">
                    <div className="parent-list-main">
                      <div className="parent-list-title">{report.term}</div>
                      <div className="parent-list-meta">Report Date: {report.date}</div>
                    </div>
                    <div className="parent-list-actions">
                      <div className="parent-quiz-score">{report.overall}%</div>
                      <button className="parent-download-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        📄 View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="parent-card">
              <div className="parent-card-header">
                <div>
                  <div className="parent-card-title">Achievements & Badges</div>
                  <div className="parent-card-subtitle">All accomplishments earned by {selectedChild.name}</div>
                </div>
              </div>
              <div className="parent-list">
                {childDetails.achievements.map((achievement, idx) => (
                  <div key={idx} className="parent-list-row">
                    <div className="parent-list-main" style={{ flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '24px' }}>🏆</span>
                      <div>
                        <div className="parent-list-title">{achievement.title}</div>
                        <div className="parent-list-meta">{achievement.description}</div>
                        <div style={{ fontSize: '11px', color: '#9c8fc6', marginTop: '2px' }}>
                          Earned: {achievement.date}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Habits */}
            <div className="parent-grid-2">
              <div className="parent-card">
                <div className="parent-card-header">
                  <div>
                    <div className="parent-card-title">Study Habits</div>
                    <div className="parent-card-subtitle">Learning patterns and preferences</div>
                  </div>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#8a7bbd', marginBottom: '4px' }}>Average Study Time</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#4c2f96' }}>
                      {childDetails.studyHabits.averageTime}
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#8a7bbd', marginBottom: '4px' }}>Current Streak</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#4c2f96' }}>
                      {childDetails.studyHabits.studyStreak}
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#8a7bbd', marginBottom: '4px' }}>Favorite Subject</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#4c2f96' }}>
                      {childDetails.studyHabits.favoriteSubject}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#8a7bbd', marginBottom: '4px' }}>Needs Support In</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#dc2626' }}>
                      {childDetails.studyHabits.leastFavoriteSubject}
                    </div>
                  </div>
                </div>
              </div>

              <div className="parent-card">
                <div className="parent-card-header">
                  <div>
                    <div className="parent-card-title">Quick Actions</div>
                    <div className="parent-card-subtitle">Common tasks and shortcuts</div>
                  </div>
                </div>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link to="/parent/quiz-reports" className="parent-link-btn" style={{ padding: '12px', background: '#faf7ff', borderRadius: '10px', textAlign: 'center' }}>
                    View All Quiz Reports →
                  </Link>
                  <Link to="/parent/messages" className="parent-link-btn" style={{ padding: '12px', background: '#faf7ff', borderRadius: '10px', textAlign: 'center' }}>
                    Message Teachers →
                  </Link>
                  <button
                    className="parent-download-btn"
                    style={{ width: '100%', padding: '12px' }}
                    onClick={() => {/* TODO: Generate PDF */}}
                  >
                    📥 Download Full Report
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

