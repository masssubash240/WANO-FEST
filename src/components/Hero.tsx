import React, { useState, useEffect, useRef } from 'react';
import { useScrollVelocity } from '../hooks/useScrollVelocity';
import { setGlobalAmbientMuted, startGlobalAmbientAudio } from './GlobalAmbientAudio';

interface HeroProps {
  onRegisterClick: () => void;
  onSelectCategory?: (cat: 'tech' | 'non-tech') => void;
  onNavigatePitch?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRegisterClick, onNavigatePitch }) => {
  // Countdown to October 9, 2026
  const targetDate = new Date('2026-10-09T09:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [bgVideoSrc, setBgVideoSrc] = useState<'video2' | 'intro'>('video2');
  const [isBgMuted, setIsBgMuted] = useState(true);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  const { scrollY, velocity } = useScrollVelocity();

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTrailerModalOpen(false);
      }
    };
    if (isTrailerModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTrailerModalOpen]);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, targetDate - now);
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Parallax calculations
  const heroHeight = typeof window !== 'undefined' ? window.innerHeight : 900;
  const scrollRatio = Math.min(1.2, Math.max(0, scrollY / heroHeight));

  // Layer 1: Sky/Video slow zoom
  const layer1Scale = 1 + scrollRatio * 0.12;

  // Layer 2: Mountains slow parallax
  const layer2Y = scrollY * 0.15;

  // Layer 3: Architecture parallax
  const layer3Y = scrollY * 0.28;

  // Layer 4: Sideways moving fog
  const layer4X = scrollY * 0.35;
  const layer4Opacity = Math.max(0, 0.7 - scrollRatio * 0.6);

  // Layer 6: UI & Typography
  const headlineX = scrollY * 0.22;
  const headlineSkew = Math.max(-4, Math.min(4, velocity * 0.1));

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#040508',
      }}
    >
      {/* ══════════════════════════════════════════════
          LAYER 1: SKY & CINEMATIC VIDEO BACKGROUND
          ══════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          overflow: 'hidden',
          transform: `scale(${layer1Scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.1s ease-out',
        }}
      >
        <video
          ref={bgVideoRef}
          key={bgVideoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/hero.jpg"
          style={bgVideoSrc === 'intro' ? {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          } : {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-90deg) scale(1.78)',
            width: '100vh',
            height: '100vw',
            objectFit: 'cover',
            minWidth: 'unset',
            minHeight: 'unset',
          }}
        >
          <source src={bgVideoSrc === 'intro' ? '/intro.mp4' : '/video2.mp4'} type="video/mp4" />
          <img
            src="/images/hero.jpg"
            alt="CybiTradic WANO FEST"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </video>

        {/* Ambient Dark Gradients & Atmospheric Moonlight */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(circle at 65% 25%, rgba(0, 229, 255, 0.15) 0%, transparent 55%),
              radial-gradient(circle at 20% 75%, rgba(217, 4, 41, 0.18) 0%, transparent 60%),
              linear-gradient(90deg, rgba(4, 5, 8, 0.9) 0%, rgba(4, 5, 8, 0.6) 45%, rgba(4, 5, 8, 0.4) 100%),
              linear-gradient(180deg, rgba(4, 5, 8, 0.45) 0%, rgba(4, 5, 8, 0.1) 40%, rgba(4, 5, 8, 0.85) 85%, #040508 100%)
            `,
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════
          LAYER 2: WANO MOUNTAINS SILHOUETTE
          ══════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: 0,
          right: 0,
          height: '240px',
          zIndex: 2,
          pointerEvents: 'none',
          transform: `translate3d(0, ${layer2Y}px, 0)`,
          opacity: 0.35,
        }}
      >
        <svg viewBox="0 0 1440 280" fill="none" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <path
            d="M0 280L120 180L240 240L380 140L560 220L720 110L900 230L1100 130L1260 210L1440 160L1440 280Z"
            fill="#060914"
          />
          <path
            d="M0 280L180 200L340 250L480 170L680 240L840 160L1020 250L1200 180L1440 240L1440 280Z"
            fill="#030407"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════
          LAYER 3: JAPANESE ARCHITECTURE & CASTLE SILHOUETTE
          ══════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          right: '8%',
          width: '420px',
          height: '320px',
          zIndex: 3,
          pointerEvents: 'none',
          transform: `translate3d(0, ${layer3Y}px, 0)`,
          opacity: 0.45,
        }}
      >
        <svg viewBox="0 0 400 300" fill="none" style={{ width: '100%', height: '100%' }}>
          {/* Pagoda Tiers */}
          <path d="M160 50 L200 20 L240 50 L230 65 L170 65 Z" fill="#090d1a" />
          <path d="M140 85 L200 55 L260 85 L245 105 L155 105 Z" fill="#090d1a" />
          <path d="M110 130 L200 95 L290 130 L270 155 L130 155 Z" fill="#060914" />
          <path d="M80 185 L200 145 L320 185 L295 220 L105 220 Z" fill="#040508" />
          <rect x="185" y="5" width="30" height="15" fill="#d90429" opacity="0.8" />
          {/* Lantern glow */}
          <circle cx="200" cy="12" r="8" fill="#ffb703" filter="drop-shadow(0 0 10px #ffb703)" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════
          LAYER 4: SIDEWAYS MOVING ATMOSPHERIC FOG
          ══════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '-20%',
          width: '160%',
          height: '260px',
          zIndex: 4,
          pointerEvents: 'none',
          transform: `translate3d(${layer4X}px, 0, 0)`,
          opacity: layer4Opacity,
          background: 'radial-gradient(ellipse at 50% 60%, rgba(217, 4, 41, 0.08) 0%, rgba(0, 229, 255, 0.06) 40%, transparent 75%)',
          filter: 'blur(35px)',
        }}
      />

      {/* ══════════════════════════════════════════════
          LAYER 6: UI & TYPOGRAPHY SYSTEM
          ══════════════════════════════════════════════ */}
      <div
        className="hero-main-grid"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1380px',
          width: '100%',
          margin: '0 auto',
          padding: '80px 24px 30px 24px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px',
        }}
      >
        {/* ─── HERO CONTENT & ACTIONS ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '860px', width: '100%' }}>
          {/* Top Tagline / Category Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
              alignSelf: 'flex-start',
              background: 'linear-gradient(90deg, rgba(8, 12, 24, 0.92) 0%, rgba(18, 24, 40, 0.8) 100%)',
              border: '1px solid rgba(217, 4, 41, 0.5)',
              borderRadius: '30px',
              padding: '5px 16px',
              boxShadow: '0 0 16px rgba(217, 4, 41, 0.25), inset 0 0 8px rgba(217, 4, 41, 0.15)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="wano-hanko-seal" style={{ width: '20px', height: '20px', fontSize: '0.7rem', border: '1.5px solid #d90429' }}>
              和
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.2em',
                color: '#ffffff',
                textTransform: 'uppercase',
              }}
            >
              ENTER THE GRAND FESTIVAL <span style={{ color: '#00e5ff' }}>•</span> 2026
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                color: '#ffb703',
                fontWeight: 800,
                borderLeft: '1px solid rgba(255,255,255,0.2)',
                paddingLeft: '8px',
              }}
            >
              OCT 9
            </span>
          </div>

          {/* ─── HERO GIGANTIC DISPLAY HEADLINE WITH VELOCITY SKEW ─── */}
          <div
            style={{
              marginBottom: '14px',
              transform: `translateX(${headlineX}px) skewX(${headlineSkew}deg)`,
              transformOrigin: 'left center',
              transition: 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform',
            }}
          >
            <img
              src="/images/wano_fest_overall_logo.png"
              alt="CybiTradic Wano Fest"
              style={{
                width: 'min(100%, 640px)',
                maxHeight: '190px',
                objectFit: 'contain',
                objectPosition: 'left center',
                mixBlendMode: 'normal',
                filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.75)) drop-shadow(0 0 20px rgba(0, 229, 255, 0.2))',
              }}
            />
          </div>

          {/* Supporting Editorial Paragraph */}
          <p
            style={{
              fontSize: 'clamp(0.88rem, 1.15vw, 1.05rem)',
              color: 'rgba(230, 238, 252, 0.88)',
              lineHeight: 1.6,
              maxWidth: '680px',
              marginBottom: '20px',
              textShadow: '0 2px 8px rgba(0,0,0,0.9)',
            }}
          >
            Step into an anime cinematic universe where samurai spirit meets next-gen technology.
            25+ battles, CTFs, hackathons, and esports across the Grand Line.
          </p>

          {/* ─── CTA ROW: EXPLORE EVENTS + JOIN THE FEST ─── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '22px',
            }}
          >
            {/* Primary CTA: EXPLORE EVENTS */}
            <a
              href="#world-of-wano"
              data-cursor="expand"
              data-cursor-text="EXPLORE"
              className="btn-samurai-primary"
              style={{
                padding: '12px 26px',
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>EXPLORE EVENTS</span>
              <span style={{ fontSize: '1.1rem' }}>➔</span>
            </a>

            {/* Secondary CTA: JOIN THE FEST */}
            <button
              onClick={onRegisterClick}
              data-cursor="register"
              data-cursor-text="JOIN"
              className="btn-cyber-primary"
              style={{
                padding: '12px 24px',
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, rgba(14, 24, 48, 0.9) 0%, rgba(20, 36, 72, 0.9) 100%)',
                border: '1.5px solid #00e5ff',
              }}
            >
              <span>JOIN THE FEST</span>
              <span>⚡</span>
            </button>

            {/* Special CTA: PITCH PERFECT '26 */}
            <button
              onClick={onNavigatePitch}
              data-cursor="expand"
              data-cursor-text="PITCH"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 20px',
                borderRadius: '30px',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #2563eb 100%)',
                border: '1.5px solid #60a5fa',
                color: '#ffffff',
                fontFamily: 'var(--font-body)',
                fontWeight: 800,
                fontSize: '0.86rem',
                letterSpacing: '0.03em',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(37, 99, 235, 0.45)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                e.currentTarget.style.borderColor = '#fbbf24';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = '#60a5fa';
              }}
            >
              <span>🚀</span>
              <span>PITCH PERFECT ’26</span>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  padding: '2px 7px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#0a0f24',
                }}
              >
                ₹20K
              </span>
            </button>

            {/* Watch Trailer Button */}
            <button
              onClick={() => setIsTrailerModalOpen(true)}
              data-cursor="view"
              data-cursor-text="WATCH"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 18px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '30px',
                color: '#ffffff',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.25s ease',
              }}
            >
              <span style={{ fontSize: '1rem', color: '#ffb703' }}>▶</span>
              <span>TRAILER</span>
            </button>

            {/* Audio Mute/Unmute Toggle */}
            <button
              onClick={() => {
                const nextMuted = !isBgMuted;
                setIsBgMuted(nextMuted);
                setGlobalAmbientMuted(nextMuted);
                if (!nextMuted) void startGlobalAmbientAudio();
              }}
              data-cursor="button"
              data-cursor-text={isBgMuted ? "UNMUTE" : "MUTE"}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '11px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '30px',
                color: '#ffffff',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span>{isBgMuted ? '🔇' : '🔊'}</span>
              <span>{isBgMuted ? 'SOUND OFF' : 'SOUND ON'}</span>
            </button>

            {/* Background Video Scene Switcher */}
            <button
              onClick={() => setBgVideoSrc(bgVideoSrc === 'video2' ? 'intro' : 'video2')}
              data-cursor="button"
              data-cursor-text="SCENE"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '11px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                borderRadius: '30px',
                color: '#00e5ff',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span>🎬</span>
              <span>SCENE {bgVideoSrc === 'video2' ? '1' : '2'}</span>
            </button>
          </div>

          {/* ─── COUNTDOWN TIMER BANNER ─── */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              background: 'rgba(8, 12, 22, 0.85)',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              borderRadius: '14px',
              padding: '8px 18px',
              backdropFilter: 'blur(12px)',
              alignSelf: 'flex-start',
            }}
          >
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
              COUNTDOWN:
            </span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {[
                { val: timeLeft.days, unit: 'D' },
                { val: timeLeft.hours, unit: 'H' },
                { val: timeLeft.minutes, unit: 'M' },
                { val: timeLeft.seconds, unit: 'S' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: '1rem',
                      fontWeight: 900,
                      color: '#00e5ff',
                    }}
                  >
                    {String(item.val).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '0.62rem', color: '#8e9bb4', fontWeight: 700 }}>
                    {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* ─── RIGHT COLUMN: SMALL PROMO BANNER ─── */}
        <div 
          style={{
            flex: '0 0 auto',
            maxWidth: '220px',
            borderRadius: '14px',
            padding: '4px',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onClick={onNavigatePitch}
          onMouseEnter={(e) => { 
            e.currentTarget.style.transform = 'scale(1.04)'; 
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          }}
          className="hero-promo-banner"
        >
          <img
            src="/images/pitch-perfect-poster.jpg"
            alt="Pitch Perfect 26 Banner"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '10px',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* ─── TRAILER MODAL (intro.mp4) ─── */}
      {isTrailerModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setIsTrailerModalOpen(false)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '960px',
              width: '100%',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '2px solid rgba(0, 229, 255, 0.6)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 50px rgba(0, 229, 255, 0.4)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src="/intro.mp4"
              autoPlay
              controls
              playsInline
              style={{ width: '100%', display: 'block', maxHeight: '80vh' }}
            />
            <button
              onClick={() => setIsTrailerModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0, 0, 0, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                fontSize: '1.2rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
