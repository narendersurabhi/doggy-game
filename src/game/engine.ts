import { GameState, GameConfig, InputState, Vec } from './types';

function normalize(v: Vec): Vec {
  const l = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / l, y: v.y / l };
}
function clampPos(e: { pos: Vec; size: number }, w: number, h: number) {
  e.pos.x = Math.max(e.size / 2, Math.min(w - e.size / 2, e.pos.x));
  e.pos.y = Math.max(e.size / 2, Math.min(h - e.size / 2, e.pos.y));
}
function distance(a: Vec, b: Vec) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function createInitialState(config: GameConfig): GameState {
  const { width, height } = config;
  const dog = {
    id: 'dog',
    pos: { x: width / 2, y: height / 2 },
    vel: { x: 0, y: 0 },
    speed: 160,
    size: 36,
  };
  const rabbit = {
    id: 'rabbit',
    pos: { x: width * 0.2 + 20, y: height * 0.3 + 10 },
    vel: { x: 0, y: 0 },
    speed: 120,
    size: 22,
    caught: false,
    playTimer: 0,
  };
  return { time: 0, width, height, dog, rabbit, running: false, config };
}

export function update(state: GameState, dt: number, input: InputState): GameState {
  const s: GameState = { ...state, time: state.time + dt } as any;
  const dog = { ...state.dog };
  const rabbit = { ...state.rabbit };

  // Dog: move toward pointer while pressed, otherwise gently follow rabbit
  let target: Vec | null = input.pointer && input.pointerDown ? input.pointer : rabbit.pos;
  const dir = normalize({ x: target.x - dog.pos.x, y: target.y - dog.pos.y });
  const damp = Math.min(1, 8 * dt);
  dog.vel.x += (dir.x * dog.speed - dog.vel.x) * damp;
  dog.vel.y += (dir.y * dog.speed - dog.vel.y) * damp;
  dog.pos.x += dog.vel.x * dt;
  dog.pos.y += dog.vel.y * dt;
  clampPos(dog, s.width, s.height);

  // Rabbit: if not caught, flee from dog with small wander
  if (!rabbit.caught) {
    const away = normalize({ x: rabbit.pos.x - dog.pos.x, y: rabbit.pos.y - dog.pos.y });
    const wander = { x: Math.sin(s.time * 3) * 30, y: Math.cos(s.time * 2) * 30 };
    const desired = { x: away.x * rabbit.speed + wander.x, y: away.y * rabbit.speed + wander.y };
    rabbit.vel.x += (desired.x - rabbit.vel.x) * Math.min(1, 4 * dt);
    rabbit.vel.y += (desired.y - rabbit.vel.y) * Math.min(1, 4 * dt);
    rabbit.pos.x += rabbit.vel.x * dt;
    rabbit.pos.y += rabbit.vel.y * dt;
    clampPos(rabbit, s.width, s.height);
  } else {
    // When caught: cozy animation near dog; after a short time release and respawn
    rabbit.playTimer += dt;
    rabbit.pos.x = dog.pos.x - 8 + Math.sin(s.time * 20) * 2;
    rabbit.pos.y = dog.pos.y + 6 + Math.cos(s.time * 18) * 2;
    rabbit.vel = { x: 0, y: 0 };
    if (rabbit.playTimer > 2.0) {
      rabbit.caught = false;
      rabbit.playTimer = 0;
      rabbit.pos = { x: Math.random() * (s.width - 40) + 20, y: Math.random() * (s.height - 40) + 20 };
    }
  }

  // Catch detection (friendly cuddle)
  const dist = distance(dog.pos, rabbit.pos);
  if (!rabbit.caught && dist < (dog.size + rabbit.size) * 0.6) {
    rabbit.caught = true;
    rabbit.playTimer = 0;
  }

  s.dog = dog;
  s.rabbit = rabbit;
  return s;
}
