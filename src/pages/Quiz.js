import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaLightbulb, 
  FaHome, 
  FaEdit, 
  FaBell, 
  FaBook, 
  FaUser, 
  FaRobot, 
  FaCog,
  FaMicrophone,
  FaChartLine
} from 'react-icons/fa';
import './Quiz.css';

const sampleQuizzes = [
  {
    id: 1,
    title: 'Algebra Basics Quiz',
    subject: 'Math',
    topic: 'Algebra',
    difficulty: 'Easy',
    questions: 10,
    duration: '15 mins',
    icon: '📝',
    uploadedBy: 'Ms. Johnson',
    date: '2 days ago',
    status: 'Not Started',
    description: 'Test your knowledge of basic algebraic concepts and equations.',
  },
  {
    id: 2,
    title: 'Photosynthesis Process',
    subject: 'Science',
    topic: 'Biology',
    difficulty: 'Medium',
    questions: 15,
    duration: '20 mins',
    icon: '🌱',
    uploadedBy: 'Dr. Smith',
    date: '1 week ago',
    status: 'In Progress',
    description: 'Assess your understanding of photosynthesis and plant biology.',
  },
  {
    id: 3,
    title: 'Literature & Poetry',
    subject: 'English',
    topic: 'Literature',
    difficulty: 'Hard',
    questions: 12,
    duration: '25 mins',
    icon: '📚',
    uploadedBy: 'Mr. Brown',
    date: '3 days ago',
    status: 'Not Started',
    description: 'Evaluate your comprehension of literary devices and poetry analysis.',
  },
  {
    id: 4,
    title: 'World War II History',
    subject: 'History',
    topic: 'WWII',
    difficulty: 'Medium',
    questions: 20,
    duration: '30 mins',
    icon: '🏛️',
    uploadedBy: 'Mrs. Davis',
    date: '5 days ago',
    status: 'Completed',
    description: 'Test your knowledge of major events and figures in World War II.',
  },
  {
    id: 5,
    title: 'Geometry Shapes & Angles',
    subject: 'Math',
    topic: 'Geometry',
    difficulty: 'Hard',
    questions: 18,
    duration: '28 mins',
    icon: '📐',
    uploadedBy: 'Ms. Johnson',
    date: '1 week ago',
    status: 'Not Started',
    description: 'Challenge yourself with advanced geometry problems.',
  },
  {
    id: 6,
    title: 'Cell Biology Basics',
    subject: 'Science',
    topic: 'Biology',
    difficulty: 'Easy',
    questions: 12,
    duration: '18 mins',
    icon: '🔬',
    uploadedBy: 'Dr. Smith',
    date: '2 weeks ago',
    status: 'Completed',
    description: 'Fundamental concepts of cell structure and function.',
  },
];

export default function Quiz() {
  const [filters, setFilters] = useState({
    subject: 'All Subjects',
    difficulty: 'All Difficulties',
    status: 'All Statuses',
  });

  const subjects = useMemo(() => ['All Subjects', 'Math', 'Science', 'English', 'History'], []);
  const difficulties = useMemo(() => ['All Difficulties', 'Easy', 'Medium', 'Hard'], []);
  const statuses = useMemo(() => ['All Statuses', 'Not Started', 'In Progress', 'Completed'], []);

  const filtered = useMemo(() => {
    return sampleQuizzes.filter((q) => {
      if (filters.subject !== 'All Subjects' && q.subject !== filters.subject) return false;
      if (filters.difficulty !== 'All Difficulties' && q.difficulty !== filters.difficulty) return false;
      if (filters.status !== 'All Statuses' && q.status !== filters.status) return false;
      return true;
    });
  }, [filters]);

  const notStarted = filtered.filter((q) => q.status === 'Not Started');
  const inProgress = filtered.filter((q) => q.status === 'In Progress');
  const completed = filtered.filter((q) => q.status === 'Completed');

  function onChange(e) {
    const { name, value } = e.target;
    setFilters((s) => ({ ...s, [name]: value }));
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Not Started':
        return 'badge-gray';
      case 'In Progress':
        return 'badge-blue';
      case 'Completed':
        return 'badge-green';
      default:
        return 'badge-gray';
    }
  };

  return (
    <div className="quiz-root">
      <aside className="quiz-sidebar">
        <div className="sidebar-top">
          <div className="logo-block">
            <div className="logo-circle">
              <FaLightbulb className="logo-icon" />
            </div>
            <span className="logo-text">SmartLearn</span>
          </div>
          <nav className="nav-links">
            <Link className="nav-link" to="/app"><FaHome className="nav-ico" /><span className="label">Home</span></Link>
            <Link className="nav-link active" to="/quiz"><FaEdit className="nav-ico" /><span className="label">Quiz</span></Link>
            <Link className="nav-link" to="/notifications"><FaBell className="nav-ico" /><span className="label">Notifications</span></Link>
            <Link className="nav-link" to="/lessons"><FaBook className="nav-ico" /><span className="label">Lessons</span></Link>
            <Link className="nav-link" to="/profile"><FaUser className="nav-ico" /><span className="label">Profile</span></Link>
            <Link className="nav-link" to="/ai-tutor"><FaRobot className="nav-ico" /><span className="label">AI Tutor</span></Link>
            <Link className="nav-link" to="/settings"><FaCog className="nav-ico" /><span className="label">Settings</span></Link>
          </nav>
        </div>
        <div className="sidebar-bottom">
          <Link className="nav-link" to="/voice-assistant"><FaMicrophone className="nav-ico" /><span className="label">Voice Assistant</span></Link>
          <Link className="nav-link small" to="/ai-insights"><FaChartLine className="nav-ico" /><span className="label">AI Insights</span></Link>
          <div className="ai-buddy-block">
            <div className="ai-buddy-title">AI Buddy</div>
            <div className="ai-buddy-desc">Ready to help you learn something new today!</div>
            <Link className="ai-buddy-chat" to="/ai-tutor">Chat</Link>
          </div>
        </div>
      </aside>

      <main className="quiz-main">
        <header className="quiz-header">
          <div>
            <h1>Quizzes</h1>
            <p className="muted">Available quizzes from your teachers to assess your understanding</p>
          </div>
          <div className="filters">
            <div className="filter">
              <label>Subject</label>
              <select name="subject" value={filters.subject} onChange={onChange}>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="filter">
              <label>Difficulty</label>
              <select name="difficulty" value={filters.difficulty} onChange={onChange}>
                {difficulties.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="filter">
              <label>Status</label>
              <select name="status" value={filters.status} onChange={onChange}>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {notStarted.length > 0 && (
          <section className="quiz-section">
            <div className="section-title">Not Started</div>
            <div className="quiz-grid">
              {notStarted.map((q) => (
                <article className="quiz-card" key={q.id}>
                  <div className="card-top">
                    <div className="icon-wrap">{q.icon}</div>
                    <div className={`status-badge ${getStatusBadge(q.status)}`}>{q.status}</div>
                  </div>
                  <div className="card-body">
                    <h3 className="quiz-title">{q.title}</h3>
                    <p className="quiz-desc">{q.description}</p>
                    <div className="quiz-meta">
                      <span className={`badge subject-${q.subject.toLowerCase()}`}>{q.subject}</span>
                      <span className="difficulty">{q.difficulty}</span>
                    </div>
                    <div className="quiz-stats">
                      <span>📋 {q.questions} Questions</span>
                      <span>⏱️ {q.duration}</span>
                    </div>
                    <div className="quiz-footer">
                      <div className="uploader">By {q.uploadedBy}</div>
                      <div className="date">{q.date}</div>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="btn-start">Start Quiz</button>
                    <button className="btn-details">Details</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {inProgress.length > 0 && (
          <section className="quiz-section">
            <div className="section-title">In Progress</div>
            <div className="quiz-grid">
              {inProgress.map((q) => (
                <article className="quiz-card" key={q.id}>
                  <div className="card-top">
                    <div className="icon-wrap">{q.icon}</div>
                    <div className={`status-badge ${getStatusBadge(q.status)}`}>{q.status}</div>
                  </div>
                  <div className="card-body">
                    <h3 className="quiz-title">{q.title}</h3>
                    <p className="quiz-desc">{q.description}</p>
                    <div className="quiz-meta">
                      <span className={`badge subject-${q.subject.toLowerCase()}`}>{q.subject}</span>
                      <span className="difficulty">{q.difficulty}</span>
                    </div>
                    <div className="quiz-stats">
                      <span>📋 {q.questions} Questions</span>
                      <span>⏱️ {q.duration}</span>
                    </div>
                    <div className="quiz-footer">
                      <div className="uploader">By {q.uploadedBy}</div>
                      <div className="date">{q.date}</div>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="btn-continue">Continue Quiz</button>
                    <button className="btn-details">Details</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {completed.length > 0 && (
          <section className="quiz-section">
            <div className="section-title">Completed</div>
            <div className="quiz-grid">
              {completed.map((q) => (
                <article className="quiz-card completed" key={q.id}>
                  <div className="card-top">
                    <div className="icon-wrap">{q.icon}</div>
                    <div className={`status-badge ${getStatusBadge(q.status)}`}>{q.status}</div>
                  </div>
                  <div className="card-body">
                    <h3 className="quiz-title">{q.title}</h3>
                    <p className="quiz-desc">{q.description}</p>
                    <div className="quiz-meta">
                      <span className={`badge subject-${q.subject.toLowerCase()}`}>{q.subject}</span>
                      <span className="difficulty">{q.difficulty}</span>
                    </div>
                    <div className="quiz-stats">
                      <span>📋 {q.questions} Questions</span>
                      <span>⏱️ {q.duration}</span>
                    </div>
                    <div className="quiz-footer">
                      <div className="uploader">By {q.uploadedBy}</div>
                      <div className="date">{q.date}</div>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="btn-review">Review Results</button>
                    <button className="btn-retake">Retake Quiz</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No Quizzes Found</h3>
            <p>Try adjusting your filters to see available quizzes.</p>
          </div>
        )}
      </main>
    </div>
  );
}
