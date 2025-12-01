import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: '/student.png',
      title: 'Personalized Learning',
      description: 'AI-driven recommendations tailored to your learning style and pace.'
    },
    {
      icon: '/teacher.png',
      title: 'Expert Guidance',
      description: 'Learn from top educators and industry professionals worldwide.'
    },
    {
      icon: '/visuallearner.png',
      title: 'Interactive Content',
      description: 'Engage with videos, quizzes, and hands-on projects for better retention.'
    },
    {
      icon: '/audiolearner.png',
      title: 'Multi-Modal Learning',
      description: 'Access content through text, audio, and visual formats to suit your preferences.'
    }
  ];

  return (
    <section className="features">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Why Choose SmartLearn?</h2>
          <p className="features-subtitle">
            Discover the features that make learning smarter, faster, and more engaging.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <img src={feature.icon} alt={feature.title} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
