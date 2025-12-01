import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingStep2.css';

export default function OnboardingStep2() {
  const navigate = useNavigate();

  // subject interest cards state
  const [subjects, setSubjects] = useState({
    reading: true,
    science: true,
    english: true,
    math: false,
  });

  // learning styles state (checkbox style)
  const [styles, setStyles] = useState({ visual: true, audio: false, handsOn: true });

  function toggleSubject(key) {
    setSubjects((s) => ({ ...s, [key]: !s[key] }));
  }

  function toggleStyle(key) {
    setStyles((s) => ({ ...s, [key]: !s[key] }));
  }

  return (
    <div className="onboarding-step2-root">
      <header className="step2-header">
        <div className="logo"><span className="logo-purple">Smart</span><span className="logo-teal">Learn</span></div>
        <div className="progress-note">You're getting closer</div>
      </header>

      <div className="progress-strip">
        <div className="progress-bar"><div className="progress-fill" style={{width:'66%'}}/></div>
        <div className="step-label">Step 2 of 3</div>
      </div>

      <main className="step2-main">
        <section className="visual-column" aria-hidden="true">
          <div className="illustration-area">
            {/* Placeholder image; replace with high quality asset if available */}
            <img src="/about2.png" alt="reading illustration" className="step2-illustration"/>
          </div>
        </section>

        <section className="form-column">
          <div className="section">
            <h2 className="section-title">What subjects are you interested in?</h2>
            <p className="section-sub">Select what applies to you, our AI will prioritize them</p>

            <div className="subjects-grid">
              <button
                type="button"
                className={`card ${subjects.reading ? 'selected purple' : ''}`}
                onClick={() => toggleSubject('reading')}
                aria-pressed={subjects.reading}
              >
                <div className="icon">📘</div>
                <div className="label">Reading Comprehension</div>
              </button>

              <button
                type="button"
                className={`card ${subjects.science ? 'selected green' : ''}`}
                onClick={() => toggleSubject('science')}
                aria-pressed={subjects.science}
              >
                <div className="icon">🔬</div>
                <div className="label">Science Experiments and discovery</div>
              </button>

              <button
                type="button"
                className={`card ${subjects.english ? 'selected yellow' : ''}`}
                onClick={() => toggleSubject('english')}
                aria-pressed={subjects.english}
              >
                <div className="icon">🔤</div>
                <div className="label">English Comprehension</div>
              </button>

              <button
                type="button"
                className={`card ${subjects.math ? 'selected' : ''}`}
                onClick={() => toggleSubject('math')}
                aria-pressed={subjects.math}
              >
                <div className="icon">➗</div>
                <div className="label">Math Numbers and Others</div>
              </button>
            </div>
          </div>

          <div className="section">
            <h3 className="section-title">How do you learn best?</h3>
            <div className="styles-list">
              <label className={`style-item ${styles.visual ? 'checked' : ''}`}>
                <div className="meta">
                  <div className="style-icon">👁️</div>
                  <div className="style-text">
                    <div className="style-label">Visual learner</div>
                    <div className="style-desc">I learn best with images and illustrations</div>
                  </div>
                </div>
                <div className="style-check">
                  <input type="checkbox" checked={styles.visual} onChange={() => toggleStyle('visual')} aria-label="Visual learner" />
                </div>
              </label>

              <label className={`style-item ${styles.audio ? 'checked' : ''}`}>
                <div className="meta">
                  <div className="style-icon">🎧</div>
                  <div className="style-text">
                    <div className="style-label">Audio learner</div>
                    <div className="style-desc">I learn best by listening and discussing</div>
                  </div>
                </div>
                <div className="style-check">
                  <input type="checkbox" checked={styles.audio} onChange={() => toggleStyle('audio')} aria-label="Audio learner" />
                </div>
              </label>

              <label className={`style-item ${styles.handsOn ? 'checked' : ''}`}>
                <div className="meta">
                  <div className="style-icon">🛠️</div>
                  <div className="style-text">
                    <div className="style-label">Hands-On learner</div>
                    <div className="style-desc">I learn best by practising</div>
                  </div>
                </div>
                <div className="style-check">
                  <input type="checkbox" checked={styles.handsOn} onChange={() => toggleStyle('handsOn')} aria-label="Hands on learner" />
                </div>
              </label>
            </div>
          </div>

          <div className="actions-row">
            <button className="btn back" onClick={() => navigate('/onboarding/step-1')}>Back</button>
            <button className="btn primary" onClick={() => navigate('/onboarding/step-3')}>Continue</button>
          </div>
        </section>
      </main>
    </div>
  );
}
