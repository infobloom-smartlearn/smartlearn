import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      // Call backend registration endpoint
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || 'Registration failed. Please try again.'
        );
      }

      const data = await response.json();

      // Show success message
      setSuccess(
        'Account created successfully! Redirecting to sign in page...'
      );

      // Store user info temporarily
      localStorage.setItem('newUserEmail', formData.email);
      localStorage.setItem('userType', formData.userType);

      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        navigate('/signin', {
          state: { email: formData.email, userType: formData.userType },
        });
      }, 2000);
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
                <span className="icon">👨‍🎓</span>
                <span className="label">Student</span>
              </button>
              <button
                type="button"
                className={`user-type-btn ${
                  formData.userType === 'teacher' ? 'active' : ''
                }`}
                onClick={() => handleUserTypeChange('teacher')}
              >
                <span className="icon">👩‍🏫</span>
                <span className="label">Teacher</span>
              </button>
              <button
                type="button"
                className={`user-type-btn ${
                  formData.userType === 'parent' ? 'active' : ''
                }`}
                onClick={() => handleUserTypeChange('parent')}
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

          {/* Success Message */}
          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span>
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
                  ✓ At least 8 characters
                </li>
                <li
                  className={
                    /[A-Z]/.test(formData.password) &&
                    /[a-z]/.test(formData.password)
                      ? 'met'
                      : 'unmet'
                  }
                >
                  ✓ Mix of uppercase and lowercase letters
                </li>
                <li
                  className={
                    /[0-9]/.test(formData.password) ? 'met' : 'unmet'
                  }
                >
                  ✓ At least one number
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
                  {formData.password === formData.confirmPassword
                    ? '✓ Passwords match'
                    : '✗ Passwords do not match'}
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
            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="form-divider">
            <span>Already have an account?</span>
          </div>

          {/* Sign In Link */}
          <button
            type="button"
            className="signin-link-btn"
            onClick={() => navigate('/signin')}
            disabled={loading}
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
                <span className="benefit-icon">📚</span>
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
