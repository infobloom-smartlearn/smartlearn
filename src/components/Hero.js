import React, { useEffect, useRef, useState } from 'react';
import { FaLightbulb, FaArrowRight, FaUserGraduate, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import { HiBookOpen, HiChartBar } from 'react-icons/hi';
import './Hero.css';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const heroRef = useRef(null);

    // small typewriter for subtitle to make the hero feel alive
    const messages = [
        'Personalized learning at your fingertips.',
        'Lessons that adapt to your child\'s pace.',
        'Interactive learning parents can trust.'
    ];

    const [msgIndex, setMsgIndex] = useState(0);
    const [typed, setTyped] = useState('');
    const typingRef = useRef(null);

    // persona preview (updates illustration and CTA on hover/click)
    const [persona, setPersona] = useState('student');
    const [illustrationLoaded, setIllustrationLoaded] = useState(false);

    // Scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animation on mount
    useEffect(() => {
        setIllustrationLoaded(true);
    }, []);

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

    // CTA action navigates to signup page
    function handleGetStarted() {
        navigate('/signup');
    }

    return (
        <section className="hero" ref={heroRef}>
            <div className="hero-inner">
                <div className="hero-left">
                    

                    <h1 className={`title ${illustrationLoaded ? 'fade-in-delay-1' : ''}`}>
                        Transform Learning with
                        <span className="title-gradient"> SmartLearn</span>
                    </h1>

                    <p className={`subtitle ${illustrationLoaded ? 'fade-in-delay-2' : ''}`} aria-live="polite">
                        {typed}
                        <span className="type-cursor">▍</span>
                    </p>

                    <div className={`hero-cta-row ${illustrationLoaded ? 'fade-in-delay-3' : ''}`}>
                        <button
                            className="get-started"
                            onClick={handleGetStarted}
                            aria-label="Get started onboarding"
                        >
                            <span>Get Started</span>
                            <FaArrowRight className="get-started-icon" aria-hidden="true" />
                        </button>

                        <button
                            className="secondary"
                            onClick={() => navigate('/signin')}
                        >
                            Sign In
                        </button>
                    </div>


                    {/* Stats */}
                    <div className={`hero-stats ${illustrationLoaded ? 'fade-in-delay-5' : ''}`}>
                        <div className="stat-item">
                            <div className="stat-number">10K+</div>
                            <div className="stat-label">Active Learners</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Expert Teachers</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">95%</div>
                            <div className="stat-label">Success Rate</div>
                        </div>
                    </div>
                </div>

                <div className={`hero-right ${illustrationLoaded ? 'slide-in' : ''}`} aria-hidden="false">
                    <div className={`illustration large ${persona}`}>
                        {/* images served from /public */}
                        <img 
                            src={persona === 'student' ? '/student.png' : persona === 'parent' ? '/parent.png' : '/teacher.png'} 
                            alt={`${persona} illustration`} 
                            className="hero-portrait"
                            onLoad={() => setIllustrationLoaded(true)}
                        />
                        <div className="illustration-glow"></div>
                    </div>

                    <div className="floating-cards">
                        <div className="card card-1">
                            <HiBookOpen className="card-icon" />
                            <div className="card-content">
                                <div className="card-title">Sample Lesson</div>
                                <div className="card-subtitle">Interactive content</div>
                            </div>
                        </div>
                        <div className="card card-2">
                            <HiChartBar className="card-icon" />
                            <div className="card-content">
                                <div className="card-title">Progress Stats</div>
                                <div className="card-subtitle">Track your growth</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
