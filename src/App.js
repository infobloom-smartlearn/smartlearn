import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Onboarding from './pages/Onboarding';
import OnboardingStep1 from './pages/OnboardingStep1';
import OnboardingStep2 from './pages/OnboardingStep2';
import Navbar from './components/Navbar';
import OnboardingStep3 from './pages/OnboardingStep3';
import Hero from './components/Hero';
import Features from './components/Features';
import Dashboard from './pages/Dashboard';

function Home() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Features />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/step-1" element={<OnboardingStep1 />} />
        <Route path="/onboarding/step-2" element={<OnboardingStep2 />} />
        <Route path="/onboarding/step-3" element={<OnboardingStep3 />} />
        <Route path="/app" element={<Dashboard />} />
        {/* add further steps like /onboarding/step-4 next */}
        {/* ...other routes... */}
      </Routes>
    </Router>
  );
}

export default App;
