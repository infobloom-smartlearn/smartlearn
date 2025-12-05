import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaChalkboardTeacher, 
  FaBook, 
  FaChartBar, 
  FaHome, 
  FaFileAlt, 
  FaCog,
  FaPlus
} from 'react-icons/fa';
import './TeacherDashboard.css';
import { API_URL, getAuthToken } from '../utils/api';

export default function TeacherDashboard() {
  // Local state for messaging struggling students
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [messageText, setMessageText] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [messageStatus, setMessageStatus] = React.useState('');
  
  // Local state for parent messages
  const [parentMessages, setParentMessages] = React.useState([]);
  const [selectedParentMessage, setSelectedParentMessage] = React.useState(null);
  const [replyText, setReplyText] = React.useState('');
  const [replying, setReplying] = React.useState(false);
  const [replyStatus, setReplyStatus] = React.useState('');

  // Placeholder stats – replace with real data from backend teacher analytics
  const quickStats = [
    {
      label: 'Active Students',
      value: '32',
      caption: 'Students who took a quiz in the last 7 days',
    },
    {
      label: 'Lessons Uploaded',
      value: '18',
      caption: 'Total lesson notes shared with your classes',
    },
    {
      label: 'Avg Quiz Score',
      value: '78%',
      caption: 'Average score across all recent quizzes',
    },
  ];

  const atRiskStudents = [
    // In a real app, each student would have a stable ID from the backend
    { id: 'stu-1', name: 'John Doe', subject: 'Math', topic: 'Algebra', status: 'Struggling' },
    { id: 'stu-2', name: 'Mary Ann', subject: 'Science', topic: 'Photosynthesis', status: 'Struggling' },
  ];

  const recentUploads = [
    { title: 'Algebra – Linear Equations', subject: 'Math', type: 'Lesson Note' },
    { title: 'Plant Biology – Photosynthesis', subject: 'Science', type: 'Course Module' },
  ];

  // Load parent messages on component mount
  React.useEffect(() => {
    loadParentMessages();
  }, []);

  async function loadParentMessages() {
    try {
      const token = getAuthToken();
      // TODO: Replace with actual API call
      // const res = await fetch(`${API_URL}/teacher/parent-messages`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await res.json();
      // setParentMessages(data);

      // Mock data
      const mockMessages = [
        {
          id: 'msg-1',
          parentName: 'Sarah Johnson',
          childName: 'Emma Johnson',
          childGrade: 'Grade 5',
          subject: 'Math',
          message: 'Hi Ms. Williams, I wanted to check in about Emma\'s progress in Math. She mentioned struggling with the recent algebra quiz. Could we schedule a brief discussion?',
          date: '2024-01-15',
          time: '10:30 AM',
          unread: true,
          parentId: 'parent-1',
        },
        {
          id: 'msg-2',
          parentName: 'Michael Chen',
          childName: 'David Chen',
          childGrade: 'Grade 4',
          subject: 'Science',
          message: 'Thank you for the update on David\'s science project. He\'s very excited about it!',
          date: '2024-01-14',
          time: '2:15 PM',
          unread: false,
          parentId: 'parent-2',
        },
        {
          id: 'msg-3',
          parentName: 'Lisa Brown',
          childName: 'Sophia Brown',
          childGrade: 'Grade 6',
          subject: 'English',
          message: 'I noticed Sophia received feedback on her essay. Could you provide some additional resources to help her improve her writing?',
          date: '2024-01-13',
          time: '4:45 PM',
          unread: true,
          parentId: 'parent-3',
        },
      ];
      setParentMessages(mockMessages);
    } catch (err) {
      console.error('Failed to load parent messages:', err);
    }
  }

  function openParentMessage(message) {
    setSelectedParentMessage(message);
    setReplyText('');
    setReplyStatus('');
    // Mark as read
    if (message.unread) {
      setParentMessages(prev =>
        prev.map(msg =>
          msg.id === message.id ? { ...msg, unread: false } : msg
        )
      );
    }
  }

  function closeParentMessage() {
    setSelectedParentMessage(null);
    setReplyText('');
    setReplyStatus('');
  }

  async function handleReplyToParent(e) {
    e.preventDefault();
    if (!selectedParentMessage || !replyText.trim()) {
      return;
    }
    setReplying(true);
    setReplyStatus('');

    try {
      const token = getAuthToken();
      // TODO: Replace with actual API call
      // const res = await fetch(`${API_URL}/teacher/parent-messages/${selectedParentMessage.id}/reply`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
      //   },
      //   body: JSON.stringify({
      //     parent_id: selectedParentMessage.parentId,
      //     message: replyText.trim(),
      //   }),
      // });

      // if (!res.ok) {
      //   throw new Error('Could not send reply.');
      // }

      setReplyStatus('Reply sent successfully.');
      setReplyText('');
      setTimeout(() => {
        closeParentMessage();
        loadParentMessages(); // Reload to show the reply in the conversation
      }, 1500);
    } catch (err) {
      setReplyStatus(err.message || 'An error occurred while sending the reply.');
    } finally {
      setReplying(false);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!selectedStudent || !messageText.trim()) {
      return;
    }
    setSending(true);
    setMessageStatus('');

    try {
      const token = getAuthToken();
      // Backend integration hint:
      // Implement an endpoint such as
      // POST `${API_URL}/teacher/messages`
      // with body: { student_id, message }
      const res = await fetch(`${API_URL}/teacher/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          student_id: selectedStudent.id,
          message: messageText.trim(),
        }),
      });

      if (!res.ok) {
        let detail = 'Could not send message.';
        try {
          const data = await res.json();
          if (data.detail || data.message) {
            detail = data.detail || data.message;
          }
        } catch {
          // ignore
        }
        throw new Error(detail);
      }

      setMessageStatus('Message sent successfully.');
      setMessageText('');
    } catch (err) {
      setMessageStatus(err.message || 'An error occurred while sending the message.');
    } finally {
      setSending(false);
    }
  }

  function openMessage(student) {
    setSelectedStudent(student);
    setMessageText('');
    setMessageStatus('');
  }

  function closeMessage() {
    setSelectedStudent(null);
    setMessageText('');
    setMessageStatus('');
  }

  return (
    <div className="teacher-root">
      <aside className="teacher-sidebar">
        <div>
          <Link to="/onboarding" className="teacher-logo-block" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="teacher-logo-circle"><FaChalkboardTeacher /></div>
            <div className="teacher-logo-text">SmartLearn</div>
          </Link>
          <nav className="teacher-nav-links">
            <Link className="teacher-nav-link active" to="/teacher">
              <FaHome className="teacher-nav-ico" />
              <span className="teacher-nav-label">Overview</span>
            </Link>
            <Link className="teacher-nav-link" to="/teacher/lessons">
              <FaFileAlt className="teacher-nav-ico" />
              <span className="teacher-nav-label">Lesson Notes</span>
            </Link>
            <Link className="teacher-nav-link" to="/teacher/courses">
              <FaBook className="teacher-nav-ico" />
              <span className="teacher-nav-label">Courses</span>
            </Link>
            <Link className="teacher-nav-link" to="/teacher/analytics">
              <FaChartBar className="teacher-nav-ico" />
              <span className="teacher-nav-label">Analytics</span>
            </Link>
          </nav>
        </div>
        <div className="teacher-nav-links">
          <Link className="teacher-nav-link" to="/settings">
            <FaCog className="teacher-nav-ico" />
            <span className="teacher-nav-label">Settings</span>
          </Link>
        </div>
      </aside>

      <main className="teacher-main">
        <header className="teacher-header">
          <div className="teacher-title-block">
            <h1>Teacher Dashboard</h1>
            <p>Upload lesson notes, manage courses, and monitor student performance.</p>
          </div>
          <div className="teacher-header-right">
            <div className="teacher-quick-actions">
              <Link to="/teacher/lessons" className="teacher-quick-btn primary">
                <FaPlus />
                <span>Upload Lesson Note</span>
              </Link>
              <Link to="/teacher/courses" className="teacher-quick-btn">
                <FaBook />
                <span>Upload Course</span>
              </Link>
            </div>
            <Link to="/teacher/profile" className="teacher-avatar">
              <FaChalkboardTeacher />
            </Link>
          </div>
        </header>

        <section className="teacher-grid">
          <div className="teacher-card">
            <div className="teacher-card-header">
              <div>
                <div className="teacher-card-title">Messages from Parents</div>
                <div className="teacher-card-subtitle">
                  View and respond to messages from parents about their children.
                </div>
              </div>
              {parentMessages.filter(m => m.unread).length > 0 && (
                <span className="teacher-chip" style={{ background: '#fee2e2', color: '#991b1b' }}>
                  {parentMessages.filter(m => m.unread).length} new
                </span>
              )}
            </div>
            <div className="teacher-list">
              {parentMessages.length === 0 ? (
                <div className="teacher-empty">No messages from parents yet.</div>
              ) : (
                parentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="teacher-list-row"
                    style={{
                      cursor: 'pointer',
                      background: msg.unread ? '#f0e9ff' : '#faf7ff',
                      borderLeft: msg.unread ? '3px solid #AA33F0' : 'none',
                    }}
                    onClick={() => openParentMessage(msg)}
                  >
                    <div className="teacher-list-main">
                      <div className="teacher-list-title">
                        {msg.parentName} • {msg.childName}
                        {msg.unread && <span style={{ marginLeft: '8px', fontSize: '10px', color: '#AA33F0' }}>●</span>}
                      </div>
                      <div className="teacher-list-meta">
                        {msg.subject} • {msg.date} • {msg.time}
                      </div>
                      <div style={{ fontSize: '12px', color: '#8a7bbd', marginTop: '4px', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.message}
                      </div>
                    </div>
                    <div className="teacher-list-actions">
                      <button
                        type="button"
                        className="teacher-message-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openParentMessage(msg);
                        }}
                      >
                        View & Reply
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="teacher-card">
            <div className="teacher-card-header">
              <div>
                <div className="teacher-card-title">Classroom Snapshot</div>
                <div className="teacher-card-subtitle">
                  High-level overview of how your students are doing this week.
                </div>
              </div>
              <span className="teacher-chip">Last 7 days</span>
            </div>
            <div className="teacher-stats-row">
              {quickStats.map((stat) => (
                <div key={stat.label} className="teacher-stat-pill">
                  <div className="teacher-stat-label">{stat.label}</div>
                  <div className="teacher-stat-value">{stat.value}</div>
                  <div className="teacher-stat-caption">{stat.caption}</div>
                </div>
              ))}
            </div>
            <div className="teacher-banner">
              <div className="teacher-banner-text">
                <h2>AI-generated quizzes from your lesson notes</h2>
                <p>
                  Upload a lesson note PDF or Word file and SmartLearn will automatically
                  generate practice quizzes for your students.
                </p>
                <Link to="/teacher/lessons">
                  <button className="teacher-banner-btn">Generate a quiz from a lesson</button>
                </Link>
              </div>
              <div className="teacher-banner-icon">🤖</div>
            </div>
          </div>

          <div className="teacher-card">
            <div className="teacher-card-header">
              <div>
                <div className="teacher-card-title">Students Needing Support</div>
                <div className="teacher-card-subtitle">
                  Highlight of students struggling with recent quizzes.
                </div>
              </div>
            </div>
            <div className="teacher-list">
              {atRiskStudents.length === 0 && (
                <div className="teacher-empty">
                  No students are currently flagged as struggling. Great job!
                </div>
              )}
              {atRiskStudents.map((s) => (
                <div key={s.id} className="teacher-list-row">
                  <div className="teacher-list-main">
                    <div className="teacher-list-title">{s.name}</div>
                    <div className="teacher-list-meta">
                      {s.subject} • {s.topic}
                    </div>
                  </div>
                  <div className="teacher-list-actions">
                    <span className="teacher-list-badge red">{s.status}</span>
                    <button
                      type="button"
                      className="teacher-message-btn"
                      onClick={() => openMessage(s)}
                    >
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="teacher-card-header" style={{ marginTop: 16 }}>
              <div>
                <div className="teacher-card-title">Recent Uploads</div>
                <div className="teacher-card-subtitle">
                  Latest lesson notes and course content shared with students.
                </div>
              </div>
            </div>
            <div className="teacher-list">
              {recentUploads.map((u) => (
                <div key={u.title} className="teacher-list-row">
                  <div className="teacher-list-main">
                    <div className="teacher-list-title">{u.title}</div>
                    <div className="teacher-list-meta">{u.subject} • {u.type}</div>
                  </div>
                  <span className="teacher-list-badge">{u.subject}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {selectedStudent && (
        <div className="teacher-message-backdrop" onClick={closeMessage}>
          <div
            className="teacher-message-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h2>Message {selectedStudent.name}</h2>
            <p className="teacher-message-subtitle">
              Reach out with encouragement, clarification, or extra resources about{' '}
              {selectedStudent.topic}.
            </p>
            <form onSubmit={handleSendMessage}>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Hi John, I noticed the last quiz was challenging. Let's schedule a quick check‑in or try these practice questions..."
              />
              {messageStatus && (
                <div className="teacher-message-status">
                  {messageStatus}
                </div>
              )}
              <div className="teacher-message-actions">
                <button
                  type="button"
                  className="teacher-btn-secondary"
                  onClick={closeMessage}
                  disabled={sending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="teacher-btn-primary"
                  disabled={sending || !messageText.trim()}
                >
                  {sending ? 'Sending…' : 'Send message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Parent Message Modal */}
      {selectedParentMessage && (
        <div className="teacher-message-backdrop" onClick={closeParentMessage}>
          <div
            className="teacher-message-modal"
            style={{ maxWidth: '600px' }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2>Message from {selectedParentMessage.parentName}</h2>
              <button
                onClick={closeParentMessage}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>
            <p className="teacher-message-subtitle">
              About {selectedParentMessage.childName} ({selectedParentMessage.childGrade}) • {selectedParentMessage.subject}
            </p>
            
            {/* Original Message */}
            <div style={{
              background: '#faf7ff',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '16px',
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ fontSize: '12px', color: '#8a7bbd', marginBottom: '8px' }}>
                {selectedParentMessage.date} • {selectedParentMessage.time}
              </div>
              <div style={{ fontSize: '14px', color: '#4c2f96', lineHeight: '1.6' }}>
                {selectedParentMessage.message}
              </div>
            </div>

            {/* Reply Form */}
            <form onSubmit={handleReplyToParent}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4c2f96', marginBottom: '8px' }}>
                Your Reply
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Hi ${selectedParentMessage.parentName.split(' ')[0]}, thank you for reaching out. Regarding ${selectedParentMessage.childName}'s progress...`}
                style={{ minHeight: '120px' }}
              />
              {replyStatus && (
                <div className="teacher-message-status" style={{ marginTop: '8px' }}>
                  {replyStatus}
                </div>
              )}
              <div className="teacher-message-actions" style={{ marginTop: '12px' }}>
                <button
                  type="button"
                  className="teacher-btn-secondary"
                  onClick={closeParentMessage}
                  disabled={replying}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="teacher-btn-primary"
                  disabled={replying || !replyText.trim()}
                >
                  {replying ? 'Sending…' : 'Send Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


