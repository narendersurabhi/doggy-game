import React from 'react';

export default function Dog({ onTug = () => {}, isTugging = false, power = 1, label = 'Dog' }) {
  const handle = () => onTug('dog', Math.max(0.1, power));
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
        @keyframes tailWag { 0% { transform: rotate(0deg);} 50% { transform: rotate(18deg);} 100% { transform: rotate(0deg);} }
        .dog-face { transition: transform .12s linear; }
        .dog-tug { transform: translateX(-6px) scale(0.99); }
        .tail { transform-origin: 6px 10px; animation: tailWag .45s infinite linear; }
      `}</style>

      <svg
        className={isTugging ? 'dog-face dog-tug' : 'dog-face'}
        width="120"
        height="100"
        viewBox="0 0 120 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gDog" x1="0" x2="1">
            <stop offset="0" stopColor="#F6D365" />
            <stop offset="1" stopColor="#FDA085" />
          </linearGradient>
        </defs>
        {/* body */}
        <ellipse cx="60" cy="62" rx="42" ry="28" fill="url(#gDog)" />
        {/* head */}
        <circle cx="36" cy="36" r="22" fill="#fff7e6" stroke="#d89" strokeWidth="2" />
        {/* ear left */}
        <path d="M22 24 q-6 10 6 18" fill="#d89" />
        {/* ear right */}
        <path d="M46 22 q8 12 -2 18" fill="#d89" />
        {/* eyes */}
        <circle cx="30" cy="36" r="3" fill="#222" />
        <circle cx="42" cy="36" r="3" fill="#222" />
        {/* nose */}
        <ellipse cx="36" cy="44" rx="4" ry="3" fill="#6b3" />
        {/* tail */}
        <rect className="tail" x="96" y="48" width="12" height="6" rx="3" fill="#d89" />
        {/* blush */}
        <circle cx="24" cy="44" r="3" fill="#ffc1c1" opacity="0.9" />
      </svg>
      <div style={{ fontSize: 14, color: '#333', fontWeight: 600 }}>Dog</div>
      <div style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>Click to tug playfully</div>
    </div>
  );
}
