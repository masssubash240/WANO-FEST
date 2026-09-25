import React, { useEffect, useRef, useState, useCallback } from "react";

const GLITCH_CHARS = "!@#$%^&*<>?|\\[]{}ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

interface GlitchTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  /** Duration of decode effect in ms (default 1200) */
  duration?: number;
  /** Trigger decode on mount (default true) */
  autoPlay?: boolean;
  tag?: "h1" | "h2" | "h3" | "h4" | "span" | "div" | "p";
}

/**
 * GlitchText — text scramble/decode effect that resolves to the real string.
 * Honors prefers-reduced-motion.
 */
export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className,
  style,
  duration = 1200,
  autoPlay = true,
  tag: Tag = "span",
}) => {
  const [displayed, setDisplayed] = useState(text);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const decode = useCallback(() => {
    if (reduced) { setDisplayed(text); return; }

    const start = performance.now();
    startRef.current = start;
    const iterations = Array(text.length).fill(0);

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      const next = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          // Each character unlocks at its proportional time
          const threshold = (i / text.length) * 0.85;
          if (progress > threshold) return char;
          // Scramble cycle
          iterations[i]++;
          return GLITCH_CHARS[iterations[i] % GLITCH_CHARS.length];
        })
        .join("");

      setDisplayed(next);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayed(text);
      }
    };

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(step);
  }, [text, duration, reduced]);

  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(decode, 200);
      return () => {
        clearTimeout(t);
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
      };
    }
  }, [autoPlay, decode]);

  return (
    <Tag
      className={className}
      style={{ fontVariantNumeric: "tabular-nums", ...style }}
      onMouseEnter={decode}
    >
      {displayed}
    </Tag>
  );
};
