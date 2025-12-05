import React from 'react';
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
  FaChartLine,
  FaBrain,
  FaCircle,
  FaFire,
  FaPalette,
  FaLandmark,
  FaPaintBrush
} from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <Link to="/" className="logo-block">
            <div className="logo-circle">
              {/* Replace with SVG icon if available */}
              <FaLightbulb className="logo-icon" />
            </div>
            <span className="logo-text">SmartLearn</span>
          </Link>
          <nav className="nav-links">
              <Link className="nav-link active" to="/app"><FaHome className="nav-ico" /><span className="label">Home</span></Link>
              <Link className="nav-link" to="/quiz"><FaEdit className="nav-ico" /><span className="label">Quiz</span></Link>
              <Link className="nav-link" to="/notifications"><FaBell className="nav-ico" /><span className="label">Notifications</span></Link>
              <Link className="nav-link" to="/lessons"><FaBook className="nav-ico" /><span className="label">Lessons</span></Link>
              <Link className="nav-link" to="/profile"><FaUser className="nav-ico" /><span className="label">Profile</span></Link>
              <Link className="nav-link" to="/ai-tutor"><FaRobot className="nav-ico" /><span className="label">AI Tutor</span></Link>
              <Link className="nav-link" to="/settings"><FaCog className="nav-ico" /><span className="label">Settings</span></Link>
          </nav>
        </div>
        <div className="sidebar-bottom">
          <Link className="nav-link small" to="/voice-assistant"><FaMicrophone className="nav-ico" /><span className="label">Voice Assistant</span></Link>
          <Link className="nav-link small" to="/ai-insights"><FaChartLine className="nav-ico" /><span className="label">AI Insights</span></Link>
          <div className="ai-buddy-block">
            <div className="ai-buddy-title">AI Buddy</div>
            <div className="ai-buddy-desc">Ready to help you learn something new today!</div>
            <Link className="ai-buddy-chat" to="/ai-tutor">Chat</Link>
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
            <Link to="/notifications" className="search-bell"><FaBell /></Link>
          </div>
          <Link to="/profile" className="profile-area"><HiAcademicCap /></Link>
        </header>
        {/* AI Insight Banner */}
        <section className="ai-banner">
          <div className="ai-banner-content">
            <div>
              <h2>You're doing well in Math!</h2>
              <p>Based on your progress, I recommend trying advanced geometry next.</p>
              <button className="ai-banner-btn">View Recommendations</button>
            </div>
            <div className="ai-banner-icon"><FaBrain /></div>
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
              <FaCircle className="course-icon" style={{ color: '#3b82f6' }} />
              <div className="course-title">Algebra basics</div>
              <div className="course-progress"><div className="progress-bar purple" style={{width:'75%'}}></div></div>
              <button className="course-btn">Continue</button>
            </div>
            <div className="course-card science">
              <FaCircle className="course-icon" style={{ color: '#10b981' }} />
              <div className="course-title">Plant biology</div>
              <div className="course-progress"><div className="progress-bar green" style={{width:'85%'}}></div></div>
              <button className="course-btn">Continue</button>
            </div>
            <div className="course-card english">
              <FaCircle className="course-icon" style={{ color: '#f59e0b' }} />
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
              <FaPalette className="ai-card-illustration" />
              <div className="ai-card-title">Art</div>
              <button className="ai-card-btn">Learn</button>
            </div>
            <div className="ai-card architecture">
              <FaLandmark className="ai-card-illustration" />
              <div className="ai-card-title">Architecture</div>
              <button className="ai-card-btn">Learn</button>
            </div>
            <div className="ai-card design">
              <FaPaintBrush className="ai-card-illustration" />
              <div className="ai-card-title">Design</div>
              <button className="ai-card-btn">Learn</button>
            </div>
          </div>
        </section>
        {/* Learning Streak Section */}
        <section className="streak-section">
          <div className="streak-header">
            <span className="streak-title">Learning Streak</span>
            <FaFire className="streak-flame" />
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
