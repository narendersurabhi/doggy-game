import React from 'react';

export default function Toy({ tension = 0, wear = 0, onTug = () => {}, size = 120, label = 'Plush Toy' }) {
  const pct = Math.max(0, Math.min(1, wear));
  const color = pct > 0.7 ? '#d9534f' : pct > 0.4 ? '#f0ad4e' : '#5cb85c';
  const handle = () => onTug();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <style>{`
        .toy { cursor: pointer; user-select: none; }
        .squeak { transition: transform .08s ease; }
        .squeak.active { transform: scale(1.02) translateY(-4px); }
        .fluff { opacity: .9; animation: drift 2.6s ease-in-out infinite; }
        @keyframes drift { 0% { transform: translateY(0);} 50% { transform: translateY(-3px);} 100% { transform: translateY(0);} }
      `}</style>

      <svg
        className={`toy ${tension > 0.1 ? 'squeak active' : 'squeak'}`}
        width={size}
        height={(size * 0.65).toString()}
        viewBox="0 0 120 78"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={label}
        onClick={handle}
      >
        <defs>
          <linearGradient id="toyG" x1="0" x2="1">
            <stop offset="0" stopColor="#ffe082" />
            <stop offset="1" stopColor="#ffd54f" />
          </linearGradient>
        </defs>
        {/* plush body */}
        <ellipse cx="60" cy="40" rx="40" ry="24" fill="url(#toyG)" stroke="#caa" strokeWidth="2" />
        {/* stitching */}
        <path d="M28 40 q8 -6 24 -6 q16 0 32 6" fill="none" stroke="#f7b" strokeWidth="1.2" strokeDasharray="3 4" />
        {/* tag */}
        <rect x="18" y="30" width="8" height="12" rx="2" fill="#fff" opacity="0.9" />
        {/* fluff particles (represent non-graphic wear) */}
        {Array.from({ length: Math.round(6 * (1 - pct)) }).map((_, i) => (
          <circle key={i} className="fluff" cx={20 + i * 12} cy={14 + (i % 3)} r={2 + (i % 2)} fill="#fff3" />
        ))}
        {/* rope ends to indicate tug direction (visual only) */}
        <line x1="12" y1="40" x2="-6" y2={40 - tension * 18} stroke="#8b5" strokeWidth={4 + tension * 3} strokeLinecap="round" opacity="0.95" />
        <line x1="108" y1="40" x2="126" y2={40 + tension * 18} stroke="#8b5" strokeWidth={4 + tension * 3} strokeLinecap="round" opacity="0.95" />
      </svg>

      <div style={{ width: size, display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ flex: 1, height: 8, background: '#eee', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${Math.round(pct * 100)}%`, height: '100%', background: color }} />
        </div>
        <div style={{ fontSize: 12, color: '#444', minWidth: 44, textAlign: 'right' }}>{Math.round((1 - pct) * 100)}% plush</div>
      </div>
      <div style={{ fontSize: 12, color: '#666' }}>Click toy to tug — playful tug-of-war, no hurt</div>
    </div>
  );
}
