import React from 'react';
import Creature from './Creature';
import type { GameState } from '../game/engine';

export default function Playfield(props: { state: GameState; onPointer?: (p: { x: number; y: number } | null) => void }) {
  const { state, onPointer } = props;
  const style: React.CSSProperties = {
    width: state.w,
    height: state.h,
    background: 'linear-gradient(180deg,#eaffea 0%,#bfecc8 100%)',
    borderRadius: 14,
    boxShadow: '0 8px 30px rgba(20,40,0,0.12)',
    position: 'relative',
    overflow: 'hidden',
    margin: '12px auto',
  };

  return (
    <div
      style={style}
      onMouseDown={(e) => onPointer && onPointer({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })}
      onMouseUp={() => onPointer && onPointer(null)}
      onMouseLeave={() => onPointer && onPointer(null)}
      onTouchStart={(e) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const t = e.touches[0];
        onPointer && onPointer({ x: t.clientX - rect.left, y: t.clientY - rect.top });
      }}
      onTouchMove={(e) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const t = e.touches[0];
        onPointer && onPointer({ x: t.clientX - rect.left, y: t.clientY - rect.top });
      }}
      onTouchEnd={() => onPointer && onPointer(null)}
    >
      {/* decorative sun */}
      <div style={{ position: 'absolute', left: 18, top: 18, width: 64, height: 64, borderRadius: 32, background: 'radial-gradient(circle at 30% 30%, #fff9c4, #ffd54f)', boxShadow: '0 6px 20px rgba(255,170,0,0.08)' }} />

      {state.entities.map((e) => (
        <Creature key={e.id} id={e.id} kind={e.kind} pos={e.pos} radius={e.radius} color={e.color} state={e.state} />
      ))}

      {/* subtle grass */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 80, background: 'linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0))' }} />

    </div>
  );
}
