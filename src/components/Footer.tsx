import React, { useRef, useState, useEffect } from 'react';

const SPONSORS = [
  { name: 'CipherPol Security', emoji: '🛡️' },
  { name: 'Egghead Cyber Labs', emoji: '🔬' },
  { name: 'All Blue Ventures', emoji: '💎' },
  { name: 'Neo-Tokyo Studios', emoji: '🎬' },
  { name: 'Marineford Tech', emoji: '⚙️' },
  { name: 'Grand Line Cloud', emoji: '☁️' },
  { name: 'Thousand Sunny AI', emoji: '🤖' },
  { name: 'Laugh Tale Labs', emoji: '🧪' },
];

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      id="footer"
      ref={footerRef}
      style={{
        position: 'relative',
        backgroundColor: '#040508',
        borderTop: '1px solid rgba(217, 4, 41, 0.25)',
        overflow: 'hidden',
      }}
    >
      {/* ─── ANIMATED BACKGROUND ARTWORK WITH SLOW ZOOM ON ENTER ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <img
          src="/images/grand_line_visuals.jpg"
          alt="The Adventure Starts Here"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center bottom',
            opacity: 0.22,
            transform: isInView ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 8s ease-out, opacity 1.5s ease',
            filter: 'contrast(1.2) brightness(0.7) blur(1px)',
          }}
        />
        {/* Dark Vignette Overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, #040508 0%, rgba(4,5,8,0.7) 40%, rgba(4,5,8,0.92) 85%, #020305 100%)',
          }}
        />
      </div>

      {/* ─── SPONSORS MARQUEE RIBBON ─── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '20px 0',
          overflow: 'hidden',
          background: 'rgba(6, 8, 14, 0.8)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '40px',
            animation: 'marqueeScroll 28s linear infinite',
            whiteSpace: 'nowrap',
            width: 'max-content',
          }}
        >
          {[...SPONSORS, ...SPONSORS].map((sponsor, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 22px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '30px',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{sponsor.emoji}</span>
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#8e9bb4',
                  letterSpacing: '0.1em',
                  whiteSpace: 'nowrap',
                }}
              >
                {sponsor.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── ANIME EPISODE FINALE HERO HEADLINE BANNER ─── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '100px 24px 60px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
          }}
        >
          <span className="wano-hanko-seal" style={{ width: '28px', height: '28px', fontSize: '0.9rem' }}>
            終
          </span>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.3em',
              color: '#ffb703',
              textTransform: 'uppercase',
            }}
          >
            EPISODE FINALE • THE NEXT CHAPTER
          </span>
        </div>

        {/* Huge Cinematic Ending Typography */}
        <h2
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(2.8rem, 8vw, 6.5rem)',
            fontWeight: 900,
            lineHeight: 1.02,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#ffffff',
            margin: '0 0 12px 0',
            textShadow: '0 10px 40px rgba(0,0,0,0.9)',
          }}
        >
          THE ADVENTURE
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #ffb703 0%, #fb8500 50%, #d90429 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 35px rgba(217, 4, 41, 0.6))',
            }}
          >
            STARTS HERE.
          </span>
        </h2>

        <div
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)',
            fontWeight: 900,
            letterSpacing: '0.15em',
            color: '#00e5ff',
            marginBottom: '36px',
            textShadow: '0 0 25px rgba(0, 229, 255, 0.6)',
          }}
        >
          WANO FEST
        </div>

        {/* ─── FINAL BRAND LOGO (WanoFest Primary Logo) ─── */}
        <div
          style={{
            maxWidth: '380px',
            margin: '0 auto 40px auto',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '-20%',
              background: 'radial-gradient(ellipse at center, rgba(0, 229, 255, 0.25) 0%, rgba(217, 4, 41, 0.15) 50%, transparent 75%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }}
          />
          <img
            src="/images/logo.png"
            alt="CybiTradic Wano Fest Primary Logo"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '120px',
              objectFit: 'contain',
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 25px rgba(0, 229, 255, 0.8)) brightness(1.15)',
              maskImage: 'radial-gradient(ellipse 95% 90% at 50% 50%, black 60%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 95% 90% at 50% 50%, black 60%, transparent 100%)',
            }}
          />
        </div>

        {/* ─── SOCIAL LINKS: Instagram, YouTube, LinkedIn, GitHub, Contact ─── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}
        >
          {[
            { label: 'Instagram', icon: '📸', href: 'https://instagram.com' },
            { label: 'YouTube', icon: '▶️', href: 'https://youtube.com' },
            { label: 'LinkedIn', icon: '💼', href: 'https://linkedin.com' },
            { label: 'GitHub', icon: '🐙', href: 'https://github.com' },
            { label: 'Contact', icon: '✉️', href: 'mailto:crew@cybitradic.in' },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="button"
              data-cursor-text={s.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '30px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00e5ff';
                e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ─── BOTTOM COPYRIGHT & ANIME SEALS ─── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '0.82rem', color: '#6b7a9e' }}>
          © 2026 CybiTradic WANO FEST. Grand Line Festival Syndicate. All Rights Reserved.
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem', color: '#ffb703', fontWeight: 800 }}>
          <span>⚔️ FORGED BY NAKAMA</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <span style={{ color: '#00e5ff' }}>TO BE CONTINUED IN WANO</span>
        </div>
      </div>

      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
};
