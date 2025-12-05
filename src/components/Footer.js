import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaYoutube,
  FaLightbulb,
  FaCheck
} from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Here you would typically send the email to your backend
      console.log('Subscribing:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Testimonials', href: '#testimonials' },
      { name: 'FAQ', href: '#faq' }
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Contact', href: '#contact' }
    ],
    resources: [
      { name: 'Documentation', href: '#docs' },
      { name: 'Help Center', href: '#help' },
      { name: 'Community', href: '#community' },
      { name: 'Partners', href: '#partners' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'GDPR', href: '#gdpr' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, href: 'https://facebook.com', color: '#1877F2' },
    { name: 'Twitter', icon: FaTwitter, href: 'https://twitter.com', color: '#1DA1F2' },
    { name: 'LinkedIn', icon: FaLinkedin, href: 'https://linkedin.com', color: '#0077B5' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com', color: '#E4405F' },
    { name: 'YouTube', icon: FaYoutube, href: 'https://youtube.com', color: '#FF0000' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <FaLightbulb className="footer-logo-icon" />
              <h3 className="footer-logo-text">SmartLearn</h3>
            </div>
            <p className="footer-description">
              Transforming education through AI-powered personalized learning experiences. 
              Empowering students, teachers, and parents with innovative tools.
            </p>
            <div className="footer-social">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={social.name}
                    style={{ '--social-color': social.color }}
                  >
                    <IconComponent className="social-icon" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-column-title">Product</h4>
              <ul className="footer-link-list">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Company</h4>
              <ul className="footer-link-list">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Resources</h4>
              <ul className="footer-link-list">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Legal</h4>
              <ul className="footer-link-list">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="footer-newsletter">
            <h4 className="footer-column-title">Stay Updated</h4>
            <p className="newsletter-description">
              Get the latest updates, tips, and educational insights delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="newsletter-input-group">
                <div className="newsletter-input-wrapper">
                  <HiMail className="newsletter-input-icon" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="newsletter-input"
                    required
                  />
                </div>
                <button type="submit" className="newsletter-button">
                  {subscribed ? (
                    <>
                      <FaCheck className="newsletter-check-icon" />
                      <span>Subscribed!</span>
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
              {subscribed && (
                <p className="newsletter-success">Thank you for subscribing!</p>
              )}
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {new Date().getFullYear()} SmartLearn. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/signin" className="footer-bottom-link">Sign In</Link>
              <span className="footer-separator">•</span>
              <Link to="/signup" className="footer-bottom-link">Sign Up</Link>
              <span className="footer-separator">•</span>
              <a href="#support" className="footer-bottom-link">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

