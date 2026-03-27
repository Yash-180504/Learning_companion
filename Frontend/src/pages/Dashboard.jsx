import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, getRank } from '../context/AppContext';
import XPChart   from '../components/XPChart';
import XPSidebar from '../components/XPSidebar';
import '../styles/Dashboard.css';

/* ── Icons ── */
const QuizIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);
const FlashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);
const TutorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const PathIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
    <line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const TrendUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);
const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const TargetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const ZapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const quickLinks = [
  { label: 'Take a Quiz',      sub: 'Test your knowledge',        path: '/app/quiz',          icon: QuizIcon  },
  { label: 'Flashcards',       sub: 'Spaced repetition session',  path: '/app/flashcards',    icon: FlashIcon },
  { label: 'AI Tutor',         sub: 'Get instant explanations',   path: '/app/tutor',         icon: TutorIcon },
  { label: 'Learning Path',    sub: 'View your topic graph',      path: '/app/learning-path', icon: PathIcon  },
];

export default function Dashboard() {
  const navigate       = useNavigate();
  const { xpTick }     = useApp();
  void xpTick;

  const [user, setUser]               = useState({});
  const [quizHistory, setQuizHistory] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setUser(u);
    const all = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    setQuizHistory(all.filter(h => h.email === u.email));
  }, [xpTick]);

  const xp               = user.xp || 0;
  const rank             = getRank(xp);
  const quizzesCompleted = quizHistory.length;
  const accuracy         = quizzesCompleted > 0
    ? Math.round(quizHistory.reduce((s, h) => s + (h.accuracy || 0), 0) / quizzesCompleted) : 0;
  const streak           = user.loginStreak || 0;

  const stats = [
    { label: 'Total XP',          value: xp,                                  icon: ZapIcon,    color: '#4f46e5', bg: '#eef2ff'  },
    { label: 'Current Rank',      value: rank,                                icon: StarIcon,   color: '#7c3aed', bg: '#f5f3ff'  },
    { label: 'Quizzes Completed', value: quizzesCompleted || 0,               icon: TrendUpIcon,color: '#059669', bg: '#f0fdf4'  },
    { label: 'Accuracy Rate',     value: accuracy ? `${accuracy}%` : '—',    icon: TargetIcon, color: '#d97706', bg: '#fffbeb'  },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1>Welcome back, {user.name?.split(' ')[0] || 'Student'}</h1>
          <p>Here is an overview of your learning journey.</p>
        </div>
        <div className="dash-header-streak">
          <ZapIcon />
          <span>{streak} day streak</span>
        </div>
      </div>

      <div className="page-body">

        {/* Stat cards */}
        <div className="dash-stats">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="dash-stat-card">
              <div className="dash-stat-icon" style={{ background: bg, color }}>
                <Icon />
              </div>
              <div>
                <div className="dash-stat-value" style={{ color }}>{value}</div>
                <div className="dash-stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="dash-charts-row">
          <div className="dash-chart-main">
            <p className="dash-section-label">XP Progress</p>
            <XPChart loading={false} />
          </div>
          <div className="dash-chart-side">
            <p className="dash-section-label">Rank Overview</p>
            <XPSidebar xpData={{ totalXP: xp, streak }} />
          </div>
        </div>

        {/* Quick actions */}
        <p className="dash-section-label">Quick Actions</p>
        <div className="dash-quick-links">
          {quickLinks.map(({ label, sub, path, icon: Icon }) => (
            <button key={path} className="dash-quick-card" onClick={() => navigate(path)}>
              <div className="dash-quick-icon">
                <Icon />
              </div>
              <div className="dash-quick-text">
                <span className="dash-quick-label">{label}</span>
                <span className="dash-quick-sub">{sub}</span>
              </div>
              <ArrowIcon />
            </button>
          ))}
        </div>

        {/* Recent activity */}
        <p className="dash-section-label">Recent Activity</p>
        <div className="dash-activity">
          {quizHistory.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-icon"><TrendUpIcon /></div>
              <p>No activity yet. Take your first quiz to get started.</p>
              <button className="dash-empty-btn" onClick={() => navigate('/app/quiz')}>
                Start Quiz
              </button>
            </div>
          ) : (
            quizHistory.slice().reverse().slice(0, 5).map((h, i) => (
              <div key={i} className="dash-activity-row">
                <div className="dash-activity-dot" />
                <div className="dash-activity-info">
                  <span className="dash-activity-title">
                    {h.subject.charAt(0).toUpperCase() + h.subject.slice(1)} Quiz
                  </span>
                  <span className="dash-activity-date">
                    {new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="dash-activity-right">
                  <span className="dash-activity-pts">{h.score} pts</span>
                  <span className={`dash-activity-acc ${h.accuracy >= 70 ? 'good' : h.accuracy >= 40 ? 'mid' : 'low'}`}>
                    {h.accuracy}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
