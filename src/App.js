import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Onboarding from './pages/Onboarding';
import OnboardingStep1 from './pages/OnboardingStep1';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';

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
        {/* add further steps like /onboarding/step-2 next */}
        {/* ...other routes... */}
      </Routes>
    </Router>
  );
}

export default App;
