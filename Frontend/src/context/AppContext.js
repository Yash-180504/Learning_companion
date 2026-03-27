import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

export function getRank(xp = 0) {
  if (xp >= 2000) return 'Legend';
  if (xp >= 1000) return 'Expert';
  if (xp >= 500)  return 'Advanced';
  if (xp >= 200)  return 'Intermediate';
  if (xp >= 50)   return 'Beginner';
  return 'Newcomer';
}

export function getNextRankXP(xp = 0) {
  if (xp >= 2000) return null;
  if (xp >= 1000) return 2000;
  if (xp >= 500)  return 1000;
  if (xp >= 200)  return 500;
  if (xp >= 50)   return 200;
  return 50;
}

const getUser  = () => JSON.parse(localStorage.getItem('currentUser') || 'null');
const saveUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  localStorage.setItem('users', JSON.stringify(
    users.map(u => u.email === user.email ? user : u)
  ));
};

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [notifications, setNotifications] = useState(
    () => JSON.parse(localStorage.getItem('notifications') || '[]')
  );
  const [xpTick, setXpTick] = useState(0); // forces re-reads of XP from localStorage

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => {
      const next = t === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  // ── Notifications ──────────────────────────────────────────────────────────
  const pushNotification = useCallback((type, message, icon = '🔔') => {
    const notif = {
      id: Date.now() + Math.random(),
      type, message, icon,
      time: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => {
      const updated = [notif, ...prev].slice(0, 30);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    localStorage.setItem('notifications', '[]');
  }, []);

  // ── XP ─────────────────────────────────────────────────────────────────────
  const addXP = useCallback((amount, reason) => {
    const user = getUser();
    if (!user) return;
    const prevXP = user.xp || 0;
    const nextXP = Math.max(0, prevXP + amount);
    const updated = { ...user, xp: nextXP };
    saveUser(updated);
    setXpTick(t => t + 1);

    // XP history for graph
    const xpHistory = JSON.parse(localStorage.getItem('xpHistory') || '[]');
    xpHistory.push({
      email: user.email,
      xp: nextXP,
      delta: amount,
      reason,
      date: new Date().toISOString(),
    });
    localStorage.setItem('xpHistory', JSON.stringify(xpHistory));

    // XP notification
    pushNotification('xp', `${amount > 0 ? '+' : ''}${amount} XP — ${reason}`, amount > 0 ? 'gain' : 'loss');

    // Rank-up notification
    const prevRank = getRank(prevXP);
    const nextRank = getRank(nextXP);
    if (nextRank !== prevRank) {
      pushNotification('rank', `You ranked up to ${nextRank}!`, 'rank');
    }
  }, [pushNotification]);

  // ── Login streak ───────────────────────────────────────────────────────────
  const updateLoginStreak = useCallback(() => {
    const user = getUser();
    if (!user) return;
    const today     = new Date().toISOString().split('T')[0];
    if (user.lastLoginDate === today) return;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const streak    = user.lastLoginDate === yesterday ? (user.loginStreak || 0) + 1 : 1;
    const updated   = { ...user, loginStreak: streak, lastLoginDate: today };
    saveUser(updated);
    setXpTick(t => t + 1);

    pushNotification('streak', `Day ${streak} login streak! Keep it up!`, 'streak');
    if (streak > 1) {
      addXP(10, `Day ${streak} login streak bonus`);
    }
  }, [pushNotification, addXP]);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      notifications, pushNotification, markAllRead, clearNotifications,
      addXP, updateLoginStreak,
      xpTick,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
