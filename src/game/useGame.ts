import { useCallback, useEffect, useRef, useState } from 'react';
import { createInitialState, update } from './engine';
import type { GameConfig, GameState, InputState, GameAPI } from './types';

export function useGame(config: GameConfig): GameAPI {
  const [state, setState] = useState<GameState>(() => createInitialState(config));
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);
  const input = useRef<InputState>({ pointer: null, pointerDown: false });

  const step = useCallback((ts: number) => {
    if (last.current == null) last.current = ts;
    const dt = Math.min(0.05, (ts - last.current) / 1000);
    last.current = ts;
    setState((s) => update(s, dt, input.current));
    raf.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  const start = useCallback(() => {
    if (raf.current == null) {
      last.current = null;
      raf.current = requestAnimationFrame(step);
    }
  }, [step]);

  const pause = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    last.current = null;
  }, []);

  const reset = useCallback(() => {
    pause();
    setState(createInitialState(config));
  }, [config, pause]);

  const onPointerMove = useCallback((p: { x: number; y: number }) => {
    input.current.pointer = p;
  }, []);
  const onPointerDown = useCallback(() => (input.current.pointerDown = true), []);
  const onPointerUp = useCallback(() => (input.current.pointerDown = false), []);

  return { state, start, pause, reset, onPointerMove, onPointerDown, onPointerUp } as GameAPI;
}
