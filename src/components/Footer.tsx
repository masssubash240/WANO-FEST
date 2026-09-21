import React, { useRef, useState, useEffect } from 'react';
import { Globe, MapPin, Mail, MessageCircle } from 'lucide-react';
import { InstagramIcon as Instagram, YoutubeIcon as Youtube } from './SocialIcons';
import { SITE_CONFIG } from '../data/siteConfig';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          videoRef.current?.play().catch(() => {});
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const socialIcons = [
    { label: 'College Website', icon: <Globe size={18} />, href: SITE_CONFIG.college.website, color: '#00e5ff' },
    { label: 'Campus Maps', icon: <MapPin size={18} />, href: SITE_CONFIG.college.googleMapsUrl, color: '#00e676' },
    { label: 'Official Mail', icon: <Mail size={18} />, href: `mailto:${SITE_CONFIG.college.email}`, color: '#ffb703' },
    { label: 'Instagram', icon: <Instagram size={18} />, href: SITE_CONFIG.college.instagramUrl, color: '#ff4d6d' },
    { label: 'YouTube Stream', icon: <Youtube size={18} />, href: SITE_CONFIG.college.youtubeUrl, color: '#d90429' },
  ];

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
      {/* ─── ANIMATED OCEAN WAVE (Spec Requirement) ─── */}
      <div
        className="footer-wave-container"
        style={{
          position: 'relative',
          width: '100%',
          height: '60px',
          overflow: 'hidden',
          lineHeight: 0,
          background: 'transparent',
          zIndex: 3,
        }}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            position: 'relative',
            display: 'block',
            width: 'calc(100% + 1.3px)',
            height: '60px',
          }}
        >
          <path
            d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,0 L0,0 Z"
            fill="rgba(0, 229, 255, 0.08)"
            className="ocean-wave-layer-1"
          />
          <path
            d="M0,0 C200,70 420,-30 600,50 C800,120 1000,20 1200,40 L1200,0 L0,0 Z"
            fill="rgba(217, 4, 41, 0.06)"
            className="ocean-wave-layer-2"
          />
          <path
            d="M0,0 C300,50 550,10 750,65 C950,110 1100,30 1200,50 L1200,0 L0,0 Z"
            fill="rgba(255, 183, 3, 0.07)"
            className="ocean-wave-layer-3"
          />
        </svg>
      </div>

      {/* ─── ANIMATED BACKGROUND VIDEO (luffy2.mp4) WITH CINEMATIC GLOW ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <video
          ref={videoRef}
          src="/luffy2.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.38,
            transform: isInView ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 8s ease-out, opacity 1.5s ease',
            filter: 'contrast(1.15) brightness(0.85)',
          }}
        />
        {/* Backup Visual Image */}
        <img
          src="/images/grand_line_visuals.jpg"
          alt="The Adventure Starts Here"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center bottom',
            opacity: 0.08,
            pointerEvents: 'none',
          }}
        />
        {/* Dark Vignette Overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, #040508 0%, rgba(4,5,8,0.55) 25%, rgba(4,5,8,0.72) 70%, #020305 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(217, 4, 41, 0.12) 0%, rgba(0, 229, 255, 0.08) 40%, transparent 75%)',
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
          padding: '80px 24px 40px 24px',
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
            fontSize: 'clamp(2.6rem, 7vw, 5.5rem)',
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

        {/* Tagline: Anime × Technology × Opportunity */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 24px',
            borderRadius: '30px',
            backgroundColor: 'rgba(0, 229, 255, 0.08)',
            border: '1.5px solid rgba(0, 229, 255, 0.35)',
            marginBottom: '32px',
            boxShadow: '0 0 25px rgba(0, 229, 255, 0.15)',
          }}
        >
          <span style={{ color: '#ffd166', fontSize: '0.9rem' }}>⚔️</span>
          <span
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(0.9rem, 2vw, 1.15rem)',
              fontWeight: 900,
              letterSpacing: '0.14em',
              color: '#ffffff',
              textTransform: 'uppercase',
            }}
          >
            {SITE_CONFIG.college.tagline}
          </span>
          <span style={{ color: '#ffd166', fontSize: '0.9rem' }}>🏴‍☠️</span>
        </div>

        {/* ─── FINAL BRAND LOGO (WanoFest Primary Logo) ─── */}
        <div
          style={{
            maxWidth: '320px',
            margin: '0 auto 36px auto',
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
              maxHeight: '100px',
              objectFit: 'contain',
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 25px rgba(0, 229, 255, 0.8)) brightness(1.15)',
            }}
          />
        </div>

        {/* ─── SMALL ICON ROW: Website, Maps, Mail, Instagram, YouTube, WhatsApp ─── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            marginBottom: '36px',
          }}
        >
          {socialIcons.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="footer-icon-circle"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                textDecoration: 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = item.color;
                e.currentTarget.style.backgroundColor = `${item.color}22`;
                e.currentTarget.style.color = item.color;
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.12)';
                e.currentTarget.style.boxShadow = `0 0 20px ${item.color}66`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              title={item.label}
            >
              {item.icon}
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
          © 2026 {SITE_CONFIG.college.name}. CybiTradic WANO FEST. All Rights Reserved.
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

