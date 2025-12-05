import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaLightbulb, FaUserGraduate, FaChalkboardTeacher, FaUsers, FaBullseye, FaChartBar, FaBook, FaRobot, FaTrophy } from 'react-icons/fa';
import { HiExclamationCircle } from 'react-icons/hi';
import './SignIn.css';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student'); // 'student', 'teacher', 'parent'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Pre-fill email and userType if coming from signup
  useEffect(() => {
    if (location.state) {
      if (location.state.email) {
        setEmail(location.state.email);
      }
      if (location.state.userType) {
        setUserType(location.state.userType);
      }
    }
  }, [location]);

  // Define handleGoogleSignIn before useEffect
  const handleGoogleSignIn = React.useCallback(async (response) => {
    setGoogleLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate Google authentication
      localStorage.setItem('token', 'simulated_google_token_' + Date.now());
      localStorage.setItem('userType', userType);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Redirect based on user type to their respective dashboard
      if (userType === 'teacher') {
        navigate('/teacher');
      } else if (userType === 'parent') {
        navigate('/parent');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during Google sign-in');
      console.error('Google sign-in error:', err);
    } finally {
      setGoogleLoading(false);
    }
  }, [userType, navigate]);

  // Load Google OAuth script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
          callback: handleGoogleSignIn,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [handleGoogleSignIn]); // Re-initialize when callback changes

  const handleGoogleButtonClick = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google Sign-In is not available. Please check your configuration.');
    }
  };

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

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate authentication - accept any email/password combination
      // Store authentication state
      localStorage.setItem('token', 'simulated_token_' + Date.now());
      localStorage.setItem('userType', userType);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Redirect based on user type to their respective dashboard
      if (userType === 'teacher') {
        navigate('/teacher');
      } else if (userType === 'parent') {
        navigate('/parent');
      } else {
        navigate('/onboarding');
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
            <div className="logo-container">
              <div className="logo-icon">
                <FaLightbulb />
              </div>
              <span className="logo-text">SmartLearn</span>
            </div>
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
                <span className="icon"><FaUserGraduate /></span>
                <span className="label">Student</span>
              </button>
              <button
                type="button"
                className={`user-type-btn ${userType === 'teacher' ? 'active' : ''}`}
                onClick={() => setUserType('teacher')}
              >
                <span className="icon"><FaChalkboardTeacher /></span>
                <span className="label">Teacher</span>
              </button>
              <button
                type="button"
                className={`user-type-btn ${userType === 'parent' ? 'active' : ''}`}
                onClick={() => setUserType('parent')}
              >
                <span className="icon"><FaUsers /></span>
                <span className="label">Parent</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <HiExclamationCircle className="error-icon" />
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
              disabled={loading || googleLoading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="form-divider">
            <span>Or continue with</span>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            className="google-signin-btn"
            onClick={handleGoogleButtonClick}
            disabled={loading || googleLoading}
          >
            {googleLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: '8px' }}>
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.467-.806 5.96-2.184l-2.908-2.258c-.806.54-1.837.86-3.052.86-2.347 0-4.332-1.585-5.043-3.715H.957v2.332C2.438 15.983 5.482 18 9 18z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.957 10.713c-.18-.54-.282-1.117-.282-1.713s.102-1.173.282-1.713V4.955H.957C.348 6.173 0 7.55 0 9s.348 2.827.957 4.045l3-2.332z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.955L3.957 7.287C4.668 5.157 6.653 3.58 9 3.58z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="form-divider">
            <span>Don't have an account?</span>
          </div>

          {/* Sign Up Link */}
          <button
            type="button"
            className="signup-btn"
            onClick={handleSignUp}
            disabled={loading || googleLoading}
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
                <FaBullseye className="feature-icon" />
                <span>Personalized Learning Paths</span>
              </li>
              <li>
                <FaRobot className="feature-icon" />
                <span>AI-Powered Tutoring</span>
              </li>
              <li>
                <FaChartBar className="feature-icon" />
                <span>Progress Tracking & Analytics</span>
              </li>
              <li>
                <FaTrophy className="feature-icon" />
                <span>Achievements & Gamification</span>
              </li>
              <li>
                <FaBook className="feature-icon" />
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
