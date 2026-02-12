import React from "react";

export default function HUD({ score, fun, time, message, onReset }: { score: number; fun: number; time: number; message: string | null; onReset: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Playful Tug</div>
        <div style={{ background: "#fff", padding: "6px 10px", borderRadius: 8, boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.03)", fontSize: 13 }}>Score: {score}</div>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Meter label="Fun" value={fun} color="#ffb86b" />
        <div style={{ fontSize: 13, color: "#334155" }}>⏱ {time}s</div>
        <div>
          <button onClick={onReset} style={{ background: "#38bdf8", color: "white", border: 0, padding: "8px 12px", borderRadius: 10, cursor: "pointer" }}>Reset</button>
        </div>
      </div>
    </div>
  );
}

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <div style={{ fontSize: 12, color: "#475569" }}>{label}</div>
      <div style={{ width: 120, height: 10, background: "#eef2f7", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, transition: "width 140ms linear" }} />
      </div>
    </div>
  );
}
