import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Lessons.css';

const sampleLessons = [
  {
    id: 1,
    name: 'Algebra Topics',
    subject: 'Math',
    topic: 'Algebra',
    difficulty: 'Medium',
    status: 'In Progress',
    progress: 75,
    time: '3 hours',
    units: 12,
    icon: '🔵',
  },
  {
    id: 2,
    name: 'Living Things',
    subject: 'Science',
    topic: 'Biology',
    difficulty: 'Easy',
    status: 'Not Started',
    progress: 0,
    time: '2.5 hours',
    units: 8,
    icon: '🟢',
  },
  {
    id: 3,
    name: 'Metaphors & Meaning',
    subject: 'English',
    topic: 'Literature',
    difficulty: 'Hard',
    status: 'In Progress',
    progress: 77,
    time: '1.5 hours',
    units: 6,
    icon: '🟠',
  },
  {
    id: 4,
    name: 'World War II Overview',
    subject: 'History',
    topic: 'WWII',
    difficulty: 'Medium',
    status: 'Complete',
    progress: 100,
    time: '4 hours',
    units: 10,
    icon: '🏛️',
  },
  {
    id: 5,
    name: 'Geometry: Shapes',
    subject: 'Math',
    topic: 'Geometry',
    difficulty: 'Hard',
    status: 'In Progress',
    progress: 40,
    time: '2 hours',
    units: 9,
    icon: '📐',
  },
  {
    id: 6,
    name: 'Plant Biology',
    subject: 'Science',
    topic: 'Botany',
    difficulty: 'Medium',
    status: 'In Progress',
    progress: 85,
    time: '3 hours',
    units: 12,
    icon: '🌿',
  },
];

export default function Lessons() {
  const [filters, setFilters] = useState({
    subject: 'All Subjects',
    topic: 'All Topics',
    difficulty: 'All Difficulties',
    status: 'All Statuses',
  });

  const subjects = useMemo(() => ['All Subjects', 'Math', 'Science', 'English', 'History'], []);
  const topics = useMemo(() => ['All Topics', 'Algebra', 'Geometry', 'Biology', 'WWII', 'Literature', 'Botany'], []);
  const difficulties = useMemo(() => ['All Difficulties', 'Easy', 'Medium', 'Hard'], []);
  const statuses = useMemo(() => ['All Statuses', 'In Progress', 'Complete', 'Not Started'], []);

  const filtered = useMemo(() => {
    return sampleLessons.filter((l) => {
      if (filters.subject !== 'All Subjects' && l.subject !== filters.subject) return false;
      if (filters.topic !== 'All Topics' && l.topic !== filters.topic) return false;
      if (filters.difficulty !== 'All Difficulties' && l.difficulty !== filters.difficulty) return false;
      if (filters.status !== 'All Statuses' && l.status !== filters.status) return false;
      return true;
    });
  }, [filters]);

  // Split into two scenario sections for demonstration
  const inProgress = filtered.filter((l) => l.status === 'In Progress');
  const recommended = filtered.filter((l) => l.status !== 'In Progress');

  function onChange(e) {
    const { name, value } = e.target;
    setFilters((s) => ({ ...s, [name]: value }));
  }

  return (
    <div className="lessons-root">
      <aside className="lessons-sidebar">
        <div className="logo-small">💡</div>
        <nav className="side-icons">
          <Link to="/app" className="icon">🏠</Link>
          <Link to="/lessons" className="icon active">📚</Link>
          <Link to="/notifications" className="icon">🔔</Link>
          <Link to="/profile" className="icon">👤</Link>
        </nav>
      </aside>
      <main className="lessons-main">
        <header className="lessons-header">
          <h1>My Lessons</h1>
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
              <label>Topic</label>
              <select name="topic" value={filters.topic} onChange={onChange}>
                {topics.map((t) => (
                  <option key={t} value={t}>{t}</option>
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

        <section className="section">
          <div className="section-title">In Progress</div>
          <div className="lessons-grid">
            {inProgress.length === 0 && <div className="empty">No lessons in progress.</div>}
            {inProgress.map((l) => (
              <article className="lesson-card" key={l.id}>
                <div className="card-header">
                  <div className="icon-wrap">{l.icon}</div>
                  <div className="card-title">
                    <div className="lesson-name">{l.name}</div>
                    <div className={`badge ${l.subject.toLowerCase()}`}>{l.subject}</div>
                  </div>
                </div>
                <div className="card-body">
                  <p className="desc">A short summary describing what this lesson covers in 1–2 lines.</p>
                  <div className="metrics">
                    <span className="metric">Progress: <strong>{l.progress}%</strong></span>
                    <span className="metric">Time: {l.time}</span>
                    <span className="metric">Units: {l.units}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${l.progress}%` }} />
                  </div>
                </div>
                <div className="card-footer">
                  <button className="btn primary">Continue Lesson</button>
                  <button className="btn outline">Lesson Details</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-title">Recommended / Other</div>
          <div className="lessons-grid">
            {recommended.length === 0 && <div className="empty">No recommended lessons.</div>}
            {recommended.map((l) => (
              <article className="lesson-card" key={l.id}>
                <div className="card-header">
                  <div className="icon-wrap">{l.icon}</div>
                  <div className="card-title">
                    <div className="lesson-name">{l.name}</div>
                    <div className={`badge ${l.subject.toLowerCase()}`}>{l.subject}</div>
                  </div>
                </div>
                <div className="card-body">
                  <p className="desc">A short summary describing what this lesson covers in 1–2 lines.</p>
                  <div className="metrics">
                    <span className="metric">Progress: <strong>{l.progress}%</strong></span>
                    <span className="metric">Time: {l.time}</span>
                    <span className="metric">Units: {l.units}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${l.progress}%` }} />
                  </div>
                </div>
                <div className="card-footer">
                  <button className="btn primary">Continue Lesson</button>
                  <button className="btn outline">Lesson Details</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
