import { Handle, Position } from '@xyflow/react';

const masteryConfig = {
  mastered: { color: '#059669', bg: '#f0fdf4', border: '#a7f3d0', label: 'Mastered' },
  moderate: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Moderate' },
  weak:     { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Weak'     },
};

export default function TopicNode({ data }) {
  const cfg     = masteryConfig[data.mastery] || masteryConfig.weak;
  const radius  = 20;
  const circ    = 2 * Math.PI * radius;
  const dash    = (data.masteryPct / 100) * circ;

  return (
    <div style={{
      background: data.isActive ? '#eef2ff' : cfg.bg,
      border: `2px solid ${data.isActive ? '#4f46e5' : cfg.border}`,
      borderRadius: 14,
      padding: '12px 14px',
      minWidth: 160,
      boxShadow: data.isActive ? '0 0 0 3px rgba(79,70,229,0.2)' : '0 1px 4px rgba(0,0,0,0.06)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      position: 'relative',
    }}>
      <Handle type="target" position={Position.Top}    style={{ background: cfg.color, width: 8, height: 8 }} />
      <Handle type="source" position={Position.Bottom} style={{ background: cfg.color, width: 8, height: 8 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Mastery ring */}
        <svg width={48} height={48} style={{ flexShrink: 0 }}>
          <circle cx={24} cy={24} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={3} />
          <circle cx={24} cy={24} r={radius} fill="none" stroke={cfg.color} strokeWidth={3}
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            transform="rotate(-90 24 24)" />
          <text x={24} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={cfg.color}>
            {data.masteryPct}%
          </text>
        </svg>

        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
            {data.label}
          </p>
          <p style={{ margin: '3px 0 0', fontSize: 11, color: cfg.color, fontWeight: 600 }}>
            {data.isActive ? 'Active' : data.isNext ? 'Up Next' : cfg.label}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b' }}>
            {data.xp} XP earned
          </p>
        </div>
      </div>
    </div>
  );
}
