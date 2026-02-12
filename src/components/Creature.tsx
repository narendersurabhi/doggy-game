import React from 'react';
import type { Vec } from '../game/engine';

export default function Creature(props: {
  id: string;
  kind: 'dog' | 'rabbit';
  pos: Vec;
  radius: number;
  color?: string;
  state?: any;
}) {
  const { kind, pos, radius, color = '#ddd', state } = props;
  const size = radius * 2;
  const transform = `translate(${pos.x - radius}px, ${pos.y - radius}px)`;

  const base: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    transform,
    transition: 'transform 0.06s linear',
    pointerEvents: 'none',
  };

  const faceStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: color,
    boxShadow: '0 6px 14px rgba(0,0,0,0.12), inset 0 -8px 12px rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const tail = kind === 'dog' ? (
    <div style={{
      position: 'absolute',
      right: -radius * 0.4,
      top: '40%',
      width: radius * 0.8,
      height: radius * 0.4,
      borderRadius: 20,
      background: color,
      transformOrigin: 'left center',
      transform: `rotate(${Math.sin((state?.tail || 0)) * 30}deg)`,
      boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
    }} />
  ) : (
    <div style={{
      position: 'absolute',
      left: -radius * 0.25,
      bottom: -radius * 0.25,
      width: radius * 0.9,
      height: radius * 0.6,
      borderRadius: 10,
      background: '#fff',
      opacity: 0.9
    }} />
  );

  const ears = kind === 'dog' ? (
    <> 
      <div style={{ position: 'absolute', left: 6, top: -radius * 0.35, width: radius * 0.6, height: radius * 0.6, borderRadius: '40%', background: '#d9966b', transform: 'rotate(-15deg)' }} />
      <div style={{ position: 'absolute', right: 6, top: -radius * 0.35, width: radius * 0.6, height: radius * 0.6, borderRadius: '40%', background: '#d9966b', transform: 'rotate(15deg)' }} />
    </>
  ) : (
    <>
      <div style={{ position: 'absolute', left: radius * 0.15, top: -radius * 0.8, width: radius * 0.4, height: radius * 1.0, borderRadius: 20, background: '#b4c6ff' }} />
      <div style={{ position: 'absolute', right: radius * 0.15, top: -radius * 0.8, width: radius * 0.4, height: radius * 1.0, borderRadius: 20, background: '#b4c6ff' }} />
    </>
  );

  const eyes = (
    <>
      <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: 3, background: '#111', left: '35%', top: '44%' }} />
      <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: 3, background: '#111', right: '35%', top: '44%' }} />
    </>
  );

  const mouth = kind === 'dog' ? (
    <div style={{ position: 'absolute', bottom: '18%', width: '36%', height: 6, borderRadius: 6, background: '#7a4d32' }} />
  ) : (
    <div style={{ position: 'absolute', bottom: '16%', width: '26%', height: 6, borderRadius: 6, background: '#6f88be' }} />
  );

  const tagBubble = state?.taggedAt && (Date.now() / 1000 - state.taggedAt) < 0.9 ? (
    <div style={{ position: 'absolute', top: -radius * 0.9, left: '50%', transform: 'translateX(-50%)', padding: '6px 10px', background: 'rgba(255,255,255,0.95)', borderRadius: 12, fontSize: 12, boxShadow: '0 6px 14px rgba(0,0,0,0.08)' }}>Tag!</div>
  ) : null;

  return (
    <div style={base} aria-hidden>
      <div style={faceStyle}>
        {ears}
        {eyes}
        {mouth}
        {tail}
        {tagBubble}
      </div>
    </div>
  );
}
