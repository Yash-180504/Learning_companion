import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/Auth.css';

const SUBJECTS = ['mathematics','science','english','history','geography','physics','chemistry','biology'];
const CLASSES  = ['6','7','8','9','10','11','12'];

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open
      ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
    }
  </svg>
);

const Auth = () => {
  const navigate = useNavigate();

  const [tab, setTab]           = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData]     = useState({
    name: '', email: '', password: '', confirmPassword: '',
    class: '', subject: '', learningPace: 'medium'
  });

  const { updateLoginStreak } = useApp();
  const switchTab = (t) => { setTab(t); setError(''); setShowPass(false); };

  if (localStorage.getItem('currentUser')) return <Navigate to="/app" replace />;

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user  = users.find(u => u.email === loginData.email && u.password === loginData.password);
      if (!user) { setError('Invalid email or password.'); setLoading(false); return; }
      localStorage.setItem('currentUser', JSON.stringify(user));
      updateLoginStreak();
      navigate('/app');
    }, 600);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (regData.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (regData.password !== regData.confirmPassword) { setError('Passwords do not match.'); return; }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === regData.email)) { setError('An account with this email already exists.'); return; }

    setLoading(true);
    setTimeout(() => {
      const newUser = {
        name: regData.name, email: regData.email, password: regData.password,
        class: regData.class, subject: regData.subject, learningPace: regData.learningPace,
        joinDate: new Date().toISOString().split('T')[0],
        stats: { quizzesCompleted: 0, totalPoints: 0, streak: 0, accuracy: 0 }
      };
      localStorage.setItem('users', JSON.stringify([...users, newUser]));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      updateLoginStreak();
      navigate('/app');
    }, 600);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon">AI</div>
          <h1>Learning Companion</h1>
          <p>Your personalized path to knowledge</p>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>Sign In</button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => switchTab('register')}>Register</button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={loginData.email}
                onChange={e => { setLoginData({ ...loginData, email: e.target.value }); setError(''); }}
                placeholder="you@school.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input type={showPass ? 'text' : 'password'} name="password" value={loginData.password}
                  onChange={e => { setLoginData({ ...loginData, password: e.target.value }); setError(''); }}
                  placeholder="Enter your password" required />
                <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}><EyeIcon open={showPass} /></button>
              </div>
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Sign In'}
            </button>
            <p className="auth-switch">Don't have an account?{' '}
              <button type="button" onClick={() => switchTab('register')}>Register here</button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={regData.name}
                onChange={e => { setRegData({ ...regData, name: e.target.value }); setError(''); }}
                placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={regData.email}
                onChange={e => { setRegData({ ...regData, email: e.target.value }); setError(''); }}
                placeholder="you@school.com" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Class / Grade</label>
                <select name="class" value={regData.class} onChange={e => setRegData({ ...regData, class: e.target.value })} required>
                  <option value="">Select class</option>
                  {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Preferred Subject</label>
                <select name="subject" value={regData.subject} onChange={e => setRegData({ ...regData, subject: e.target.value })} required>
                  <option value="">Select subject</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Learning Pace</label>
              <div className="pace-options">
                {[['slow','Slow & Steady'],['medium','Moderate'],['fast','Fast Track']].map(([val, lbl]) => (
                  <label key={val} className={`pace-option ${regData.learningPace === val ? 'active' : ''}`}>
                    <input type="radio" name="learningPace" value={val} checked={regData.learningPace === val}
                      onChange={() => setRegData({ ...regData, learningPace: val })} />
                    <span>{lbl}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input type={showPass ? 'text' : 'password'} name="password" value={regData.password}
                  onChange={e => { setRegData({ ...regData, password: e.target.value }); setError(''); }}
                  placeholder="Min. 6 characters" required />
                <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}><EyeIcon open={showPass} /></button>
              </div>
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type={showPass ? 'text' : 'password'} name="confirmPassword" value={regData.confirmPassword}
                onChange={e => { setRegData({ ...regData, confirmPassword: e.target.value }); setError(''); }}
                placeholder="Repeat your password" required />
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create Account'}
            </button>
            <p className="auth-switch">Already have an account?{' '}
              <button type="button" onClick={() => switchTab('login')}>Sign in here</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
