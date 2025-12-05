import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FaCheck,
  FaTimes,
  FaSave
} from 'react-icons/fa';
import './Settings.css';

export default function Settings(){
  const navigate = useNavigate();
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || 'ada@example.com');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [goals, setGoals] = useState({
    dailyStudyTime: 60,
    weeklyLessons: 5,
    weeklyQuizzes: 3,
    reminderTime: '09:00'
  });
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: true,
    analytics: true,
    personalizedAds: false
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedEmailNotif = localStorage.getItem('emailNotifications');
    const savedPushNotif = localStorage.getItem('pushNotifications');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedLanguage = localStorage.getItem('language');
    const savedGoals = localStorage.getItem('learningGoals');
    const savedPrivacy = localStorage.getItem('privacySettings');

    if (savedEmailNotif !== null) setEmailNotif(savedEmailNotif === 'true');
    if (savedPushNotif !== null) setPushNotif(savedPushNotif === 'true');
    if (savedDarkMode !== null) {
      const isDark = savedDarkMode === 'true';
      setDarkMode(isDark);
      // Apply dark mode on mount
      if (isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedPrivacy) setPrivacySettings(JSON.parse(savedPrivacy));
  }, []);

  // Save settings to localStorage
  const saveSetting = (key, value) => {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
  };

  const handleEmailNotifChange = (value) => {
    setEmailNotif(value);
    saveSetting('emailNotifications', value);
    showSuccess('Email notifications updated');
  };

  const handlePushNotifChange = (value) => {
    setPushNotif(value);
    saveSetting('pushNotifications', value);
    showSuccess('Push notifications updated');
  };

  const handleDarkModeChange = (value) => {
    setDarkMode(value);
    saveSetting('darkMode', value);
    showSuccess('Appearance updated');
    // Apply dark mode to body
    if (value) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    saveSetting('language', value);
    showSuccess('Language updated');
  };

  const handleEditEmail = () => {
    setIsEditingEmail(true);
    setNewEmail(email);
  };

  const handleCancelEmailEdit = () => {
    setIsEditingEmail(false);
    setNewEmail('');
  };

  const handleSaveEmail = () => {
    if (!newEmail || !newEmail.includes('@')) {
      showError('Please enter a valid email address');
      return;
    }
    setEmail(newEmail);
    localStorage.setItem('userEmail', newEmail);
    setIsEditingEmail(false);
    showSuccess('Email updated successfully');
  };

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  const handleSavePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showError('Please fill in all password fields');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }
    // Simulate password change
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowChangePassword(false);
    showSuccess('Password changed successfully');
  };

  const handleSaveGoals = () => {
    saveSetting('learningGoals', goals);
    setShowGoalsModal(false);
    showSuccess('Learning goals updated');
  };

  const handleSavePrivacy = () => {
    saveSetting('privacySettings', privacySettings);
    setShowPrivacyModal(false);
    showSuccess('Privacy settings updated');
  };

  const handleDeleteAccount = () => {
    // Simulate account deletion
    localStorage.clear();
    showSuccess('Account deleted successfully. Redirecting...');
    setTimeout(() => {
      navigate('/signin');
    }, 2000);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setSuccessMessage('');
    setTimeout(() => setErrorMessage(''), 3000);
  };

  return (
    <div className="settings-root">
      <aside className="settings-sidebar">
        <div className="sidebar-top">
          <Link to="/" className="logo-block">
            <div className="logo-circle">
              <FaLightbulb className="logo-icon" />
            </div>
            <span className="logo-text">SmartLearn</span>
          </Link>
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
          <Link className="nav-link" to="/voice-assistant"><FaMicrophone className="nav-ico" /><span className="label">Voice Assistant</span></Link>
          <Link className="nav-link small" to="/ai-insights"><FaChartLine className="nav-ico" /><span className="label">AI Insights</span></Link>
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

        {(successMessage || errorMessage) && (
          <div className={`message-banner ${successMessage ? 'success' : 'error'}`}>
            {successMessage ? successMessage : errorMessage}
            <button onClick={() => { setSuccessMessage(''); setErrorMessage(''); }} className="close-btn">
              <FaTimes />
            </button>
          </div>
        )}

        <section className="card account-card">
          <h3>Account</h3>
          <div className="row">
            <div className="col">
              <label>Email</label>
              {isEditingEmail ? (
                <div className="edit-field">
                  <input 
                    type="email" 
                    value={newEmail} 
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="input-field"
                    placeholder="Enter new email"
                  />
                  <div className="edit-actions">
                    <button onClick={handleSaveEmail} className="btn-icon save">
                      <FaCheck />
                    </button>
                    <button onClick={handleCancelEmailEdit} className="btn-icon cancel">
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="value">{email}</div>
              )}
            </div>
            <div className="col actions">
              {!isEditingEmail && (
                <>
                  <button onClick={handleEditEmail} className="btn small">
                    <FaEdit style={{ marginRight: '4px' }} />
                    Change Email
                  </button>
                  <button onClick={handleChangePassword} className="btn small outline">Change Password</button>
                </>
              )}
            </div>
          </div>
        </section>

        {showChangePassword && (
          <section className="card password-card">
            <h3>Change Password</h3>
            <div className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="input-field"
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="input-field"
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="input-field"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="form-actions">
                <button onClick={handleSavePassword} className="btn small">
                  <FaSave style={{ marginRight: '4px' }} />
                  Save Password
                </button>
                <button onClick={() => { setShowChangePassword(false); setPasswordData({currentPassword: '', newPassword: '', confirmPassword: ''}); }} className="btn small outline">
                  Cancel
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="card pref-card">
          <h3>Notifications</h3>
          <div className="row">
            <div className="col">
              <div className="label">Email notifications</div>
              <div className="muted">Receive course updates and recommendations</div>
            </div>
            <div className="col actions">
              <label className="toggle">
                <input type="checkbox" checked={emailNotif} onChange={(e)=> handleEmailNotifChange(e.target.checked)} />
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
              <label className="toggle">
                <input type="checkbox" checked={pushNotif} onChange={(e)=> handlePushNotifChange(e.target.checked)} />
                <span className="switch" />
              </label>
            </div>
          </div>
        </section>

        <section className="card prefs-grid">
          <div className="pref-block">
            <h4>Appearance</h4>
            <div className="muted">Control app theme</div>
            <div className="row" style={{marginTop:10}}>
              <label className="toggle">
                <input type="checkbox" checked={darkMode} onChange={(e)=> handleDarkModeChange(e.target.checked)} />
                <span className="switch" />
                <span className="toggle-label">Dark mode</span>
              </label>
            </div>
          </div>

          <div className="pref-block">
            <h4>Language</h4>
            <div className="muted">Select app language</div>
            <select value={language} onChange={(e)=> handleLanguageChange(e.target.value)}>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>Portuguese</option>
              <option>German</option>
              <option>Italian</option>
            </select>
          </div>

          <div className="pref-block">
            <h4>Learning Preferences</h4>
            <div className="muted">Customize study reminders and goals</div>
            <div className="row" style={{marginTop:8}}>
              <button onClick={() => setShowGoalsModal(true)} className="btn small">Manage Goals</button>
            </div>
          </div>

          <div className="pref-block">
            <h4>Privacy & Security</h4>
            <div className="muted">Control data sharing and password</div>
            <div className="row" style={{marginTop:8}}>
              <button onClick={() => setShowPrivacyModal(true)} className="btn small outline">Privacy Settings</button>
            </div>
          </div>
        </section>

        <section className="card danger-card">
          <h3>Danger Zone</h3>
          <div className="muted">Delete your account and all associated data. This action is irreversible.</div>
          <div className="danger-actions">
            <button onClick={() => setShowDeleteConfirm(true)} className="btn danger">Delete Account</button>
          </div>
        </section>

        {/* Learning Goals Modal */}
        {showGoalsModal && (
          <div className="modal-overlay" onClick={() => setShowGoalsModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Learning Goals</h3>
                <button onClick={() => setShowGoalsModal(false)} className="modal-close">
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Daily Study Time (minutes)</label>
                  <input 
                    type="number" 
                    value={goals.dailyStudyTime}
                    onChange={(e) => setGoals({...goals, dailyStudyTime: parseInt(e.target.value) || 0})}
                    className="input-field"
                    min="15"
                    max="480"
                  />
                </div>
                <div className="form-group">
                  <label>Weekly Lessons Goal</label>
                  <input 
                    type="number" 
                    value={goals.weeklyLessons}
                    onChange={(e) => setGoals({...goals, weeklyLessons: parseInt(e.target.value) || 0})}
                    className="input-field"
                    min="1"
                    max="20"
                  />
                </div>
                <div className="form-group">
                  <label>Weekly Quizzes Goal</label>
                  <input 
                    type="number" 
                    value={goals.weeklyQuizzes}
                    onChange={(e) => setGoals({...goals, weeklyQuizzes: parseInt(e.target.value) || 0})}
                    className="input-field"
                    min="1"
                    max="20"
                  />
                </div>
                <div className="form-group">
                  <label>Daily Reminder Time</label>
                  <input 
                    type="time" 
                    value={goals.reminderTime}
                    onChange={(e) => setGoals({...goals, reminderTime: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={handleSaveGoals} className="btn">
                  <FaSave style={{ marginRight: '4px' }} />
                  Save Goals
                </button>
                <button onClick={() => setShowGoalsModal(false)} className="btn outline">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Settings Modal */}
        {showPrivacyModal && (
          <div className="modal-overlay" onClick={() => setShowPrivacyModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Privacy & Security Settings</h3>
                <button onClick={() => setShowPrivacyModal(false)} className="modal-close">
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col">
                    <div className="label">Data Sharing</div>
                    <div className="muted">Allow SmartLearn to use your data for improving the platform</div>
                  </div>
                  <div className="col actions">
                    <label className="toggle">
                      <input 
                        type="checkbox" 
                        checked={privacySettings.dataSharing}
                        onChange={(e) => setPrivacySettings({...privacySettings, dataSharing: e.target.checked})}
                      />
                      <span className="switch" />
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="label">Analytics</div>
                    <div className="muted">Help us improve by sharing usage analytics</div>
                  </div>
                  <div className="col actions">
                    <label className="toggle">
                      <input 
                        type="checkbox" 
                        checked={privacySettings.analytics}
                        onChange={(e) => setPrivacySettings({...privacySettings, analytics: e.target.checked})}
                      />
                      <span className="switch" />
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="label">Personalized Ads</div>
                    <div className="muted">Show personalized advertisements based on your interests</div>
                  </div>
                  <div className="col actions">
                    <label className="toggle">
                      <input 
                        type="checkbox" 
                        checked={privacySettings.personalizedAds}
                        onChange={(e) => setPrivacySettings({...privacySettings, personalizedAds: e.target.checked})}
                      />
                      <span className="switch" />
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={handleSavePrivacy} className="btn">
                  <FaSave style={{ marginRight: '4px' }} />
                  Save Settings
                </button>
                <button onClick={() => setShowPrivacyModal(false)} className="btn outline">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="modal-content danger-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Delete Account</h3>
                <button onClick={() => setShowDeleteConfirm(false)} className="modal-close">
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <p className="warning-text">
                  Are you sure you want to delete your account? This action cannot be undone. 
                  All your data, progress, and achievements will be permanently deleted.
                </p>
                <p className="muted">Type "DELETE" to confirm:</p>
                <input 
                  type="text" 
                  id="deleteConfirm"
                  className="input-field"
                  placeholder="Type DELETE to confirm"
                />
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowDeleteConfirm(false)} className="btn outline">Cancel</button>
                <button 
                  onClick={() => {
                    const confirm = document.getElementById('deleteConfirm').value;
                    if (confirm === 'DELETE') {
                      handleDeleteAccount();
                      setShowDeleteConfirm(false);
                    } else {
                      showError('Please type DELETE to confirm');
                    }
                  }} 
                  className="btn danger"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
