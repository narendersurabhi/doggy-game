import React from 'react';

export default function Rabbit({ onTug = () => {}, isTugging = false, agility = 1, label = 'Rabbit' }) {
  const handle = () => onTug('rabbit', Math.max(0.1, agility));
  return (
    <div
      role="button"
      aria-label={label}
      tabIndex={0}
      onClick={handle}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handle()}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        userSelect: 'none',
        cursor: 'pointer',
        width: 160,
      }}
    >
      <style>{`
        .hop { transition: transform .12s ease; }
        .hop.active { transform: translateY(-8px) scale(0.98); }
        @keyframes earWiggle { 0% { transform: rotate(0);} 50% { transform: rotate(6deg);} 100% { transform: rotate(0);} }
        .ear { transform-origin: 10px 8px; animation: earWiggle .9s infinite linear; }
      `}</style>

      <svg
        className={isTugging ? 'hop active' : 'hop'}
        width="120"
        height="100"
        viewBox="0 0 120 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gRab" x1="0" x2="1">
            <stop offset="0" stopColor="#E0F7FA" />
            <stop offset="1" stopColor="#B2EBF2" />
          </linearGradient>
        </defs>
        {/* body */}
        <ellipse cx="62" cy="66" rx="34" ry="22" fill="url(#gRab)" />
        {/* head */}
        <circle cx="36" cy="38" r="18" fill="#fff" stroke="#aac" strokeWidth="1.5" />
        {/* ears */}
        <rect className="ear" x="26" y="6" width="8" height="28" rx="6" fill="#fff8f8" transform="rotate(-6 30 20)" />
        <rect className="ear" x="40" y="4" width="8" height="30" rx="6" fill="#fff8f8" transform="rotate(6 44 20)" />
        {/* eyes & nose */}
        <circle cx="30" cy="38" r="2" fill="#222" />
        <circle cx="42" cy="38" r="2" fill="#222" />
        <ellipse cx="36" cy="46" rx="3" ry="2" fill="#f07" />
        {/* feet */}
        <ellipse cx="48" cy="84" rx="8" ry="4" fill="#cfe" opacity="0.9" />
      </svg>

      <div style={{ fontSize: 14, color: '#333', fontWeight: 600 }}>Rabbit</div>
      <div style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>Click to tug or hop away</div>
    </div>
  );
}
