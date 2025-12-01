import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h2>SmartLearn</h2>
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item">Home</li>
          <li className="navbar-item">About</li>
          <li className="navbar-item">Contact</li>
        </ul>
        <div className="navbar-actions">
          <button className="navbar-btn">Sign In</button>
          <button
            className="navbar-btn primary"
            onClick={handleGetStarted}
            aria-label="Get started"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
