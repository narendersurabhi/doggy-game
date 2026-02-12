import React, { useEffect, useState } from "react";

export default function Controls({ onPull, onHoldChange, onReset, running }: { onPull: (s: number) => void; onHoldChange: (h: boolean) => void; onReset: () => void; running: boolean }) {
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        onPull(3.6);
      }
      if (e.key === "ArrowLeft") onPull(2.6);
      if (e.key === "ArrowRight") onPull(0.6);
      if (e.key === "r") onReset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPull, onReset]);

  useEffect(() => onHoldChange(holding), [holding, onHoldChange]);

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onPull(3.2)} style={btnStyle}>Pull</button>
        <button onClick={() => onPull(1.6)} style={btnStyle}>Tug</button>
        <button onMouseDown={() => setHolding(true)} onMouseUp={() => setHolding(false)} onMouseLeave={() => setHolding(false)} style={{ ...btnStyle, background: holding ? "#fb7185" : "#ffb4c6" }}>{holding ? "Holding…" : "Hold Pull"}</button>
      </div>

      <div style={{ color: "#475569", fontSize: 13 }}>Tips: Space / ← to pull, Hold for steady pull, R to reset</div>
    </div>
  );
}

const btnStyle: React.CSSProperties = { background: "#7dd3fc", border: 0, padding: "10px 14px", borderRadius: 10, cursor: "pointer", color: "#003049", fontWeight: 600 };
