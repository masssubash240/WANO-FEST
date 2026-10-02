import React, { useState, useEffect, useRef } from 'react';

// ─── SPONSOR DATA ───────────────────────────────────────────
interface Sponsor {
  name: string;
  logo: string;
  url?: string;
  description?: string;
}

const POWERED_BY: Sponsor = {
  name: 'RYUX IN SSREC — LAN CUP 2026',
  logo: '/images/sponsors/ryux_ssrec_lan_cup.png',
  url: 'https://www.youtube.com/@RYUXESPORTS',
  description: 'Tournament Production & Official Esports Partner',
};

const CO_POWERED: Sponsor[] = [
  {
    name: 'CybiTradic Club',
    logo: '/images/sponsor_cybitradic.jpg',
    url: '#',
    description: 'Cybersecurity & Technology Club',
  },
  {
    name: 'SSREC',
    logo: '/images/sponsor_ssrec.jpg',
    url: 'https://reccbe.ac.in/',
    description: 'Sri Sai Ranganathan Engineering College',
  },
];

const OFFICIAL_PARTNERS: Sponsor[] = [
  {
    name: 'Free Fire MAX Community India',
    logo: '/images/sponsor_ffm_community.jpg',
    url: '#',
    description: 'Gaming Partner',
  },
  {
    name: 'RYUX Esports Channel',
    logo: '/images/sponsor_ryux_esports.jpg',
    url: 'https://www.youtube.com/@RYUXESPORTS',
    description: 'Media Partner',
  },
  {
    name: 'CybiTradic Wano Fest',
    logo: '/images/cybitradic-wano-fest-logo.jpg',
    description: 'Event Branding Partner',
  },
  {
    name: 'SSREC Official',
    logo: '/images/ssrec_seal.jpg',
    url: 'https://reccbe.ac.in/',
    description: 'Venue & Institution Partner',
  },
];

const PARTNER_CATEGORIES = [
  'MEDIA PARTNER',
  'GAMING PARTNER',
  'TECH PARTNER',
  'COMMUNITY PARTNER',
];

// ─── SPONSOR LOGO CARD COMPONENT ────────────────────────────
const SponsorCard: React.FC<{
  sponsor: Sponsor;
  size?: 'large' | 'medium' | 'small';
  glowColor?: string;
}> = ({ sponsor, size = 'medium', glowColor = 'rgba(212, 175, 55, 0.4)' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeMap = {
    large: { width: '180px', height: '180px', logoSize: '120px' },
    medium: { width: '140px', height: '140px', logoSize: '90px' },
    small: { width: '120px', height: '120px', logoSize: '75px' },
  };

  const s = sizeMap[size];

  const card = (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        cursor: sponsor.url ? 'pointer' : 'default',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'translateY(-6px) scale(1.05)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Logo Container */}
      <div
        style={{
          width: s.width,
          height: s.height,
          borderRadius: '20px',
          background: 'rgba(15, 10, 25, 0.85)',
          border: `1.5px solid ${isHovered ? 'rgba(212, 175, 55, 0.6)' : 'rgba(255, 255, 255, 0.1)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isHovered
            ? `0 0 30px ${glowColor}, 0 8px 32px rgba(0,0,0,0.6), inset 0 0 20px rgba(212, 175, 55, 0.1)`
            : '0 4px 20px rgba(0,0,0,0.4), inset 0 0 10px rgba(255,255,255,0.02)',
        }}
      >
        {/* Subtle corner accents */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '20px',
          height: '20px',
          borderTop: `2px solid ${isHovered ? '#d4af37' : 'rgba(212, 175, 55, 0.3)'}`,
          borderLeft: `2px solid ${isHovered ? '#d4af37' : 'rgba(212, 175, 55, 0.3)'}`,
          borderRadius: '20px 0 0 0',
          transition: 'all 0.3s ease',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '20px',
          height: '20px',
          borderBottom: `2px solid ${isHovered ? '#d4af37' : 'rgba(212, 175, 55, 0.3)'}`,
          borderRight: `2px solid ${isHovered ? '#d4af37' : 'rgba(212, 175, 55, 0.3)'}`,
          borderRadius: '0 0 20px 0',
          transition: 'all 0.3s ease',
        }} />

        <img
          src={sponsor.logo}
          alt={sponsor.name}
          loading="lazy"
          style={{
            width: s.logoSize,
            height: s.logoSize,
            objectFit: 'contain',
            borderRadius: '12px',
            filter: isHovered
              ? 'brightness(1.2) drop-shadow(0 0 12px rgba(212, 175, 55, 0.5))'
              : 'brightness(0.95) grayscale(0.1)',
            transition: 'all 0.4s ease',
          }}
        />
      </div>

      {/* Sponsor Name */}
      <div style={{ textAlign: 'center', maxWidth: s.width }}>
        <div
          style={{
            fontSize: size === 'large' ? '0.85rem' : '0.75rem',
            fontWeight: 800,
            color: isHovered ? '#d4af37' : '#ffffff',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            transition: 'color 0.3s ease',
            lineHeight: 1.2,
          }}
        >
          {sponsor.name}
        </div>
        {sponsor.description && (
          <div
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.45)',
              letterSpacing: '0.06em',
              marginTop: '3px',
              textTransform: 'uppercase',
            }}
          >
            {sponsor.description}
          </div>
        )}
      </div>
    </div>
  );

  if (sponsor.url) {
    return (
      <a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        {card}
      </a>
    );
  }

  return card;
};

// ─── FUTURISTIC DIVIDER ─────────────────────────────────────
const FuturisticDivider: React.FC = () => (
  <div
    style={{
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
      height: '3px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {/* Left line */}
    <div
      style={{
        flex: 1,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5))',
      }}
    />
    {/* Center diamond */}
    <div
      style={{
        width: '12px',
        height: '12px',
        transform: 'rotate(45deg)',
        background: 'linear-gradient(135deg, #d4af37, #8b6914)',
        border: '1px solid rgba(212, 175, 55, 0.8)',
        boxShadow: '0 0 15px rgba(212, 175, 55, 0.5)',
        margin: '0 16px',
        flexShrink: 0,
      }}
    />
    {/* Center dot left */}
    <div
      style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: '#d90429',
        boxShadow: '0 0 10px rgba(217, 4, 41, 0.6)',
        margin: '0 8px',
        flexShrink: 0,
      }}
    />
    {/* Center diamond 2 */}
    <div
      style={{
        width: '8px',
        height: '8px',
        transform: 'rotate(45deg)',
        background: 'linear-gradient(135deg, #d90429, #8b0000)',
        border: '1px solid rgba(217, 4, 41, 0.6)',
        boxShadow: '0 0 12px rgba(217, 4, 41, 0.4)',
        margin: '0 8px',
        flexShrink: 0,
      }}
    />
    {/* Center dot right */}
    <div
      style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: '#d90429',
        boxShadow: '0 0 10px rgba(217, 4, 41, 0.6)',
        margin: '0 8px',
        flexShrink: 0,
      }}
    />
    {/* Center diamond 3 */}
    <div
      style={{
        width: '12px',
        height: '12px',
        transform: 'rotate(45deg)',
        background: 'linear-gradient(135deg, #d4af37, #8b6914)',
        border: '1px solid rgba(212, 175, 55, 0.8)',
        boxShadow: '0 0 15px rgba(212, 175, 55, 0.5)',
        margin: '0 16px',
        flexShrink: 0,
      }}
    />
    {/* Right line */}
    <div
      style={{
        flex: 1,
        height: '1px',
        background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.5), transparent)',
      }}
    />
  </div>
);

// ─── SECTION LABEL ──────────────────────────────────────────
const SectionLabel: React.FC<{ text: string; accent?: string }> = ({ text, accent = '#d4af37' }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 28px',
      borderRadius: '40px',
      background: `linear-gradient(135deg, ${accent}15, ${accent}08)`,
      border: `1.5px solid ${accent}55`,
      boxShadow: `0 0 20px ${accent}20, inset 0 0 15px ${accent}08`,
    }}
  >
    <span
      style={{
        fontSize: '0.72rem',
        fontWeight: 900,
        letterSpacing: '0.25em',
        color: accent,
        textTransform: 'uppercase',
        fontFamily: 'var(--font-title, system-ui, sans-serif)',
      }}
    >
      {text}
    </span>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN ESPORTS SPONSOR SECTION COMPONENT
// ═══════════════════════════════════════════════════════════════
export const EsportsSponsorSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="esports-sponsors"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        padding: '80px 24px 60px',
        background: 'linear-gradient(180deg, rgba(4, 2, 8, 0.98) 0%, rgba(12, 4, 8, 0.99) 30%, rgba(8, 2, 4, 1) 100%)',
        overflow: 'hidden',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* ─── BACKGROUND EFFECTS ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 20%, rgba(217, 4, 41, 0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 30% 80%, rgba(212, 175, 55, 0.04) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />
      {/* Subtle grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          pointerEvents: 'none',
        }}
      />
      {/* Top scan line */}
      <div className="sponsor-scan-line" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(217, 4, 41, 0.6), rgba(212, 175, 55, 0.6), transparent)',
        boxShadow: '0 0 20px rgba(217, 4, 41, 0.3)',
      }} />

      {/* ─── CONTENT CONTAINER ─── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* ─── FUTURISTIC TOP DIVIDER ─── */}
        <FuturisticDivider />

        {/* ─── MAIN HEADING ─── */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '40px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: '0.4em',
              color: '#d90429',
              textTransform: 'uppercase',
              marginBottom: '12px',
              fontFamily: 'var(--font-title, system-ui, sans-serif)',
            }}
          >
            WANO FEST 2026 • ESPORTS CHAMPIONSHIP
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-title, system-ui, sans-serif)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: '0 0 8px 0',
              background: 'linear-gradient(135deg, #d4af37 0%, #f0d060 25%, #ffffff 50%, #f0d060 75%, #d4af37 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))',
              animation: 'sponsorShimmer 4s linear infinite',
            }}
          >
            OUR SPONSORS & PARTNERS
          </h2>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              color: 'rgba(255, 255, 255, 0.4)',
              textTransform: 'uppercase',
            }}
          >
            RYUX ESPORTS × SSREC LAN CUP 2026
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* ─── POWERED BY (Primary Sponsor) ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div
          style={{
            textAlign: 'center',
            margin: '50px 0 40px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          <SectionLabel text="⚡ POWERED BY ⚡" accent="#d4af37" />

          <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center' }}>
            <SponsorCard
              sponsor={POWERED_BY}
              size="large"
              glowColor="rgba(217, 4, 41, 0.5)"
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* ─── CO-POWERED BY ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div
          style={{
            textAlign: 'center',
            margin: '40px 0',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
          }}
        >
          <SectionLabel text="CO-POWERED BY" accent="#d90429" />

          <div
            style={{
              marginTop: '28px',
              display: 'flex',
              justifyContent: 'center',
              gap: '48px',
              flexWrap: 'wrap',
            }}
          >
            {CO_POWERED.map((sponsor) => (
              <SponsorCard
                key={sponsor.name}
                sponsor={sponsor}
                size="medium"
                glowColor="rgba(217, 4, 41, 0.4)"
              />
            ))}
          </div>
        </div>

        {/* Thin divider */}
        <div style={{ margin: '32px auto', maxWidth: '600px' }}>
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          }} />
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* ─── OFFICIAL PARTNERS ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div
          style={{
            textAlign: 'center',
            margin: '40px 0',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
          }}
        >
          <SectionLabel text="OFFICIAL PARTNERS" accent="#00e5ff" />

          <div
            style={{
              marginTop: '28px',
              display: 'flex',
              justifyContent: 'center',
              gap: '36px',
              flexWrap: 'wrap',
            }}
          >
            {OFFICIAL_PARTNERS.map((sponsor) => (
              <SponsorCard
                key={sponsor.name}
                sponsor={sponsor}
                size="small"
                glowColor="rgba(0, 229, 255, 0.3)"
              />
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* ─── PARTNER CATEGORIES STRIP ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div
          style={{
            textAlign: 'center',
            margin: '44px 0 20px',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {PARTNER_CATEGORIES.map((cat, idx) => (
              <React.Fragment key={cat}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.15em',
                    color: 'rgba(255, 255, 255, 0.35)',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-title, system-ui, sans-serif)',
                  }}
                >
                  {cat}
                </span>
                {idx < PARTNER_CATEGORIES.length - 1 && (
                  <span
                    style={{
                      fontSize: '0.6rem',
                      color: 'rgba(212, 175, 55, 0.5)',
                      margin: '0 4px',
                    }}
                  >
                    •
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* ─── EXPOSURE BENEFITS STRIP ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div
          style={{
            margin: '36px auto 0',
            maxWidth: '800px',
            padding: '16px 24px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1s',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { icon: '🎬', label: 'Event Creative' },
              { icon: '📡', label: 'Broadcast' },
              { icon: '🏟️', label: 'Venue Branding' },
              { icon: '📱', label: 'Social Media' },
              { icon: '🏆', label: 'Award Stage' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '0.85rem' }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: 'rgba(255, 255, 255, 0.4)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              textAlign: 'center',
              marginTop: '10px',
              fontSize: '0.6rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.25)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            SPONSOR EXPOSURE INCLUDES LIVE PRODUCTION • COMMENTARY • SCOREBOARD • HIGHLIGHTS
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* ─── BOTTOM FOOTER ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div style={{ marginTop: '40px' }}>
          <FuturisticDivider />
          <div
            style={{
              textAlign: 'center',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: 'rgba(255, 255, 255, 0.25)',
                textTransform: 'uppercase',
              }}
            >
              In Association With • Powered By • Official Partners
            </div>
            <div
              style={{
                fontSize: '0.58rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.15)',
                marginTop: '6px',
                textTransform: 'uppercase',
              }}
            >
              WANO FEST 2026 © SSREC • ALL RIGHTS RESERVED • PROFESSIONAL COLLEGE LAN ESPORTS CHAMPIONSHIP
            </div>
          </div>
        </div>
      </div>

      {/* ─── ANIMATIONS ─── */}
      <style>{`
        @keyframes sponsorShimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        @keyframes sponsorScanLine {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(calc(100vh + 100%)); opacity: 0; }
        }

        .sponsor-scan-line {
          animation: sponsorScanLine 6s linear infinite;
        }

        @media (max-width: 768px) {
          #esports-sponsors {
            padding: 50px 16px 40px !important;
          }
        }
      `}</style>
    </section>
  );
};
