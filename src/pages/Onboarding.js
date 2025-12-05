import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Onboarding.css'; // keep existing or create

export default function Onboarding() {
    const navigate = useNavigate();
    // default selection: Student (as requested the Student tile is highlighted)
    const [role, setRole] = useState('student');
    const [hoveredRole, setHoveredRole] = useState(null);

    function handleContinue() {
        // Persist selected role so the rest of the app (including teacher dashboard guards)
        // can recognize this user as a teacher/parent/student.
        try {
            window.localStorage.setItem('userType', role);
        } catch (e) {
            // ignore storage errors (e.g., private mode)
        }

        if (role === 'teacher') {
            navigate('/teacher');
        } else if (role === 'student') {
            navigate('/onboarding/step-1');
        } else if (role === 'parent') {
            navigate('/parent');
        } else {
            navigate('/onboarding/details');
        }
    }

    return (
        <div className="onboarding-screen">
            <header className="onboarding-header">
                <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span className="logo-purple">Smart</span>
                    <span className="logo-teal">Learn</span>
                </Link>
            </header>

            <main className="onboarding-body">
                <h1 className="main-question">How are you using SmartLearn?</h1>

                <div className="role-row" role="list">
                    {/* Teacher */}
                    <div
                        role="listitem"
                        className={`role-card ${role === 'teacher' ? 'selected' : ''} ${((hoveredRole === 'teacher') || role === 'teacher') ? 'active' : ''}`}
                    >
                        <button
                            className="role-inner"
                            onClick={() => setRole('teacher')}
                            onMouseEnter={() => setHoveredRole('teacher')}
                            onMouseLeave={() => setHoveredRole(null)}
                            onTouchStart={() => {
                                setHoveredRole('teacher');
                                setRole('teacher');
                            }}
                            aria-pressed={role === 'teacher'}
                        >
                            <div className="illustration-circle white">
                                {/* teacher image from public folder */}
                                <img src="/teacher.png" alt="Teacher illustration" className="role-image teacher-img" />
                            </div>
                        </button>
                        <div className="label-bar">
                            <span>Teacher</span>
                        </div>
                    </div>

                    {/* Parent */}
                    <div
                        role="listitem"
                        className={`role-card ${role === 'parent' ? 'selected' : ''} ${((hoveredRole === 'parent') || role === 'parent') ? 'active' : ''}`}
                    >
                        <button
                            className="role-inner"
                            onClick={() => setRole('parent')}
                            onMouseEnter={() => setHoveredRole('parent')}
                            onMouseLeave={() => setHoveredRole(null)}
                            onTouchStart={() => {
                                setHoveredRole('parent');
                                setRole('parent');
                            }}
                            aria-pressed={role === 'parent'}
                        >
                            <div className="illustration-circle white">
                                {/* parent image from public folder */}
                                <img src="/parent.png" alt="Parent illustration" className="role-image parent-img" />
                            </div>
                        </button>
                        <div className="label-bar">
                            <span>Parent</span>
                        </div>
                    </div>

                    {/* Student - highlighted */}
                    <div
                        role="listitem"
                        className={`role-card ${role === 'student' ? 'selected student' : ''} ${((hoveredRole === 'student') || role === 'student') ? 'active' : ''}`}
                    >
                        <button
                            className="role-inner"
                            onClick={() => setRole('student')}
                            onMouseEnter={() => setHoveredRole('student')}
                            onMouseLeave={() => setHoveredRole(null)}
                            onTouchStart={() => {
                                setHoveredRole('student');
                                setRole('student');
                            }}
                            aria-pressed={role === 'student'}
                        >
                            <div className="illustration-circle purple">
                                {/* student image from public folder */}
                                <img src="/student.png" alt="Student illustration" className="role-image student-img" />
                            </div>
                        </button>
                        <div className="label-bar label-highlight">
                            <span>Student</span>
                        </div>
                    </div>
                </div>

                <div className="continue-row">
                    <button
                        className="continue-btn"
                        onClick={handleContinue}
                        aria-label="Continue"
                    >
                        Continue
                    </button>
                </div>
            </main>
        </div>
    );
}