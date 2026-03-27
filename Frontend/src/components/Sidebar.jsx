import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp, getRank, getNextRankXP } from '../context/AppContext';
import './Sidebar.css';

const HomeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const QuizIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);
const FlashcardIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);
const TutorIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const PathIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
    <line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const nav = [
  { to: '/app',                  icon: HomeIcon,      label: 'Dashboard',     end: true },
  { to: '/app/profile',          icon: UserIcon,      label: 'My Profile'               },
  { to: '/app/quiz',             icon: QuizIcon,      label: 'Quiz'                     },
  { to: '/app/flashcards',       icon: FlashcardIcon, label: 'Flashcards'               },
  { to: '/app/tutor',            icon: TutorIcon,     label: 'AI Tutor'                 },
  { to: '/app/learning-path',    icon: PathIcon,      label: 'Learning Path'            },
];

export default function Sidebar({ open, onClose }) {
  const navigate   = useNavigate();
  const { xpTick } = useApp();
  void xpTick;

  const user     = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'S';
  const xp       = user.xp || 0;
  const rank     = getRank(xp);
  const nextXP   = getNextRankXP(xp);
  const streak   = user.loginStreak || 0;
  const xpPct    = nextXP ? Math.min(100, Math.round((xp / nextXP) * 100)) : 100;

  const handleNav    = () => { if (onClose) onClose(); };
  const handleLogout = () => { localStorage.removeItem('currentUser'); navigate('/login'); };

  return (
    <aside className={`sidebar${open ? ' sidebar-open' : ''}`}>

      {/* Brand */}
      <div className="sidebar-brand" onClick={() => { navigate('/'); handleNav(); }}>
        <div className="sidebar-logo">AI</div>
        <span>Learning Companion</span>
      </div>

      {/* XP block */}
      <div className="sidebar-xp-block">
        <div className="sidebar-xp-top">
          <span className="sidebar-rank">{rank}</span>
          <span className="sidebar-streak">{streak}d streak</span>
        </div>
        <div className="sidebar-xp-row">
          <span className="sidebar-xp-label">{xp} XP</span>
          {nextXP && <span className="sidebar-xp-next">{nextXP} XP</span>}
        </div>
        <div className="sidebar-xp-track">
          <div className="sidebar-xp-fill" style={{ width: `${xpPct}%` }} />
        </div>
        {nextXP && <p className="sidebar-xp-hint">{nextXP - xp} XP to {getRank(nextXP)}</p>}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {nav.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={handleNav}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user.name || 'Student'}</p>
            <p className="sidebar-user-sub">Class {user.class || '—'}</p>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout} title="Sign out">
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}
