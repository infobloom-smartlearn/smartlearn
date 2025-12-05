import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './ParentDashboard.css';
import { API_URL, getAuthToken } from '../utils/api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ParentProfile() {
  const q = useQuery();
  const showSuccess = q.get('success') === '1';
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parentData, setParentData] = useState(null);

  React.useEffect(() => {
    // Mock data - replace with API calls
    const mockChildren = [
      { id: 'child-1', name: 'Emma Johnson', grade: 'Grade 5', avatar: '👧', overallScore: 82 },
      { id: 'child-2', name: 'Lucas Johnson', grade: 'Grade 3', avatar: '👦', overallScore: 78 },
    ];
    setChildren(mockChildren);

    const mockParentData = {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2023-09-15',
      totalChildren: 2,
      totalQuizzesMonitored: 48,
      messagesWithTeachers: 12,
      reportsDownloaded: 8,
      activeDays: 45,
    };
    setParentData(mockParentData);
    setLoading(false);
  }, []);

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

          <nav className="parent-nav-links">
            <Link className="parent-nav-link" to="/parent">
              <span className="parent-nav-ico">🏠</span>
              <span className="parent-nav-label">Dashboard</span>
            </Link>
            <Link className="parent-nav-link" to="/parent/profiles">
              <span className="parent-nav-ico">👥</span>
              <span className="parent-nav-label">Child Profiles</span>
            </Link>
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
            <h1>Parent Profile</h1>
            <p>Your account information and activity overview</p>
          </div>
          <div className="parent-header-right">
            <button
              className="parent-download-btn"
              onClick={() => navigate('/parent/profile?success=1')}
            >
              💾 Save Changes
            </button>
            <Link to="/parent/profile" className="parent-avatar">
              👨‍👩‍👧
            </Link>
          </div>
        </header>

        {showSuccess && (
          <div
            style={{
              background: '#d1fae5',
              color: '#065f46',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>✅</span>
            <span>Account information updated successfully</span>
          </div>
        )}

        <section className="parent-content">
          {/* Profile Information */}
          <div className="parent-card">
            <div className="parent-card-header">
              <div>
                <div className="parent-card-title">Profile Information</div>
                <div className="parent-card-subtitle">Your personal account details</div>
              </div>
              <button
                className="parent-download-btn"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => {/* TODO: Open edit modal */}}
              >
                ✏️ Edit
              </button>
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginTop: '16px' }}>
              <div style={{ fontSize: '64px' }}>👨‍👩‍👧</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#4c2f96', marginBottom: '8px' }}>
                  {parentData?.name}
                </div>
                <div style={{ fontSize: '14px', color: '#8a7bbd', marginBottom: '4px' }}>
                  📧 {parentData?.email}
                </div>
                <div style={{ fontSize: '14px', color: '#8a7bbd', marginBottom: '4px' }}>
                  📱 {parentData?.phone}
                </div>
                <div style={{ fontSize: '12px', color: '#9c8fc6', marginTop: '8px' }}>
                  Member since {new Date(parentData?.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="parent-card">
            <div className="parent-card-header">
              <div>
                <div className="parent-card-title">Activity Overview</div>
                <div className="parent-card-subtitle">Your engagement with SmartLearn</div>
              </div>
            </div>
            <div className="parent-stats-row">
              <div className="parent-stat-pill">
                <div className="parent-stat-label">Linked Children</div>
                <div className="parent-stat-value">{parentData?.totalChildren}</div>
                <div className="parent-stat-caption">Children on SmartLearn</div>
              </div>
              <div className="parent-stat-pill">
                <div className="parent-stat-label">Quizzes Monitored</div>
                <div className="parent-stat-value">{parentData?.totalQuizzesMonitored}</div>
                <div className="parent-stat-caption">Total quizzes reviewed</div>
              </div>
              <div className="parent-stat-pill">
                <div className="parent-stat-label">Teacher Messages</div>
                <div className="parent-stat-value">{parentData?.messagesWithTeachers}</div>
                <div className="parent-stat-caption">Conversations with teachers</div>
              </div>
              <div className="parent-stat-pill">
                <div className="parent-stat-label">Active Days</div>
                <div className="parent-stat-value">{parentData?.activeDays}</div>
                <div className="parent-stat-caption">Days logged in this month</div>
              </div>
            </div>
          </div>

          {/* Linked Children */}
          <div className="parent-card">
            <div className="parent-card-header">
              <div>
                <div className="parent-card-title">Linked Children</div>
                <div className="parent-card-subtitle">Children connected to your parent account</div>
              </div>
              <Link to="/parent/profiles" className="parent-link-btn">
                Manage →
              </Link>
            </div>
            <div className="parent-list">
              {children.map((child) => (
                <Link
                  key={child.id}
                  to={`/parent/profiles`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="parent-list-row" style={{ cursor: 'pointer' }}>
                    <div className="parent-list-main" style={{ flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                      <span className="parent-child-avatar" style={{ fontSize: '32px' }}>{child.avatar}</span>
                      <div>
                        <div className="parent-list-title">{child.name}</div>
                        <div className="parent-list-meta">{child.grade}</div>
                      </div>
                    </div>
                    <div className="parent-list-actions">
                      <div className="parent-quiz-score">{child.overallScore}%</div>
                      <span className="parent-list-badge">View Profile</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="parent-grid-2">
            <div className="parent-card">
              <div className="parent-card-header">
                <div>
                  <div className="parent-card-title">Quick Actions</div>
                  <div className="parent-card-subtitle">Common tasks and shortcuts</div>
                </div>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/parent/quiz-reports" className="parent-link-btn" style={{ padding: '12px', background: '#faf7ff', borderRadius: '10px', textAlign: 'center' }}>
                  📊 View Quiz Reports
                </Link>
                <Link to="/parent/messages" className="parent-link-btn" style={{ padding: '12px', background: '#faf7ff', borderRadius: '10px', textAlign: 'center' }}>
                  💬 Message Teachers
                </Link>
                <Link to="/parent/settings" className="parent-link-btn" style={{ padding: '12px', background: '#faf7ff', borderRadius: '10px', textAlign: 'center' }}>
                  ⚙️ Account Settings
                </Link>
              </div>
            </div>

            <div className="parent-card">
              <div className="parent-card-header">
                <div>
                  <div className="parent-card-title">Account Security</div>
                  <div className="parent-card-subtitle">Manage your account security</div>
                </div>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="parent-list-row">
                  <div className="parent-list-main">
                    <div className="parent-list-title">Password</div>
                    <div className="parent-list-meta">Last changed 30 days ago</div>
                  </div>
                  <button
                    className="parent-download-btn"
                    style={{ padding: '6px 12px', fontSize: '12px', background: '#f3f4f6', color: '#374151' }}
                    onClick={() => navigate('/parent/settings')}
                  >
                    Change
                  </button>
                </div>
                <div className="parent-list-row">
                  <div className="parent-list-main">
                    <div className="parent-list-title">Two-Factor Authentication</div>
                    <div className="parent-list-meta">Add an extra layer of security</div>
                  </div>
                  <button
                    className="parent-download-btn"
                    style={{ padding: '6px 12px', fontSize: '12px', background: '#f3f4f6', color: '#374151' }}
                    onClick={() => navigate('/parent/settings')}
                  >
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="parent-card">
            <div className="parent-card-header">
              <div>
                <div className="parent-card-title">Recent Activity</div>
                <div className="parent-card-subtitle">Your recent actions on SmartLearn</div>
              </div>
            </div>
            <div className="parent-list">
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Downloaded Emma's Performance Report</div>
                  <div className="parent-list-meta">2 days ago</div>
                </div>
              </div>
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Sent message to Ms. Sarah Williams</div>
                  <div className="parent-list-meta">3 days ago</div>
                </div>
              </div>
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Viewed Lucas's Quiz Report</div>
                  <div className="parent-list-meta">5 days ago</div>
                </div>
              </div>
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Updated notification preferences</div>
                  <div className="parent-list-meta">1 week ago</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

