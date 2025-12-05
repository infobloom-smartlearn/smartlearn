import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ParentDashboard.css';
import { API_URL, getAuthToken } from '../utils/api';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [selectedChild, setSelectedChild] = React.useState(null);
  const [children, setChildren] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [childData, setChildData] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [selectedTeacher, setSelectedTeacher] = React.useState(null);
  const [messageText, setMessageText] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [messageStatus, setMessageStatus] = React.useState('');

  // Mock data - replace with API calls
  React.useEffect(() => {
    // Simulate loading children
    const mockChildren = [
      { id: 'child-1', name: 'Emma Johnson', grade: 'Grade 5', avatar: '👧' },
      { id: 'child-2', name: 'Lucas Johnson', grade: 'Grade 3', avatar: '👦' },
    ];
    setChildren(mockChildren);
    if (mockChildren.length > 0) {
      setSelectedChild(mockChildren[0]);
      loadChildData(mockChildren[0].id);
    }
    setLoading(false);

    // Load notifications
    const mockNotifications = [
      { id: 1, type: 'quiz', message: 'Emma completed a Math quiz', time: '2 hours ago', unread: true },
      { id: 2, type: 'performance', message: 'Lucas needs support in Science', time: '1 day ago', unread: true },
      { id: 3, type: 'message', message: 'New message from Teacher Sarah', time: '2 days ago', unread: false },
    ];
    setNotifications(mockNotifications);
  }, []);

  async function loadChildData(childId) {
    try {
      const token = getAuthToken();
      // TODO: Replace with actual API call
      // const data = await fetch(`${API_URL}/parent/children/${childId}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // }).then(r => r.json());
      
      // Mock data
      const mockData = {
        overallScore: 82,
        quizzesCompleted: 24,
        timeSpent: '18.5 hours',
        subjects: [
          { name: 'Math', score: 88, status: 'good', topics: ['Algebra', 'Geometry'] },
          { name: 'Science', score: 75, status: 'needs-improvement', topics: ['Biology', 'Chemistry'] },
          { name: 'English', score: 90, status: 'good', topics: ['Reading', 'Writing'] },
        ],
        recentQuizzes: [
          { id: 'q1', title: 'Algebra Basics', subject: 'Math', score: 85, date: '2024-01-15', attempts: 1, rank: 5 },
          { id: 'q2', title: 'Photosynthesis', subject: 'Science', score: 70, date: '2024-01-14', attempts: 2, rank: 12 },
          { id: 'q3', title: 'Reading Comprehension', subject: 'English', score: 92, date: '2024-01-13', attempts: 1, rank: 3 },
        ],
        strugglingTopics: ['Photosynthesis', 'Chemical Reactions'],
        activityData: generateActivityHeatmap(),
        progressTrend: [
          { week: 'Week 1', score: 75 },
          { week: 'Week 2', score: 78 },
          { week: 'Week 3', score: 80 },
          { week: 'Week 4', score: 82 },
        ],
        badges: ['Math Master', 'Quiz Champion', 'Consistent Learner'],
        loginFrequency: '5 days this week',
        studyTime: '2.5 hours today',
      };
      setChildData(mockData);
    } catch (err) {
      console.error('Failed to load child data:', err);
    }
  }

  function generateActivityHeatmap() {
    // Generate 7x4 grid (7 days, 4 weeks)
    const data = [];
    for (let week = 0; week < 4; week++) {
      for (let day = 0; day < 7; day++) {
        data.push({
          day: day,
          week: week,
          value: Math.floor(Math.random() * 4), // 0-3 activity level
        });
      }
    }
    return data;
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!selectedTeacher || !messageText.trim()) return;
    
    setSending(true);
    setMessageStatus('');
    
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/parent/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          teacher_id: selectedTeacher.id,
          child_id: selectedChild?.id,
          message: messageText.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Could not send message.');
      }

      setMessageStatus('Message sent successfully.');
      setMessageText('');
      setSelectedTeacher(null);
    } catch (err) {
      setMessageStatus(err.message || 'An error occurred while sending the message.');
    } finally {
      setSending(false);
    }
  }

  function openMessageModal(teacher) {
    setSelectedTeacher(teacher);
    setMessageText('');
    setMessageStatus('');
  }

  function closeMessageModal() {
    setSelectedTeacher(null);
    setMessageText('');
    setMessageStatus('');
  }

  function handleChildSelect(child) {
    setSelectedChild(child);
    loadChildData(child.id);
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
          
          {/* Child Selector */}
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
            <button
              className={`parent-nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="parent-nav-ico">🏠</span>
              <span className="parent-nav-label">Dashboard</span>
            </button>
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
            <button
              className={`parent-nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <span className="parent-nav-ico">🔔</span>
              <span className="parent-nav-label">Notifications</span>
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="parent-nav-badge">{notifications.filter(n => n.unread).length}</span>
              )}
            </button>
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
            <h1>Parent Dashboard</h1>
            <p>
              {selectedChild ? `Monitoring ${selectedChild.name}'s academic progress` : 'Select a child to view their progress'}
            </p>
          </div>
          <div className="parent-header-right">
            <button className="parent-download-btn" onClick={() => {/* TODO: Generate PDF */}}>
              📥 Download Report
            </button>
            <Link to="/parent/profile" className="parent-avatar">
              👨‍👩‍👧
            </Link>
          </div>
        </header>

        {activeTab === 'dashboard' && selectedChild && childData && (
          <section className="parent-content">
            {/* Performance Overview */}
            <div className="parent-card">
              <div className="parent-card-header">
                <div>
                  <div className="parent-card-title">Performance Overview</div>
                  <div className="parent-card-subtitle">
                    {selectedChild.name}'s academic performance summary
                  </div>
                </div>
                <span className="parent-chip">Last 30 days</span>
              </div>
              <div className="parent-stats-row">
                <div className="parent-stat-pill">
                  <div className="parent-stat-label">Overall Score</div>
                  <div className="parent-stat-value">{childData.overallScore}%</div>
                  <div className="parent-stat-caption">Average across all subjects</div>
                </div>
                <div className="parent-stat-pill">
                  <div className="parent-stat-label">Quizzes Completed</div>
                  <div className="parent-stat-value">{childData.quizzesCompleted}</div>
                  <div className="parent-stat-caption">Total quizzes taken</div>
                </div>
                <div className="parent-stat-pill">
                  <div className="parent-stat-label">Study Time</div>
                  <div className="parent-stat-value">{childData.timeSpent}</div>
                  <div className="parent-stat-caption">Time spent learning</div>
                </div>
                <div className="parent-stat-pill">
                  <div className="parent-stat-label">Login Frequency</div>
                  <div className="parent-stat-value">{childData.loginFrequency}</div>
                  <div className="parent-stat-caption">Active days this week</div>
                </div>
              </div>
            </div>

            {/* Subject Performance */}
            <div className="parent-card">
              <div className="parent-card-header">
                <div>
                  <div className="parent-card-title">Subject Performance</div>
                  <div className="parent-card-subtitle">
                    Performance breakdown by subject
                  </div>
                </div>
              </div>
              <div className="parent-subjects-grid">
                {childData.subjects.map((subject) => (
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
                    <div className="parent-subject-topics">
                      <strong>Topics:</strong> {subject.topics.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Quizzes */}
            <div className="parent-card">
              <div className="parent-card-header">
                <div>
                  <div className="parent-card-title">Recent Quiz Results</div>
                  <div className="parent-card-subtitle">
                    Latest quiz performance and rankings
                  </div>
                </div>
                <Link to="/parent/quiz-reports" className="parent-link-btn">
                  View All →
                </Link>
              </div>
              <div className="parent-list">
                {childData.recentQuizzes.map((quiz) => (
                  <div key={quiz.id} className="parent-list-row">
                    <div className="parent-list-main">
                      <div className="parent-list-title">{quiz.title}</div>
                      <div className="parent-list-meta">
                        {quiz.subject} • {quiz.date} • {quiz.attempts} attempt{quiz.attempts > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="parent-list-actions">
                      <div className="parent-quiz-score">{quiz.score}%</div>
                      <span className="parent-list-badge">
                        Rank #{quiz.rank}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Trend */}
            <div className="parent-card">
              <div className="parent-card-header">
                <div>
                  <div className="parent-card-title">Progress Over Time</div>
                  <div className="parent-card-subtitle">
                    Weekly performance trend
                  </div>
                </div>
              </div>
              <div className="parent-progress-chart">
                {childData.progressTrend.map((point, idx) => (
                  <div key={idx} className="parent-chart-bar-container">
                    <div className="parent-chart-bar-wrapper">
                      <div
                        className="parent-chart-bar"
                        style={{ height: `${(point.score / 100) * 200}px` }}
                      />
                    </div>
                    <div className="parent-chart-label">{point.week}</div>
                    <div className="parent-chart-value">{point.score}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Activity Heatmap */}
            <div className="parent-card">
              <div className="parent-card-header">
                <div>
                  <div className="parent-card-title">Study Activity</div>
                  <div className="parent-card-subtitle">
                    Daily activity heatmap (last 4 weeks)
                  </div>
                </div>
              </div>
              <div className="parent-activity-heatmap">
                <div className="parent-heatmap-legend">
                  <span>Less</span>
                  <div className="parent-heatmap-colors">
                    <div className="parent-heatmap-color" style={{ backgroundColor: '#ebedf0' }} />
                    <div className="parent-heatmap-color" style={{ backgroundColor: '#c6e48b' }} />
                    <div className="parent-heatmap-color" style={{ backgroundColor: '#7bc96f' }} />
                    <div className="parent-heatmap-color" style={{ backgroundColor: '#239a3b' }} />
                  </div>
                  <span>More</span>
                </div>
                <div className="parent-heatmap-grid">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="parent-heatmap-day-col">
                      <div className="parent-heatmap-day-label">{day}</div>
                      {childData.activityData
                        .filter(d => d.day === ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day))
                        .map((data, idx) => (
                          <div
                            key={idx}
                            className="parent-heatmap-cell"
                            style={{
                              backgroundColor:
                                data.value === 0 ? '#ebedf0' :
                                data.value === 1 ? '#c6e48b' :
                                data.value === 2 ? '#7bc96f' : '#239a3b',
                            }}
                            title={`${day} Week ${data.week + 1}: ${data.value} hours`}
                          />
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Struggling Topics & AI Recommendations */}
            <div className="parent-grid-2">
              <div className="parent-card">
                <div className="parent-card-header">
                  <div>
                    <div className="parent-card-title">Topics Needing Support</div>
                    <div className="parent-card-subtitle">
                      Areas where {selectedChild.name} may need extra help
                    </div>
                  </div>
                </div>
                <div className="parent-struggling-topics">
                  {childData.strugglingTopics.length > 0 ? (
                    childData.strugglingTopics.map((topic, idx) => (
                      <div key={idx} className="parent-topic-tag red">
                        {topic}
                      </div>
                    ))
                  ) : (
                    <div className="parent-empty">No struggling topics identified. Great job!</div>
                  )}
                </div>
              </div>

              <div className="parent-card">
                <div className="parent-card-header">
                  <div>
                    <div className="parent-card-title">AI Recommendations</div>
                    <div className="parent-card-subtitle">
                      Personalized suggestions for academic support
                    </div>
                  </div>
                </div>
                <div className="parent-ai-recommendations">
                  <div className="parent-ai-item">
                    <span className="parent-ai-icon">💡</span>
                    <div>
                      <strong>Study Pace:</strong> Consider spending 30 more minutes daily on Science topics.
                    </div>
                  </div>
                  <div className="parent-ai-item">
                    <span className="parent-ai-icon">📚</span>
                    <div>
                      <strong>Weak Areas:</strong> Focus on Photosynthesis and Chemical Reactions.
                    </div>
                  </div>
                  <div className="parent-ai-item">
                    <span className="parent-ai-icon">🎯</span>
                    <div>
                      <strong>Recommendation:</strong> Try interactive Science modules to improve engagement.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges & Achievements */}
            <div className="parent-card">
              <div className="parent-card-header">
                <div>
                  <div className="parent-card-title">Badges & Achievements</div>
                  <div className="parent-card-subtitle">
                    Recent accomplishments earned by {selectedChild.name}
                  </div>
                </div>
              </div>
              <div className="parent-badges-list">
                {childData.badges.map((badge, idx) => (
                  <div key={idx} className="parent-badge-item">
                    <span className="parent-badge-icon">🏆</span>
                    <span className="parent-badge-name">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'notifications' && (
          <section className="parent-content">
            <div className="parent-card">
              <div className="parent-card-header">
                <div>
                  <div className="parent-card-title">Notifications</div>
                  <div className="parent-card-subtitle">
                    Alerts and updates about your children's academic progress
                  </div>
                </div>
              </div>
              <div className="parent-list">
                {notifications.length === 0 ? (
                  <div className="parent-empty">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className={`parent-list-row ${notif.unread ? 'unread' : ''}`}>
                      <div className="parent-list-main">
                        <div className="parent-list-title">{notif.message}</div>
                        <div className="parent-list-meta">{notif.time}</div>
                      </div>
                      {notif.unread && <div className="parent-unread-dot" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Message Modal */}
      {selectedTeacher && (
        <div className="parent-message-backdrop" onClick={closeMessageModal}>
          <div
            className="parent-message-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Message {selectedTeacher.name}</h2>
            <p className="parent-message-subtitle">
              Send a message about {selectedChild?.name}'s progress
            </p>
            <form onSubmit={handleSendMessage}>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Hi, I'd like to discuss my child's progress in..."
              />
              {messageStatus && (
                <div className="parent-message-status">{messageStatus}</div>
              )}
              <div className="parent-message-actions">
                <button
                  type="button"
                  className="parent-btn-secondary"
                  onClick={closeMessageModal}
                  disabled={sending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="parent-btn-primary"
                  disabled={sending || !messageText.trim()}
                >
                  {sending ? 'Sending…' : 'Send message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

