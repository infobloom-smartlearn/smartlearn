import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student'); // 'student', 'teacher', 'parent'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!email.trim()) {
        setError('Email is required');
        setLoading(false);
        return;
      }
      if (!password.trim()) {
        setError('Password is required');
        setLoading(false);
        return;
      }

      // Call backend login endpoint
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email, // Backend expects username field (which is email)
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed. Please check your credentials.');
      }

      const data = await response.json();
      
      // Store token in localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userType', userType); // Store the selected user type
      
      // Redirect based on user type
      if (userType === 'teacher') {
        navigate('/dashboard'); // Teachers go to dashboard
      } else if (userType === 'parent') {
        navigate('/dashboard'); // Parents go to dashboard
      } else {
        navigate('/dashboard'); // Students go to dashboard
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="signin-container">
      <div className="signin-wrapper">
        <div className="signin-card">
          {/* Header */}
          <div className="signin-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your SmartLearn account</p>
          </div>

          {/* User Type Selection */}
          <div className="user-type-selector">
            <p className="selector-label">I'm signing in as a:</p>
            <div className="user-type-buttons">
              <button
                type="button"
                className={`user-type-btn ${userType === 'student' ? 'active' : ''}`}
                onClick={() => setUserType('student')}
              >
                <span className="icon">👨‍🎓</span>
                <span className="label">Student</span>
              </button>
              <button
                type="button"
                className={`user-type-btn ${userType === 'teacher' ? 'active' : ''}`}
                onClick={() => setUserType('teacher')}
              >
                <span className="icon">👩‍🏫</span>
                <span className="label">Teacher</span>
              </button>
              <button
                type="button"
                className={`user-type-btn ${userType === 'parent' ? 'active' : ''}`}
                onClick={() => setUserType('parent')}
              >
                <span className="icon">👨‍👩‍👧</span>
                <span className="label">Parent</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="signin-form">
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#forgot-password" className="forgot-password">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="signin-btn"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="form-divider">
            <span>Don't have an account?</span>
          </div>

          {/* Sign Up Link */}
          <button
            type="button"
            className="signup-btn"
            onClick={handleSignUp}
            disabled={loading}
          >
            Create a new account
          </button>

          {/* Footer Links */}
          <div className="signin-footer">
            <a href="#terms">Terms of Service</a>
            <span className="separator">•</span>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>

        {/* Side Information Panel */}
        <div className="signin-info-panel">
          <div className="info-content">
            <h2>Why SmartLearn?</h2>
            <ul className="features-list">
              <li>
                <span className="feature-icon">🎯</span>
                <span>Personalized Learning Paths</span>
              </li>
              <li>
                <span className="feature-icon">🤖</span>
                <span>AI-Powered Tutoring</span>
              </li>
              <li>
                <span className="feature-icon">📊</span>
                <span>Progress Tracking & Analytics</span>
              </li>
              <li>
                <span className="feature-icon">🏆</span>
                <span>Achievements & Gamification</span>
              </li>
              <li>
                <span className="feature-icon">📚</span>
                <span>Rich Learning Content</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
