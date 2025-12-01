import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingStep1.css';

export default function OnboardingStep1() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [ageRange, setAgeRange] = useState('9-11'); // default selected
    const [grade, setGrade] = useState('');

    return (
        <div className="onboard-step1">
            <header className="onboard-header">
                <div className="logo">
                    <span className="logo-purple">Smart</span><span className="logo-teal">Learn</span>
                </div>
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
                        {/* Decorative SVG-style illustration (placeholder) */}
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="g" x1="0" x2="1">
                                    <stop offset="0" stopColor="#ffdede" />
                                    <stop offset="1" stopColor="#fff0b2" />
                                </linearGradient>
                            </defs>
                            <circle cx="100" cy="100" r="98" fill="url(#g)" />
                            <g transform="translate(40,40)">
                                <ellipse cx="60" cy="100" rx="62" ry="32" fill="#6EE7B7" opacity="0.2" />
                                <circle cx="60" cy="60" r="38" fill="#fff" />
                                <path d="M42 50 q18 -18 36 0" stroke="#6b46c1" strokeWidth="3" fill="none"/>
                                <circle cx="60" cy="60" r="6" fill="#6b46c1"/>
                            </g>
                        </svg>
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

                    <div className="actions">
                        <button className="btn secondary" onClick={() => navigate('/onboarding')}>Back</button>
                        <button
                            className="btn primary"
                            onClick={() => navigate('/onboarding/step-2')}
                            aria-disabled={!name}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}