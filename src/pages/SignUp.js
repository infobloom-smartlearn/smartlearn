import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLightbulb, FaUserGraduate, FaChalkboardTeacher, FaUsers, FaCheck, FaBook } from 'react-icons/fa';
import { HiExclamationCircle } from 'react-icons/hi';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    userType: 'student', // 'student', 'teacher', 'parent'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Define handleGoogleSignUp before useEffect
  const handleGoogleSignUp = React.useCallback(async (response) => {
    setGoogleLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate Google registration - store user data (but not authentication token)
      localStorage.setItem('userType', formData.userType);
      
      // Show success message
      setSuccess('Account created successfully! Redirecting to sign in page...');
      
      // Redirect to sign in page
      setTimeout(() => {
        navigate('/signin', {
          state: { userType: formData.userType },
        });
      }, 1500);
    } catch (err) {
      setError(err.message || 'An error occurred during Google sign-up');
      console.error('Google sign-up error:', err);
    } finally {
      setGoogleLoading(false);
    }
  }, [formData.userType, navigate]);

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
          callback: handleGoogleSignUp,
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
  }, [handleGoogleSignUp]); // Re-initialize when callback changes

  const handleGoogleButtonClick = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google Sign-In is not available. Please check your configuration.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleUserTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      userType: type,
    }));
  };

  const validateForm = () => {
    // Email validation
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // First name validation
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }

    // Password validation
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    // Password strength check
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      );
      return false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Terms agreement
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return false;
    }

    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate registration - store user data (but not authentication token)
      localStorage.setItem('userType', formData.userType);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`);

      // Show success message
      setSuccess(
        'Account created successfully! Redirecting to sign in page...'
      );

      // Redirect to sign in page after 1.5 seconds
      setTimeout(() => {
        navigate('/signin', {
          state: { email: formData.email, userType: formData.userType },
        });
      }, 1500);
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const passwordStrengthText = [
    'Very Weak',
    'Weak',
    'Fair',
    'Good',
    'Strong',
    'Very Strong',
  ];

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        {/* Sign Up Card */}
        <div className="signup-card">
          {/* Header */}
          <div className="signup-header">
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px', 
              marginBottom: '24px' 
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(90deg, #AA33F0 0%, #CF7DEF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(170, 51, 240, 0.3)'
              }}>
                <FaLightbulb />
              </div>
              <span style={{
                fontFamily: "'DynaPuff', cursive",
                fontSize: '28px',
                fontWeight: 400,
                background: 'linear-gradient(90deg, #AA33F0 0%, #CF7DEF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                SmartLearn
              </span>
            </div>
            <h1>Create Account</h1>
            <p>Join SmartLearn and start learning today</p>
          </div>

          {/* User Type Selection */}
          <div className="user-type-selector">
            <p className="selector-label">I'm signing up as a:</p>
            <div className="user-type-buttons">
              <button
                type="button"
                className={`user-type-btn ${
                  formData.userType === 'student' ? 'active' : ''
                }`}
                onClick={() => handleUserTypeChange('student')}
              >
                <span className="icon"><FaUserGraduate /></span>
                <span className="label">Student</span>
              </button>
              <button
                type="button"
                className={`user-type-btn ${
                  formData.userType === 'teacher' ? 'active' : ''
                }`}
                onClick={() => handleUserTypeChange('teacher')}
              >
                <span className="icon"><FaChalkboardTeacher /></span>
                <span className="label">Teacher</span>
              </button>
              <button
                type="button"
                className={`user-type-btn ${
                  formData.userType === 'parent' ? 'active' : ''
                }`}
                onClick={() => handleUserTypeChange('parent')}
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

          {/* Success Message */}
          {success && (
            <div className="success-message">
              <FaCheck className="success-icon" />
              <span>{success}</span>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="signup-form">
            {/* Name Fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
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
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
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
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className={`strength-fill strength-${passwordStrength}`}
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className={`strength-text strength-${passwordStrength}`}>
                    Password Strength: {passwordStrengthText[passwordStrength]}
                  </p>
                </div>
              )}
              <p className="password-requirements">
                Password must contain:
              </p>
              <ul className="requirements-list">
                <li
                  className={
                    formData.password.length >= 8 ? 'met' : 'unmet'
                  }
                >
                  <FaCheck style={{ marginRight: '6px', fontSize: '12px' }} /> At least 8 characters
                </li>
                <li
                  className={
                    /[A-Z]/.test(formData.password) &&
                    /[a-z]/.test(formData.password)
                      ? 'met'
                      : 'unmet'
                  }
                >
                  <FaCheck style={{ marginRight: '6px', fontSize: '12px' }} /> Mix of uppercase and lowercase letters
                </li>
                <li
                  className={
                    /[0-9]/.test(formData.password) ? 'met' : 'unmet'
                  }
                >
                  <FaCheck style={{ marginRight: '6px', fontSize: '12px' }} /> At least one number
                </li>
              </ul>
            </div>

            {/* Confirm Password Input */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {formData.confirmPassword && formData.password && (
                <p
                  className={`password-match ${
                    formData.password === formData.confirmPassword
                      ? 'match'
                      : 'mismatch'
                  }`}
                >
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <FaCheck style={{ marginRight: '6px', fontSize: '12px' }} />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <HiExclamationCircle style={{ marginRight: '6px', fontSize: '12px' }} />
                      Passwords do not match
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="terms-agreement">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  disabled={loading}
                />
                <span>
                  I agree to the{' '}
                  <a href="#terms">Terms of Service</a> and{' '}
                  <a href="#privacy">Privacy Policy</a>
                </span>
              </label>
            </div>

            {/* Sign Up Button */}
            <button type="submit" className="signup-btn" disabled={loading || googleLoading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="form-divider">
            <span>Or continue with</span>
          </div>

          {/* Google Sign Up Button */}
          <button
            type="button"
            className="google-signin-btn"
            onClick={handleGoogleButtonClick}
            disabled={loading || googleLoading}
          >
            {googleLoading ? (
              <span>Creating account...</span>
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
                <span>Sign up with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="form-divider">
            <span>Already have an account?</span>
          </div>

          {/* Sign In Link */}
          <button
            type="button"
            className="signin-link-btn"
            onClick={() => navigate('/signin')}
            disabled={loading || googleLoading}
          >
            Sign In Instead
          </button>

          {/* Footer Links */}
          <div className="signup-footer">
            <a href="#terms">Terms of Service</a>
            <span className="separator">•</span>
            <a href="#privacy">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#contact">Contact Support</a>
          </div>
        </div>

        {/* Side Information Panel */}
        <div className="signup-info-panel">
          <div className="info-content">
            <h2>Get Started Learning</h2>
            <ul className="benefits-list">
              <li>
                <span className="benefit-icon">🎓</span>
                <span>
                  <strong>Personalized</strong> learning paths tailored to you
                </span>
              </li>
              <li>
                <span className="benefit-icon">🤖</span>
                <span>
                  <strong>AI Tutor</strong> available 24/7 for help
                </span>
              </li>
              <li>
                <span className="benefit-icon">📈</span>
                <span>
                  <strong>Track Progress</strong> with detailed analytics
                </span>
              </li>
              <li>
                <span className="benefit-icon">🏆</span>
                <span>
                  <strong>Earn Badges</strong> and celebrate achievements
                </span>
              </li>
              <li>
                <FaBook className="benefit-icon" />
                <span>
                  <strong>Rich Content</strong> across multiple subjects
                </span>
              </li>
              <li>
                <span className="benefit-icon">👥</span>
                <span>
                  <strong>Join Community</strong> of millions of learners
                </span>
              </li>
            </ul>

            <div className="info-quote">
              <p>
                "SmartLearn made learning fun and engaging. I improved my
                grades significantly!" - Sarah, Student
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
