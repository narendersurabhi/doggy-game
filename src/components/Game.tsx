import React, { useEffect, useRef, useState } from "react";
import HUD from "./HUD";
import Controls from "./Controls";

const WIDTH = 800;
const HEIGHT = 320;
const DOG_X = -260;
const RABBIT_X = 260;
const WIN_THRESHOLD = 220;

export default function Game() {
  const [toyX, setToyX] = useState(0); // 0 = center, negative toward dog
  const toyV = useRef(0);
  const pullInput = useRef(0); // momentary user input force
  const [fun, setFun] = useState(50);
  const [time, setTime] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const raf = useRef<number | null>(null);
  const running = useRef(true);
  const last = useRef<number | null>(null);
  const score = useRef(0);

  useEffect(() => {
    function step(ts: number) {
      if (!last.current) last.current = ts;
      const dt = Math.min(40, ts - last.current);
      last.current = ts;
      if (running.current) {
        // user pull -> left (negative)
        const userForce = -pullInput.current; // negative pulls left
        // rabbit AI: resists based on position and gentle randomness
        const aiBias = 0.12 + Math.abs(toyX) / 800; // stronger when toy drifts
        const aiSine = Math.sin(ts / 300) * 0.6;
        const rabbitForce = (0.08 + aiBias) * (1 + aiSine); // positive pulls right

        // net force
        const force = userForce + rabbitForce;
        // integrate toy velocity
        toyV.current += force * (dt / 16);
        // friction
        toyV.current *= 0.94;
        let next = toyX + toyV.current * (dt / 16);
        // clamp
        next = Math.max(-340, Math.min(340, next));
        setToyX(next);

        // fun meter dynamics
        setFun((f) => Math.max(0, Math.min(100, f + (Math.abs(userForce) * 0.4 - 0.02) * (dt / 16))));
        setTime((t) => t + dt / 1000);

        // check win/lose
        if (next <= -WIN_THRESHOLD) {
          running.current = false;
          setMessage("Dog wins! Playful tug victory 🐶🎉");
          score.current += 1;
        } else if (next >= WIN_THRESHOLD) {
          running.current = false;
          setMessage("Rabbit keeps the toy! Friendly rematch? 🐰");
        }
      }
      raf.current = requestAnimationFrame(step);
    }
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [toyX]);

  useEffect(() => {
    // reset pull input each frame (taps). Continuous hold is handled in Controls.
    const id = setInterval(() => (pullInput.current = 0), 80);
    return () => clearInterval(id);
  }, []);

  function handlePull(strength: number) {
    // strength positive means user wants to pull toward dog
    pullInput.current = Math.max(pullInput.current, Math.min(6, strength));
    // small visual jolt
    toyV.current -= strength * 0.5;
    setFun((f) => Math.max(0, Math.min(100, f + 0.8)));
  }

  function handleHoldChange(holding: boolean) {
    // make holding apply a continuous small pull
    pullInput.current = holding ? 1.2 : 0;
  }

  function reset() {
    setToyX(0);
    toyV.current = 0;
    setMessage(null);
    running.current = true;
    last.current = null;
    setFun(50);
    setTime(0);
  }

  const center = WIDTH / 2;
  return (
    <div style={{ fontFamily: "Inter, system-ui, Arial", padding: 18, display: "flex", gap: 18, justifyContent: "center" }}>
      <div style={{ width: WIDTH, background: "linear-gradient(#eaf6ff,#fff)", borderRadius: 14, padding: 12, boxShadow: "0 6px 30px rgba(20,40,80,0.08)" }}>
        <HUD score={score.current} fun={Math.round(fun)} time={Math.floor(time)} message={message} onReset={reset} />

        <div style={{ position: "relative", height: HEIGHT, overflow: "hidden", borderRadius: 10, background: "linear-gradient(180deg,#dff1ff,#ffffff)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* ground */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 70, background: "linear-gradient(#bfe7b8,#e8f6de)", borderTopLeftRadius: 80, borderTopRightRadius: 80 }} />

          {/* dog */}
          <Character x={center + DOG_X} y={HEIGHT / 2 + 10} emoji="🐶" label="Dog" bounce={Math.max(0, -toyX)} />
          {/* rabbit */}
          <Character x={center + RABBIT_X} y={HEIGHT / 2 + 6} emoji="🐰" label="Rabbit" bounce={Math.max(0, toyX)} />

          {/* toy rope and toy */}
          <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
            <defs>
              <linearGradient id="ropeGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="#e8c07a" />
                <stop offset="100%" stopColor="#d99f5f" />
              </linearGradient>
            </defs>
            <line x1={center + DOG_X + 34} y1={HEIGHT / 2 + 8} x2={center + toyX - 28} y2={HEIGHT / 2 - 6} stroke="url(#ropeGrad)" strokeWidth={8} strokeLinecap="round" opacity={0.95} />
            <line x1={center + RABBIT_X - 34} y1={HEIGHT / 2 + 8} x2={center + toyX + 28} y2={HEIGHT / 2 - 6} stroke="url(#ropeGrad)" strokeWidth={8} strokeLinecap="round" opacity={0.95} />
            <g transform={`translate(${center + toyX},${HEIGHT / 2 - 6})`}>
              <circle r={22} fill="#ff7b9c" stroke="#ff4b6b" strokeWidth={3} />
              <text x={0} y={7} textAnchor="middle" fontSize={20} style={{ fontFamily: "sans-serif" }}>🧸</text>
            </g>
          </svg>

          {/* small status bubble */}
          {message ? (
            <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.95)", padding: "8px 12px", borderRadius: 10, boxShadow: "0 6px 20px rgba(20,40,80,0.06)", fontSize: 14 }}>
              {message}
            </div>
          ) : null}
        </div>

        <div style={{ marginTop: 12 }}>
          <Controls onPull={handlePull} onHoldChange={handleHoldChange} onReset={reset} running={!message} />
        </div>
      </div>
    </div>
  );
}

function Character({ x, y, emoji, label, bounce }: { x: number; y: number; emoji: string; label: string; bounce: number }) {
  return (
    <div style={{ position: "absolute", left: x - 34, top: y - 40, width: 68, textAlign: "center", transform: `translateY(${-Math.min(8, bounce)}px)`, transition: "transform 80ms linear" }}>
      <div style={{ width: 68, height: 68, borderRadius: 18, background: "linear-gradient(#fff,#f6f6f8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(20,40,80,0.06)", fontSize: 34 }}>
        <span role="img" aria-label={label}>{emoji}</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "#4b5563" }}>{label}</div>
    </div>
  );
}
