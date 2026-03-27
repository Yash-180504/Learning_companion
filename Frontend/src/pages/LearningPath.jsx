import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap,
  useNodesState, useEdgesState, addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useApp } from '../context/AppContext';
import TopicNode from '../components/TopicNode';
import XPChart   from '../components/XPChart';
import XPSidebar from '../components/XPSidebar';
import '../styles/LearningPath.css';

const xpData = { totalXP: 1340, streak: 7 };

const RAW_NODES = [
  { id: '1', pos: { x: 220, y: 10  }, label: 'Kinematics',       mastery: 'mastered', masteryPct: 92, xp: 200, isActive: false, isNext: false },
  { id: '2', pos: { x: 40,  y: 140 }, label: 'Velocity',          mastery: 'mastered', masteryPct: 88, xp: 180, isActive: false, isNext: false },
  { id: '3', pos: { x: 400, y: 140 }, label: 'Displacement',      mastery: 'moderate', masteryPct: 62, xp: 120, isActive: false, isNext: false },
  { id: '4', pos: { x: 40,  y: 280 }, label: 'Acceleration',      mastery: 'moderate', masteryPct: 55, xp: 100, isActive: true,  isNext: false },
  { id: '5', pos: { x: 400, y: 280 }, label: 'Projectile Motion', mastery: 'weak',     masteryPct: 28, xp: 40,  isActive: false, isNext: true  },
  { id: '6', pos: { x: 220, y: 410 }, label: "Newton's Laws",     mastery: 'weak',     masteryPct: 22, xp: 60,  isActive: false, isNext: false },
  { id: '7', pos: { x: 40,  y: 540 }, label: 'Friction',          mastery: 'weak',     masteryPct: 10, xp: 0,   isActive: false, isNext: false },
  { id: '8', pos: { x: 400, y: 540 }, label: 'Circular Motion',   mastery: 'weak',     masteryPct: 8,  xp: 0,   isActive: false, isNext: false },
];

const buildNodes = () => RAW_NODES.map(({ id, pos, ...data }) => ({
  id, type: 'topicNode', position: pos, data,
}));

const edgeStyle   = { stroke: '#cbd5e1', strokeWidth: 1.8 };
const activeStyle = { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 3' };

const buildEdges = () => [
  { id: 'e1-2', source: '1', target: '2', style: edgeStyle,   animated: false },
  { id: 'e1-3', source: '1', target: '3', style: edgeStyle,   animated: false },
  { id: 'e2-4', source: '2', target: '4', style: activeStyle, animated: true  },
  { id: 'e3-5', source: '3', target: '5', style: edgeStyle,   animated: false },
  { id: 'e4-6', source: '4', target: '6', style: edgeStyle,   animated: false },
  { id: 'e5-6', source: '5', target: '6', style: edgeStyle,   animated: false },
  { id: 'e6-7', source: '6', target: '7', style: edgeStyle,   animated: false },
  { id: 'e6-8', source: '6', target: '8', style: edgeStyle,   animated: false },
];

const nodeTypes = { topicNode: TopicNode };

const minimapColor = (node) => {
  const m = node.data?.mastery;
  if (m === 'mastered') return '#34d399';
  if (m === 'moderate') return '#fbbf24';
  return '#f87171';
};

const legend = [
  { color: '#f87171', label: 'Weak  (<40%)' },
  { color: '#fbbf24', label: 'Moderate (40–70%)' },
  { color: '#34d399', label: 'Mastered (>70%)' },
  { color: '#818cf8', label: 'Active topic' },
];

export default function LearningPath() {
  const { theme } = useApp();
  const [nodes, , onNodesChange]        = useNodesState(buildNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdges());
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const onConnect = useCallback(
    (params) => setEdges(eds => addEdge({ ...params, style: edgeStyle }, eds)),
    [setEdges],
  );

  const weakTopics = nodes.filter(n => n.data.mastery === 'weak');

  return (
    <div className="lp-wrapper">

      {/* Header */}
      <div className="lp-header">
        <div>
          <h1>Learning Path</h1>
          <p>Topic dependency graph · Mastery levels · XP analytics</p>
        </div>
      </div>

      {/* Weak topics alert */}
      {weakTopics.length > 0 && (
        <div className="lp-alert">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>
            <strong>{weakTopics.length} weak topic{weakTopics.length > 1 ? 's' : ''}</strong> detected —{' '}
            {weakTopics.map(n => n.data.label).join(', ')}. Focus on these to unlock advanced topics.
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="lp-legend">
        {legend.map(({ color, label }) => (
          <div key={label} className="lp-legend-item">
            <span className="lp-legend-dot" style={{ background: color }} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div className="lp-body">

        {/* Graph */}
        <div className="lp-graph">
          {loading ? (
            <div className="lp-skeleton">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="lp-skeleton-node" />
              ))}
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              proOptions={{ hideAttribution: true }}
              colorMode={theme === 'dark' ? 'dark' : 'light'}
            >
              <Background color={theme === 'dark' ? '#334155' : '#e2e8f0'} gap={22} size={1} />
              <Controls showInteractive={false} />
              <MiniMap
                nodeColor={minimapColor}
                maskColor={theme === 'dark' ? 'rgba(15,23,42,0.7)' : 'rgba(248,250,252,0.7)'}
              />
            </ReactFlow>
          )}
        </div>

        {/* Right panel */}
        <div className="lp-side">
          <p className="lp-side-label">XP Progress</p>
          <XPChart loading={loading} />
          <p className="lp-side-label" style={{ marginTop: 16 }}>Rank Overview</p>
          <XPSidebar xpData={xpData} />
        </div>

      </div>
    </div>
  );
}
