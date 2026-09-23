import React from 'react';
import { useScrollVelocity } from '../hooks/useScrollVelocity';

export const SideMovingBackground: React.FC = () => {
  const { progress } = useScrollVelocity();

  // Calculate scroll-linked horizontal translations
  // Layer 1: x: 20vw -> -35vw
  const layer1X = 20 - progress * 55; // in vw

  // Layer 2: x: -25vw -> 25vw
  const layer2X = -25 + progress * 50; // in vw

  // Layer 3: x: -45vw -> 40vw (Technical coordinates / Cyber grid)
  const layer3X = -45 + progress * 85; // in vw

  // Layer 4: x: 15vw -> -25vw (Kanji brush banner)
  const layer4X = 15 - progress * 40; // in vw

  return (
    <div
      className="side-moving-bg"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* ─── LAYER 1: GIANT OUTLINED TYPOGRAPHY (Right to Left) ─── */}
      <div
        style={{
          position: 'absolute',
          top: '28%',
          left: 0,
          whiteSpace: 'nowrap',
          transform: `translate3d(${layer1X}vw, 0, 0)`,
          willChange: 'transform',
          userSelect: 'none',
          opacity: 0.12,
        }}
      >
        <span
          className="giant-typography-stroke"
          style={{
            fontSize: 'clamp(6rem, 14vw, 15rem)',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '0.08em',
          }}
        >
          WANO FEST • CYBITRADIC • GRAND LINE • ワノ国 • WANO FEST • CYBITRADIC •
        </span>
      </div>

      {/* ─── LAYER 2: SAMURAI RED BRUSH STROKES & KANJI (Left to Right) ─── */}
      <div
        style={{
          position: 'absolute',
          top: '55%',
          left: 0,
          whiteSpace: 'nowrap',
          transform: `translate3d(${layer2X}vw, 0, 0)`,
          willChange: 'transform',
          userSelect: 'none',
          opacity: 0.14,
        }}
      >
        <span
          className="giant-typography-red-stroke"
          style={{
            fontSize: 'clamp(5rem, 11vw, 12rem)',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '0.12em',
          }}
        >
          頂点への道 • 自由 • 冒険 • INNOVATION • BEYOND ALL LIMITS •
        </span>
      </div>

      {/* ─── LAYER 3: ELECTRIC BLUE TECHNICAL GRID & COORDINATES (Left to Right, Fast) ─── */}
      <div
        style={{
          position: 'absolute',
          top: '80%',
          left: 0,
          whiteSpace: 'nowrap',
          transform: `translate3d(${layer3X}vw, 0, 0)`,
          willChange: 'transform',
          userSelect: 'none',
          opacity: 0.1,
        }}
      >
        <span
          className="giant-typography-blue-stroke"
          style={{
            fontSize: 'clamp(3rem, 7vw, 7rem)',
            fontWeight: 800,
            fontFamily: 'monospace',
            letterSpacing: '0.2em',
          }}
        >
          SYS://35°41'22"N 139°41'30"E // PROTOCOL_WANO_V4 // QUANTUM_GRID // GRAND_LINE_EXPEDITION //
        </span>
      </div>

      {/* ─── LAYER 4: JAPANESE SEIGAIHA WAVES / CLOUD SILHOUETTES (Right to Left) ─── */}
      <div
        style={{
          position: 'absolute',
          top: '42%',
          left: 0,
          width: '200vw',
          height: '140px',
          transform: `translate3d(${layer4X}vw, 0, 0)`,
          willChange: 'transform',
          opacity: 0.05,
          backgroundImage: `radial-gradient(circle at 50% 100%, #ffffff 12px, transparent 13px), radial-gradient(circle at 50% 100%, transparent 22px, #ffffff 23px, #ffffff 25px, transparent 26px)`,
          backgroundSize: '70px 45px',
        }}
      />
    </div>
  );
};
