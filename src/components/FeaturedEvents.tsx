import React, { useState, useRef, useEffect } from 'react';
import { FEATURED_EVENTS } from '../data/eventData';
interface FeaturedEventsProps {
  filterCategory: 'all' | 'tech' | 'non-tech';
  onFilterChange: (cat: 'all' | 'tech' | 'non-tech') => void;
  onOpenEventDetail?: (eventId: string, rect?: DOMRect, initialTab?: string) => void;
  onRegisterClick?: (eventId?: string) => void;
}

// Individual 3D Perspective Poster Card
interface CardProps {
  event: typeof FEATURED_EVENTS[0];
  onOpenDetail?: (id: string, rect?: DOMRect, initialTab?: string) => void;
  onRegister?: (id: string) => void;
}

const EVENT_ICONS: Record<string, string> = {
  'capture-the-flag': '🏴‍☠️',
  'coding-challenge': '💻',
  'ai-prompt': '🤖',
  'ui-ux-challenge': '🎨',
  'will-of-d': '🧠',
  'red-line-rush': '🗺️',
  'nikas-dance-arena': '💃',
  'binks-rhythm': '🎤',
  'pirate-portraits': '📸',
  'grand-line-visuals': '🎥',
  'straw-hat-studios': '🎬',
  'e-sports': '🎮',
};

const PosterCard: React.FC<CardProps> = ({ event, onOpenDetail, onRegister }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  // IntersectionObserver for Masked Image Reveal
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Gentle 3D perspective rotation: max 8deg
    const rotX = -((y - centerY) / centerY) * 8;
    const rotY = ((x - centerX) / centerX) * 8;

    setRotateX(rotX);
    setRotateY(rotY);
    setMousePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const accentColor = event.category === 'tech' ? '#00e5ff' : '#ffb703';
  const secondaryGlow = event.category === 'tech' ? 'rgba(0, 229, 255, 0.45)' : 'rgba(255, 183, 3, 0.45)';
  const pirateIcon = EVENT_ICONS[event.id] || '⚔️';

  return (
    <div
      ref={cardRef}
      data-cursor="card"
      data-cursor-text="EXPAND"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (onOpenDetail) onOpenDetail(event.id, rect, 'overview');
      }}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#090d19',
          border: `1.5px solid ${isHovered ? accentColor : 'rgba(255, 255, 255, 0.1)'}`,
          boxShadow: isHovered
            ? `0 25px 60px rgba(0,0,0,0.85), 0 0 35px ${secondaryGlow}`
            : '0 12px 35px rgba(0,0,0,0.6)',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovered ? 'scale(1.025) translateY(-6px)' : 'scale(1)'}`,
          transition: isHovered ? 'transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease' : 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'pointer',
          willChange: 'transform',
        }}
      >
        {/* Large Decorative Event Number Watermark */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '18px',
            fontFamily: "'Cinzel', 'Playfair Display', serif",
            fontSize: '4.5rem',
            fontWeight: 900,
            lineHeight: 1,
            color: 'rgba(255, 255, 255, 0.08)',
            zIndex: 4,
            pointerEvents: 'none',
            letterSpacing: '-0.05em',
            transition: 'transform 0.4s ease, color 0.4s ease',
            transform: isHovered ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
          }}
        >
          {event.eventNumber || '01'}
        </div>

        {/* Dynamic Cursor Spotlight Radial Highlight */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 5,
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.25) 0%, transparent 80%)`,
            transition: 'opacity 0.25s ease',
          }}
        />

        {/* ─── CARD IMAGE WITH MASKED CLIP-PATH REVEAL ─── */}
        <div
          style={{
            position: 'relative',
            height: '240px',
            overflow: 'hidden',
          }}
        >
          <img
            src={event.image}
            alt={event.title}
            className={`mask-reveal ${isRevealed ? 'revealed' : ''}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: isHovered ? 'scale(1.12)' : 'scale(1)',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          {/* Bottom Dark Gradient Shadow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(6,8,14,0.15) 0%, rgba(9,13,25,0.95) 100%)',
              zIndex: 2,
            }}
          />

          {/* Top Badges: Category & Prize */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              right: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(6, 8, 14, 0.9)',
                  border: `1px solid ${accentColor}88`,
                  fontSize: '1.2rem',
                  transform: isHovered ? 'rotate(12deg) scale(1.1)' : 'none',
                  transition: 'transform 0.3s ease',
                }}
              >
                {pirateIcon}
              </span>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  backgroundColor: 'rgba(6, 8, 14, 0.85)',
                  color: accentColor,
                  border: `1px solid ${accentColor}66`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                {event.category.toUpperCase()} DIVISION
              </span>
            </div>

            {/* Prize Badge */}
            {event.prize && (
              <span
                style={{
                  padding: '5px 14px',
                  borderRadius: '16px',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  backgroundColor: '#ffb703',
                  color: '#06080e',
                  boxShadow: '0 0 15px rgba(255, 183, 3, 0.6)',
                }}
              >
                {event.prize}
              </span>
            )}
          </div>
        </div>

        {/* ─── CARD BODY & TYPOGRAPHY ─── */}
        <div
          style={{
            padding: '24px',
            transform: isHovered ? 'translateZ(20px)' : 'none',
            transition: 'transform 0.3s ease',
          }}
        >
          <p
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              color: accentColor,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              margin: '0 0 6px 0',
            }}
          >
            {event.subtitle}
          </p>

          <h3
            style={{
              fontFamily: "'Cinzel', 'Playfair Display', serif",
              fontSize: '1.45rem',
              fontWeight: 900,
              color: '#ffffff',
              margin: '0 0 10px 0',
              letterSpacing: '0.04em',
              transform: isHovered ? 'translateY(-2px)' : 'none',
              transition: 'transform 0.25s ease',
            }}
          >
            {event.title}
          </h3>

          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              margin: '0 0 14px 0',
              minHeight: '44px',
            }}
          >
            {event.description}
          </p>

          {/* Coordinator Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'flex-start',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              fontSize: '0.76rem',
              color: '#d4af37',
              marginBottom: '16px',
              maxWidth: '100%',
            }}
          >
            <span>👤</span>
            <span>
              <span style={{ fontWeight: 700 }}>Coordinator: </span>
              <span>{event.coordinator}</span>
              {event.department && (
                <span style={{ display: 'block', marginTop: '3px', color: '#94a3b8', fontSize: '0.68rem' }}>
                  {[event.year, event.department].filter(Boolean).join(' • ')}
                </span>
              )}
            </span>
          </div>

          {/* Highlights */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '20px',
            }}
          >
            {event.highlights.map((h, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.72rem',
                  padding: '3px 10px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(240, 244, 252, 0.8)',
                }}
              >
                ✦ {h}
              </span>
            ))}
          </div>

          {/* Card Footer: Team Size + 3 Master Prompt Buttons */}
          <div
            style={{
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.9rem' }}>👥</span>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
                  Team: {event.teamSize}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                📍 {event.venue || 'To Be Announced'}
              </span>
            </div>

            {/* 3 Action Buttons per Master Prompt */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '8px' }}>
              {/* Button 1: View Details */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = cardRef.current?.getBoundingClientRect();
                  if (onOpenDetail) onOpenDetail(event.id, rect, 'overview');
                }}
                data-cursor="view"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '9px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accentColor;
                  e.currentTarget.style.color = accentColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                Details
              </button>

              {/* Button 2: Rules & Regulations */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = cardRef.current?.getBoundingClientRect();
                  if (onOpenDetail) onOpenDetail(event.id, rect, 'rules');
                }}
                data-cursor="rules"
                style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '12px',
                  padding: '9px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#d4af37',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                }}
              >
                📜 Rules
              </button>

              {/* Button 3: Register Now */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRegister) onRegister(event.id);
                  else if (onOpenDetail) onOpenDetail(event.id);
                }}
                data-cursor="register"
                style={{
                  background: event.category === 'tech'
                    ? 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)'
                    : 'linear-gradient(135deg, #d90429 0%, #ffb703 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '9px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                  boxShadow: `0 0 12px ${accentColor}44`,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.04)';
                  e.currentTarget.style.boxShadow = `0 0 20px ${accentColor}88`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = `0 0 12px ${accentColor}44`;
                }}
              >
                ⚔️ Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FeaturedEvents: React.FC<FeaturedEventsProps> = ({
  filterCategory,
  onFilterChange,
  onOpenEventDetail,
}) => {
  const [regToast, setRegToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  // Spec Section 20: open the registration link when available, otherwise
  // show the "Registration details will be announced soon." confirmation.
  const handleRegister = (event: typeof FEATURED_EVENTS[0]) => {
    if (event.registrationLink) {
      window.open(event.registrationLink, '_blank', 'noopener,noreferrer');
      return;
    }
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setRegToast(event.title);
    toastTimer.current = window.setTimeout(() => setRegToast(null), 4200);
  };

  const filtered =
    filterCategory === 'all'
      ? FEATURED_EVENTS
      : FEATURED_EVENTS.filter((e) => e.category === filterCategory);

  return (
    <section
      id="events"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '100px 24px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          <span className="wano-hanko-seal" style={{ width: '26px', height: '26px', fontSize: '0.85rem' }}>
            闘
          </span>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.28em',
              color: '#00e5ff',
              textTransform: 'uppercase',
            }}
          >
            CINEMATIC POSTER EXPEDITIONS
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #ffffff 0%, #ffb703 60%, #d90429 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.08em',
            margin: '0 0 12px 0',
          }}
        >
          FEATURED BATTLES
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 32px auto' }}>
          Nine legendary events across the Tech, Non-Tech, and E-Sports seas. Claim your glory across the Grand Line.
        </p>

        {/* Filter Tabs */}
        <div
          style={{
            display: 'inline-flex',
            background: 'rgba(10, 14, 26, 0.95)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '40px',
            padding: '6px',
            gap: '6px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
          }}
        >
          {([
            { key: 'all', label: '⚡ ALL EXPEDITIONS' },
            { key: 'tech', label: '⚔️ TECHNICAL' },
            { key: 'non-tech', label: '🍖 NON-TECHNICAL' },
          ] as { key: 'all' | 'tech' | 'non-tech'; label: string }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => onFilterChange(tab.key)}
              style={{
                padding: '10px 24px',
                borderRadius: '30px',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontWeight: 800,
                fontSize: '0.84rem',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                background:
                  filterCategory === tab.key
                    ? tab.key === 'tech'
                      ? 'linear-gradient(135deg, #00b4d8, #0077b6)'
                      : tab.key === 'non-tech'
                      ? 'linear-gradient(135deg, #d90429, #ffb703)'
                      : 'linear-gradient(135deg, #7b2cbf, #9d4edd)'
                    : 'transparent',
                color: filterCategory === tab.key ? '#ffffff' : 'rgba(255,255,255,0.6)',
                boxShadow: filterCategory === tab.key ? '0 0 20px rgba(0, 229, 255, 0.4)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Poster Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '32px',
        }}
      >
        {filtered.map((event) => (
          <PosterCard
            key={event.id}
            event={event}
            onOpenDetail={onOpenEventDetail}
            onRegister={() => handleRegister(event)}
          />
        ))}
      </div>

      {/* ─── REGISTRATION CONFIRMATION TOAST (Spec Section 20) ─── */}
      {regToast && (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 28px',
            borderRadius: '16px',
            background: 'rgba(10, 14, 26, 0.95)',
            border: '1px solid rgba(212, 175, 55, 0.5)',
            boxShadow: '0 15px 45px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.25)',
            backdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.3s ease',
            maxWidth: 'calc(100vw - 40px)',
          }}
        >
          <span style={{ fontSize: '1.6rem' }}>🏴‍☠️</span>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '1rem',
                color: '#d4af37',
                letterSpacing: '0.05em',
              }}
            >
              REGISTRATION FLAG RAISED — {regToast.toUpperCase()}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '2px' }}>
              Registration details will be announced soon.
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
