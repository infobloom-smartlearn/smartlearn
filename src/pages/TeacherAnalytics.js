import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TeacherAnalytics.css';
import { API_URL, getAuthToken, getUserType } from '../utils/api';

function useRequireTeacher() {
  const navigate = useNavigate();
  React.useEffect(() => {
    const type = getUserType();
    if (type !== 'teacher') {
      navigate('/signin');
    }
  }, [navigate]);
}

export default function TeacherAnalytics() {
  useRequireTeacher();

  const [subject, setSubject] = React.useState('All Subjects');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Placeholder performance data – expected to come from a teacher analytics endpoint
  const [summary, setSummary] = React.useState({
    buckets: [
      { label: '0-49%', value: 4 },
      { label: '50-69%', value: 10 },
      { label: '70-84%', value: 12 },
      { label: '85-100%', value: 6 },
    ],
    strugglingTopics: [
      { topic: 'Algebra – Linear Equations', subject: 'Math', avg: 54, students: 9 },
      { topic: 'Photosynthesis', subject: 'Science', avg: 61, students: 7 },
      { topic: 'Metaphors & Poetry', subject: 'English', avg: 59, students: 5 },
    ],
  });

  const maxBucket = Math.max(...summary.buckets.map((b) => b.value || 0), 1);

  const handleRefresh = async () => {
    setLoading(true);
    setError('');
    try {
      const token = getAuthToken();

      // Example backend endpoint for teacher analytics:
      // GET `${API_URL}/teacher/analytics/quiz-performance?subject=${subject || ''}`
      // Response shape could be aligned with `summary` state above.
      const url = new URL(`${API_URL}/teacher/analytics/quiz-performance`);
      if (subject && subject !== 'All Subjects') {
        url.searchParams.set('subject', subject);
      }

      const res = await fetch(url.toString(), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        let detail = 'Failed to load analytics.';
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
      const data = await res.json();
      // Expecting `data` to contain `buckets` and `strugglingTopics`
      setSummary((prev) => ({
        ...prev,
        ...data,
      }));
    } catch (err) {
      setError(err.message || 'Unable to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher-analytics-root">
      <aside className="teacher-analytics-sidebar">
        <div className="teacher-analytics-logo">📊</div>
        <nav className="teacher-analytics-nav">
          <Link to="/teacher" className="teacher-analytics-icon">
            🏠
          </Link>
          <Link to="/teacher/lessons" className="teacher-analytics-icon">
            📄
          </Link>
          <Link to="/teacher/courses" className="teacher-analytics-icon">
            📚
          </Link>
          <Link to="/teacher/analytics" className="teacher-analytics-icon active">
            📊
          </Link>
        </nav>
      </aside>

      <main className="teacher-analytics-main">
        <header className="teacher-analytics-header">
          <h1>Student Performance Analytics</h1>
          <p>
            Visualize quiz results and quickly spot students or topics that need more
            attention.
          </p>
          <div className="teacher-analytics-controls">
            <select
              className="teacher-analytics-select"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option>All Subjects</option>
              <option>Math</option>
              <option>Science</option>
              <option>English</option>
              <option>History</option>
            </select>
            <button
              type="button"
              className="teacher-analytics-select"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
          {error && <div style={{ color: '#b91c1c', fontSize: 13, marginTop: 6 }}>{error}</div>}
        </header>

        <section className="teacher-analytics-layout">
          <article className="teacher-analytics-card">
            <h2>Score Distribution</h2>
            <p>How many students fall into each score range for recent quizzes.</p>
            <div className="teacher-analytics-chart">
              <div className="teacher-analytics-bars">
                {summary.buckets.map((b) => {
                  const heightPct = (b.value / maxBucket) * 100;
                  return (
                    <div
                      key={b.label}
                      className="teacher-analytics-bar"
                      style={{ height: `${Math.max(10, heightPct)}%` }}
                    >
                      <div className="teacher-analytics-bar-value">{b.value}</div>
                      <div className="teacher-analytics-bar-label">{b.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="teacher-analytics-summary">
              Backend integration hint: this chart expects aggregate data per score range
              from an endpoint such as{' '}
              <code>{API_URL}/teacher/analytics/quiz-performance</code>.
            </div>
          </article>

          <article className="teacher-analytics-card">
            <h2>Struggling Topics</h2>
            <p>Topics where many students consistently score below 65%.</p>
            <div className="teacher-analytics-table">
              <div className="teacher-analytics-header-row">
                <span>Topic</span>
                <span>Subject</span>
                <span>Avg score</span>
                <span>Students</span>
              </div>
              {summary.strugglingTopics.map((t) => (
                <div key={t.topic} className="teacher-analytics-row">
                  <span>
                    {t.topic}
                    {t.avg < 65 && <span className="teacher-analytics-tag">Needs review</span>}
                  </span>
                  <span>{t.subject}</span>
                  <span>{t.avg}%</span>
                  <span>{t.students}</span>
                </div>
              ))}
            </div>
            <div className="teacher-analytics-summary">
              Once wired to the backend, clicking a topic row could deep-link to the
              relevant quiz or lesson so you can quickly review and assign follow‑up
              practice.
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}


