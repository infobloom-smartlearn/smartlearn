import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaLightbulb, 
  FaHome, 
  FaEdit, 
  FaBell, 
  FaBook, 
  FaUser, 
  FaRobot, 
  FaCog,
  FaMicrophone,
  FaChartLine,
  FaStop,
  FaVolumeUp,
  FaClock
} from 'react-icons/fa';
import './VoiceAssistant.css';

export default function VoiceAssistant() {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Handle navigation commands
  const handleNavigation = useCallback((lowerCommand, originalCommand) => {
    let route = null;
    let responseText = '';

    if (lowerCommand.includes('lesson') || lowerCommand.includes('lessons')) {
      route = '/lessons';
      responseText = 'Opening the Lessons page for you.';
    } else if (lowerCommand.includes('quiz') || lowerCommand.includes('quizzes')) {
      route = '/quiz';
      responseText = 'Opening the Quiz page for you.';
    } else if (lowerCommand.includes('dashboard') || lowerCommand.includes('home') || lowerCommand.includes('main')) {
      route = '/app';
      responseText = 'Opening the Dashboard for you.';
    } else if (lowerCommand.includes('profile')) {
      route = '/profile';
      responseText = 'Opening your Profile page.';
    } else if (lowerCommand.includes('setting') || lowerCommand.includes('settings')) {
      route = '/settings';
      responseText = 'Opening Settings for you.';
    } else if (lowerCommand.includes('notification') || lowerCommand.includes('notifications')) {
      route = '/notifications';
      responseText = 'Opening Notifications for you.';
    } else if (lowerCommand.includes('ai tutor') || lowerCommand.includes('tutor')) {
      route = '/ai-tutor';
      responseText = 'Opening the AI Tutor for you.';
    } else if (lowerCommand.includes('voice assistant') || lowerCommand.includes('voice')) {
      route = '/voice-assistant';
      responseText = 'You are already on the Voice Assistant page.';
    } else if (lowerCommand.includes('ai insight') || lowerCommand.includes('insights')) {
      route = '/ai-insights';
      responseText = 'Opening AI Insights for you.';
    } else {
      responseText = 'I didn\'t recognize that page. You can navigate to: Dashboard, Lessons, Quiz, Profile, Settings, Notifications, AI Tutor, or AI Insights.';
    }

    setTimeout(() => {
      setResponse(responseText);
      setIsProcessing(false);
      setHistory(prev => [{
        id: Date.now(),
        question: originalCommand,
        answer: responseText,
        time: 'Just now'
      }, ...prev]);

      if (route) {
        setTimeout(() => {
          navigate(route);
        }, 1500);
      }
    }, 1000);
  }, [navigate]);

  // Handle information queries
  const handleInformationQuery = useCallback((command, originalCommand) => {
    let responseText = '';

    if (command.includes('what is smartlearn') || command.includes('tell me about smartlearn')) {
      responseText = 'SmartLearn is an AI-powered learning platform designed to help students learn effectively. It offers lessons, quizzes, AI tutoring, progress tracking, and personalized learning recommendations.';
    } else if (command.includes('how do i') || command.includes('how can i')) {
      if (command.includes('take a quiz')) {
        responseText = 'To take a quiz, navigate to the Quiz page and select a quiz you want to attempt. Click "Start Quiz" to begin.';
      } else if (command.includes('view lesson') || command.includes('access lesson')) {
        responseText = 'To view lessons, go to the Lessons page where you can see all available lessons organized by subject and difficulty.';
      } else if (command.includes('check progress') || command.includes('see progress')) {
        responseText = 'You can check your progress on the Dashboard or visit the AI Insights page for detailed analytics and performance metrics.';
      } else if (command.includes('use ai tutor')) {
        responseText = 'To use the AI Tutor, navigate to the AI Tutor page and start a conversation. You can ask questions about any subject you\'re learning.';
      } else {
        responseText = 'I can help you navigate to different pages, check your progress, take quizzes, and access lessons. What would you like to do?';
      }
    } else if (command.includes('feature') || command.includes('what can')) {
      responseText = 'SmartLearn features include: Interactive Lessons, Quizzes, AI Tutor for personalized help, Progress Tracking, Voice Assistant for hands-free navigation, and AI Insights for learning analytics.';
    } else if (command.includes('help') || command.includes('assist')) {
      responseText = 'I can help you navigate SmartLearn! Try saying "go to lessons", "open quiz page", "show me my profile", or ask questions about the platform features.';
    } else {
      responseText = 'I understand you\'re asking about SmartLearn. You can ask me to navigate to different pages, explain features, or help you use the platform. Try saying "go to lessons" or "what is SmartLearn".';
    }

    setTimeout(() => {
      setResponse(responseText);
      setIsProcessing(false);
      setHistory(prev => [{
        id: Date.now(),
        question: originalCommand,
        answer: responseText,
        time: 'Just now'
      }, ...prev]);
    }, 1000);
  }, []);

  // Process voice commands
  const processCommand = useCallback((command) => {
    setIsProcessing(true);
    const lowerCommand = command.toLowerCase().trim();

    // Check if command is about SmartLearn
    const smartLearnKeywords = ['smartlearn', 'smart learn', 'platform', 'app', 'dashboard', 'lesson', 'quiz', 'profile', 'settings', 'notification', 'ai tutor', 'voice', 'assistant'];
    const isAboutSmartLearn = smartLearnKeywords.some(keyword => lowerCommand.includes(keyword));

    if (!isAboutSmartLearn) {
      setTimeout(() => {
        setResponse('I can only help you with questions about SmartLearn. Please ask me about navigating the platform, features, or how to use SmartLearn.');
        setIsProcessing(false);
        setHistory(prev => [{
          id: Date.now(),
          question: command,
          answer: 'I can only help you with questions about SmartLearn. Please ask me about navigating the platform, features, or how to use SmartLearn.',
          time: 'Just now'
        }, ...prev]);
      }, 1000);
      return;
    }

    // Navigation commands
    if (lowerCommand.includes('go to') || lowerCommand.includes('open') || lowerCommand.includes('navigate to') || lowerCommand.includes('show me')) {
      handleNavigation(lowerCommand, command);
      return;
    }

    // Information commands
    handleInformationQuery(lowerCommand, command);
  }, [handleNavigation, handleInformationQuery]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcriptText = event.results[0][0].transcript;
        setTranscript(transcriptText);
        processCommand(transcriptText);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        let errorMessage = 'Sorry, I couldn\'t understand that. Please try again.';
        
        if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Please try speaking again.';
        } else if (event.error === 'audio-capture') {
          errorMessage = 'No microphone found. Please check your microphone settings.';
        } else if (event.error === 'not-allowed') {
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
        }
        
        setResponse(errorMessage);
        setIsProcessing(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsSupported(false);
    }
  }, [processCommand]);

  const handleStartListening = () => {
    if (!isSupported || !recognitionRef.current) {
      setResponse('Speech recognition is not supported in your browser. Please use a modern browser like Chrome, Edge, or Safari.');
      setIsProcessing(false);
      return;
    }

    setIsListening(true);
    setTranscript('');
    setResponse('');
    setIsProcessing(false);
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsListening(false);
      if (error.message && error.message.includes('already started')) {
        setResponse('Voice recognition is already active. Please wait for it to finish.');
      } else {
        setResponse('Error starting voice recognition. Please try again.');
      }
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handlePlayResponse = () => {
    if ('speechSynthesis' in window && response) {
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  return (
    <div className="voice-assistant-root">
      <aside className="voice-sidebar">
        <div className="sidebar-top">
          <Link to="/" className="logo-block">
            <div className="logo-circle">
              <FaLightbulb className="logo-icon" />
            </div>
            <span className="logo-text">SmartLearn</span>
          </Link>
          <nav className="nav-links">
            <Link className="nav-link" to="/app"><FaHome className="nav-ico" /><span className="label">Home</span></Link>
            <Link className="nav-link" to="/quiz"><FaEdit className="nav-ico" /><span className="label">Quiz</span></Link>
            <Link className="nav-link" to="/notifications"><FaBell className="nav-ico" /><span className="label">Notifications</span></Link>
            <Link className="nav-link" to="/lessons"><FaBook className="nav-ico" /><span className="label">Lessons</span></Link>
            <Link className="nav-link" to="/profile"><FaUser className="nav-ico" /><span className="label">Profile</span></Link>
            <Link className="nav-link" to="/ai-tutor"><FaRobot className="nav-ico" /><span className="label">AI Tutor</span></Link>
            <Link className="nav-link" to="/settings"><FaCog className="nav-ico" /><span className="label">Settings</span></Link>
          </nav>
        </div>
        <div className="sidebar-bottom">
          <Link className="nav-link active" to="/voice-assistant"><FaMicrophone className="nav-ico" /><span className="label">Voice Assistant</span></Link>
          <Link className="nav-link small" to="/ai-insights"><FaChartLine className="nav-ico" /><span className="label">AI Insights</span></Link>
          <div className="ai-buddy-block">
            <div className="ai-buddy-title">AI Buddy</div>
            <div className="ai-buddy-desc">Ready to help you learn something new today!</div>
            <Link className="ai-buddy-chat" to="/ai-tutor">Chat</Link>
          </div>
        </div>
      </aside>

      <main className="voice-main">
        <header className="voice-header">
          <div className="header-content">
            <h1>Voice Assistant</h1>
            <p className="muted">Navigate SmartLearn and ask questions about the platform using your voice</p>
          </div>
        </header>

        <div className="voice-container">
          <div className="voice-controls">
            <div className={`mic-button ${isListening ? 'listening' : ''} ${isProcessing ? 'processing' : ''}`}>
              {isListening ? (
                <button onClick={handleStopListening} className="mic-btn stop" aria-label="Stop listening">
                  <FaStop className="mic-icon" />
                  <span>Stop</span>
                </button>
              ) : (
                <button onClick={handleStartListening} className="mic-btn start" disabled={isProcessing} aria-label="Start voice assistant">
                  <FaMicrophone className="mic-icon" />
                  <span>{isProcessing ? 'Processing...' : 'Start'}</span>
                </button>
              )}
            </div>
            {isListening && (
              <div className="listening-indicator" aria-hidden="true">
                <div className="pulse-ring"></div>
                <div className="pulse-ring"></div>
                <div className="pulse-ring"></div>
              </div>
            )}
          </div>

          {transcript && (
            <div className="transcript-section">
              <h3>Your Question:</h3>
              <div className="transcript-box">
                <p>{transcript}</p>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="processing-section">
              <div className="processing-spinner"></div>
              <p>Processing your question...</p>
            </div>
          )}

          {response && (
            <div className="response-section">
              <div className="response-header">
                <h3>AI Response:</h3>
                <button onClick={handlePlayResponse} className="play-btn">
                  <FaVolumeUp />
                  <span>Play Audio</span>
                </button>
              </div>
              <div className="response-box">
                <p>{response}</p>
              </div>
            </div>
          )}

          {!transcript && !response && !isProcessing && (
            <div className="welcome-section">
              <div className="welcome-icon">
                <FaMicrophone />
              </div>
              <h2>Ready to Listen</h2>
              <p>Click the microphone button to navigate SmartLearn or ask questions about the platform</p>
              {!isSupported && (
                <div className="browser-warning">
                  <p>⚠️ Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.</p>
                </div>
              )}
              <div className="suggestions">
                <p className="suggestions-title">Try saying:</p>
                <div className="suggestion-chips">
                  <span className="chip">Go to lessons</span>
                  <span className="chip">Open quiz page</span>
                  <span className="chip">What is SmartLearn?</span>
                  <span className="chip">How do I take a quiz?</span>
                  <span className="chip">Show me my profile</span>
                  <span className="chip">Navigate to dashboard</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <section className="history-section">
          <div className="section-header">
            <h2>
              <FaClock className="section-icon" />
              Recent Conversations
            </h2>
          </div>
          <div className="history-list">
            {history.map(item => (
              <div key={item.id} className="history-item">
                <div className="history-question">
                  <strong>Q:</strong> {item.question}
                </div>
                <div className="history-answer">
                  <strong>A:</strong> {item.answer}
                </div>
                <div className="history-time">{item.time}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

