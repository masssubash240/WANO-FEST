import React, { useRef } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
  glowColor?: string;
}

/**
 * TiltCard — 3D perspective tilt on mouse move + spotlight overlay + glow.
 * Uses transform/opacity only for 60fps performance.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className,
  style,
  maxTilt = 12,
  glowColor = "rgba(0, 229, 255, 0.35)",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `
      perspective(700px)
      rotateY(${x * maxTilt * 2}deg)
      rotateX(${-y * maxTilt}deg)
      scale(1.03)
    `;

    if (glowRef.current) {
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      glowRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, ${glowColor} 0%, transparent 65%)`;
      glowRef.current.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)";
    }
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.15s ease-out, box-shadow 0.3s ease",
        willChange: "transform",
        ...style,
      }}
    >
      {/* Spotlight overlay */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity 0.3s ease",
          zIndex: 2,
        }}
      />
      {children}
    </div>
  );
};
