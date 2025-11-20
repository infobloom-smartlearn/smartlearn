import React, { useState } from 'react';
import './App.css';

function Onboarding() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="App">
      <nav className="App-nav">
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '600px', textAlign: 'center', padding: '40px', background: '#f8f9fa', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
          <h1 style={{ color: '#4facfe', marginBottom: '20px' }}>Welcome to SmartLearn!</h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '30px' }}>
            Let's personalize your learning experience. We'll guide you through a few quick steps.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                style={{
                  width: '40px',
                  height: '8px',
                  background: i + 1 <= step ? '#4facfe' : '#ddd',
                  margin: '0 5px',
                  borderRadius: '4px',
                  transition: 'background 0.3s ease'
                }}
              />
            ))}
          </div>

          {step === 1 && (
            <div>
              <img src="/student.png" alt="Learning Style" style={{ width: '100px', height: '100px', marginBottom: '20px', borderRadius: '50%' }} />
              <h3 style={{ color: '#4facfe' }}>Step 1: Choose Your Learning Style</h3>
              <p>Select how you prefer to learn: visual, auditory, or kinesthetic.</p>
            </div>
          )}

          {step === 2 && (
            <div>
              <img src="/teacher.png" alt="Goals" style={{ width: '100px', height: '100px', marginBottom: '20px', borderRadius: '50%' }} />
              <h3 style={{ color: '#4facfe' }}>Step 2: Set Your Goals</h3>
              <p>Tell us your learning objectives and preferred subjects.</p>
            </div>
          )}

          {step === 3 && (
            <div>
              <img src="/visuallearner.png" alt="Ready" style={{ width: '100px', height: '100px', marginBottom: '20px', borderRadius: '50%' }} />
              <h3 style={{ color: '#4facfe' }}>Step 3: You're All Set!</h3>
              <p>Start your personalized learning journey with SmartLearn.</p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
            <button
              onClick={prevStep}
              disabled={step === 1}
              style={{
                background: step === 1 ? '#ddd' : '#4facfe',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: step === 1 ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s ease'
              }}
            >
              Previous
            </button>
            <button
              onClick={step === totalSteps ? () => window.location.href = '/' : nextStep}
              style={{
                background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
              }}
            >
              {step === totalSteps ? 'Start Learning' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
