import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="logo-block">
            <div className="logo-circle">
              {/* Replace with SVG icon if available */}
              <span className="logo-icon">💡</span>
            </div>
            <span className="logo-text">Smart Learn</span>
          </div>
          <nav className="nav-links">
            <Link className="nav-link active" to="/"><span className="nav-ico">🏠</span>Home</Link>
            <Link className="nav-link" to="#"><span className="nav-ico">📝</span>Quiz</Link>
            <Link className="nav-link" to="/notifications"><span className="nav-ico">🔔</span>Notification</Link>
            <Link className="nav-link" to="#"><span className="nav-ico">📚</span>Lessons</Link>
            <Link className="nav-link" to="/profile"><span className="nav-ico">👤</span>Profile</Link>
            <Link className="nav-link" to="#"><span className="nav-ico">🤖</span>AI Tutor</Link>
            <Link className="nav-link" to="#"><span className="nav-ico">⚙️</span>Settings</Link>
          </nav>
        </div>
        <div className="sidebar-bottom">
          <a className="nav-link small" href="#"><span className="nav-ico">🎤</span>Voice Assistant</a>
          <a className="nav-link small" href="#"><span className="nav-ico">📈</span>AI Insights</a>
          <div className="ai-buddy-block">
            <div className="ai-buddy-title">AI Buddy</div>
            <div className="ai-buddy-desc">Ready to help you learn something new today!</div>
            <button className="ai-buddy-chat">Chat</button>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="greeting">
            <h1>Welcome Ada</h1>
            <p>Let's continue your learning journey.</p>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search Courses..." />
            <Link to="/notifications" className="search-bell">🔔</Link>
          </div>
          <Link to="/profile" className="profile-area">👩‍🎓</Link>
        </header>
        {/* AI Insight Banner */}
        <section className="ai-banner">
          <div className="ai-banner-content">
            <div>
              <h2>You're doing well in Math!</h2>
              <p>Based on your progress, I recommend trying advanced geometry next.</p>
              <button className="ai-banner-btn">View Recommendations</button>
            </div>
            <div className="ai-banner-icon">🧠</div>
          </div>
        </section>
        {/* Continue Learning Section */}
        <section className="continue-section">
          <div className="section-header">
            <h3>Continue Learning</h3>
            <a className="view-all" href="#">View All</a>
          </div>
          <div className="course-cards">
            <div className="course-card math">
              <div className="course-icon">🔵</div>
              <div className="course-title">Algebra basics</div>
              <div className="course-progress"><div className="progress-bar purple" style={{width:'75%'}}></div></div>
              <button className="course-btn">Continue</button>
            </div>
            <div className="course-card science">
              <div className="course-icon">🟢</div>
              <div className="course-title">Plant biology</div>
              <div className="course-progress"><div className="progress-bar green" style={{width:'85%'}}></div></div>
              <button className="course-btn">Continue</button>
            </div>
            <div className="course-card english">
              <div className="course-icon">🟠</div>
              <div className="course-title">Metaphors</div>
              <div className="course-progress"><div className="progress-bar red" style={{width:'77%'}}></div></div>
              <button className="course-btn">Continue</button>
            </div>
          </div>
        </section>
        {/* AI Recommended Section */}
        <section className="ai-recommended">
          <h3>AI recommended</h3>
          <div className="ai-cards">
            <div className="ai-card art">
              <div className="ai-card-illustration">🎨</div>
              <div className="ai-card-title">Art</div>
              <button className="ai-card-btn">Learn</button>
            </div>
            <div className="ai-card architecture">
              <div className="ai-card-illustration">🏛️</div>
              <div className="ai-card-title">Architecture</div>
              <button className="ai-card-btn">Learn</button>
            </div>
            <div className="ai-card design">
              <div className="ai-card-illustration">🖌️</div>
              <div className="ai-card-title">Design</div>
              <button className="ai-card-btn">Learn</button>
            </div>
          </div>
        </section>
        {/* Learning Streak Section */}
        <section className="streak-section">
          <div className="streak-header">
            <span className="streak-title">Learning Streak</span>
            <span className="streak-flame">🔥</span>
          </div>
          <div className="streak-days">4 days in a row.</div>
          <div className="streak-circles">
            <span className="circle checked">M</span>
            <span className="circle checked">T</span>
            <span className="circle checked">W</span>
            <span className="circle checked">T</span>
            <span className="circle">F</span>
            <span className="circle">S</span>
            <span className="circle">S</span>
          </div>
        </section>
      </main>
    </div>
  );
}
