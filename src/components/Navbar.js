import React, { useState, useEffect } from 'react';
import { FaGlobe } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate('/signup');
    setIsMobileMenuOpen(false);
  };

  const handleSignIn = () => {
    navigate('/signin');
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div 
          className="navbar-logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <FaGlobe className="logo-icon" />
          <h2>SmartLearn</h2>
        </div>
        
        <ul className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li 
            className={`navbar-item ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </li>
          <li 
            className={`navbar-item ${activeSection === 'features' ? 'active' : ''}`}
            onClick={() => handleNavClick('features')}
          >
            Features
          </li>
          <li 
            className={`navbar-item ${activeSection === 'about' ? 'active' : ''}`}
            onClick={() => handleNavClick('about')}
          >
            About
          </li>
        </ul>
        
        <div className="navbar-actions">
          <button 
            className="navbar-btn" 
            onClick={handleSignIn}
          >
            Sign In
          </button>
          <button
            className="navbar-btn primary"
            onClick={handleGetStarted}
            aria-label="Get started"
          >
            Get Started
          </button>
          
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
