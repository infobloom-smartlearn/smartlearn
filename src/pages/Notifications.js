import React, {useState} from 'react';
import './Notifications.css';
import { Link } from 'react-router-dom';

const sampleNotifications = [
  {
    id: 1,
    icon: '🏆',
    title: 'Math Progress Achievement',
    body: "Congratulations! You've completed 75% of Algebra basics.",
    tag: 'Achievement',
    tagColor: 'green',
    time: '2m ago',
    unread: false
  },
  {
    id: 2,
    icon: '⏰',
    title: 'Quiz Reminder',
    body: 'Don\'t forget: Math quiz tomorrow at 9:00am',
    tag: 'Reminder',
    tagColor: 'orange',
    time: '1h ago',
    unread: false
  },
  {
    id: 3,
    icon: '🔵',
    title: 'Course Update',
    body: 'New chapter added to Plant Biology: Photosynthesis',
    tag: 'Course',
    tagColor: 'blue',
    time: '6h ago',
    unread: false
  },
  {
    id: 4,
    icon: '🤖',
    title: 'AI Insight',
    body: 'Based on your work, try Advanced Geometry next for a quick win.',
    tag: 'AI Insight',
    tagColor: 'purple',
    time: '1d ago',
    unread: false
  },
  {
    id: 5,
    icon: '🔥',
    title: 'Study Streak',
    body: '4 days in a row — keep it going!',
    tag: 'Streak',
    tagColor: 'orange',
    time: '2d ago',
    unread: false
  }
];

export default function Notifications(){
  const [filter, setFilter] = useState('all');

  const counts = {
    all: 5,
    unread: 0,
    ai: 2,
    updates: 1
  };

  const filtered = (() => {
    if(filter === 'all') return sampleNotifications;
    if(filter === 'unread') return sampleNotifications.filter(n=> n.unread);
    if(filter === 'ai') return sampleNotifications.filter(n=> n.tag === 'AI Insight');
    if(filter === 'updates') return sampleNotifications.filter(n=> n.tag === 'Course');
    return sampleNotifications;
  })();

  return (
    <div className="notifications-root">
      <aside className="notif-sidebar">
        <div className="logo-block">
          <div className="logo-circle">💡</div>
          <div className="logo-text">SmartLearn</div>
        </div>

        <nav className="nav-links">
          <Link className="nav-link" to="/app"><span className="nav-ico">🏠</span><span className="label">Home</span></Link>
          <Link className="nav-link" to="/quiz"><span className="nav-ico">📝</span><span className="label">Quiz</span></Link>
          <Link className="nav-link active" to="/notifications"><span className="nav-ico">🔔</span><span className="label">Notifications</span></Link>
          <Link className="nav-link" to="/app"><span className="nav-ico">📚</span><span className="label">Lessons</span></Link>
          <Link className="nav-link" to="/profile"><span className="nav-ico">👤</span><span className="label">Profile</span></Link>
          <Link className="nav-link" to="/app"><span className="nav-ico">🤖</span><span className="label">AI Tutor</span></Link>
          <Link className="nav-link" to="#"><span className="nav-ico">🎮</span><span className="label">Games</span></Link>
          <Link className="nav-link" to="/settings"><span className="nav-ico">⚙️</span><span className="label">Settings</span></Link>
        </nav>

      </aside>

      <main className="notif-main">
        <header className="notif-header">
          <div className="title-block">
            <h1>Notifications</h1>
            <p className="muted">Stay up-to-date with personalized updates and AI recommendations</p>
          </div>
          <Link to="/profile" className="profile-area">👩‍🎓</Link>
        </header>

        <section className="tabs">
          <button className={`tab ${filter === 'all' ? 'active': ''}`} onClick={()=>setFilter('all')}>All ({counts.all})</button>
          <button className={`tab ${filter === 'unread' ? 'active': ''}`} onClick={()=>setFilter('unread')}>Unread ({counts.unread})</button>
          <button className={`tab ${filter === 'ai' ? 'active': ''}`} onClick={()=>setFilter('ai')}>AI Insights ({counts.ai})</button>
          <button className={`tab ${filter === 'updates' ? 'active': ''}`} onClick={()=>setFilter('updates')}>Updates ({counts.updates})</button>
        </section>

        <section className="notif-content">
          {filter === 'unread' && filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-illustration">📨</div>
              <h3>No Unread Messages</h3>
              <p className="muted">You're all caught up — good job! Check "All" for previous notifications.</p>
            </div>
          ) : (
            <div className="list">
              {filtered.map(item => (
                <article className={`notif-card ${item.unread ? 'unread' : ''}`} key={item.id}>
                  <div className="left">
                    <div className={`notif-icon ${item.tagColor}`}>{item.icon}</div>
                    <div className="notif-body">
                      <div className="notif-title">{item.title}</div>
                      <div className="notif-text">{item.body}</div>
                    </div>
                  </div>
                  <div className="right">
                    <div className={`tag ${item.tagColor}`}>{item.tag}</div>
                    <div className="time">{item.time}</div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
