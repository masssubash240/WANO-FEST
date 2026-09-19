import React, { useEffect, useRef } from "react";

/**
 * MatrixRain — full-screen canvas matrix character rain.
 * Renders katakana + ASCII. Honors prefers-reduced-motion.
 */
export const MatrixRain: React.FC<{ opacity?: number }> = ({ opacity = 0.18 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]|\\/*+-=";
    const FONT_SIZE = 14;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let cols = Math.floor(width / FONT_SIZE);
    const drops: number[] = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(2, 4, 10, 0.055)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${FONT_SIZE}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Leading char: bright neon green
        const isHead = drops[i] * FONT_SIZE === Math.floor(drops[i]) * FONT_SIZE;
        ctx.fillStyle = isHead ? "#afffcf" : `rgba(0, 255, 120, ${0.35 + Math.random() * 0.35})`;
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);

        if (drops[i] * FONT_SIZE > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.45;
      }
    };

    const interval = setInterval(draw, 50);

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      cols = Math.floor(width / FONT_SIZE);
      drops.length = 0;
      for (let i = 0; i < cols; i++) drops.push(1);
    };

    window.addEventListener("resize", onResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity,
        mixBlendMode: "screen",
      }}
    />
  );
};
