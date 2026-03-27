import { useEffect, useState } from 'react';
import '../styles/XPComponents.css';

export default function XPChart({ loading }) {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const user    = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const history = JSON.parse(localStorage.getItem('xpHistory') || '[]');
    const mine    = history.filter(h => h.email === user.email).slice(-12);
    setPoints(mine);
  }, []);

  if (loading) {
    return (
      <div className="xpc-card xpc-skeleton">
        <div className="xpc-skeleton-bar" style={{ width: '60%', height: 14, marginBottom: 8 }} />
        <div className="xpc-skeleton-bar" style={{ width: '100%', height: 80 }} />
      </div>
    );
  }

  const W = 220, H = 90, PAD = 10;
  const values = points.map(p => p.xp);
  const hasData = values.length > 1;
  const min   = hasData ? Math.min(...values) : 0;
  const max   = hasData ? Math.max(...values) : 100;
  const range = max - min || 1;

  const toX = i => PAD + (i / (values.length - 1)) * (W - PAD * 2);
  const toY = v => H - PAD - ((v - min) / range) * (H - PAD * 2);

  const polyline = values.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  const area     = hasData
    ? `${polyline} ${toX(values.length - 1)},${H - PAD} ${toX(0)},${H - PAD}`
    : '';

  return (
    <div className="xpc-card">
      <p className="xpc-title">XP Progress</p>
      {hasData ? (
        <svg viewBox={`0 0 ${W} ${H}`} className="xpc-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="xpcGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#4f46e5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0"    />
            </linearGradient>
          </defs>
          <polygon points={area}    fill="url(#xpcGrad)" />
          <polyline points={polyline} fill="none" stroke="#4f46e5" strokeWidth="2"
            strokeLinejoin="round" strokeLinecap="round" />
          {values.map((v, i) => (
            <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill="#4f46e5" />
          ))}
        </svg>
      ) : (
        <p className="xpc-empty">Complete quizzes to see your XP trend.</p>
      )}
      <div className="xpc-footer">
        <span>Total XP: <strong>{points.length ? points[points.length - 1].xp : 0}</strong></span>
      </div>
    </div>
  );
}
