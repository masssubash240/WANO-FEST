import React, { useState, useEffect } from 'react';
import { ExternalLink, Sparkles, Building2, Flame, Globe2, Award, Newspaper, ArrowLeft, Star } from 'lucide-react';
import { SPONSOR_CATEGORIES } from '../data/sponsorData';
import type { SponsorItem } from '../data/sponsorData';

// All sponsor logos flattened for the hero marquee
const ALL_LOGOS = SPONSOR_CATEGORIES.flatMap((c) => c.items);

interface SponsorsPageProps {
  onBackToHome: () => void;
  onNavigateContact?: () => void;
}

export const SponsorsPage: React.FC<SponsorsPageProps> = ({ onBackToHome, onNavigateContact }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredSponsor, setHoveredSponsor] = useState<string | null>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const filteredCategories =
    activeCategory === 'all'
      ? SPONSOR_CATEGORIES
      : SPONSOR_CATEGORIES.filter((c) => c.id === activeCategory);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateContact) {
      onNavigateContact();
    } else {
      window.location.hash = 'contact';
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#040608',
        backgroundImage: `
          radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 55%),
          radial-gradient(ellipse at 10% 30%, rgba(255, 46, 77, 0.08) 0%, transparent 45%),
          radial-gradient(ellipse at 90% 70%, rgba(0, 229, 255, 0.07) 0%, transparent 45%),
          linear-gradient(180deg, #04060a 0%, #080c16 60%, #04060a 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ─── CYBER GRID OVERLAY ─── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ─── HERO SECTION ─── */}
      <section
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '120px 24px 80px',
          textAlign: 'center',
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Back button */}
        <button
          onClick={onBackToHome}
          style={{
            position: 'absolute',
            top: '90px',
            left: '28px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: 'rgba(255, 255, 255, 0.75)',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)';
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
            e.currentTarget.style.color = '#d4af37';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
          }}
        >
          <ArrowLeft size={14} />
          BACK HOME
        </button>

        {/* Eyebrow badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 20px',
            borderRadius: '30px',
            background: 'linear-gradient(90deg, rgba(255, 46, 77, 0.15), rgba(212, 175, 55, 0.18))',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            boxShadow: '0 0 24px rgba(212, 175, 55, 0.18)',
            marginBottom: '20px',
          }}
        >
          <Star size={14} color="#d4af37" fill="#d4af37" />
          <span
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: '0.76rem',
              fontWeight: 900,
              letterSpacing: '0.22em',
              color: '#d4af37',
              textTransform: 'uppercase',
            }}
          >
            WANO FEST 2026 — INDUSTRY ALLIANCE
          </span>
          <Star size={14} color="#d4af37" fill="#d4af37" />
        </div>

        {/* Page Title */}
        <h1
          style={{
            fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
            fontSize: 'clamp(2.4rem, 6vw, 5rem)',
            fontWeight: 900,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            margin: '0 0 16px 0',
            background: 'linear-gradient(135deg, #ffffff 0%, #f7d070 45%, #ff4655 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.12,
          }}
        >
          OUR SPONSORS
          <br />
          <span style={{ fontSize: '0.58em', letterSpacing: '0.16em' }}>& PARTNERS</span>
        </h1>

        <p
          style={{
            maxWidth: '700px',
            margin: '0 auto 40px',
            color: 'rgba(255, 255, 255, 0.68)',
            fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
            lineHeight: 1.65,
            fontFamily: "'Rajdhani', system-ui, sans-serif",
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          The titans of industry, government innovators, and media powerhouses who stand behind{' '}
          <span style={{ color: '#00e5ff', fontWeight: 800 }}>WANO FEST 2026</span> — empowering
          India's next generation of{' '}
          <span style={{ color: '#d4af37', fontWeight: 800 }}>
            cybersecurity commanders, esports champions, and innovators.
          </span>
        </p>

        {/* ─── HERO STATS ROW ─── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '48px',
          }}
        >
          {[
            { value: `${ALL_LOGOS.length}+`, label: 'Partners & Sponsors' },
            { value: '5', label: 'Categories' },
            { value: '8', label: 'Media Outlets' },
            { value: '3', label: 'Govt. Initiatives' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                backdropFilter: 'blur(12px)',
                textAlign: 'center',
                minWidth: '120px',
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  fontWeight: 900,
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  background: 'linear-gradient(135deg, #d4af37, #ff4655)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'rgba(255, 255, 255, 0.55)',
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginTop: '4px',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ─── ANIMATED MARQUEE HERO STRIP ─── */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            background: 'rgba(6, 10, 18, 0.92)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.8), 0 0 30px rgba(212, 175, 55, 0.08), inset 0 0 20px rgba(0,0,0,0.5)',
            padding: '14px 0',
            maskImage: 'linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent)',
          }}
        >
          {/* Top gold accent line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '8%',
              right: '8%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #d4af37, #ff4655, #00e5ff, transparent)',
              boxShadow: '0 0 12px rgba(212, 175, 55, 0.6)',
            }}
          />

          {/* Label */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '16px',
              transform: 'translateY(-50%)',
              zIndex: 3,
              background: 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(255,46,77,0.2))',
              border: '1px solid rgba(212,175,55,0.4)',
              borderRadius: '8px',
              padding: '4px 10px',
            }}
          >
            <span
              style={{
                fontSize: '0.6rem',
                fontWeight: 900,
                letterSpacing: '0.16em',
                color: '#d4af37',
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              ⚡ POWERED BY
            </span>
          </div>

          {/* Rolling logos */}
          <div className="sponsor-running-track" style={{ gap: '10px', alignItems: 'center', paddingLeft: '100px' }}>
            {[...ALL_LOGOS, ...ALL_LOGOS].map((sp, idx) => {
              const Tag = sp.url ? 'a' : 'div';
              return (
                <Tag
                  key={`hero-${sp.name}-${idx}`}
                  href={sp.url}
                  target={sp.url ? '_blank' : undefined}
                  rel={sp.url ? 'noopener noreferrer' : undefined}
                  title={sp.name}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '36px',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    textDecoration: 'none',
                    flexShrink: 0,
                    cursor: sp.url ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 0 18px rgba(212, 175, 55, 0.7)';
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.35)';
                  }}
                >
                  <img
                    src={sp.logo}
                    alt={sp.name}
                    style={{
                      height: '22px',
                      maxWidth: '80px',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      color: '#0d111b',
                      letterSpacing: '0.03em',
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {sp.name.split('—')[0].trim()}
                  </span>
                </Tag>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,46,77,0.5), rgba(212,175,55,0.8), rgba(0,229,255,0.5), transparent)',
            boxShadow: '0 0 20px rgba(212,175,55,0.25)',
            marginBottom: '48px',
          }}
        />
      </div>

      {/* ─── CATEGORY FILTERS ─── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1280px',
          margin: '0 auto 48px',
          padding: '0 24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <button
          onClick={() => setActiveCategory('all')}
          style={{
            padding: '9px 22px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.09em',
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            border: activeCategory === 'all' ? '1.5px solid #d4af37' : '1px solid rgba(255,255,255,0.12)',
            background:
              activeCategory === 'all'
                ? 'linear-gradient(135deg, rgba(212,175,55,0.22), rgba(255,46,77,0.22))'
                : 'rgba(255,255,255,0.03)',
            color: activeCategory === 'all' ? '#ffffff' : 'rgba(255,255,255,0.62)',
            boxShadow: activeCategory === 'all' ? '0 0 22px rgba(212,175,55,0.28)' : 'none',
          }}
        >
          ALL CATEGORIES
        </button>
        {SPONSOR_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '7px 16px',
              borderRadius: '10px',
              fontSize: '0.76rem',
              fontWeight: 800,
              letterSpacing: '0.09em',
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              border:
                activeCategory === cat.id ? `1.5px solid ${cat.accent}` : '1px solid rgba(255,255,255,0.1)',
              background:
                activeCategory === cat.id ? `rgba(255,255,255,0.1)` : 'rgba(255,255,255,0.03)',
              color: activeCategory === cat.id ? '#ffffff' : 'rgba(255,255,255,0.62)',
              boxShadow: activeCategory === cat.id ? `0 0 20px ${cat.glow}` : 'none',
            }}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* ─── SPONSOR CATEGORY GRIDS ─── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px 80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
        }}
      >
        {filteredCategories.map((category) => {
          const IconComp = category.icon;
          const isMedia = category.id === 'media-mentions';

          return (
            <div
              key={category.id}
              style={{
                position: 'relative',
                background: 'rgba(10, 14, 22, 0.7)',
                borderRadius: '20px',
                padding: '38px 30px 40px',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              {/* Corner accent lines */}
              <div
                style={{
                  position: 'absolute',
                  top: '-1px',
                  left: '28px',
                  width: '50px',
                  height: '2px',
                  background: category.accent,
                  boxShadow: `0 0 12px ${category.accent}`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-1px',
                  right: '28px',
                  width: '50px',
                  height: '2px',
                  background: category.accent,
                  boxShadow: `0 0 10px ${category.accent}`,
                }}
              />

              {/* Category header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '30px',
                  paddingBottom: '18px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `radial-gradient(circle, ${category.accent}28, rgba(0,0,0,0.4))`,
                      border: `1.5px solid ${category.accent}88`,
                      boxShadow: `0 0 18px ${category.glow}`,
                    }}
                  >
                    <IconComp size={22} color={category.accent} />
                  </div>
                  <div>
                    <h2
                      style={{
                        margin: '0 0 2px 0',
                        fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                        fontWeight: 900,
                        letterSpacing: '0.12em',
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        color: '#ffffff',
                        textTransform: 'uppercase',
                      }}
                    >
                      {category.title}
                    </h2>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.52)',
                        fontFamily: "'Rajdhani', system-ui, sans-serif",
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {category.subtitle}
                    </span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    color: category.accent,
                    background: 'rgba(255,255,255,0.04)',
                    padding: '4px 14px',
                    borderRadius: '16px',
                    border: `1px solid ${category.accent}44`,
                    textTransform: 'uppercase',
                  }}
                >
                  {category.items.length}{' '}
                  {category.items.length === 1 ? 'Partner' : 'Partners'}
                </span>
              </div>

              {/* Sponsor cards grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMedia
                    ? 'repeat(auto-fit, minmax(160px, 1fr))'
                    : 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px',
                }}
              >
                {category.items.map((sponsor) => (
                  <SponsorCard
                    key={sponsor.name}
                    sponsor={sponsor}
                    categoryAccent={category.accent}
                    isHovered={hoveredSponsor === sponsor.name}
                    onHover={() => setHoveredSponsor(sponsor.name)}
                    onLeave={() => setHoveredSponsor(null)}
                    compact={isMedia}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── BECOME A SPONSOR CTA ─── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '900px',
          margin: '0 auto 80px',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            borderRadius: '22px',
            padding: '56px 40px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(18,22,34,0.92) 0%, rgba(26,12,18,0.92) 100%)',
            border: '1.5px solid rgba(212,175,55,0.35)',
            boxShadow: '0 30px 70px rgba(0,0,0,0.8), 0 0 50px rgba(255,46,77,0.12)',
            backdropFilter: 'blur(18px)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Ambient light top */}
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '320px',
              height: '90px',
              background: 'radial-gradient(circle, rgba(212,175,55,0.28) 0%, transparent 70%)',
              filter: 'blur(24px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '18px',
                padding: '5px 16px',
                borderRadius: '20px',
                background: 'rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.3)',
              }}
            >
              <Sparkles size={14} color="#d4af37" />
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  color: '#d4af37',
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  textTransform: 'uppercase',
                }}
              >
                PARTNERSHIP OPPORTUNITIES
              </span>
            </div>

            <h3
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(1.7rem, 3.5vw, 2.8rem)',
                fontWeight: 900,
                letterSpacing: '0.06em',
                color: '#ffffff',
                margin: '0 0 14px 0',
                textTransform: 'uppercase',
              }}
            >
              WANT TO PARTNER WITH WANO FEST?
            </h3>

            <p
              style={{
                maxWidth: '620px',
                margin: '0 auto 32px',
                color: 'rgba(255,255,255,0.7)',
                fontSize: 'clamp(0.92rem, 1.2vw, 1.06rem)',
                lineHeight: 1.65,
                fontFamily: "'Rajdhani', system-ui, sans-serif",
                fontWeight: 600,
              }}
            >
              Showcase your brand to thousands of elite engineering talent, cybersecurity researchers,
              and esports athletes across India. Customized sponsorship tiers available.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="#contact"
                onClick={handleContactClick}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 38px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ff2e4d 0%, #d4af37 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontSize: '0.96rem',
                  fontWeight: 900,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  boxShadow: '0 10px 30px rgba(255,46,77,0.4), 0 0 25px rgba(212,175,55,0.3)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(255,46,77,0.6), 0 0 35px rgba(212,175,55,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,46,77,0.4), 0 0 25px rgba(212,175,55,0.3)';
                }}
              >
                <span>BECOME A SPONSOR</span>
                <span style={{ fontSize: '1.1rem' }}>→</span>
              </a>
              <button
                onClick={onBackToHome}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.8)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }}
              >
                ← BACK TO HOME
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SPONSOR CARD SUB-COMPONENT ──────────────────────────────────────────────
interface SponsorCardProps {
  sponsor: SponsorItem;
  categoryAccent: string;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  compact?: boolean;
}

const SponsorCard: React.FC<SponsorCardProps> = ({
  sponsor,
  categoryAccent,
  isHovered,
  onHover,
  onLeave,
  compact = false,
}) => {
  const isClickable = Boolean(sponsor.url && sponsor.url !== '#');
  const accent = sponsor.accentColor || categoryAccent;

  const cardContent = (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: compact ? '14px 12px' : '20px 16px',
        borderRadius: '14px',
        background: isHovered
          ? 'linear-gradient(180deg, rgba(26,34,52,0.95) 0%, rgba(18,22,34,0.98) 100%)'
          : 'linear-gradient(180deg, rgba(14,18,28,0.82) 0%, rgba(10,14,22,0.88) 100%)',
        border: isHovered ? `1.5px solid ${accent}` : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isHovered
          ? `0 16px 36px rgba(0,0,0,0.85), 0 0 22px ${accent}44`
          : '0 6px 18px rgba(0,0,0,0.45)',
        transform: isHovered ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 260ms cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: isClickable ? 'pointer' : 'default',
        height: '100%',
        boxSizing: 'border-box',
        textDecoration: 'none',
      }}
    >
      {/* Top glow bar on hover */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '18px',
          right: '18px',
          height: '2px',
          background: isHovered ? accent : 'transparent',
          transition: 'all 260ms ease',
          boxShadow: isHovered ? `0 0 10px ${accent}` : 'none',
          borderRadius: '2px',
        }}
      />

      {/* External link icon */}
      {isClickable && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            color: isHovered ? accent : 'rgba(255,255,255,0.28)',
            transition: 'color 260ms ease',
          }}
        >
          <ExternalLink size={12} />
        </div>
      )}

      {/* Logo container */}
      <div
        style={{
          width: '100%',
          height: compact ? '52px' : '64px',
          borderRadius: '10px',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: compact ? '7px 12px' : '10px 14px',
          boxSizing: 'border-box',
          boxShadow: isHovered
            ? '0 6px 18px rgba(0,0,0,0.35)'
            : '0 3px 10px rgba(0,0,0,0.25)',
          transition: 'all 260ms ease',
          transform: isHovered ? 'scale(1.03)' : 'scale(1)',
        }}
      >
        <img
          src={sponsor.logo}
          alt={`${sponsor.name} Logo`}
          loading="lazy"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* Name + tagline */}
      <div style={{ marginTop: '12px', textAlign: 'center', width: '100%' }}>
        <h3
          style={{
            margin: '0 0 3px 0',
            fontSize: compact ? '0.78rem' : '0.88rem',
            fontWeight: 800,
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            color: '#ffffff',
            letterSpacing: '0.04em',
          }}
        >
          {sponsor.name}
        </h3>
        {sponsor.tagline && (
          <p
            style={{
              margin: 0,
              fontSize: '0.69rem',
              color: isHovered ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.5)',
              fontFamily: "'Rajdhani', system-ui, sans-serif",
              fontWeight: 600,
              lineHeight: 1.35,
              letterSpacing: '0.02em',
              transition: 'color 260ms ease',
            }}
          >
            {sponsor.tagline}
          </p>
        )}
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
        aria-label={`Visit ${sponsor.name} (opens in new tab)`}
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};
