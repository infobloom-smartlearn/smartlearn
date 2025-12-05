import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ParentDashboard.css';
import { API_URL, getAuthToken } from '../utils/api';

export default function ParentSettings() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [quizAlerts, setQuizAlerts] = useState(true);
  const [performanceAlerts, setPerformanceAlerts] = useState(true);
  const [teacherMessages, setTeacherMessages] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [reportFrequency, setReportFrequency] = useState('weekly');
  const [children, setChildren] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Mock data - replace with API call
    const mockChildren = [
      { id: 'child-1', name: 'Emma Johnson', grade: 'Grade 5', avatar: '👧' },
      { id: 'child-2', name: 'Lucas Johnson', grade: 'Grade 3', avatar: '👦' },
    ];
    setChildren(mockChildren);
    setLoading(false);
  }, []);

  async function handleSaveSettings() {
    try {
      const token = getAuthToken();
      // TODO: Replace with actual API call
      // await fetch(`${API_URL}/parent/settings`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
      //   },
      //   body: JSON.stringify({
      //     email_notifications: emailNotif,
      //     push_notifications: pushNotif,
      //     quiz_alerts: quizAlerts,
      //     performance_alerts: performanceAlerts,
      //     teacher_messages: teacherMessages,
      //     weekly_reports: weeklyReports,
      //     dark_mode: darkMode,
      //     language: language,
      //     report_frequency: reportFrequency,
      //   }),
      // });
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings. Please try again.');
    }
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
            <button className="parent-nav-link active">
              <span className="parent-nav-ico">⚙️</span>
              <span className="parent-nav-label">Settings</span>
            </button>
          </nav>
        </div>
      </aside>

      <main className="parent-main">
        <header className="parent-header">
          <div className="parent-title-block">
            <h1>Settings</h1>
            <p>Manage your account, notification preferences, and children's privacy settings</p>
          </div>
          <div className="parent-header-right">
            <button className="parent-download-btn" onClick={handleSaveSettings}>
              💾 Save Changes
            </button>
            <Link to="/parent/profile" className="parent-avatar">
              👨‍👩‍👧
            </Link>
          </div>
        </header>

        <section className="parent-content">
          {/* Account Settings */}
          <div className="parent-card">
            <div className="parent-card-header">
              <div>
                <div className="parent-card-title">Account Settings</div>
                <div className="parent-card-subtitle">Manage your parent account information</div>
              </div>
            </div>
            <div className="parent-list">
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Email Address</div>
                  <div className="parent-list-meta">parent@example.com</div>
                </div>
                <button className="parent-download-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  Change Email
                </button>
              </div>
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Password</div>
                  <div className="parent-list-meta">Last changed 30 days ago</div>
                </div>
                <button className="parent-download-btn" style={{ padding: '6px 12px', fontSize: '12px', background: '#f3f4f6', color: '#374151' }}>
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Children Management */}
          <div className="parent-card">
            <div className="parent-card-header">
              <div>
                <div className="parent-card-title">Manage Children</div>
                <div className="parent-card-subtitle">View and manage your children's accounts</div>
              </div>
            </div>
            <div className="parent-list">
              {children.map((child) => (
                <div key={child.id} className="parent-list-row">
                  <div className="parent-list-main" style={{ flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                    <span className="parent-child-avatar" style={{ fontSize: '24px' }}>{child.avatar}</span>
                    <div>
                      <div className="parent-list-title">{child.name}</div>
                      <div className="parent-list-meta">{child.grade}</div>
                    </div>
                  </div>
                  <div className="parent-list-actions">
                    <button className="parent-download-btn" style={{ padding: '6px 12px', fontSize: '12px', background: '#f3f4f6', color: '#374151' }}>
                      View Profile
                    </button>
                    <button className="parent-download-btn" style={{ padding: '6px 12px', fontSize: '12px', background: '#f3f4f6', color: '#374151' }}>
                      Privacy Settings
                    </button>
                  </div>
                </div>
              ))}
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Add Another Child</div>
                  <div className="parent-list-meta">Link a new child's account to your parent account</div>
                </div>
                <button className="parent-download-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  + Add Child
                </button>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="parent-card">
            <div className="parent-card-header">
              <div>
                <div className="parent-card-title">Notification Preferences</div>
                <div className="parent-card-subtitle">Control how and when you receive updates about your children</div>
              </div>
            </div>
            <div className="parent-list">
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Email Notifications</div>
                  <div className="parent-list-meta">Receive updates via email</div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={emailNotif}
                    onChange={(e) => setEmailNotif(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </label>
              </div>
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Push Notifications</div>
                  <div className="parent-list-meta">Receive instant alerts on your device</div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={pushNotif}
                    onChange={(e) => setPushNotif(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </label>
              </div>
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Quiz Completion Alerts</div>
                  <div className="parent-list-meta">Get notified when your children complete quizzes</div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={quizAlerts}
                    onChange={(e) => setQuizAlerts(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </label>
              </div>
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Performance Alerts</div>
                  <div className="parent-list-meta">Alert when performance drops or improvements occur</div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={performanceAlerts}
                    onChange={(e) => setPerformanceAlerts(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </label>
              </div>
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Teacher Messages</div>
                  <div className="parent-list-meta">Notify when teachers send messages</div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={teacherMessages}
                    onChange={(e) => setTeacherMessages(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Report Preferences */}
          <div className="parent-card">
            <div className="parent-card-header">
              <div>
                <div className="parent-card-title">Report Preferences</div>
                <div className="parent-card-subtitle">Configure how often you receive performance reports</div>
              </div>
            </div>
            <div className="parent-list">
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Weekly Reports</div>
                  <div className="parent-list-meta">Receive a summary report every week</div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={weeklyReports}
                    onChange={(e) => setWeeklyReports(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </label>
              </div>
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Report Frequency</div>
                  <div className="parent-list-meta">How often to receive detailed performance reports</div>
                </div>
                <select
                  value={reportFrequency}
                  onChange={(e) => setReportFrequency(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px',
                    color: '#4c2f96',
                    background: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="parent-card">
            <div className="parent-card-header">
              <div>
                <div className="parent-card-title">Communication Preferences</div>
                <div className="parent-card-subtitle">How you prefer to communicate with teachers</div>
              </div>
            </div>
            <div className="parent-list">
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Preferred Contact Method</div>
                  <div className="parent-list-meta">How teachers should reach you</div>
                </div>
                <select
                  defaultValue="in-app"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px',
                    color: '#4c2f96',
                    background: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <option value="in-app">In-App Messages</option>
                  <option value="email">Email</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Meeting Reminders</div>
                  <div className="parent-list-meta">Get reminders for scheduled parent-teacher meetings</div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="parent-grid-2">
            <div className="parent-card">
              <div className="parent-card-header">
                <div>
                  <div className="parent-card-title">Appearance</div>
                  <div className="parent-card-subtitle">Control app theme and display</div>
                </div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <div className="parent-list-row">
                  <div className="parent-list-main">
                    <div className="parent-list-title">Dark Mode</div>
                    <div className="parent-list-meta">Switch to dark theme</div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="parent-card">
              <div className="parent-card-header">
                <div>
                  <div className="parent-card-title">Language</div>
                  <div className="parent-card-subtitle">Select your preferred language</div>
                </div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px',
                    color: '#4c2f96',
                    background: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>Portuguese</option>
                  <option>German</option>
                  <option>Chinese</option>
                </select>
              </div>
            </div>
          </div>

          {/* Children's Privacy Settings */}
          <div className="parent-card">
            <div className="parent-card-header">
              <div>
                <div className="parent-card-title">Children's Privacy Settings</div>
                <div className="parent-card-subtitle">Control data sharing and privacy for your children</div>
              </div>
            </div>
            <div className="parent-list">
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Data Sharing with Teachers</div>
                  <div className="parent-list-meta">Allow teachers to view your children's performance data</div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </label>
              </div>
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Analytics & Insights</div>
                  <div className="parent-list-meta">Allow SmartLearn to use data for AI insights and recommendations</div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </label>
              </div>
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title">Download Children's Data</div>
                  <div className="parent-list-meta">Request a copy of all data associated with your children</div>
                </div>
                <button className="parent-download-btn" style={{ padding: '6px 12px', fontSize: '12px', background: '#f3f4f6', color: '#374151' }}>
                  Request Data
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="parent-card" style={{ border: '2px solid #fee2e2', background: '#fef2f2' }}>
            <div className="parent-card-header">
              <div>
                <div className="parent-card-title" style={{ color: '#991b1b' }}>Danger Zone</div>
                <div className="parent-card-subtitle" style={{ color: '#b91c1c' }}>
                  Irreversible actions. Please proceed with caution.
                </div>
              </div>
            </div>
            <div className="parent-list">
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title" style={{ color: '#991b1b' }}>Remove Child Account</div>
                  <div className="parent-list-meta" style={{ color: '#b91c1b' }}>
                    Unlink a child's account from your parent account
                  </div>
                </div>
                <button
                  className="parent-download-btn"
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    background: '#fee2e2',
                    color: '#991b1b',
                    border: '1px solid #fecaca',
                  }}
                >
                  Remove Child
                </button>
              </div>
              <div className="parent-list-row">
                <div className="parent-list-main">
                  <div className="parent-list-title" style={{ color: '#991b1b' }}>Delete Parent Account</div>
                  <div className="parent-list-meta" style={{ color: '#b91c1b' }}>
                    Permanently delete your parent account and all associated data
                  </div>
                </div>
                <button
                  className="parent-download-btn"
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    background: '#dc2626',
                    color: '#fff',
                    border: 'none',
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

