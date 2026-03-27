import { getRank, getNextRankXP } from '../context/AppContext';
import '../styles/XPComponents.css';

export default function XPSidebar({ xpData }) {
  const user   = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const xp     = user.xp || xpData?.totalXP || 0;
  const streak = user.loginStreak || xpData?.streak || 0;
  const rank   = getRank(xp);
  const nextXP = getNextRankXP(xp);
  const pct    = nextXP ? Math.min(100, Math.round((xp / nextXP) * 100)) : 100;

  const rows = [
    { label: 'Current Rank', value: rank },
    { label: 'Total XP',     value: `${xp} XP` },
    { label: 'Login Streak', value: `${streak} day${streak !== 1 ? 's' : ''}` },
    { label: 'Next Rank',    value: nextXP ? `${nextXP - xp} XP away` : 'Max rank' },
  ];

  return (
    <div className="xpc-card">
      <p className="xpc-title">Your Progress</p>
      <div className="xps-rows">
        {rows.map(r => (
          <div key={r.label} className="xps-row">
            <span className="xps-label">{r.label}</span>
            <span className="xps-value">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="xps-bar-wrap">
        <div className="xps-bar-track">
          <div className="xps-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="xps-bar-pct">{pct}% to {nextXP ? getRank(nextXP) : 'Max'}</span>
      </div>
    </div>
  );
}
