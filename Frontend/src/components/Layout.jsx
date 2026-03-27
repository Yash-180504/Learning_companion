import React, { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useApp } from '../context/AppContext';
import './Layout.css';

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

function NotifIcon({ type }) {
  if (type === 'xp' || type === 'gain') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
  if (type === 'rank') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
  if (type === 'streak') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
    </svg>
  );
  if (type === 'course') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

function NotificationPanel({ notifications, markAllRead, clearNotifications, onClose }) {
  const unread = notifications.filter(n => !n.read).length;
  const panelRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="notif-panel" ref={panelRef}>
      <div className="notif-header">
        <span>Notifications {unread > 0 && <span className="notif-badge-count">{unread}</span>}</span>
        <div className="notif-header-actions">
          {unread > 0 && <button onClick={markAllRead}>Mark all read</button>}
          {notifications.length > 0 && <button onClick={clearNotifications}>Clear</button>}
        </div>
      </div>
      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">No notifications yet</div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`notif-item${n.read ? '' : ' unread'} notif-${n.type}`}>
              <span className="notif-icon"><NotifIcon type={n.type} /></span>
              <div className="notif-body">
                <p>{n.message}</p>
                <span>{timeAgo(n.time)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const { theme, toggleTheme, notifications, markAllRead, clearNotifications } = useApp();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="layout-wrapper">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="layout-right">
        {/* Top bar — visible on all sizes */}
        <div className="layout-topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>
            <span /><span /><span />
          </button>
          <div className="mobile-brand">
            <div className="mobile-logo">AI</div>
            <span>Learning Companion</span>
          </div>
          <div className="topbar-actions">
            <button className="topbar-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            <div className="notif-wrap">
              <button className="topbar-btn" onClick={() => setNotifOpen(o => !o)} title="Notifications">
                <BellIcon />
                {unread > 0 && <span className="notif-dot">{unread > 9 ? '9+' : unread}</span>}
              </button>
              {notifOpen && (
                <NotificationPanel
                  notifications={notifications}
                  markAllRead={markAllRead}
                  clearNotifications={clearNotifications}
                  onClose={() => setNotifOpen(false)}
                />
              )}
            </div>
          </div>
        </div>

        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
