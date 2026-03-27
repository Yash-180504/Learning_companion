import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const features = [
  {
    icon: '🧠',
    title: 'AI-Powered Tutoring',
    desc: 'Get instant, personalized explanations from your AI tutor — available 24/7 for any subject.',
  },
  {
    icon: '📊',
    title: 'Diagnostic Quizzes',
    desc: 'Assess your knowledge level with adaptive quizzes tailored to your class and subject.',
  },
  {
    icon: '🃏',
    title: 'Smart Flashcards',
    desc: 'Reinforce learning with spaced-repetition flashcards that adapt to what you need most.',
  },
  {
    icon: '📈',
    title: 'Progress Tracking',
    desc: 'Visualize your learning journey with detailed stats, streaks, and accuracy reports.',
  },
  {
    icon: '🎯',
    title: 'Personalized Paths',
    desc: 'Learning plans built around your pace — slow & steady, moderate, or fast track.',
  },
  {
    icon: '🏆',
    title: 'Points & Streaks',
    desc: 'Stay motivated with a reward system that celebrates every quiz and daily streak.',
  },
];

const steps = [
  { step: '01', title: 'Create your profile', desc: 'Set your class, subject, and learning pace in under a minute.' },
  { step: '02', title: 'Take the diagnostic quiz', desc: 'We assess your current level to personalise your experience.' },
  { step: '03', title: 'Start learning', desc: 'Access your dashboard, flashcards, AI tutor, and progress tracker.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('currentUser');

  return (
    <div className="landing">
      {/* ── Navbar ── */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo" onClick={() => navigate('/')}>
            <div className="logo-icon">AI</div>
            <span>Learning Companion</span>
          </div>
          <nav className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
          </nav>
          <div className="landing-nav-actions">
            {isLoggedIn ? (
              <button className="btn-primary" onClick={() => navigate('/app')}>Go to Dashboard</button>
            ) : (
              <>
                <button className="btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
                <button className="btn-primary" onClick={() => navigate('/login')}>Get Started</button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-badge">✨ AI-Powered Learning</div>
        <h1 className="hero-title">
          Your personalized<br />
          <span className="hero-gradient">learning companion</span>
        </h1>
        <p className="hero-sub">
          Adaptive quizzes, smart flashcards, and an AI tutor — all in one place.
          Built for students who want to learn smarter, not harder.
        </p>
        <div className="hero-actions">
          <button className="btn-primary btn-lg" onClick={() => navigate('/login')}>
            Start Learning Free →
          </button>
          <button className="btn-outline btn-lg" onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><strong>8</strong><span>Subjects</span></div>
          <div className="hero-stat-divider" />
          <div className="hero-stat"><strong>40+</strong><span>Quiz Questions</span></div>
          <div className="hero-stat-divider" />
          <div className="hero-stat"><strong>24/7</strong><span>AI Tutor</span></div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section" id="features">
        <div className="section-inner">
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything you need to excel</h2>
          <p className="section-sub">One platform that covers every aspect of your learning journey.</p>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section section-alt" id="how">
        <div className="section-inner">
          <div className="section-label">How it works</div>
          <h2 className="section-title">Up and running in minutes</h2>
          <div className="steps-grid">
            {steps.map((s) => (
              <div key={s.step} className="step-card">
                <div className="step-number">{s.step}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>Ready to start learning?</h2>
          <p>Join thousands of students already using AI Learning Companion.</p>
          <button className="btn-primary btn-lg" onClick={() => navigate('/login')}>
            Create Free Account →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-logo" onClick={() => navigate('/')}>
          <div className="logo-icon logo-icon-sm">AI</div>
          <span>Learning Companion</span>
        </div>
        <p>© {new Date().getFullYear()} AI Learning Companion. Built for students.</p>
      </footer>
    </div>
  );
}
