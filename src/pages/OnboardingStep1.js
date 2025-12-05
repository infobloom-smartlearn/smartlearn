import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './OnboardingStep1.css';

export default function OnboardingStep1() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [ageRange, setAgeRange] = useState('9-11'); // default selected
    const [grade, setGrade] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load saved step-1 data from localStorage on mount
    useEffect(() => {
        try {
            const savedData = localStorage.getItem('onboarding_step1');
            if (savedData) {
                const data = JSON.parse(savedData);
                setName(data.name || '');
                setAgeRange(data.ageRange || '9-11');
                setGrade(data.grade || '');
            }
        } catch (err) {
            console.error('Error loading step-1 data from localStorage:', err);
        }
    }, []);

    // Save step-1 data to localStorage and navigate to step-2
    const handleContinue = () => {
        if (!name.trim()) {
            setError('Please enter your name.');
            return;
        }

        try {
            // Save to localStorage
            const step1Data = {
                name: name.trim(),
                ageRange,
                grade: grade || null
            };
            localStorage.setItem('onboarding_step1', JSON.stringify(step1Data));
            
            // Also save to user profile data if available
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
                const userData = {
                    ...step1Data,
                    email: userEmail
                };
                localStorage.setItem('userProfile', JSON.stringify(userData));
            }

            // Navigate to step 2
            navigate('/onboarding/step-2');
        } catch (err) {
            console.error('Error saving step-1 data:', err);
            setError('An error occurred while saving your information.');
        }
    };

    return (
        <div className="onboard-step1">
            <header className="onboard-header">
                <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span className="logo-purple">Smart</span><span className="logo-teal">Learn</span>
                </Link>
                <div className="progress-wrap">
                    <div className="progress-label">Step 1 of 3</div>
                    <div className="progress-bar" aria-hidden="true">
                        <div className="progress-fill" style={{ width: '33%' }} />
                    </div>
                </div>
            </header>

            <main className="onboard-main">
                <div className="left-illustration" aria-hidden="true">
                    <div className="badge-illustration">
                        {/* image from public folder */}
                        <img src="/about1.png" alt="child exploring nature illustration" className="step1-illustration" />
                    </div>
                </div>

                <div className="right-form">
                    <h1>Tell us About Yourself</h1>
                    <p className="subtext">This helps our AI create a perfect learning experience for you.</p>

                    <label className="field">
                        <div className="label-text">What is your name?</div>
                        <input
                            className="input"
                            placeholder="Enter your First name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            aria-label="First name"
                        />
                    </label>

                    <div className="field">
                        <div className="label-text">How old are you?</div>
                        <div className="segmented" role="radiogroup" aria-label="Age range">
                            {['6-8','9-11','11-14','15+'].map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    role="radio"
                                    aria-checked={ageRange === opt}
                                    className={`seg-btn ${ageRange === opt ? 'active' : ''}`}
                                    onClick={() => setAgeRange(opt)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <label className="field">
                        <div className="label-text">What grade are you in?</div>
                        <select
                            className="select"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            aria-label="Select your grade"
                        >
                            <option value="">Select your grade</option>
                            <option>Kindergarten</option>
                            <option>1st</option>
                            <option>2nd</option>
                            <option>3rd</option>
                            <option>4th</option>
                            <option>5th</option>
                            <option>6th</option>
                            <option>7th</option>
                            <option>8th</option>
                            <option>9th</option>
                            <option>10th</option>
                            <option>11th</option>
                            <option>12th</option>
                        </select>
                    </label>

                    {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}

                    <div className="actions">
                        <button className="btn secondary" onClick={() => navigate('/onboarding')}>Back</button>
                        <button
                            className="btn primary"
                            onClick={handleContinue}
                            disabled={!name.trim()}
                            aria-disabled={!name.trim()}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}