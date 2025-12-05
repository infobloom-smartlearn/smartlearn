import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './OnboardingStep3.css';

export default function OnboardingStep3(){
  const navigate = useNavigate();

  return (
    <div className="onboarding-step3-root">
      <header className="step3-header">
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}><span className="logo-purple">Smart</span><span className="logo-teal">Learn</span></Link>
        <div className="progress-note">You're finally here</div>
      </header>

      <div className="progress-strip">
        <div className="progress-bar"><div className="progress-fill" style={{width:'100%'}}/></div>
        <div className="step-label">Step 3 of 3</div>
      </div>

      <main className="step3-main">
        <section className="visual-column">
          <div className="circle-illustration">
            <img src="/about3.png" alt="joyful child running" className="step3-illustration" />
          </div>
        </section>

        <section className="right-column">
          <h2 className="title">What happens next?</h2>
          <p className="subtitle">Your AI learning companion will guide you every step of the way</p>

          <div className="steps-list">
            <div className="step-card blue">
              <div className="step-num">1</div>
              <div className="step-meta">
                <div className="step-title">Take a quick assessment</div>
                <div className="step-desc">Our AI analyzes your strengths and weaknesses</div>
              </div>
            </div>

            <div className="step-card green">
              <div className="step-num">2</div>
              <div className="step-meta">
                <div className="step-title">Receive a personalized curriculum</div>
                <div className="step-desc">Receive a personalized curriculum designed by our AI for you</div>
              </div>
            </div>

            <div className="step-card pink">
              <div className="step-num">3</div>
              <div className="step-meta">
                <div className="step-title">Start learning and have fun</div>
                <div className="step-desc">Begin your learning journey with games and activities</div>
              </div>
            </div>
          </div>

          <div className="actions-col">
            <button className="btn primary" onClick={() => navigate('/app')}>Start Learning Today!</button>
            <button className="btn secondary" onClick={() => navigate('/')}>Customize settings later</button>
          </div>
        </section>
      </main>
    </div>
  );
}
