import React, { useState, useRef, useEffect } from 'react';
import '../styles/TutorChat.css';

const suggestions = [
  'Explain photosynthesis',
  'What is Newton\'s 2nd law?',
  'How does recursion work?',
  'What is the Pythagorean theorem?',
];

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const BotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>
  </svg>
);

export default function TutorChat() {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const firstName = user.name?.split(' ')[0] || 'there';

  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi ${firstName}! I'm your AI tutor. Ask me anything about your coursework — I'm here to help you understand concepts, solve problems, and prepare for exams. 🎓` }
  ]);
  const [input, setInput]   = useState('');
  const bottomRef           = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (text) => {
    const q = (text || input).trim();
    if (!q) return;
    setInput('');
    setMessages(prev => [
      ...prev,
      { role: 'user', text: q },
      { role: 'ai', text: `Great question! "${q}" is an important concept. In a full integration, I'd connect to an AI backend to give you a detailed, personalised explanation. For now, try breaking the topic into smaller parts and reviewing your notes!` }
    ]);
  };

  return (
    <div className="chat-wrapper">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-icon"><BotIcon /></div>
        <div>
          <h1>AI Tutor</h1>
          <p className="chat-online">● Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-row ${msg.role}`}>
            {msg.role === 'ai' && (
              <div className="chat-bot-avatar"><BotIcon /></div>
            )}
            <div className={`chat-bubble ${msg.role}`}>{msg.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="chat-suggestions">
        {suggestions.map(s => (
          <button key={s} className="chat-suggestion" onClick={() => send(s)}>{s}</button>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input-wrap">
        <div className="chat-input-box">
          <input
            className="chat-input"
            placeholder="Ask anything about your studies..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <button className="chat-send-btn" onClick={() => send()}><SendIcon /></button>
        </div>
      </div>
    </div>
  );
}
