import React, { useState, useRef, useEffect } from 'react';

interface CrewContact {
  id: string;
  shortName: string;
  role: string;
  phone: string;
  tel?: string;
  url?: string;
  actionLabel?: string;
  icon?: string;
  color: string;
}

const CREW_CONTACTS: CrewContact[] = [
  {
    id: 'sathi',
    shortName: 'SATHI',
    role: 'AI NAVIGATOR / INTELLIGENCE CREW',
    phone: '+91 96267 44195',
    tel: '+919626744195',
    actionLabel: 'CALL SATHI',
    icon: '📞',
    color: '#00e676',
  },
  {
    id: 'subash',
    shortName: 'SUBASH',
    role: 'CYBER PIRATE / SECURITY CAPTAIN',
    phone: 'godofcybertech.vercel.app',
    url: 'https://godofcybertech.vercel.app/',
    tel: '6383853695',
    actionLabel: 'VISIT SUBASH',
    icon: '🌐',
    color: '#00e5ff',
  },
  {
    id: 'raj',
    shortName: 'RAJ',
    role: 'DIGITAL STRATEGIST / CREW MEMBER',
    phone: '+91 93611 84362',
    tel: '+919361184362',
    actionLabel: 'CALL RAJ',
    icon: '📞',
    color: '#ffb703',
  },
];

export const CrewContactSection: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLElement>(null);

  // Mouse move for ambient harbour lights
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  return (
    <section
      id="crew"
      ref={containerRef}
      style={{
        position: 'relative',
        backgroundColor: '#030407',
        color: '#fff',
        padding: '120px 20px 100px 20px',
        overflow: 'hidden',
        borderTop: '2px solid rgba(255, 183, 3, 0.3)',
      }}
    >
      {/* ANCHOR FOR #contact AS WELL */}
      <div id="contact" style={{ position: 'absolute', top: 0, left: 0 }} />

      {/* ATMOSPHERIC SHIP-DECK BACKGROUND */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255, 183, 3, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 20% 20%, rgba(0, 229, 255, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, rgba(217, 4, 41, 0.1) 0%, transparent 60%),
            linear-gradient(180deg, rgba(3, 4, 7, 0.95) 0%, rgba(8, 12, 22, 0.92) 50%, rgba(4, 5, 8, 0.98) 100%)
          `,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Wood plank texture lines in background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 48px, rgba(255, 255, 255, 0.015) 49px, transparent 50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Floating Ember & Mist Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(255, 183, 3, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          animation: 'shipBobbing 8s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          animation: 'shipBobbing 10s ease-in-out infinite reverse',
        }}
      />

      <div style={{ maxWidth: '1360px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* PAGE TITLE & HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 20px',
              background: 'rgba(255, 183, 3, 0.08)',
              border: '1px solid rgba(255, 183, 3, 0.35)',
              borderRadius: '30px',
              backdropFilter: 'blur(10px)',
              marginBottom: '18px',
            }}
          >
            <span
              className="wano-hanko-seal"
              style={{ width: '26px', height: '26px', fontSize: '0.8rem', background: '#d90429' }}
            >
              仲間
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.28em',
                color: '#ffb703',
                textTransform: 'uppercase',
              }}
            >
              MEET THE CREW BEHIND THE VOYAGE
            </span>
            <span className="lantern-glow" style={{ fontSize: '1rem' }}>
              🏮
            </span>
          </div>

          <div className="pirate-crew-shimmer" style={{ display: 'inline-block' }}>
            <h2
              className="pirate-crew-title"
              style={{
                fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              THE CREW
            </h2>
          </div>

          <p
            style={{
              color: 'rgba(230, 240, 255, 0.8)',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              maxWidth: '680px',
              margin: '20px auto 0 auto',
              lineHeight: 1.6,
              fontFamily: 'var(--font-body)',
            }}
          >
            Architects of the CybiTradic Grand Line — commanding ethical cyber security, autonomous intelligence, and
            cutting-edge digital strategies for WANOFEST 2026.
          </p>
        </div>

        {/* TEAM WANTED POSTER (teams.png) */}
        <div
          className="ship-deck-float"
          style={{
            position: 'relative',
            maxWidth: '1240px',
            margin: '0 auto 90px auto',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '2px solid rgba(255, 183, 3, 0.55)',
            boxShadow:
              '0 35px 100px rgba(0,0,0,0.95), 0 0 55px rgba(255, 183, 3, 0.3), inset 0 0 40px rgba(255, 183, 3, 0.08)',
            backgroundColor: '#05070e',
            transition: 'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.015)';
            e.currentTarget.style.borderColor = '#ffd166';
            e.currentTarget.style.boxShadow = '0 40px 110px rgba(0,0,0,0.95), 0 0 75px rgba(255, 183, 3, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = 'rgba(255, 183, 3, 0.55)';
            e.currentTarget.style.boxShadow =
              '0 35px 100px rgba(0,0,0,0.95), 0 0 55px rgba(255, 183, 3, 0.3), inset 0 0 40px rgba(255, 183, 3, 0.08)';
          }}
        >
          {/* Corner Kanji Seals */}
          <span
            className="font-brush"
            style={{
              position: 'absolute',
              top: '12px',
              left: '16px',
              fontSize: '1.6rem',
              color: 'rgba(255, 183, 3, 0.85)',
              textShadow: '0 0 14px rgba(255, 183, 3, 0.6)',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          >
            仲間
          </span>
          <span
            className="font-brush"
            style={{
              position: 'absolute',
              top: '12px',
              right: '16px',
              fontSize: '1.6rem',
              color: 'rgba(217, 4, 41, 0.9)',
              textShadow: '0 0 14px rgba(217, 4, 41, 0.7)',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          >
            海賊
          </span>

          {/* The Developer Crew Poster Artwork — full developer lineup */}
          <img
            src="/images/wano_fest_developers_banner.png"
            alt="CYBITRADIC WANO FEST DEVELOPERS — THE MINDS BEHIND A BIGGER TOMORROW"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>

        {/* CONTACT THE CREW ACTION DOCK */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(14, 20, 36, 0.9) 0%, rgba(8, 12, 22, 0.95) 100%)',
            border: '2px solid rgba(255, 183, 3, 0.35)',
            borderRadius: '28px',
            padding: '40px 32px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(255, 183, 3, 0.15)',
            marginBottom: '90px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.25em',
                color: '#ffb703',
                textTransform: 'uppercase',
              }}
            >
              COMMUNICATION MATRIX
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 900,
                color: '#fff',
                letterSpacing: '0.05em',
                margin: '8px 0',
              }}
            >
              CONTACT THE CREW
            </h3>
            <p style={{ color: 'rgba(220, 230, 245, 0.75)', fontSize: '0.95rem', margin: 0 }}>
              Need CTF challenges, AI symposium details, or summit access? Reach out directly to the coordinators.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {CREW_CONTACTS.map((m) => {
              const isUrl = Boolean(m.url);
              const href = isUrl ? m.url : `tel:${m.tel || m.phone}`;

              return (
                <a
                  key={`action-${m.id}`}
                  href={href}
                  target={isUrl ? '_blank' : undefined}
                  rel={isUrl ? 'noopener noreferrer' : undefined}
                  data-cursor="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '18px 24px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(6, 9, 16, 0.75)',
                    border: `1.5px solid ${m.color}55`,
                    textDecoration: 'none',
                    color: '#fff',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = m.color;
                    e.currentTarget.style.boxShadow = `0 14px 35px rgba(0,0,0,0.8), 0 0 25px ${m.color}55`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = `${m.color}55`;
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.5)';
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: `${m.color}22`,
                      border: `1.5px solid ${m.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                      flexShrink: 0,
                    }}
                  >
                    {m.icon || (isUrl ? '🌐' : '📞')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: m.color,
                        fontWeight: 800,
                        letterSpacing: '0.15em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{m.actionLabel || `CALL ${m.shortName}`}</span>
                      {isUrl && (
                        <span style={{ fontSize: '0.85rem', fontWeight: 900 }}>↗</span>
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-title)',
                        fontSize: isUrl ? '0.92rem' : '1rem',
                        fontWeight: 900,
                        color: '#fff',
                        letterSpacing: isUrl ? '0.02em' : 'normal',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {m.phone}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                      {m.role}
                      {isUrl && m.tel && (
                        <span style={{ marginLeft: '6px', color: 'rgba(255,255,255,0.4)' }}>
                          • {m.tel}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* MORE DETAILS: TREASURE MAP BUTTON LEADING TO OFFICIAL COLLEGE */}
        <div style={{ textAlign: 'center', marginBottom: '100px' }}>
          <a
            href="https://reccbe.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="spin-on-hover"
            data-cursor="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '18px',
              padding: '20px 42px',
              borderRadius: '40px',
              background: 'linear-gradient(135deg, #2b1f14 0%, #170d06 50%, #3a2614 100%)',
              border: '2px solid #ffb703',
              boxShadow:
                '0 15px 45px rgba(0,0,0,0.9), 0 0 35px rgba(255, 183, 3, 0.4), inset 0 0 20px rgba(255, 183, 3, 0.2)',
              color: '#f4ecd8',
              textDecoration: 'none',
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              fontWeight: 900,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
              e.currentTarget.style.borderColor = '#ffffff';
              e.currentTarget.style.boxShadow = '0 25px 60px rgba(0,0,0,0.95), 0 0 50px rgba(255, 183, 3, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = '#ffb703';
              e.currentTarget.style.boxShadow =
                '0 15px 45px rgba(0,0,0,0.9), 0 0 35px rgba(255, 183, 3, 0.4), inset 0 0 20px rgba(255, 183, 3, 0.2)';
            }}
          >
            <span
              className="compass-needle"
              style={{
                display: 'inline-block',
                fontSize: '1.8rem',
                filter: 'drop-shadow(0 0 8px #ffb703)',
              }}
            >
              🧭
            </span>
            <div>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#ffb703', letterSpacing: '0.25em' }}>
                OFFICIAL INSTITUTION PORTAL
              </span>
              <span>EXPLORE MORE • REC CBE</span>
            </div>
            <span
              className="wano-hanko-seal"
              style={{
                width: '32px',
                height: '32px',
                fontSize: '0.9rem',
                background: '#d90429',
                border: '1.5px solid #ffb703',
              }}
            >
              印
            </span>
          </a>
        </div>

        {/* FINAL CREW SCENE: MASTER ARTWORK REVEAL */}
        <div
          className="ship-deck-float"
          style={{
            position: 'relative',
            borderRadius: '28px',
            overflow: 'hidden',
            border: '2px solid rgba(255, 183, 3, 0.5)',
            boxShadow: '0 35px 100px rgba(0,0,0,0.95), 0 0 50px rgba(255, 183, 3, 0.25)',
            marginBottom: '80px',
            backgroundColor: '#05070e',
          }}
        >
          <img
            src="/images/crew_artwork.png"
            alt="CYBITRADIC WANO FEST DEVELOPERS — SUBASH, SATHI, RAJ"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '720px',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(4,5,8,0.2) 0%, transparent 40%, rgba(4,5,8,0.7) 75%, rgba(4,5,8,0.95) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Bottom Grand Line Banner */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '30px',
              textAlign: 'center',
              zIndex: 3,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(6, 8, 14, 0.85)',
                padding: '6px 20px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 183, 3, 0.4)',
                backdropFilter: 'blur(10px)',
                marginBottom: '10px',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: '#ffb703', fontWeight: 800, letterSpacing: '0.2em' }}>
                <a
                  href="https://godofcybertech.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#00e5ff', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  M. SUBASH KUMAR ↗
                </a>{' '}
                • SATHIYASEELAN • RAJ
              </span>
            </div>

            <h4
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1.4rem, 3.2vw, 2.4rem)',
                fontWeight: 900,
                color: '#fff',
                letterSpacing: '0.08em',
                margin: 0,
                textShadow: '0 2px 20px rgba(0,0,0,0.9)',
              }}
            >
              BUILD. EXPLORE. CREATE. TOGETHER.
            </h4>
          </div>
        </div>

        {/* FINAL ANIMATION: OCEAN WAVE & PARCHMENT TO WANOFEST 2026 */}
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'radial-gradient(ellipse at center, rgba(0, 229, 255, 0.08) 0%, transparent 70%)',
            borderTop: '1px dashed rgba(255, 183, 3, 0.3)',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌊 🧭 ⛵</div>
          <div
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: '1.2rem',
              color: '#ffb703',
              letterSpacing: '0.15em',
              marginBottom: '14px',
            }}
          >
            THE COMPASS POINTS TOWARD WANOFEST 2026
          </div>
          <a
            href="#home"
            data-cursor="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#fff',
              padding: '10px 24px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d90429';
              e.currentTarget.style.borderColor = '#ff5a6e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }}
          >
            ⚓ BACK TO THE DECK
          </a>
        </div>
      </div>
    </section>
  );
};
