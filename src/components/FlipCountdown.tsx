import React, { useEffect, useRef, useState } from "react";

interface FlipDigitProps { value: number; label: string; }

const FlipDigit: React.FC<FlipDigitProps> = ({ value, label }) => {
  const [current, setCurrent] = useState(value);
  const [prev, setPrev] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const prevValRef = useRef(value);

  useEffect(() => {
    if (value !== prevValRef.current) {
      setPrev(prevValRef.current);
      setFlipping(true);
      const t = setTimeout(() => {
        setCurrent(value);
        setFlipping(false);
      }, 320);
      prevValRef.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  const fmt = (n: number) => String(n).padStart(2, "0");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <div style={{ position: "relative", width: "64px", height: "76px" }}>
        {/* Back half (bottom) — shows current value */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
          background: "linear-gradient(180deg, #0a1020 0%, #060c18 100%)",
          border: "1px solid rgba(0,255,136,0.2)",
          borderTop: "1px solid rgba(0,0,0,0.5)",
          borderRadius: "0 0 8px 8px",
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          overflow: "hidden",
        }}>
          <span style={{ fontFamily: "var(--font-title)", fontSize: "2.4rem", fontWeight: 900,
            color: "#00ff88", marginTop: "-18px", textShadow: "0 0 12px #00ff88" }}>
            {fmt(current)}
          </span>
        </div>
        {/* Top half */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "50%",
          background: "linear-gradient(180deg, #0c1428 0%, #0a1020 100%)",
          border: "1px solid rgba(0,255,136,0.2)",
          borderBottom: "1px solid rgba(0,0,0,0.5)",
          borderRadius: "8px 8px 0 0",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          overflow: "hidden",
        }}>
          <span style={{ fontFamily: "var(--font-title)", fontSize: "2.4rem", fontWeight: 900,
            color: "#00ff88", marginBottom: "-18px", textShadow: "0 0 12px #00ff88" }}>
            {fmt(current)}
          </span>
        </div>
        {/* Flip animation flap */}
        {flipping && (
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "50%",
            background: "linear-gradient(180deg, #0c1428 0%, #0a1020 100%)",
            border: "1px solid rgba(0,255,136,0.3)",
            borderRadius: "8px 8px 0 0",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            overflow: "hidden",
            transformOrigin: "bottom center",
            animation: "flipDown 0.32s ease-in forwards",
          }}>
            <span style={{ fontFamily: "var(--font-title)", fontSize: "2.4rem", fontWeight: 900,
              color: "#00ff88", marginBottom: "-18px" }}>
              {fmt(prev)}
            </span>
          </div>
        )}
        {/* Center divider line */}
        <div style={{
          position: "absolute", top: "50%", left: 0, right: 0, height: "1px",
          background: "rgba(0,0,0,0.8)", zIndex: 4,
        }} />
        {/* Hinge shine */}
        <div style={{
          position: "absolute", top: "50%", left: "4px", right: "4px", height: "2px",
          background: "rgba(0,255,136,0.15)", zIndex: 5,
          transform: "translateY(-50%)",
        }} />
      </div>
      <span style={{
        fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.2em",
        color: "rgba(0,255,136,0.65)", textTransform: "uppercase",
      }}>
        {label}
      </span>
      <style>{`
        @keyframes flipDown {
          0%   { transform: rotateX(0deg); }
          100% { transform: rotateX(-90deg); }
        }
      `}</style>
    </div>
  );
};

/**
 * FlipCountdown — cinematic flip-card countdown to event date.
 */
export const FlipCountdown: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, targetDate.getTime() - Date.now());
      setTime({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div style={{
      display: "inline-flex",
      gap: "8px",
      alignItems: "center",
      background: "rgba(0,10,20,0.7)",
      border: "1px solid rgba(0,255,136,0.2)",
      borderRadius: "16px",
      padding: "16px 20px",
      backdropFilter: "blur(12px)",
      boxShadow: "0 0 30px rgba(0,255,136,0.08), 0 8px 30px rgba(0,0,0,0.6)",
    }}>
      <FlipDigit value={time.days}    label="Days"  />
      <Colon />
      <FlipDigit value={time.hours}   label="Hours" />
      <Colon />
      <FlipDigit value={time.minutes} label="Mins"  />
      <Colon />
      <FlipDigit value={time.seconds} label="Secs"  />
    </div>
  );
};

const Colon: React.FC = () => (
  <div style={{
    display: "flex", flexDirection: "column", gap: "10px",
    alignItems: "center", marginBottom: "18px",
  }}>
    {[0,1].map(i => (
      <div key={i} style={{
        width: "5px", height: "5px", borderRadius: "50%",
        background: "#00ff88",
        boxShadow: "0 0 6px #00ff88",
        animation: "colonPulse 1s ease-in-out infinite",
        animationDelay: `${i * 0.1}s`,
      }} />
    ))}
    <style>{`
      @keyframes colonPulse {
        0%,100% { opacity: 1; } 50% { opacity: 0.25; }
      }
    `}</style>
  </div>
);
