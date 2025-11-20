import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Onboarding from './Onboarding';

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/onboarding');
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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome to SmartLearn</h1>
        <p>Your AI-powered learning platform</p>
        <button className="App-button" onClick={handleGetStarted}>Get Started</button>
      </header>
      <section className="features-section">
        <div className="feature-card">
          <img src="/student.png" alt="Personalized Learning" />
          <h3>Personalized Learning</h3>
          <p>AI-driven recommendations tailored to your learning style and pace.</p>
        </div>
        <div className="feature-card">
          <img src="/teacher.png" alt="Expert Guidance" />
          <h3>Expert Guidance</h3>
          <p>Learn from top educators and industry professionals worldwide.</p>
        </div>
        <div className="feature-card">
          <img src="/visuallearner.png" alt="Interactive Content" />
          <h3>Interactive Content</h3>
          <p>Engage with videos, quizzes, and hands-on projects for better retention.</p>
        </div>
        <div className="feature-card">
          <img src="/audiolearner.png" alt="Multi-Modal Learning" />
          <h3>Multi-Modal Learning</h3>
          <p>Access content through text, audio, and visual formats to suit your preferences.</p>
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </Router>
  );
}

export default App;
