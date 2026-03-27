import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, getRank, getNextRankXP } from '../context/AppContext';
import '../styles/StudentProfile.css';

const SUBJECTS    = ['mathematics','science','english','history','geography','physics','chemistry','biology'];
const CLASSES     = ['6','7','8','9','10','11','12'];
const PACE_LABELS = { slow: 'Slow & Steady', medium: 'Moderate', fast: 'Fast Track' };

const validate = (field, value) => {
  if (field === 'name')  return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
  if (field === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address';
  return '';
};

const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const InlineField = ({ label, field, value, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);
  const [error, setError]     = useState('');
  useEffect(() => { setDraft(value); }, [value]);
  const save = () => {
    const err = validate(field, draft);
    if (err) { setError(err); return; }
    onSave(field, draft.trim()); setEditing(false);
  };
  const cancel = () => { setDraft(value); setError(''); setEditing(false); };
  return (
    <div className="info-item">
      <span className="info-label">{label}</span>
      {editing ? (
        <div className="inline-edit">
          <input autoFocus type={field === 'email' ? 'email' : 'text'} value={draft}
            onChange={e => { setDraft(e.target.value); setError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
            className={`inline-input${error ? ' error' : ''}`} />
          <div className="inline-actions">
            <button className="icon-btn confirm" onClick={save}><CheckIcon /></button>
            <button className="icon-btn discard" onClick={cancel}><XIcon /></button>
          </div>
          {error && <span className="field-error">{error}</span>}
        </div>
      ) : (
        <div className="info-value-row">
          <span className="info-value">{value}</span>
          <button className="icon-btn edit-field" onClick={() => { setDraft(value); setError(''); setEditing(true); }}><PencilIcon /></button>
        </div>
      )}
    </div>
  );
};

const SelectField = ({ label, field, value, options, displayMap, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);
  useEffect(() => { setDraft(value); }, [value]);
  return (
    <div className="info-item">
      <span className="info-label">{label}</span>
      {editing ? (
        <div className="inline-edit">
          <select autoFocus value={draft} onChange={e => setDraft(e.target.value)} className="inline-input">
            {options.map(o => <option key={o} value={o}>{displayMap ? displayMap(o) : o}</option>)}
          </select>
          <div className="inline-actions">
            <button className="icon-btn confirm" onClick={() => { onSave(field, draft); setEditing(false); }}><CheckIcon /></button>
            <button className="icon-btn discard" onClick={() => { setDraft(value); setEditing(false); }}><XIcon /></button>
          </div>
        </div>
      ) : (
        <div className="info-value-row">
          <span className="info-value">{displayMap ? displayMap(value) : value}</span>
          <button className="icon-btn edit-field" onClick={() => { setDraft(value); setEditing(true); }}><PencilIcon /></button>
        </div>
      )}
    </div>
  );
};

const PaceField = ({ value, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);
  useEffect(() => { setDraft(value); }, [value]);
  return (
    <div className="info-item info-item-full">
      <span className="info-label">Learning Pace</span>
      {editing ? (
        <div className="pace-edit">
          <div className="pace-options">
            {Object.entries(PACE_LABELS).map(([key, lbl]) => (
              <label key={key} className={`pace-option ${draft === key ? 'active' : ''}`}>
                <input type="radio" name="pace" value={key} checked={draft === key} onChange={() => setDraft(key)} />
                <span>{lbl}</span>
              </label>
            ))}
          </div>
          <div className="inline-actions pace-actions">
            <button className="icon-btn confirm" onClick={() => { onSave('learningPace', draft); setEditing(false); }}><CheckIcon /></button>
            <button className="icon-btn discard" onClick={() => { setDraft(value); setEditing(false); }}><XIcon /></button>
          </div>
        </div>
      ) : (
        <div className="info-value-row">
          <span className="info-value">{PACE_LABELS[value]}</span>
          <button className="icon-btn edit-field" onClick={() => { setDraft(value); setEditing(true); }}><PencilIcon /></button>
        </div>
      )}
    </div>
  );
};

function XPGraph({ data }) {
  const W = 500, H = 80, PAD = 8;
  const values = data.map(d => d.xp);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = PAD + (i / (values.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((v - min) / range) * (H - PAD * 2);
    return `${x},${y}`;
  }).join(' ');
  const areaBottom = `${PAD + (values.length - 1) / (values.length - 1) * (W - PAD * 2)},${H - PAD} ${PAD},${H - PAD}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="xp-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#4f46e5" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`${pts} ${areaBottom}`} fill="url(#xpGrad)" />
      <polyline points={pts} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => {
        const x = PAD + (i / (values.length - 1)) * (W - PAD * 2);
        const y = H - PAD - ((v - min) / range) * (H - PAD * 2);
        return <circle key={i} cx={x} cy={y} r="3" fill="#4f46e5" />;
      })}
    </svg>
  );
}

const StudentProfile = () => {
  const navigate = useNavigate();
  const { xpTick } = useApp();
  const [profile, setProfile]         = useState(null);
  const [toast, setToast]             = useState('');
  const [quizHistory, setQuizHistory] = useState([]);
  const [xpHistory, setXpHistory]     = useState([]);

  useEffect(() => {
    const current = localStorage.getItem('currentUser');
    if (!current) { navigate('/login'); return; }
    const user = JSON.parse(current);
    setProfile(user);
    const all = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    setQuizHistory(all.filter(h => h.email === user.email));
    const allXP = JSON.parse(localStorage.getItem('xpHistory') || '[]');
    setXpHistory(allXP.filter(h => h.email === user.email).slice(-14));
  }, [navigate, xpTick]);

  const handleSave = (field, value) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    localStorage.setItem('users', JSON.stringify(users.map(u => u.email === updated.email ? { ...u, [field]: value } : u)));
    setToast('Changes saved');
    setTimeout(() => setToast(''), 2500);
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  if (!profile) return null;

  const quizzesCompleted = quizHistory.length;
  const accuracy         = quizzesCompleted > 0
    ? Math.round(quizHistory.reduce((s, h) => s + (h.accuracy || 0), 0) / quizzesCompleted) : 0;

  const streak = (() => {
    if (!quizzesCompleted) return 0;
    const days = [...new Set(quizHistory.map(h => h.date))].sort((a, b) => new Date(b) - new Date(a));
    let count = 0; let expected = new Date(); expected.setHours(0,0,0,0);
    for (const day of days) {
      const d = new Date(day); d.setHours(0,0,0,0);
      if (d.getTime() === expected.getTime()) { count++; expected.setDate(expected.getDate() - 1); } else break;
    }
    return count;
  })();

  const xp       = profile.xp || 0;
  const rank     = getRank(xp);
  const nextXP   = getNextRankXP(xp);
  const xpPct    = nextXP ? Math.min(100, Math.round((xp / nextXP) * 100)) : 100;

  const stats = [
    { label: 'Total XP',          value: xp },
    { label: 'Rank',              value: rank },
    { label: 'Quizzes Completed', value: quizzesCompleted },
    { label: 'Accuracy Rate',     value: `${accuracy}%` },
  ];

  return (
    <div className="sp-wrapper">
      {toast && <div className="toast">{toast}</div>}

      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>View and manage your personal information</p>
        </div>
        <button className="sp-quiz-btn" onClick={() => navigate('/app/quiz')}>Take a Quiz →</button>
      </div>

      <div className="sp-body">
        {/* Profile card */}
        <div className="sp-profile-card">
          <div className="profile-avatar">{getInitials(profile.name)}</div>
          <div className="profile-info">
            <h2>{profile.name}</h2>
            <p className="profile-meta">Class {profile.class} &bull; {profile.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* XP progress bar */}
        <div className="profile-details">
          <div className="details-header"><h2>XP & Rank</h2></div>
          <div className="xp-rank-block">
            <div className="xp-rank-top">
              <div>
                <span className="xp-rank-label">Current Rank</span>
                <span className="xp-rank-value">{rank}</span>
              </div>
              <div className="xp-rank-right">
                <span className="xp-rank-label">Total XP</span>
                <span className="xp-rank-xp">⚡ {xp} XP</span>
              </div>
            </div>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
            </div>
            <div className="xp-bar-meta">
              <span>{xp} XP</span>
              <span>{nextXP ? `${nextXP - xp} XP to ${getRank(nextXP)}` : 'Max Rank!'}</span>
            </div>
          </div>
          {/* XP Sparkline graph */}
          {xpHistory.length > 1 && (
            <div className="xp-graph-wrap">
              <p className="xp-graph-title">XP History (last {xpHistory.length} events)</p>
              <XPGraph data={xpHistory} />
            </div>
          )}
        </div>

        {/* Streak */}
        <div className="profile-details">
          <div className="details-header"><h2>Login Streak</h2></div>
          <div className="streak-block">
            <div className="streak-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <p className="streak-count">{streak} day{streak !== 1 ? 's' : ''}</p>
              <p className="streak-sub">Log in every day to keep your streak alive!</p>
            </div>
          </div>
        </div>

        {/* Profile info */}
        <div className="profile-details">
          <div className="details-header">
            <h2>Profile Information</h2>
            <span className="edit-hint">Click <PencilIcon /> to edit any field</span>
          </div>
          <div className="info-grid">
            <InlineField label="Full Name" field="name"  value={profile.name}  onSave={handleSave} />
            <InlineField label="Email"     field="email" value={profile.email} onSave={handleSave} />
            <SelectField label="Class / Grade"     field="class"   value={profile.class}   options={CLASSES}   displayMap={v => `Class ${v}`} onSave={handleSave} />
            <SelectField label="Preferred Subject" field="subject" value={profile.subject} options={SUBJECTS}  displayMap={v => v.charAt(0).toUpperCase() + v.slice(1)} onSave={handleSave} />
            <PaceField value={profile.learningPace} onSave={handleSave} />
            <div className="info-item">
              <span className="info-label">Member Since</span>
              <span className="info-value">
                {new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Quiz history */}
        {quizHistory.length > 0 && (
          <div className="profile-details">
            <div className="details-header"><h2>Recent Quiz Results</h2></div>
            <div className="quiz-history">
              {quizHistory.slice().reverse().slice(0, 5).map((h, i) => (
                <div key={i} className="history-row">
                  <div className="history-info">
                    <span className="history-subject">{h.subject.charAt(0).toUpperCase() + h.subject.slice(1)}</span>
                    <span className="history-date">{new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="history-stats">
                    <span className="history-score">{h.score} pts</span>
                    <span className={`history-accuracy ${h.accuracy >= 70 ? 'good' : h.accuracy >= 40 ? 'mid' : 'low'}`}>{h.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
