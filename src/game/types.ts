export type Vec = { x: number; y: number };

export type Entity = {
  id: string;
  pos: Vec;
  vel: Vec;
  size: number;
};

export type Dog = Entity & { speed: number };
export type Rabbit = Entity & { speed: number; caught: boolean; playTimer: number };

export type GameConfig = { width: number; height: number };

export type GameState = {
  time: number;
  width: number;
  height: number;
  dog: Dog;
  rabbit: Rabbit;
  running: boolean;
  config: GameConfig;
};

export type InputState = { pointer: Vec | null; pointerDown: boolean };

export type GameAPI = {
  state: GameState;
  start: () => void;
  pause: () => void;
  reset: () => void;
  onPointerMove: (p: Vec) => void;
  onPointerDown: () => void;
  onPointerUp: () => void;
};