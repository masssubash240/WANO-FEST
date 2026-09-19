import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade";
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ScrollReveal — wraps children and animates them in when they enter the viewport.
 * Uses IntersectionObserver. Honors prefers-reduced-motion.
 * Pure CSS transitions — no GSAP dep needed here, keeping it lightweight.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = "up",
  threshold = 0.15,
  className,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  useEffect(() => {
    if (reduced) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, reduced]);

  const hiddenStyle: React.CSSProperties = (() => {
    if (visible || reduced) return {};
    switch (direction) {
      case "up":    return { opacity: 0, transform: "translateY(48px)" };
      case "down":  return { opacity: 0, transform: "translateY(-48px)" };
      case "left":  return { opacity: 0, transform: "translateX(-60px)" };
      case "right": return { opacity: 0, transform: "translateX(60px)" };
      case "scale": return { opacity: 0, transform: "scale(0.88)" };
      case "fade":  return { opacity: 0 };
      default:      return { opacity: 0 };
    }
  })();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        ...hiddenStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
