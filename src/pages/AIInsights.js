import React, { useState } from 'react';
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
  FaTrophy,
  FaClock,
  FaChartBar,
  FaBrain,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle
} from 'react-icons/fa';
import './AIInsights.css';

export default function AIInsights() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const insights = {
    performance: {
      overall: 87,
      change: +5,
      subjects: [
        { name: 'Math', score: 92, trend: 'up', color: '#3b82f6' },
        { name: 'Science', score: 85, trend: 'up', color: '#10b981' },
        { name: 'English', score: 88, trend: 'down', color: '#f59e0b' },
        { name: 'History', score: 83, trend: 'up', color: '#8b5cf6' }
      ]
    },
    learning: {
      hours: 28,
      change: +12,
      streak: 7,
      lessonsCompleted: 35,
      quizzesCompleted: 12
    },
    recommendations: [
      {
        id: 1,
        type: 'strength',
        title: 'Math is your strongest subject',
        description: 'You\'re excelling in algebra. Consider exploring advanced geometry next.',
        action: 'Explore Geometry',
        icon: FaTrophy,
        color: '#3b82f6'
      },
      {
        id: 2,
        type: 'improvement',
        title: 'English needs attention',
        description: 'Your English scores dropped slightly. Review literature concepts.',
        action: 'Review Lessons',
        icon: FaBrain,
        color: '#f59e0b'
      },
      {
        id: 3,
        type: 'goal',
        title: 'Maintain your streak',
        description: 'You\'re on a 7-day streak! Keep it going to unlock achievements.',
        action: 'Continue Learning',
        icon: FaCheckCircle,
        color: '#10b981'
      }
    ],
    trends: [
      { day: 'Mon', value: 75 },
      { day: 'Tue', value: 82 },
      { day: 'Wed', value: 88 },
      { day: 'Thu', value: 85 },
      { day: 'Fri', value: 90 },
      { day: 'Sat', value: 87 },
      { day: 'Sun', value: 92 }
    ],
    achievements: [
      { id: 1, title: 'Math Master', desc: 'Scored 90+ in 5 math quizzes', icon: '🏆', unlocked: true },
      { id: 2, title: 'Quick Learner', desc: 'Completed 10 lessons in a week', icon: '⚡', unlocked: true },
      { id: 3, title: 'Perfect Week', desc: '7-day learning streak', icon: '🔥', unlocked: true },
      { id: 4, title: 'Science Explorer', desc: 'Complete 20 science lessons', icon: '🔬', unlocked: false }
    ]
  };

  return (
    <div className="ai-insights-root">
      <aside className="insights-sidebar">
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
            <Link className="nav-link" to="/settings"><FaCog className="nav-ico" /><span className="label">Settings</span></Link>
          </nav>
        </div>
        <div className="sidebar-bottom">
          <Link className="nav-link" to="/voice-assistant"><FaMicrophone className="nav-ico" /><span className="label">Voice Assistant</span></Link>
          <Link className="nav-link active" to="/ai-insights"><FaChartLine className="nav-ico" /><span className="label">AI Insights</span></Link>
          <div className="ai-buddy-block">
            <div className="ai-buddy-title">AI Buddy</div>
            <div className="ai-buddy-desc">Ready to help you learn something new today!</div>
            <Link className="ai-buddy-chat" to="/ai-tutor">Chat</Link>
          </div>
        </div>
      </aside>

      <main className="insights-main">
        <header className="insights-header">
          <div className="header-content">
            <h1>AI Insights</h1>
            <p className="muted">Personalized analytics and recommendations based on your learning</p>
          </div>
          <div className="period-selector">
            <button 
              className={selectedPeriod === 'week' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('week')}
            >
              Week
            </button>
            <button 
              className={selectedPeriod === 'month' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('month')}
            >
              Month
            </button>
            <button 
              className={selectedPeriod === 'year' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('year')}
            >
              Year
            </button>
          </div>
        </header>

        {/* Performance Overview */}
        <section className="insights-section">
          <div className="section-title">
            <FaChartBar className="title-icon" />
            <h2>Performance Overview</h2>
          </div>
          <div className="performance-grid">
            <div className="performance-card main">
              <div className="card-header">
                <span className="card-label">Overall Score</span>
                <div className="trend-badge positive">
                  <FaArrowUp />
                  <span>{insights.performance.change}%</span>
                </div>
              </div>
              <div className="score-display">
                <span className="score-value">{insights.performance.overall}</span>
                <span className="score-unit">%</span>
              </div>
              <p className="card-desc">Improved from last week</p>
            </div>
            {insights.performance.subjects.map((subject, index) => (
              <div key={index} className="performance-card subject">
                <div className="subject-header">
                  <span className="subject-name">{subject.name}</span>
                  <div className={`trend-icon ${subject.trend}`}>
                    {subject.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                  </div>
                </div>
                <div className="subject-score" style={{ color: subject.color }}>
                  {subject.score}%
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${subject.score}%`, backgroundColor: subject.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Stats */}
        <section className="insights-section">
          <div className="section-title">
            <FaClock className="title-icon" />
            <h2>Learning Statistics</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #AA33F0, #CF7DEF)' }}>
                <FaClock />
              </div>
              <div className="stat-content">
                <div className="stat-value">{insights.learning.hours}h</div>
                <div className="stat-label">Study Hours</div>
                <div className="stat-change positive">
                  <FaArrowUp /> {insights.learning.change}% increase
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <FaTrophy />
              </div>
              <div className="stat-content">
                <div className="stat-value">{insights.learning.streak}</div>
                <div className="stat-label">Day Streak</div>
                <div className="stat-change positive">Keep it going!</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                <FaBook />
              </div>
              <div className="stat-content">
                <div className="stat-value">{insights.learning.lessonsCompleted}</div>
                <div className="stat-label">Lessons Completed</div>
                <div className="stat-change positive">Great progress!</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <FaEdit />
              </div>
              <div className="stat-content">
                <div className="stat-value">{insights.learning.quizzesCompleted}</div>
                <div className="stat-label">Quizzes Completed</div>
                <div className="stat-change positive">Well done!</div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Recommendations */}
        <section className="insights-section">
          <div className="section-title">
            <FaBrain className="title-icon" />
            <h2>AI Recommendations</h2>
          </div>
          <div className="recommendations-grid">
            {insights.recommendations.map(rec => {
              const IconComponent = rec.icon;
              return (
                <div key={rec.id} className="recommendation-card" style={{ borderLeftColor: rec.color }}>
                  <div className="rec-header">
                    <div className="rec-icon" style={{ background: `${rec.color}20`, color: rec.color }}>
                      <IconComponent />
                    </div>
                    <span className="rec-type">{rec.type}</span>
                  </div>
                  <h3 className="rec-title">{rec.title}</h3>
                  <p className="rec-desc">{rec.description}</p>
                  <button className="rec-action" style={{ background: rec.color }}>
                    {rec.action}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Performance Trend */}
        <section className="insights-section">
          <div className="section-title">
            <FaChartLine className="title-icon" />
            <h2>Performance Trend</h2>
          </div>
          <div className="trend-chart">
            <div className="chart-bars">
              {insights.trends.map((item, index) => (
                <div key={index} className="chart-bar-container">
                  <div 
                    className="chart-bar" 
                    style={{ height: `${item.value}%`, background: 'linear-gradient(180deg, #AA33F0, #CF7DEF)' }}
                  >
                    <span className="bar-value">{item.value}%</span>
                  </div>
                  <span className="bar-label">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="insights-section">
          <div className="section-title">
            <FaTrophy className="title-icon" />
            <h2>Achievements</h2>
          </div>
          <div className="achievements-grid">
            {insights.achievements.map(ach => (
              <div key={ach.id} className={`achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">{ach.icon}</div>
                <div className="achievement-content">
                  <h3 className="achievement-title">{ach.title}</h3>
                  <p className="achievement-desc">{ach.desc}</p>
                </div>
                {ach.unlocked && (
                  <div className="achievement-badge">
                    <FaCheckCircle />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

