import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved step-2 data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('onboarding_step2');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.subjects && Object.keys(data.subjects).length > 0) {
          setSubjects(data.subjects);
        }
        if (data.styles && Object.keys(data.styles).length > 0) {
          setStyles(data.styles);
        }
      }
    } catch (err) {
      console.error('Error loading step-2 data from localStorage:', err);
    }
  }, []);

  // Save step-2 data to localStorage and navigate to step-3
  const handleContinue = () => {
    try {
      // Save to localStorage
      const step2Data = {
        subjects,
        styles
      };
      localStorage.setItem('onboarding_step2', JSON.stringify(step2Data));

      // Update user profile data if available
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        profile.subjects = subjects;
        profile.styles = styles;
        localStorage.setItem('userProfile', JSON.stringify(profile));
      }

      // Navigate to step 3
      navigate('/onboarding/step-3');
    } catch (err) {
      console.error('Error saving step-2 data:', err);
      setError('An error occurred while saving your preferences.');
    }
  };

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

          {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}

          <div className="actions-row">
            <button className="btn back" onClick={() => navigate('/onboarding/step-1')}>Back</button>
            <button className="btn primary" onClick={handleContinue}>
              Continue
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
