import React, { useState, useRef, useEffect } from 'react';
import './AiTutor.css';
import { Link } from 'react-router-dom';

function formatTime(ms) {
  try {
    return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
}

export default function AiTutor() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello 👋 I am your AI Tutor. What would you like to learn today?', time: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loadingIds, setLoadingIds] = useState([]);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loadingIds]);

  function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const ts = Date.now();
    const userMsg = { id: ts, sender: 'user', text: trimmed, time: ts };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const botId = ts + 1;
    setLoadingIds(ids => [...ids, botId]);
    setMessages(prev => [...prev, { id: botId, sender: 'bot', text: 'Thinking...', time: Date.now() }]);

    // Simulated AI response (replace with API call later)
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === botId ? { ...m, text: `I can help with that. Here's a concise explanation about "${trimmed}" and a suggested next step to practice.` } : m));
      setLoadingIds(ids => ids.filter(i => i !== botId));
    }, 900 + Math.random() * 800);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const suggestions = ['Explain Pythagoras', 'Practice algebra', 'Summarize photosynthesis'];

  return (
    <div className="ai-root">
      <aside className="ai-sidebar">
        <div className="sidebar-top">
          <Link to="/app" className="back-link">← Back</Link>
          <div className="ai-info">
            <div className="ai-avatar">🤖</div>
            <h2>AI Tutor</h2>
            <p>Your personal learning assistant — explanations, practice and study plans.</p>
          </div>
        </div>

        <div className="ai-suggestions">
          <h4>Quick prompts</h4>
          {suggestions.map(s => (
            <button key={s} className="suggest-btn" onClick={() => { setInput(s); }}>
              {s}
            </button>
          ))}
        </div>
      </aside>

      <main className="ai-main">
        <header className="ai-main-header">
          <div>
            <h3>Chat with your AI Tutor</h3>
            <div className="ai-sub">Get explanations, examples and practice.</div>
          </div>
          <div className="ai-status">● <span>Online</span></div>
        </header>

        <div className="ai-chat" ref={listRef}>
          {messages.map(msg => {
            const isTyping = msg.text === 'Thinking...';
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} className={`chat-message user`}>
                  <div className="bubble user-bubble">
                    <div className="bubble-text">{msg.text}</div>
                    <div className="time">{formatTime(msg.time)}</div>
                  </div>
                  <div className="avatar">👩‍🎓</div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`chat-message bot`}>
                <div className="avatar">🤖</div>
                <div className="bubble bot-bubble">
                  {isTyping ? (
                    <div className="typing">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </div>
                  ) : (
                    <div className="bubble-text">{msg.text}</div>
                  )}
                  <div className="time">{formatTime(msg.time)}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="ai-input-row">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask a question or request an exercise... (Shift+Enter for new line)"
            aria-label="Message input"
          />
          <div className="input-actions">
            <button className="btn-secondary" onClick={() => { setInput(''); }}>Clear</button>
            <button className="btn-primary" onClick={sendMessage} aria-label="Send message">Send</button>
          </div>
        </div>
      </main>
    </div>
  );
}
