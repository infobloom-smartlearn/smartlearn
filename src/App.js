import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Onboarding from './pages/Onboarding';
import OnboardingStep1 from './pages/OnboardingStep1';
import OnboardingStep2 from './pages/OnboardingStep2';
import Navbar from './components/Navbar';
import OnboardingStep3 from './pages/OnboardingStep3';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import Quiz from './pages/Quiz';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import AiTutor from './pages/AiTutor';
import VoiceAssistant from './pages/VoiceAssistant';
import AIInsights from './pages/AIInsights';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherLessons from './pages/TeacherLessons';
import TeacherCourses from './pages/TeacherCourses';
import TeacherAnalytics from './pages/TeacherAnalytics';
import TeacherProfile from './pages/TeacherProfile';
import ParentDashboard from './pages/ParentDashboard';
import ParentChildProfiles from './pages/ParentChildProfiles';
import ParentQuizReports from './pages/ParentQuizReports';
import ParentMessages from './pages/ParentMessages';
import ParentSettings from './pages/ParentSettings';
import ParentProfile from './pages/ParentProfile';

function Home() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}

function App() {
  // Initialize dark mode on app load
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/step-1" element={<OnboardingStep1 />} />
        <Route path="/onboarding/step-2" element={<OnboardingStep2 />} />
        <Route path="/onboarding/step-3" element={<OnboardingStep3 />} />
        <Route path="/app" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-tutor" element={<AiTutor />} />
        <Route path="/voice-assistant" element={<VoiceAssistant />} />
        <Route path="/ai-insights" element={<AIInsights />} />
        {/* Teacher experience */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/lessons" element={<TeacherLessons />} />
        <Route path="/teacher/courses" element={<TeacherCourses />} />
        <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        {/* Parent experience */}
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/parent/profiles" element={<ParentChildProfiles />} />
        <Route path="/parent/quiz-reports" element={<ParentQuizReports />} />
        <Route path="/parent/messages" element={<ParentMessages />} />
        <Route path="/parent/notifications" element={<ParentDashboard />} />
        <Route path="/parent/profile" element={<ParentProfile />} />
        <Route path="/parent/settings" element={<ParentSettings />} />
        {/* add further steps like /onboarding/step-4 next */}
        {/* ...other routes... */}
      </Routes>
    </Router>
  );
}

export default App;
