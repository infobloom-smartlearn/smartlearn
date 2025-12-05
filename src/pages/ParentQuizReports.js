import React from 'react';
import { Link } from 'react-router-dom';
import './ParentDashboard.css';
import { API_URL, getAuthToken } from '../utils/api';

export default function ParentQuizReports() {
  const [children, setChildren] = React.useState([]);
  const [selectedChild, setSelectedChild] = React.useState(null);
  const [quizReports, setQuizReports] = React.useState([]);
  const [selectedQuiz, setSelectedQuiz] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('all'); // all, math, science, english

  React.useEffect(() => {
    // Mock data
    const mockChildren = [
      { id: 'child-1', name: 'Emma Johnson', grade: 'Grade 5', avatar: '👧' },
      { id: 'child-2', name: 'Lucas Johnson', grade: 'Grade 3', avatar: '👦' },
    ];
    setChildren(mockChildren);
    if (mockChildren.length > 0) {
      setSelectedChild(mockChildren[0]);
      loadQuizReports(mockChildren[0].id);
    }
    setLoading(false);
  }, []);

  async function loadQuizReports(childId) {
    try {
      const token = getAuthToken();
      // TODO: Replace with actual API call
      // const data = await fetch(`${API_URL}/parent/children/${childId}/quizzes`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // }).then(r => r.json());

      // Mock data
      const mockReports = [
        {
          id: 'q1',
          title: 'Algebra Basics',
          subject: 'Math',
          score: 85,
          maxScore: 100,
          date: '2024-01-15',
          timeSpent: '25 minutes',
          attempts: 1,
          rank: 5,
          totalStudents: 28,
          teacher: 'Ms. Sarah Williams',
          feedback: 'Great work on linear equations! Keep practicing quadratic equations.',
          aiInsights: 'Strong performance in basic algebra. Consider focusing on word problems next.',
          topics: ['Linear Equations', 'Quadratic Equations', 'Polynomials'],
          questionBreakdown: [
            { question: 1, correct: true, topic: 'Linear Equations' },
            { question: 2, correct: true, topic: 'Linear Equations' },
            { question: 3, correct: false, topic: 'Quadratic Equations' },
            { question: 4, correct: true, topic: 'Polynomials' },
            { question: 5, correct: true, topic: 'Linear Equations' },
          ],
        },
        {
          id: 'q2',
          title: 'Photosynthesis',
          subject: 'Science',
          score: 70,
          maxScore: 100,
          date: '2024-01-14',
          timeSpent: '30 minutes',
          attempts: 2,
          rank: 12,
          totalStudents: 28,
          teacher: 'Mr. David Chen',
          feedback: 'Good effort! Review the process of photosynthesis and the role of chlorophyll.',
          aiInsights: 'Struggling with photosynthesis concepts. Recommend additional reading materials and practice quizzes.',
          topics: ['Photosynthesis', 'Chlorophyll', 'Plant Biology'],
          questionBreakdown: [
            { question: 1, correct: true, topic: 'Plant Biology' },
            { question: 2, correct: false, topic: 'Photosynthesis' },
            { question: 3, correct: false, topic: 'Photosynthesis' },
            { question: 4, correct: true, topic: 'Chlorophyll' },
            { question: 5, correct: true, topic: 'Plant Biology' },
          ],
        },
        {
          id: 'q3',
          title: 'Reading Comprehension',
          subject: 'English',
          score: 92,
          maxScore: 100,
          date: '2024-01-13',
          timeSpent: '20 minutes',
          attempts: 1,
          rank: 3,
          totalStudents: 28,
          teacher: 'Ms. Emily Brown',
          feedback: 'Excellent reading comprehension skills! Your analysis was very thorough.',
          aiInsights: 'Outstanding performance. Strong understanding of narrative structure and character development.',
          topics: ['Reading Comprehension', 'Literary Analysis', 'Vocabulary'],
          questionBreakdown: [
            { question: 1, correct: true, topic: 'Reading Comprehension' },
            { question: 2, correct: true, topic: 'Literary Analysis' },
            { question: 3, correct: true, topic: 'Vocabulary' },
            { question: 4, correct: true, topic: 'Reading Comprehension' },
            { question: 5, correct: false, topic: 'Literary Analysis' },
          ],
        },
        {
          id: 'q4',
          title: 'World History - Ancient Civilizations',
          subject: 'Social Studies',
          score: 88,
          maxScore: 100,
          date: '2024-01-12',
          timeSpent: '35 minutes',
          attempts: 1,
          rank: 7,
          totalStudents: 28,
          teacher: 'Mr. James Wilson',
          feedback: 'Good understanding of ancient civilizations. Well done!',
          aiInsights: 'Solid grasp of historical concepts. Continue exploring different civilizations.',
          topics: ['Ancient Egypt', 'Mesopotamia', 'Greek Civilization'],
          questionBreakdown: [
            { question: 1, correct: true, topic: 'Ancient Egypt' },
            { question: 2, correct: true, topic: 'Mesopotamia' },
            { question: 3, correct: true, topic: 'Greek Civilization' },
            { question: 4, correct: false, topic: 'Ancient Egypt' },
            { question: 5, correct: true, topic: 'Mesopotamia' },
          ],
        },
      ];
      setQuizReports(mockReports);
    } catch (err) {
      console.error('Failed to load quiz reports:', err);
    }
  }

  function handleChildSelect(child) {
    setSelectedChild(child);
    loadQuizReports(child.id);
  }

  const filteredReports = filter === 'all'
    ? quizReports
    : quizReports.filter(r => r.subject.toLowerCase() === filter);

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
            <button className="parent-nav-link active">
              <span className="parent-nav-ico">📊</span>
              <span className="parent-nav-label">Quiz Reports</span>
            </button>
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
            <h1>Quiz Reports</h1>
            <p>
              {selectedChild ? `Detailed quiz reports for ${selectedChild.name}` : 'Select a child to view quiz reports'}
            </p>
          </div>
          <div className="parent-header-right">
            <button className="parent-download-btn" onClick={() => {/* TODO: Generate PDF */}}>
              📥 Download Reports
            </button>
            <Link to="/parent/profile" className="parent-avatar">
              👨‍👩‍👧
            </Link>
          </div>
        </header>

        {selectedChild && (
          <section className="parent-content">
            {/* Filter */}
            <div className="parent-card">
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  className={`parent-chip ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                  style={{
                    cursor: 'pointer',
                    border: filter === 'all' ? '2px solid var(--accent-purple, #AA33F0)' : '2px solid transparent',
                  }}
                >
                  All Subjects
                </button>
                <button
                  className={`parent-chip ${filter === 'math' ? 'active' : ''}`}
                  onClick={() => setFilter('math')}
                  style={{
                    cursor: 'pointer',
                    border: filter === 'math' ? '2px solid var(--accent-purple, #AA33F0)' : '2px solid transparent',
                  }}
                >
                  Math
                </button>
                <button
                  className={`parent-chip ${filter === 'science' ? 'active' : ''}`}
                  onClick={() => setFilter('science')}
                  style={{
                    cursor: 'pointer',
                    border: filter === 'science' ? '2px solid var(--accent-purple, #AA33F0)' : '2px solid transparent',
                  }}
                >
                  Science
                </button>
                <button
                  className={`parent-chip ${filter === 'english' ? 'active' : ''}`}
                  onClick={() => setFilter('english')}
                  style={{
                    cursor: 'pointer',
                    border: filter === 'english' ? '2px solid var(--accent-purple, #AA33F0)' : '2px solid transparent',
                  }}
                >
                  English
                </button>
              </div>
            </div>

            {/* Quiz Reports List */}
            <div className="parent-list">
              {filteredReports.length === 0 ? (
                <div className="parent-empty">No quiz reports found</div>
              ) : (
                filteredReports.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="parent-list-row"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedQuiz(quiz)}
                  >
                    <div className="parent-list-main">
                      <div className="parent-list-title">{quiz.title}</div>
                      <div className="parent-list-meta">
                        {quiz.subject} • {quiz.date} • {quiz.timeSpent} • {quiz.attempts} attempt{quiz.attempts > 1 ? 's' : ''}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9c8fc6', marginTop: '4px' }}>
                        Teacher: {quiz.teacher}
                      </div>
                    </div>
                    <div className="parent-list-actions">
                      <div className="parent-quiz-score">{quiz.score}%</div>
                      <span className="parent-list-badge">
                        Rank #{quiz.rank} of {quiz.totalStudents}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quiz Details Modal */}
            {selectedQuiz && (
              <div className="parent-message-backdrop" onClick={() => setSelectedQuiz(null)}>
                <div
                  className="parent-message-modal"
                  style={{ maxWidth: '700px' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2>{selectedQuiz.title}</h2>
                    <button
                      onClick={() => setSelectedQuiz(null)}
                      style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}
                    >
                      ×
                    </button>
                  </div>
                  <p className="parent-message-subtitle">
                    {selectedQuiz.subject} • {selectedQuiz.date} • Score: {selectedQuiz.score}/{selectedQuiz.maxScore}
                  </p>

                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#4c2f96', marginBottom: '8px' }}>
                        Performance Summary
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        <div style={{ padding: '12px', background: '#faf7ff', borderRadius: '10px' }}>
                          <div style={{ fontSize: '11px', color: '#8a7bbd' }}>Score</div>
                          <div style={{ fontSize: '20px', fontWeight: 700, color: '#4c2f96' }}>{selectedQuiz.score}%</div>
                        </div>
                        <div style={{ padding: '12px', background: '#faf7ff', borderRadius: '10px' }}>
                          <div style={{ fontSize: '11px', color: '#8a7bbd' }}>Rank</div>
                          <div style={{ fontSize: '20px', fontWeight: 700, color: '#4c2f96' }}>#{selectedQuiz.rank}</div>
                        </div>
                        <div style={{ padding: '12px', background: '#faf7ff', borderRadius: '10px' }}>
                          <div style={{ fontSize: '11px', color: '#8a7bbd' }}>Time Spent</div>
                          <div style={{ fontSize: '20px', fontWeight: 700, color: '#4c2f96' }}>{selectedQuiz.timeSpent}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#4c2f96', marginBottom: '8px' }}>
                        Topics Covered
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {selectedQuiz.topics.map((topic, idx) => (
                          <span key={idx} className="parent-chip">{topic}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#4c2f96', marginBottom: '8px' }}>
                        Teacher Feedback
                      </div>
                      <div style={{ padding: '12px', background: '#faf7ff', borderRadius: '10px', fontSize: '13px', color: '#4c2f96' }}>
                        {selectedQuiz.feedback}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#4c2f96', marginBottom: '8px' }}>
                        AI-Generated Insights
                      </div>
                      <div style={{ padding: '12px', background: '#f0e9ff', borderRadius: '10px', fontSize: '13px', color: '#4c2f96', borderLeft: '3px solid var(--accent-purple, #AA33F0)' }}>
                        {selectedQuiz.aiInsights}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#4c2f96', marginBottom: '8px' }}>
                        Question Breakdown
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                        {selectedQuiz.questionBreakdown.map((q, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '8px',
                              background: q.correct ? '#d1fae5' : '#fee2e2',
                              borderRadius: '8px',
                              textAlign: 'center',
                              fontSize: '12px',
                              color: q.correct ? '#065f46' : '#991b1b',
                              fontWeight: 600,
                            }}
                            title={q.topic}
                          >
                            Q{q.question} {q.correct ? '✓' : '✗'}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

