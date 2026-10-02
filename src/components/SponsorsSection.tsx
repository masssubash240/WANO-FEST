import React, { useState } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import type { SponsorItem } from '../data/sponsorData';
import { SPONSOR_CATEGORIES } from '../data/sponsorData';



interface SponsorsSectionProps {
  onNavigateContact?: () => void;
}

export const SponsorsSection: React.FC<SponsorsSectionProps> = ({ onNavigateContact }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredSponsor, setHoveredSponsor] = useState<string | null>(null);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateContact) {
      onNavigateContact();
    } else {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = 'contact';
      }
    }
  };

  const filteredCategories =
    activeCategory === 'all'
      ? SPONSOR_CATEGORIES
      : SPONSOR_CATEGORIES.filter((c) => c.id === activeCategory);

  return (
    <section
      id="sponsors"
      aria-label="Wano Fest Sponsors & Partners"
      style={{
        position: 'relative',
        padding: '110px 0 120px',
        backgroundColor: '#05070c',
        backgroundImage: `
          radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 15% 40%, rgba(255, 46, 77, 0.07) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 70%, rgba(0, 229, 255, 0.06) 0%, transparent 50%),
          linear-gradient(180deg, #040609 0%, #080c14 50%, #040609 100%)
        `,
        overflow: 'hidden',
      }}
    >
      {/* ─── FUTURISTIC CYBER GRID OVERLAY ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* ─── GLOWING ACCENT LINES (TOP & BOTTOM) ─── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 46, 77, 0.5), rgba(212, 175, 55, 0.8), rgba(0, 229, 255, 0.5), transparent)',
          boxShadow: '0 0 15px rgba(212, 175, 55, 0.5)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '15%',
          right: '15%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), rgba(255, 46, 77, 0.6), transparent)',
        }}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* ─── SECTION HEADER ─── */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          {/* Cyberpunk Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '24px',
              background: 'linear-gradient(90deg, rgba(255, 46, 77, 0.15), rgba(212, 175, 55, 0.15))',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.15)',
              marginBottom: '18px',
            }}
          >
            <Sparkles size={15} color="#d4af37" />
            <span
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.22em',
                color: '#d4af37',
                textTransform: 'uppercase',
              }}
            >
              Industry Alliance & Backing
            </span>
          </div>

          {/* Section Main Heading */}
          <h2
            style={{
              fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
              fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              margin: '0 0 14px 0',
              background: 'linear-gradient(135deg, #ffffff 0%, #f7d070 50%, #ff4655 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(212, 175, 55, 0.25)',
              lineHeight: 1.15,
            }}
          >
            OUR SPONSORS &amp; PARTNERS
          </h2>

          {/* Cyber Subtitle */}
          <p
            style={{
              maxWidth: '680px',
              margin: '0 auto 32px',
              color: 'rgba(255, 255, 255, 0.72)',
              fontSize: 'clamp(0.92rem, 1.3vw, 1.08rem)',
              lineHeight: 1.6,
              fontFamily: "'Rajdhani', system-ui, sans-serif",
              fontWeight: 600,
              letterSpacing: '0.03em',
            }}
          >
            Empowering the next generation of cybersecurity commanders, esports champions,
            and innovators at <span style={{ color: '#00e5ff', fontWeight: 800 }}>WANO FEST 2026</span>.
          </p>

          {/* Category Filter Pills (Desktop & Tablet) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '20px',
            }}
          >
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                border:
                  activeCategory === 'all'
                    ? '1.5px solid #d4af37'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                background:
                  activeCategory === 'all'
                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(255, 46, 77, 0.25))'
                    : 'rgba(255, 255, 255, 0.03)',
                color: activeCategory === 'all' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                boxShadow:
                  activeCategory === 'all' ? '0 0 20px rgba(212, 175, 55, 0.3)' : 'none',
              }}
            >
              ALL CATEGORIES
            </button>
            {SPONSOR_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  border:
                    activeCategory === cat.id
                      ? `1.5px solid ${cat.accent}`
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  background:
                    activeCategory === cat.id
                      ? `rgba(255, 255, 255, 0.1)`
                      : 'rgba(255, 255, 255, 0.03)',
                  color: activeCategory === cat.id ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                  boxShadow:
                    activeCategory === cat.id ? `0 0 20px ${cat.glow}` : 'none',
                }}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* ─── LIVE RUNNING ANIMATED SPONSOR TICKER ─── */}
          <div
            style={{
              marginTop: '36px',
              position: 'relative',
              width: '100%',
              overflow: 'hidden',
              padding: '10px 0',
              borderRadius: '12px',
              background: 'rgba(8, 12, 22, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), inset 0 0 15px rgba(212, 175, 55, 0.06)',
              maskImage: 'linear-gradient(to right, transparent 0%, black 50px, black calc(100% - 50px), transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 50px, black calc(100% - 50px), transparent 100%)',
            }}
          >
            <div className="sponsor-running-track" style={{ gap: '12px', alignItems: 'center' }}>
              {[
                ...SPONSOR_CATEGORIES.flatMap((c) => c.items),
                ...SPONSOR_CATEGORIES.flatMap((c) => c.items),
              ].map((sp, idx) => {
                const Tag = sp.url ? 'a' : 'div';
                return (
                  <Tag
                    key={`run-${sp.name}-${idx}`}
                    href={sp.url}
                    target={sp.url ? '_blank' : undefined}
                    rel={sp.url ? 'noopener noreferrer' : undefined}
                    title={`${sp.name} (${sp.category})`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      height: '30px',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: '#ffffff',
                      textDecoration: 'none',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      cursor: sp.url ? 'pointer' : 'default',
                    }}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 0 14px rgba(255, 46, 77, 0.7)';
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.transform = 'scale(1) translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
                    }}
                  >
                    <img
                      src={sp.logo}
                      alt={sp.name}
                      style={{
                        height: '20px',
                        maxWidth: '75px',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.64rem',
                        fontWeight: 900,
                        color: '#0d111b',
                        letterSpacing: '0.04em',
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
        </div>

        {/* ─── CATEGORIES CONTAINER ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '54px' }}>
          {filteredCategories.map((category) => {
            const IconComp = category.icon;
            const isMedia = category.id === 'media-mentions';

            return (
              <div
                key={category.id}
                style={{
                  position: 'relative',
                  background: 'rgba(10, 14, 22, 0.65)',
                  borderRadius: '18px',
                  padding: '36px 28px 38px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Cyber Corner Decors */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-1px',
                    left: '24px',
                    width: '40px',
                    height: '2px',
                    background: category.accent,
                    boxShadow: `0 0 10px ${category.accent}`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    right: '24px',
                    width: '40px',
                    height: '2px',
                    background: category.accent,
                    boxShadow: `0 0 10px ${category.accent}`,
                  }}
                />

                {/* Category Header Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '28px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `radial-gradient(circle, ${category.accent}25, rgba(0,0,0,0.4))`,
                        border: `1.5px solid ${category.accent}88`,
                        boxShadow: `0 0 16px ${category.glow}`,
                      }}
                    >
                      <IconComp size={20} color={category.accent} />
                    </div>
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '1.25rem',
                          fontWeight: 900,
                          letterSpacing: '0.12em',
                          fontFamily: "'Space Grotesk', system-ui, sans-serif",
                          color: '#ffffff',
                          textTransform: 'uppercase',
                        }}
                      >
                        {category.title}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          color: 'rgba(255, 255, 255, 0.55)',
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
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '4px 12px',
                      borderRadius: '14px',
                      border: `1px solid ${category.accent}44`,
                      textTransform: 'uppercase',
                    }}
                  >
                    {category.items.length} {category.items.length === 1 ? 'Partner' : 'Partners'}
                  </span>
                </div>

                {/* ─── MEDIA MENTIONS SPECIAL LOGO WALL / GRID ─── */}
                {isMedia ? (
                  <div>
                    {/* Media Grid Cards */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
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
                          compact
                        />
                      ))}
                    </div>

                    {/* Full Panorama Press Strip Banner */}
                    <div
                      style={{
                        marginTop: '22px',
                        padding: '12px 18px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src="/images/sponsors/media_wall_strip.png"
                        alt="National Press & Media Mentions for Wano Fest"
                        style={{
                          width: '100%',
                          maxHeight: '52px',
                          objectFit: 'contain',
                          display: 'block',
                          filter: 'contrast(1.08)',
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  /* ─── STANDARD SPONSOR GRID (4-5 desktop, 3 tablet, 2 mobile) ─── */
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
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
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── CTA AT THE END ─── */}
        <div
          style={{
            marginTop: '70px',
            position: 'relative',
            borderRadius: '20px',
            padding: '48px 32px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(18, 22, 34, 0.9) 0%, rgba(26, 12, 18, 0.9) 100%)',
            border: '1.5px solid rgba(212, 175, 55, 0.35)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 46, 77, 0.15)',
            backdropFilter: 'blur(16px)',
            overflow: 'hidden',
          }}
        >
          {/* Futuristic ambient corner lights */}
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '280px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, transparent 70%)',
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }}
          />

          <h3
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(1.6rem, 3.2vw, 2.5rem)',
              fontWeight: 900,
              letterSpacing: '0.06em',
              color: '#ffffff',
              margin: '0 0 12px 0',
              textTransform: 'uppercase',
            }}
          >
            WANT TO PARTNER WITH WANO FEST?
          </h3>

          <p
            style={{
              maxWidth: '620px',
              margin: '0 auto 30px',
              color: 'rgba(255, 255, 255, 0.72)',
              fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)',
              lineHeight: 1.6,
              fontFamily: "'Rajdhani', system-ui, sans-serif",
              fontWeight: 600,
            }}
          >
            Showcase your brand to thousands of elite engineering talent, cybersecurity researchers,
            and esports athletes across India. Customized sponsorship tiers and exhibition arenas available.
          </p>

          <a
            href="#contact"
            onClick={handleCtaClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 36px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff2e4d 0%, #d4af37 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: '0.96rem',
              fontWeight: 900,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              boxShadow: '0 10px 30px rgba(255, 46, 77, 0.4), 0 0 25px rgba(212, 175, 55, 0.3)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)';
              e.currentTarget.style.boxShadow =
                '0 15px 40px rgba(255, 46, 77, 0.6), 0 0 35px rgba(212, 175, 55, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow =
                '0 10px 30px rgba(255, 46, 77, 0.4), 0 0 25px rgba(212, 175, 55, 0.3)';
            }}
          >
            <span>BECOME A SPONSOR</span>
            <span style={{ fontSize: '1.2rem', transition: 'transform 0.25s ease' }}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

// ─── INDIVIDUAL SPONSOR CARD COMPONENT ──────────────────────────
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

  const content = (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: compact ? '14px 12px' : '18px 14px',
        borderRadius: '12px',
        background: isHovered
          ? 'linear-gradient(180deg, rgba(25, 32, 48, 0.92) 0%, rgba(16, 22, 34, 0.95) 100%)'
          : 'linear-gradient(180deg, rgba(14, 18, 28, 0.8) 0%, rgba(10, 14, 22, 0.85) 100%)',
        border: isHovered
          ? `1.5px solid ${accent}`
          : '1px solid rgba(255, 255, 255, 0.09)',
        boxShadow: isHovered
          ? `0 14px 30px rgba(0, 0, 0, 0.85), 0 0 20px ${accent}44`
          : '0 6px 18px rgba(0, 0, 0, 0.45)',
        transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: isClickable ? 'pointer' : 'default',
        textDecoration: 'none',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Subtle Cyber Notches */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '16px',
          right: '16px',
          height: '2px',
          background: isHovered ? accent : 'transparent',
          transition: 'all 250ms ease',
          boxShadow: isHovered ? `0 0 8px ${accent}` : 'none',
        }}
      />

      {/* External Link Indicator if clickable */}
      {isClickable && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            color: isHovered ? accent : 'rgba(255, 255, 255, 0.3)',
            transition: 'color 250ms ease',
          }}
          title={`Visit ${sponsor.name}`}
        >
          <ExternalLink size={12} />
        </div>
      )}

      {/* High-Contrast Crisp Logo Showcase Container (Compact Size) */}
      <div
        style={{
          width: '100%',
          height: compact ? '48px' : '58px',
          borderRadius: '8px',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: compact ? '6px 10px' : '8px 12px',
          boxSizing: 'border-box',
          boxShadow: isHovered
            ? '0 6px 16px rgba(0, 0, 0, 0.35), inset 0 0 0 1px rgba(0, 0, 0, 0.08)'
            : '0 3px 10px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(0, 0, 0, 0.05)',
          transition: 'all 250ms ease',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        <img
          src={sponsor.logo}
          alt={`${sponsor.name} Official Logo`}
          loading="lazy"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))',
            transition: 'transform 250ms ease',
          }}
        />
      </div>

      {/* Name and Tagline */}
      <div style={{ marginTop: '10px', textAlign: 'center', width: '100%' }}>
        <h4
          style={{
            margin: '0 0 3px 0',
            fontSize: compact ? '0.78rem' : '0.86rem',
            fontWeight: 800,
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            color: '#ffffff',
            letterSpacing: '0.04em',
          }}
        >
          {sponsor.name}
        </h4>
        {sponsor.tagline && (
          <p
            style={{
              margin: 0,
              fontSize: '0.68rem',
              color: isHovered ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.52)',
              fontFamily: "'Rajdhani', system-ui, sans-serif",
              fontWeight: 600,
              lineHeight: 1.3,
              letterSpacing: '0.02em',
              transition: 'color 250ms ease',
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
        aria-label={`Visit ${sponsor.name} website (opens in new tab)`}
      >
        {content}
      </a>
    );
  }

  return content;
};
