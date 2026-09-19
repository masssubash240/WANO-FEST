import React, { useEffect, useState } from "react";

/**
 * ScrollProgressBar — thin neon green bar at top tracking page scroll progress.
 */
export const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? scrolled / total : 0);
    };

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 99999,
        background: "rgba(0,0,0,0.2)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: "linear-gradient(90deg, #00ff88, #00e5ff, #00ff88)",
          backgroundSize: "200% 100%",
          animation: "progressShimmer 2s linear infinite",
          boxShadow: "0 0 10px #00ff88, 0 0 20px #00e5ff",
          transition: "width 0.1s linear",
        }}
      />
      <style>{`
        @keyframes progressShimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
      `}</style>
    </div>
  );
};
