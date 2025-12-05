import React, {useState} from 'react';
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
  FaChartLine
} from 'react-icons/fa';
import './Settings.css';

export default function Settings(){
  const [emailNotif, setEmailNotif] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  return (
    <div className="settings-root">
      <aside className="settings-sidebar">
        <div className="sidebar-top">
          <div className="logo-block">
            <div className="logo-circle">
              <FaLightbulb className="logo-icon" />
            </div>
            <span className="logo-text">SmartLearn</span>
          </div>
          <nav className="nav-links">
            <Link className="nav-link" to="/app"><FaHome className="nav-ico" /><span className="label">Home</span></Link>
            <Link className="nav-link" to="/quiz"><FaEdit className="nav-ico" /><span className="label">Quiz</span></Link>
            <Link className="nav-link" to="/notifications"><FaBell className="nav-ico" /><span className="label">Notifications</span></Link>
            <Link className="nav-link" to="/lessons"><FaBook className="nav-ico" /><span className="label">Lessons</span></Link>
            <Link className="nav-link" to="/profile"><FaUser className="nav-ico" /><span className="label">Profile</span></Link>
            <Link className="nav-link" to="/ai-tutor"><FaRobot className="nav-ico" /><span className="label">AI Tutor</span></Link>
            <Link className="nav-link active" to="/settings"><FaCog className="nav-ico" /><span className="label">Settings</span></Link>
          </nav>
        </div>
        <div className="sidebar-bottom">
          <Link className="nav-link small" to="#"><FaChartLine className="nav-ico" /><span className="label">AI Insights</span></Link>
          <div className="ai-buddy-block">
            <div className="ai-buddy-title">AI Buddy</div>
            <div className="ai-buddy-desc">Ready to help you learn something new today!</div>
            <Link className="ai-buddy-chat" to="/ai-tutor">Chat</Link>
          </div>
        </div>
      </aside>

      <main className="settings-main">
        <header className="settings-header">
          <h1>Settings</h1>
          <p className="muted">Manage your account, preferences and privacy</p>
        </header>

        <section className="card account-card">
          <h3>Account</h3>
          <div className="row">
            <div className="col">
              <label>Email</label>
              <div className="value">ada@example.com</div>
            </div>
            <div className="col actions">
              <button className="btn small">Change Email</button>
              <button className="btn small outline">Change Password</button>
            </div>
          </div>
        </section>

        <section className="card pref-card">
          <h3>Notifications</h3>
          <div className="row">
            <div className="col">
              <div className="label">Email notifications</div>
              <div className="muted">Receive course updates and recommendations</div>
            </div>
            <div className="col actions">
              <label className="toggle">
                <input type="checkbox" checked={emailNotif} onChange={()=> setEmailNotif(s=>!s)} />
                <span className="switch" />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="label">Push notifications</div>
              <div className="muted">Show quick alerts on your device</div>
            </div>
            <div className="col actions">
              <button className="btn small outline">Configure</button>
            </div>
          </div>
        </section>

        <section className="card prefs-grid">
          <div className="pref-block">
            <h4>Appearance</h4>
            <div className="muted">Control app theme</div>
            <div className="row" style={{marginTop:10}}>
              <label className="toggle">
                <input type="checkbox" checked={darkMode} onChange={()=> setDarkMode(s=>!s)} />
                <span className="switch" />
                <span className="toggle-label">Dark mode</span>
              </label>
            </div>
          </div>

          <div className="pref-block">
            <h4>Language</h4>
            <div className="muted">Select app language</div>
            <select value={language} onChange={(e)=> setLanguage(e.target.value)}>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>Portuguese</option>
            </select>
          </div>

          <div className="pref-block">
            <h4>Learning Preferences</h4>
            <div className="muted">Customize study reminders and goals</div>
            <div className="row" style={{marginTop:8}}>
              <button className="btn small">Manage Goals</button>
            </div>
          </div>

          <div className="pref-block">
            <h4>Privacy & Security</h4>
            <div className="muted">Control data sharing and password</div>
            <div className="row" style={{marginTop:8}}>
              <button className="btn small outline">Privacy Settings</button>
            </div>
          </div>
        </section>

        <section className="card danger-card">
          <h3>Danger Zone</h3>
          <div className="muted">Delete your account and all associated data. This action is irreversible.</div>
          <div style={{marginTop:12}}>
            <button className="btn danger">Delete Account</button>
          </div>
        </section>

      </main>
    </div>
  );
}
