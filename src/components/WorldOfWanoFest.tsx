import React, { useRef, useState, useEffect } from 'react';

interface WorldOfWanoFestProps {
  onSelectCategory?: (category: string) => void;
  onOpenEventDetail?: (eventId: string) => void;
}

const PANELS = [
  {
    id: 'tech',
    title: 'TECH REALM',
    subtitle: 'CYBER SAMURAI CORE',
    desc: 'Capture the Flag, Coding Challenge, AI Prompt and UI/UX Challenge across the technical division.',
    tag: 'ZORO DIVISION // 01',
    category: 'TECH',
    image: '/images/zoro_tech.jpg',
    theme: 'tech',
    accent: '#00e5ff',
    secondary: '#d90429',
    badge: '⚔️ CODE & QUIZ',
    eventId: 'coding-challenge',
  },
  {
    id: 'non-tech',
    title: 'NON-TECH REALM',
    subtitle: 'WARRIORS OF MATSURI',
    desc: 'Will of D, Red Line Rush, dance, singing, photography, videography and short film events.',
    tag: 'LUFFY DIVISION // 02',
    category: 'NON-TECH',
    image: '/images/luffy_nontech.jpg',
    theme: 'traditional',
    accent: '#ffb703',
    secondary: '#d90429',
    badge: '🍖 MATSURI ARENA',
    eventId: 'red-line-rush',
  },
  {
    id: 'games',
    title: 'E-SPORTS',
    subtitle: 'BATTLE FOR GLORY',
    desc: 'PUBG, Free Fire, Chess and Carrom Pool — combined under one E-Sports arena.',
    tag: 'COLOSSEUM // 03',
    category: 'NON-TECHNICAL',
    image: '/images/cyber_arena.jpg',
    theme: 'esports',
    accent: '#9d4edd',
    secondary: '#00e5ff',
    badge: '🎮 APEX CLASH',
    eventId: 'e-sports',
  },
  {
    id: 'cultural',
    title: 'CULTURAL BATTLES',
    subtitle: 'COSPLAY & PERFORMANCE',
    desc: "Nika's Dance Arena, Bink's Rhythm, and Pirate Portraits — cultural creativity across the Grand Line.",
    tag: 'STAGE OF DREAMS // 04',
    category: 'CULTURAL',
    image: '/images/nikas_dance_arena.jpg',
    theme: 'traditional',
    accent: '#ff4d6d',
    secondary: '#ffb703',
    badge: '🎭 CULTURAL CUP',
    eventId: 'nikas-dance-arena',
  },
  {
    id: 'workshops',
    title: 'GRAND LINE FORGE',
    subtitle: 'HANDS-ON MASTERCLASSES',
    desc: 'Original short films, themed photography, and cinematic videography — master the craft of visual storytelling.',
    tag: 'CREATOR LABS // 05',
    category: 'CREATORS',
    image: '/images/wano_fest_hero.jpg',
    theme: 'tech',
    accent: '#00b4d8',
    secondary: '#38b000',
    badge: '🎬 CREATE & CAPTURE',
    eventId: 'straw-hat-studios',
  },
  {
    id: 'special',
    title: 'SPECIAL EVENTS',
    subtitle: 'BINKS\' RHYTHM NIGHT',
    desc: 'Grand Line Visuals premieres and the Straw Hat nakama alliance finale under the festival lanterns.',
    tag: 'FESTIVAL APEX // 06',
    category: 'SPECIAL',
    image: '/images/grand_line_visuals.jpg',
    theme: 'special',
    accent: '#ffaa00',
    secondary: '#d90429',
    badge: '🏮 GRAND FINALE',
    eventId: 'grand-line-visuals',
  },
];

export const WorldOfWanoFest: React.FC<WorldOfWanoFestProps> = ({ onSelectCategory, onOpenEventDetail }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const totalDist = el.offsetHeight - window.innerHeight;
      if (totalDist <= 0) return;

      const currentY = -rect.top;
      const progress = Math.min(1, Math.max(0, currentY / totalDist));
      setScrollProgress(progress);

      // Determine active center index
      const active = Math.min(PANELS.length - 1, Math.max(0, Math.round(progress * (PANELS.length - 1))));
      setActiveIndex(active);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute horizontal translation: 0% to max translation
  // Max translation moves all panels past the center
  const trackTranslateX = scrollProgress * -((PANELS.length - 1) * 62); // in vw approx

  return (
    <div
      id="world-of-wano"
      ref={containerRef}
      style={{
        position: 'relative',
        height: '340vh', // Sticky vertical scroll distance
        backgroundColor: '#040508',
      }}
    >
      {/* Sticky Fullscreen Frame */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 15,
        }}
      >
        {/* Section Header */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '0',
            right: '0',
            textAlign: 'center',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '6px',
            }}
          >
            <div style={{ width: '40px', height: '1.5px', background: 'linear-gradient(90deg, transparent, #d90429)' }} />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.28em',
                color: '#d90429',
                textTransform: 'uppercase',
              }}
            >
              HORIZONTAL STORY GALLERY
            </span>
            <div style={{ width: '40px', height: '1.5px', background: 'linear-gradient(90deg, #d90429, transparent)' }} />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #ffffff 0%, #ffb703 60%, #d90429 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.08em',
              margin: 0,
            }}
          >
            THE WORLD OF WANO FEST
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Scroll vertically to traverse the 6 realms of the Grand Festival
          </p>
        </div>

        {/* ─── HORIZONTAL MOVING TRACK ─── */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: '3vw',
            paddingLeft: '32vw',
            paddingRight: '32vw',
            transform: `translate3d(${trackTranslateX}vw, 0, 0)`,
            transition: 'transform 0.08s ease-out',
            willChange: 'transform',
            alignItems: 'center',
            marginTop: '50px',
          }}
        >
          {PANELS.map((panel, idx) => {
            const isActive = idx === activeIndex;
            const distFromCenter = Math.abs(idx - activeIndex);

            // Center focus effects
            const scale = isActive ? 1.05 : Math.max(0.88, 1 - distFromCenter * 0.08);
            const blur = isActive ? 0 : Math.min(4, distFromCenter * 2);
            const brightness = isActive ? 1.15 : Math.max(0.45, 1 - distFromCenter * 0.28);
            const opacity = isActive ? 1 : Math.max(0.55, 1 - distFromCenter * 0.22);

            return (
              <div
                key={panel.id}
                data-cursor="card"
                data-cursor-text="EXPLORE"
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(panel.category.toLowerCase());
                  } else if (onOpenEventDetail) {
                    onOpenEventDetail(panel.eventId);
                  }
                }}
                style={{
                  flex: '0 0 clamp(320px, 46vw, 620px)',
                  height: 'clamp(420px, 58vh, 580px)',
                  borderRadius: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transform: `scale(${scale})`,
                  filter: `blur(${blur}px) brightness(${brightness})`,
                  opacity,
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: isActive ? 10 : 2,
                  border: `2px solid ${isActive ? panel.accent : 'rgba(255, 255, 255, 0.12)'}`,
                  boxShadow: isActive
                    ? `0 25px 60px rgba(0,0,0,0.85), 0 0 45px ${panel.accent}55`
                    : '0 10px 30px rgba(0,0,0,0.6)',
                  backgroundColor: '#080c16',
                }}
              >
                {/* Background Image with Parallax Shift */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={panel.image}
                    alt={panel.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: isActive ? 'scale(1.08)' : 'scale(1)',
                      transition: 'transform 0.6s ease-out',
                    }}
                  />
                  {/* Themed Overlay Gradients */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: panel.theme === 'tech'
                        ? 'linear-gradient(180deg, rgba(4, 6, 14, 0.2) 0%, rgba(4, 10, 24, 0.88) 70%, #040814 100%)'
                        : panel.theme === 'esports'
                        ? 'linear-gradient(180deg, rgba(8, 4, 18, 0.2) 0%, rgba(18, 6, 32, 0.9) 70%, #0a0414 100%)'
                        : 'linear-gradient(180deg, rgba(20, 8, 4, 0.2) 0%, rgba(28, 12, 6, 0.9) 70%, #120603 100%)',
                    }}
                  />
                </div>

                {/* Top Badge & Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '24px',
                    left: '24px',
                    right: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 2,
                  }}
                >
                  <span
                    style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      backgroundColor: 'rgba(8, 12, 24, 0.85)',
                      color: panel.accent,
                      border: `1px solid ${panel.accent}66`,
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {panel.tag}
                  </span>

                  <span
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      backgroundColor: panel.accent,
                      color: '#06080e',
                      boxShadow: `0 0 16px ${panel.accent}`,
                    }}
                  >
                    {panel.badge}
                  </span>
                </div>

                {/* Bottom Content Area */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '32px 28px',
                    zIndex: 2,
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: panel.accent,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      margin: '0 0 6px 0',
                    }}
                  >
                    {panel.subtitle}
                  </p>

                  <h3
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: 'clamp(1.6rem, 2.6vw, 2.4rem)',
                      fontWeight: 900,
                      color: '#ffffff',
                      margin: '0 0 10px 0',
                      letterSpacing: '0.04em',
                      textShadow: '0 4px 15px rgba(0,0,0,0.8)',
                    }}
                  >
                    {panel.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(220, 230, 245, 0.85)',
                      lineHeight: 1.6,
                      margin: '0 0 20px 0',
                      maxWidth: '520px',
                    }}
                  >
                    {panel.desc}
                  </p>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 24px',
                      borderRadius: '25px',
                      background: `linear-gradient(135deg, ${panel.accent} 0%, ${panel.secondary} 100%)`,
                      color: '#ffffff',
                      fontFamily: 'var(--font-title)',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      boxShadow: `0 0 20px ${panel.accent}66`,
                    }}
                  >
                    <span>ENTER REALM</span>
                    <span>➔</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Pagination Dots */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            zIndex: 20,
          }}
        >
          {PANELS.map((p, idx) => (
            <div
              key={p.id}
              style={{
                width: idx === activeIndex ? '36px' : '10px',
                height: '6px',
                borderRadius: '4px',
                backgroundColor: idx === activeIndex ? '#ffb703' : 'rgba(255, 255, 255, 0.2)',
                boxShadow: idx === activeIndex ? '0 0 12px #ffb703' : 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
