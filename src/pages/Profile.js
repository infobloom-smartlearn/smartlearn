import React from 'react';
import './Profile.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Profile(){
  const q = useQuery();
  const showSuccess = q.get('success') === '1';
  const navigate = useNavigate();

  const achievements = [
    { id: 1, title: 'Math Enthusiast', desc: 'Completed 10 math lessons', color: 'gold' },
    { id: 2, title: 'First Steps', desc: 'Finished your first lesson', color: 'pink' },
    { id: 3, title: 'Quiz Explorer', desc: 'Completed 5 quizzes', color: 'purple' },
    { id: 4, title: 'Science Explorer', desc: 'Completed 5 science lessons', color: 'teal' }
  ];

  return (
    <div className="profile-root">
      <aside className="profile-nav">
        <div className="nav-top">
          <div className="logo">💡<span className="logo-text">SmartLearn</span></div>
        </div>
        <nav className="nav-items">
          <Link className="nav-item" to="/app">🏠 <span className="label">Home</span></Link>
          <Link className="nav-item" to="/quiz">📝 <span className="label">Quiz</span></Link>
          <Link className="nav-item" to="/notifications">🔔 <span className="label">Notifications</span></Link>
          <Link className="nav-item active" to="/profile">👤 <span className="label">Profile</span></Link>
          <Link className="nav-item" to="/ai-tutor">🤖 <span className="label">AI Tutor</span></Link>
          <Link className="nav-item" to="#">🎮 <span className="label">Games</span></Link>
          <Link className="nav-item" to="/settings">⚙️ <span className="label">Settings</span></Link>
        </nav>
      </aside>

      <main className="profile-main">
        <header className="profile-header">
          <div className="title-area">
            <h1>Profile</h1>
            <p className="muted">Personal details, goals, stats and achievements</p>
          </div>
          <div className="header-actions">
            <Link to="/notifications" className="icon">🔔</Link>
            <div className="avatar">👩‍🎓</div>
            <button className="btn-save" onClick={()=> navigate('/profile?success=1')} aria-label="Save demo">Save</button>
          </div>
        </header>

        {showSuccess && (
          <div className="success-banner">
            <div className="check">✅</div>
            <div className="text">Account information updated successfully</div>
          </div>
        )}

        <section className="basic-card card">
          <div className="left-col">
            <div className="avatar-large">👧</div>
            <div className="meta">
              <div className="name">Ada <button className="edit">✏️</button></div>
              <div className="row"><strong>Class:</strong> 8th grade <button className="edit small">✏️</button></div>
              <div className="row"><strong>Age:</strong> 10 yrs <button className="edit small">✏️</button></div>
            </div>
          </div>
          <div className="right-col">
            <h3>Learning Preferences <button className="edit inline">✏️</button></h3>
            <div className="pref-row">
              <div><strong>Favorite Subject</strong><div className="pref-val">Algebra <button className="edit small">✏️</button></div></div>
              <div><strong>Learning Goal</strong><div className="pref-val">Master Algebra basics and improve problem-solving skills <button className="edit small">✏️</button></div></div>
            </div>
          </div>
        </section>

        <section className="stats-row card">
          <div className="widget green">
            <div className="num">35</div>
            <div className="label">Lessons</div>
          </div>
          <div className="widget blue">
            <div className="num">87%</div>
            <div className="label">Average score</div>
          </div>
          <div className="widget yellow">
            <div className="num">7</div>
            <div className="label">7 Day Streak</div>
          </div>
          <div className="widget purple">
            <div className="num">28h</div>
            <div className="label">Study hours</div>
          </div>
        </section>

        <section className="progress-row card">
          <div className="progress-left">Courses in progress: 3</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width:'74%'}}></div>
          </div>
          <div className="progress-right">Courses finished: 3</div>
        </section>

        <section className="achievements card">
          <h3>Achievements</h3>
          <div className="ach-grid">
            {achievements.map(a => (
              <div key={a.id} className={`ach-card ${a.color}`}>
                <div className="ach-ico">🏅</div>
                <div className="ach-meta">
                  <div className="ach-title">{a.title}</div>
                  <div className="ach-desc">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
