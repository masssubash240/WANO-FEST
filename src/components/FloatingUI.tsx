import React from 'react';
import { useScrollVelocity } from '../hooks/useScrollVelocity';

export const FloatingUI: React.FC = () => {
  const { progress, scrollY } = useScrollVelocity();

  // Calculate current section index (1 to 6)
  const sectionIndex = Math.min(6, Math.max(1, Math.floor(progress * 6) + 1));
  const isScrolledPastHero = scrollY > 200;

  return (
    <>
      {/* ─── FIXED LEFT SIDEBAR: SECTION COUNTER & JAPANESE KANJI ─── */}
      <div
        className="desktop-floating-ui"
        style={{
          position: 'fixed',
          left: '24px',
          bottom: '36px',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '10px',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.9,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-title)',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            color: '#00e5ff',
          }}
        >
          <span style={{ color: '#ffffff', fontWeight: 900 }}>0{sectionIndex}</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
          <span style={{ color: 'var(--text-muted)' }}>06</span>
          <span style={{ color: 'rgba(255,255,255,0.2)', marginLeft: '4px' }}>—</span>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255, 183, 3, 0.9)', letterSpacing: '0.2em' }}>
            WANO FEST
          </span>
        </div>

        {/* Minimal Progress Bar */}
        <div
          style={{
            width: '120px',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.max(8, progress * 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00e5ff, #ffb703)',
              transition: 'width 0.15s ease-out',
            }}
          />
        </div>
      </div>

      {/* ─── FIXED RIGHT SIDEBAR: ROTATED RUNNING TEXT ─── */}
      <div
        className="desktop-floating-ui"
        style={{
          position: 'fixed',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%) rotate(90deg)',
          transformOrigin: 'right center',
          zIndex: 40,
          pointerEvents: 'none',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <span
          style={{
            fontSize: '0.62rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 800,
            letterSpacing: '0.3em',
            color: 'rgba(255, 255, 255, 0.4)',
            textTransform: 'uppercase',
          }}
        >
          LIVE • GRAND LINE TECH REGION • 2026
        </span>
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#00e5ff',
            boxShadow: '0 0 10px #00e5ff',
            animation: 'pulseGlow 2s infinite',
          }}
        />
      </div>

      {/* ─── BOTTOM FLOATING PILL: SCROLL TO EXPLORE (Fades out after scrolling) ─── */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 35,
          pointerEvents: 'none',
          opacity: isScrolledPastHero ? 0 : 0.85,
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span
          style={{
            fontSize: '0.65rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 800,
            letterSpacing: '0.25em',
            color: 'rgba(255, 255, 255, 0.7)',
            textTransform: 'uppercase',
          }}
        >
          SCROLL TO EXPLORE
        </span>
        <div
          style={{
            width: '1px',
            height: '24px',
            background: 'linear-gradient(180deg, #00e5ff 0%, transparent 100%)',
            animation: 'floatGentle 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Responsive styling to hide on small screens */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-floating-ui {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
