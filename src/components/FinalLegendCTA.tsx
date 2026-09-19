import React, { useState } from 'react';

interface FinalLegendCTAProps {
  onExploreEvents: () => void;
  onRegister: () => void;
}

export const FinalLegendCTA: React.FC<FinalLegendCTAProps> = ({
  onExploreEvents,
  onRegister,
}) => {
  const [isCopiedNotification, setIsCopiedNotification] = useState(false);

  const handleRegisterClick = () => {
    onRegister();
    setIsCopiedNotification(true);
    setTimeout(() => setIsCopiedNotification(false), 3000);
  };

  return (
    <section
      style={{
        position: 'relative',
        padding: '120px 24px 110px',
        backgroundColor: '#020617',
        backgroundImage: 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(26, 42, 74, 0.7) 0%, rgba(2, 6, 23, 1) 100%)',
        overflow: 'hidden',
        textAlign: 'center',
        borderTop: '1px solid rgba(212, 175, 55, 0.25)',
      }}
    >
      {/* ─── ROTATING BACKGROUND VIDEO ─── */}
      <div
        style={{
          position: 'absolute',
          inset: '-15%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 0,
          perspective: '1200px',
          pointerEvents: 'none',
        }}
      >
        <video
          src="/video3.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            width: '120%',
            height: '120%',
            objectFit: 'cover',
            opacity: 0.18,
            animation: 'legendVideoRotate 25s linear infinite',
            transformStyle: 'preserve-3d',
          }}
        />
      </div>

      {/* Dark overlay so text stays readable over the rotating video */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(2, 6, 23, 0.55) 0%, rgba(2, 6, 23, 0.88) 100%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Ambient Sea Mist & Golden Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Keyframes for rotating video */}
      <style>{`
        @keyframes legendVideoRotate {
          0%   { transform: rotateY(0deg)   rotateX(3deg)  scale(1.05); }
          25%  { transform: rotateY(8deg)   rotateX(-2deg) scale(1.08); }
          50%  { transform: rotateY(0deg)   rotateX(-3deg) scale(1.05); }
          75%  { transform: rotateY(-8deg)  rotateX(2deg)  scale(1.08); }
          100% { transform: rotateY(0deg)   rotateX(3deg)  scale(1.05); }
        }
      `}</style>

      {/* Decorative Nautical Elements */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '999px',
            background: 'rgba(212, 175, 55, 0.12)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            color: '#d4af37',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.9rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '28px',
          }}
        >
          <span>⚔️</span> THE CALL TO ADVENTURE <span>⚔️</span>
        </div>

        <h2
          style={{
            fontFamily: "'Cinzel', 'Playfair Display', serif",
            fontSize: 'clamp(2.4rem, 6vw, 4.4rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '0.03em',
            color: '#ffffff',
            textShadow: '0 0 45px rgba(212, 175, 55, 0.45)',
            marginBottom: '22px',
          }}
        >
          CHOOSE YOUR EVENT.<br />
          <span style={{ color: '#d4af37' }}>CREATE YOUR LEGEND.</span>
        </h2>

        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.1rem, 2.2vw, 1.4rem)',
            color: '#94a3b8',
            lineHeight: 1.7,
            maxWidth: '660px',
            margin: '0 auto 44px',
          }}
        >
          Every challenge is a new adventure. Every participant has a story.<br />
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Your journey starts here.</span>
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '18px',
            position: 'relative',
            zIndex: 3,
          }}
        >
          <button
            type="button"
            onClick={onExploreEvents}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '18px 36px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #d4af37 0%, #b38b21 100%)',
              color: '#030712',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.05rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 35px rgba(212, 175, 55, 0.45)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 16px 45px rgba(212, 175, 55, 0.65)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 10px 35px rgba(212, 175, 55, 0.45)';
            }}
          >
            <span>📜</span> EXPLORE ALL EVENTS
          </button>

          <button
            type="button"
            onClick={handleRegisterClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '18px 36px',
              borderRadius: '999px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '2px solid #d4af37',
              color: '#d4af37',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.05rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.85)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span>⚔️</span> REGISTER NOW
          </button>
        </div>

        {/* Confirmation Banner */}
        {isCopiedNotification && (
          <div
            style={{
              marginTop: '24px',
              display: 'inline-block',
              padding: '10px 22px',
              borderRadius: '999px',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#4ade80',
              fontSize: '0.9rem',
              fontWeight: 600,
              animation: 'fadeIn 0.3s ease',
            }}
          >
            ⚔️ Preparing your Official Symposium Registration Pass...
          </div>
        )}
      </div>
    </section>
  );
};
