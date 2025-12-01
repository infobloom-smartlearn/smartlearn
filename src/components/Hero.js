import React, { useEffect, useRef, useState } from 'react';
import './Hero.css';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
    const navigate = useNavigate();

    // small typewriter for subtitle to make the hero feel alive
    const messages = [
        'Personalized learning at your fingertips.',
        'Lessons that adapt to your child’s pace.',
        'Interactive learning parents can trust.'
    ];

    const [msgIndex, setMsgIndex] = useState(0);
    const [typed, setTyped] = useState('');
    const typingRef = useRef(null);

    // persona preview (updates illustration and CTA on hover/click)
    const [persona, setPersona] = useState('student');

    useEffect(() => {
        // typewriter effect for messages[msgIndex]
        const full = messages[msgIndex];
        let i = 0;
        setTyped('');
        clearInterval(typingRef.current);
        typingRef.current = setInterval(() => {
            i += 1;
            setTyped(full.slice(0, i));
            if (i >= full.length) {
                clearInterval(typingRef.current);
                // after small pause, move to next message
                setTimeout(() => setMsgIndex((m) => (m + 1) % messages.length), 1200);
            }
        }, 26);

        return () => clearInterval(typingRef.current);
    }, [msgIndex]);

    // CTA action is context-aware (persona)
    function handleGetStarted() {
        // if student => take them to onboarding steps else to details
        if (persona === 'student') navigate('/onboarding/step-1');
        else navigate('/onboarding');
    }

    return (
        <section className="hero">
            <div className="hero-inner">
                <div className="hero-left">
                    <div className="badge">SmartLearn</div>

                    <h1 className="title">Welcome to SmartLearn</h1>

                    <p className="subtitle" aria-live="polite">{typed}<span className="type-cursor">▍</span></p>

                    <div className="hero-cta-row">
                        <button
                            className="get-started"
                            onClick={handleGetStarted}
                            aria-label="Get started onboarding"
                        >
                            Get Started
                            <span className="get-started-icon" aria-hidden>→</span>
                        </button>

                        <button
                            className="secondary"
                            onClick={() => setPersona('teacher')}
                            aria-pressed={persona === 'teacher'}
                        >
                            Explore Teacher
                        </button>
                    </div>

                    <div className="persona-picker" role="tablist" aria-label="Try a persona">
                        {['teacher', 'parent', 'student'].map((p) => (
                            <button
                                key={p}
                                className={`persona-pill ${persona === p ? 'active' : ''}`}
                                onMouseEnter={() => setPersona(p)}
                                onFocus={() => setPersona(p)}
                                onClick={() => setPersona(p)}
                                aria-selected={persona === p}
                                role="tab"
                            >
                                {p[0].toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="hero-right" aria-hidden="false">
                    <div className={`illustration large ${persona}`}>
                        {/* images served from /public */}
                        <img src={persona === 'student' ? '/student.png' : persona === 'parent' ? '/parent.png' : '/teacher.png'} alt="" className="hero-portrait" />
                    </div>

                    <div className="floating-cards">
                        <div className="card">Sample lesson</div>
                        <div className="card right">Progress stats</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
