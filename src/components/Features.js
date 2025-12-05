import React, { useState, useEffect, useRef } from 'react';
import { 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaBook, 
  FaPalette,
  FaArrowRight,
  FaRobot,
  FaChartBar,
  FaTrophy,
  FaUsers,
  FaEdit,
  FaBell,
  FaFileAlt,
  FaChartLine,
  FaComments,
  FaGraduationCap,
  FaBullseye,
  FaMicrophone,
  FaVideo,
  FaCertificate,
  FaMobile,
  FaShieldAlt,
  FaClock,
  FaAward
} from 'react-icons/fa';
import './Features.css';

const Features = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);

  const features = [
    // Core Learning Features
    {
      icon: FaUserGraduate,
      title: 'Personalized Learning',
      description: 'AI-driven recommendations tailored to your learning style and pace for optimal progress.',
      color: '#AA33F0',
      bgColor: 'rgba(170, 51, 240, 0.1)',
      category: 'Learning'
    },
    {
      icon: FaRobot,
      title: 'AI-Powered Tutoring',
      description: 'Get instant help from our intelligent AI tutor available 24/7 to answer questions and guide your learning.',
      color: '#CF7DEF',
      bgColor: 'rgba(207, 125, 239, 0.1)',
      category: 'Learning'
    },
    {
      icon: FaBook,
      title: 'Interactive Lessons',
      description: 'Engage with comprehensive lessons, videos, and interactive content across all subjects.',
      color: '#7DEFCF',
      bgColor: 'rgba(125, 239, 207, 0.1)',
      category: 'Learning'
    },
    {
      icon: FaEdit,
      title: 'Smart Quizzes',
      description: 'Test your knowledge with adaptive quizzes that adjust difficulty based on your performance.',
      color: '#FFC857',
      bgColor: 'rgba(255, 200, 87, 0.1)',
      category: 'Learning'
    },
    {
      icon: FaPalette,
      title: 'Multi-Modal Learning',
      description: 'Access content through text, audio, and visual formats to suit your learning preferences.',
      color: '#EF7D7D',
      bgColor: 'rgba(239, 125, 125, 0.1)',
      category: 'Learning'
    },
    {
      icon: FaVideo,
      title: 'Video Lessons',
      description: 'Watch engaging video content from expert teachers to enhance your understanding.',
      color: '#AA33F0',
      bgColor: 'rgba(170, 51, 240, 0.1)',
      category: 'Learning'
    },
    
    // Progress & Analytics
    {
      icon: FaChartBar,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and performance insights.',
      color: '#7DEFCF',
      bgColor: 'rgba(125, 239, 207, 0.1)',
      category: 'Analytics'
    },
    {
      icon: FaChartLine,
      title: 'Performance Analytics',
      description: 'Get comprehensive reports on your strengths, weaknesses, and improvement areas.',
      color: '#CF7DEF',
      bgColor: 'rgba(207, 125, 239, 0.1)',
      category: 'Analytics'
    },
    {
      icon: FaTrophy,
      title: 'Achievements & Badges',
      description: 'Earn badges and achievements as you complete lessons and reach learning milestones.',
      color: '#FFC857',
      bgColor: 'rgba(255, 200, 87, 0.1)',
      category: 'Gamification'
    },
    {
      icon: FaAward,
      title: 'Learning Streaks',
      description: 'Build consistent learning habits with daily streaks and motivational rewards.',
      color: '#EF7D7D',
      bgColor: 'rgba(239, 125, 125, 0.1)',
      category: 'Gamification'
    },
    
    // Teacher Features
    {
      icon: FaChalkboardTeacher,
      title: 'Teacher Dashboard',
      description: 'Comprehensive dashboard for teachers to manage classes, track student progress, and upload content.',
      color: '#AA33F0',
      bgColor: 'rgba(170, 51, 240, 0.1)',
      category: 'For Teachers'
    },
    {
      icon: FaFileAlt,
      title: 'Lesson Management',
      description: 'Create, upload, and organize lesson notes and course materials for your students.',
      color: '#CF7DEF',
      bgColor: 'rgba(207, 125, 239, 0.1)',
      category: 'For Teachers'
    },
    {
      icon: FaChartLine,
      title: 'Student Analytics',
      description: 'Track individual and class-wide performance with detailed analytics and insights.',
      color: '#7DEFCF',
      bgColor: 'rgba(125, 239, 207, 0.1)',
      category: 'For Teachers'
    },
    {
      icon: FaComments,
      title: 'Parent Communication',
      description: 'Send messages to parents and respond to their inquiries about student progress.',
      color: '#FFC857',
      bgColor: 'rgba(255, 200, 87, 0.1)',
      category: 'For Teachers'
    },
    
    // Parent Features
    {
      icon: FaUsers,
      title: 'Child Monitoring',
      description: 'Monitor all your children\'s academic progress, quiz scores, and learning activities in one place.',
      color: '#AA33F0',
      bgColor: 'rgba(170, 51, 240, 0.1)',
      category: 'For Parents'
    },
    {
      icon: FaGraduationCap,
      title: 'Academic Reports',
      description: 'View detailed quiz reports, performance trends, and subject-wise analysis for each child.',
      color: '#CF7DEF',
      bgColor: 'rgba(207, 125, 239, 0.1)',
      category: 'For Parents'
    },
    {
      icon: FaComments,
      title: 'Teacher Messaging',
      description: 'Communicate directly with teachers, receive feedback, and stay updated on your child\'s progress.',
      color: '#7DEFCF',
      bgColor: 'rgba(125, 239, 207, 0.1)',
      category: 'For Parents'
    },
    {
      icon: FaBell,
      title: 'Smart Notifications',
      description: 'Get alerts for new quizzes, performance drops, missed assignments, and important announcements.',
      color: '#FFC857',
      bgColor: 'rgba(255, 200, 87, 0.1)',
      category: 'For Parents'
    },
    
    // Additional Features
    {
      icon: FaMicrophone,
      title: 'Voice Assistant',
      description: 'Use voice commands to navigate the platform and interact with the AI tutor hands-free.',
      color: '#EF7D7D',
      bgColor: 'rgba(239, 125, 125, 0.1)',
      category: 'Accessibility'
    },
    {
      icon: FaMobile,
      title: 'Mobile Responsive',
      description: 'Access SmartLearn on any device - desktop, tablet, or mobile - with a seamless experience.',
      color: '#AA33F0',
      bgColor: 'rgba(170, 51, 240, 0.1)',
      category: 'Accessibility'
    },
    {
      icon: FaShieldAlt,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and privacy controls.',
      color: '#7DEFCF',
      bgColor: 'rgba(125, 239, 207, 0.1)',
      category: 'Security'
    },
    {
      icon: FaClock,
      title: 'Flexible Learning',
      description: 'Learn at your own pace, anytime, anywhere. No rigid schedules or deadlines.',
      color: '#CF7DEF',
      bgColor: 'rgba(207, 125, 239, 0.1)',
      category: 'Convenience'
    },
    {
      icon: FaCertificate,
      title: 'Certificates & Recognition',
      description: 'Earn certificates upon course completion and showcase your achievements.',
      color: '#FFC857',
      bgColor: 'rgba(255, 200, 87, 0.1)',
      category: 'Recognition'
    },
    {
      icon: FaBullseye,
      title: 'Goal Setting',
      description: 'Set learning goals, track milestones, and celebrate achievements along your journey.',
      color: '#EF7D7D',
      bgColor: 'rgba(239, 125, 125, 0.1)',
      category: 'Motivation'
    }
  ];

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, index]);
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll('.feature-card');
    cards?.forEach((card) => observer.observe(card));

    return () => {
      cards?.forEach((card) => observer.unobserve(card));
    };
  }, []);

  // Group features by category
  const categories = ['Learning', 'Analytics', 'Gamification', 'For Teachers', 'For Parents', 'Accessibility', 'Security', 'Convenience', 'Recognition', 'Motivation'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredFeatures = selectedCategory === 'All' 
    ? features 
    : features.filter(f => f.category === selectedCategory);

  return (
    <section id="features" className="features" ref={sectionRef}>
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Why Choose SmartLearn?</h2>
          <p className="features-subtitle">
            Discover the comprehensive features that make learning smarter, faster, and more engaging for students, teachers, and parents.
          </p>
        </div>

        {/* Category Filter */}
        <div className="features-categories">
          <button
            className={`category-filter ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            All Features
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="features-grid">
          {filteredFeatures.map((feature, index) => (
            <div
              key={index}
              className={`feature-card ${visibleCards.includes(index) ? 'visible' : ''} ${hoveredIndex === index ? 'hovered' : ''}`}
              data-index={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                // Optional: Add click interaction
                console.log(`Clicked on ${feature.title}`);
              }}
              style={{
                '--feature-color': feature.color,
                '--feature-bg': feature.bgColor,
              }}
            >
              <div className="feature-icon-wrapper">
                <div className="feature-icon">
                  {React.createElement(feature.icon, { 
                    className: 'feature-icon-svg',
                    style: { color: feature.color }
                  })}
                </div>
              </div>
              <div className="feature-category-badge">{feature.category}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-link">
                Learn more <FaArrowRight className="feature-arrow" />
              </div>
              <div className="feature-hover-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
