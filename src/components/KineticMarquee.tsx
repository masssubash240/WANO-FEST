import React from "react";

interface KineticMarqueeProps {
  items: string[];
  speed?: number; // seconds for one full pass (default 28)
  direction?: "left" | "right";
  separator?: string;
  color?: string;
  fontSize?: string;
}

/**
 * KineticMarquee — infinite horizontal ticker of text items.
 * Pauses on hover. Uses CSS animation for 60fps performance.
 */
export const KineticMarquee: React.FC<KineticMarqueeProps> = ({
  items,
  speed = 28,
  direction = "left",
  separator = "◆",
  color = "#00ff88",
  fontSize = "0.82rem",
}) => {
  const flat = items.join(`  ${separator}  `);
  const doubled = `${flat}  ${separator}  ${flat}`;

  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        padding: "12px 0",
        background: "rgba(0, 255, 136, 0.04)",
        borderTop: "1px solid rgba(0, 255, 136, 0.15)",
        borderBottom: "1px solid rgba(0, 255, 136, 0.15)",
        position: "relative",
      }}
    >
      {/* Fade edges */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "80px",
        background: "linear-gradient(to right, var(--bg-main, #040508), transparent)",
        zIndex: 2, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: "80px",
        background: "linear-gradient(to left, var(--bg-main, #040508), transparent)",
        zIndex: 2, pointerEvents: "none",
      }} />

      <div
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          animation: `marquee${direction === "right" ? "Reverse" : ""} ${speed}s linear infinite`,
          fontFamily: "var(--font-body)",
          fontSize,
          fontWeight: 700,
          letterSpacing: "0.12em",
          color,
          textTransform: "uppercase",
          textShadow: `0 0 8px ${color}`,
          willChange: "transform",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "running"; }}
      >
        {doubled}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marqueeReverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
