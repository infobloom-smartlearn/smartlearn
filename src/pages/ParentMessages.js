import React from 'react';
import { Link } from 'react-router-dom';
import './ParentDashboard.css';
import { API_URL, getAuthToken } from '../utils/api';

export default function ParentMessages() {
  const [children, setChildren] = React.useState([]);
  const [selectedChild, setSelectedChild] = React.useState(null);
  const [teachers, setTeachers] = React.useState([]);
  const [selectedTeacher, setSelectedTeacher] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [messageText, setMessageText] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [messageStatus, setMessageStatus] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Mock data
    const mockChildren = [
      { id: 'child-1', name: 'Emma Johnson', grade: 'Grade 5', avatar: '👧' },
      { id: 'child-2', name: 'Lucas Johnson', grade: 'Grade 3', avatar: '👦' },
    ];
    setChildren(mockChildren);
    if (mockChildren.length > 0) {
      setSelectedChild(mockChildren[0]);
      loadTeachersAndMessages(mockChildren[0].id);
    }
    setLoading(false);
  }, []);

  async function loadTeachersAndMessages(childId) {
    try {
      const token = getAuthToken();
      // TODO: Replace with actual API calls
      // const [teachersData, messagesData] = await Promise.all([
      //   fetch(`${API_URL}/parent/children/${childId}/teachers`, {
      //     headers: { Authorization: `Bearer ${token}` }
      // }).then(r => r.json()),
      //   fetch(`${API_URL}/parent/messages`, {
      //     headers: { Authorization: `Bearer ${token}` }
      // }).then(r => r.json())
      // ]);

      // Mock data
      const mockTeachers = [
        { id: 't1', name: 'Ms. Sarah Williams', subject: 'Math', avatar: '👩‍🏫' },
        { id: 't2', name: 'Mr. David Chen', subject: 'Science', avatar: '👨‍🏫' },
        { id: 't3', name: 'Ms. Emily Brown', subject: 'English', avatar: '👩‍🏫' },
        { id: 't4', name: 'Mr. James Wilson', subject: 'Social Studies', avatar: '👨‍🏫' },
      ];

      // Find child name for messages
      const childName = selectedChild?.name || 'your child';
      
      const mockMessages = [
        {
          id: 'm1',
          teacher: mockTeachers[0],
          childName: childName,
          subject: 'Great progress in Math!',
          message: `Hi! I wanted to let you know that ${childName} has been doing exceptionally well in our recent algebra lessons. Their quiz scores have improved significantly.`,
          date: '2024-01-15',
          time: '10:30 AM',
          unread: false,
          direction: 'received',
        },
        {
          id: 'm2',
          teacher: mockTeachers[1],
          childName: childName,
          subject: 'Science Support Needed',
          message: `I noticed ${childName} is struggling with photosynthesis concepts. Would you like to schedule a brief discussion about how we can support their learning at home?`,
          date: '2024-01-14',
          time: '2:15 PM',
          unread: true,
          direction: 'received',
        },
        {
          id: 'm3',
          teacher: mockTeachers[0],
          childName: childName,
          subject: 'Re: Science Support Needed',
          message: `Thank you for reaching out. I'd appreciate any suggestions on how to help ${childName} with photosynthesis at home.`,
          date: '2024-01-14',
          time: '4:45 PM',
          unread: false,
          direction: 'sent',
        },
      ];

      setTeachers(mockTeachers);
      setMessages(mockMessages);
    } catch (err) {
      console.error('Failed to load teachers and messages:', err);
    }
  }

  function handleChildSelect(child) {
    setSelectedChild(child);
    loadTeachersAndMessages(child.id);
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

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!selectedTeacher || !messageText.trim() || !selectedChild) return;

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
          child_id: selectedChild.id,
          message: messageText.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Could not send message.');
      }

      setMessageStatus('Message sent successfully.');
      setMessageText('');
      setSelectedTeacher(null);
      
      // Reload messages
      loadTeachersAndMessages(selectedChild.id);
    } catch (err) {
      setMessageStatus(err.message || 'An error occurred while sending the message.');
    } finally {
      setSending(false);
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
            <Link className="parent-nav-link" to="/parent/profiles">
              <span className="parent-nav-ico">👥</span>
              <span className="parent-nav-label">Child Profiles</span>
            </Link>
            <Link className="parent-nav-link" to="/parent/quiz-reports">
              <span className="parent-nav-ico">📊</span>
              <span className="parent-nav-label">Quiz Reports</span>
            </Link>
            <button className="parent-nav-link active">
              <span className="parent-nav-ico">💬</span>
              <span className="parent-nav-label">Messages</span>
              {messages.filter(m => m.unread).length > 0 && (
                <span className="parent-nav-badge">{messages.filter(m => m.unread).length}</span>
              )}
            </button>
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
            <h1>Messages</h1>
            <p>
              {selectedChild ? `Communicate with teachers about ${selectedChild.name}'s progress` : 'Select a child to view messages'}
            </p>
          </div>
          <div className="parent-header-right">
            <Link to="/parent/profile" className="parent-avatar">
              👨‍👩‍👧
            </Link>
          </div>
        </header>

        {selectedChild && (
          <section className="parent-content">
            <div className="parent-grid-2">
              {/* Teachers List */}
              <div className="parent-card">
                <div className="parent-card-header">
                  <div>
                    <div className="parent-card-title">Teachers</div>
                    <div className="parent-card-subtitle">
                      Contact {selectedChild.name}'s teachers
                    </div>
                  </div>
                </div>
                <div className="parent-list">
                  {teachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="parent-list-row"
                      style={{ cursor: 'pointer' }}
                      onClick={() => openMessageModal(teacher)}
                    >
                      <div className="parent-list-main" style={{ flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px' }}>{teacher.avatar}</span>
                        <div>
                          <div className="parent-list-title">{teacher.name}</div>
                          <div className="parent-list-meta">{teacher.subject}</div>
                        </div>
                      </div>
                      <button
                        className="parent-message-btn"
                        style={{
                          borderRadius: '999px',
                          border: 'none',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          background: '#eef2ff',
                          color: '#4c2f96',
                        }}
                      >
                        Message
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Messages List */}
              <div className="parent-card">
                <div className="parent-card-header">
                  <div>
                    <div className="parent-card-title">Recent Messages</div>
                    <div className="parent-card-subtitle">
                      Conversation history with teachers
                    </div>
                  </div>
                </div>
                <div className="parent-list">
                  {messages.length === 0 ? (
                    <div className="parent-empty">No messages yet</div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`parent-list-row ${msg.unread ? 'unread' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => openMessageModal(msg.teacher)}
                      >
                        <div className="parent-list-main">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '18px' }}>{msg.teacher.avatar}</span>
                            <div className="parent-list-title">{msg.teacher.name}</div>
                            {msg.unread && <div className="parent-unread-dot" />}
                          </div>
                          <div className="parent-list-title" style={{ fontSize: '13px', marginBottom: '2px' }}>
                            {msg.subject}
                          </div>
                          <div className="parent-list-meta" style={{ fontSize: '11px' }}>
                            {msg.message.substring(0, 60)}...
                          </div>
                          <div style={{ fontSize: '10px', color: '#9c8fc6', marginTop: '4px' }}>
                            {msg.date} • {msg.time} • {msg.direction === 'sent' ? 'Sent' : 'Received'}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* AI Tips */}
            <div className="parent-card">
              <div className="parent-card-header">
                <div>
                  <div className="parent-card-title">AI Communication Tips</div>
                  <div className="parent-card-subtitle">
                    Suggestions for effective communication with teachers
                  </div>
                </div>
              </div>
              <div className="parent-ai-recommendations">
                <div className="parent-ai-item">
                  <span className="parent-ai-icon">💡</span>
                  <div>
                    <strong>Be Specific:</strong> When asking about your child's progress, mention specific subjects or topics you're concerned about.
                  </div>
                </div>
                <div className="parent-ai-item">
                  <span className="parent-ai-icon">📅</span>
                  <div>
                    <strong>Schedule Meetings:</strong> For complex discussions, consider requesting a virtual meeting through the platform.
                  </div>
                </div>
                <div className="parent-ai-item">
                  <span className="parent-ai-icon">🤝</span>
                  <div>
                    <strong>Collaborative Approach:</strong> Ask teachers how you can support your child's learning at home.
                  </div>
                </div>
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
              Send a message about {selectedChild?.name}'s progress in {selectedTeacher.subject}
            </p>
            <form onSubmit={handleSendMessage}>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Hi ${selectedTeacher.name.split(' ')[0]}, I'd like to discuss ${selectedChild?.name}'s progress in ${selectedTeacher.subject}...`}
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

