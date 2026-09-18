import React from 'react';
import { CHARACTER_CARDS } from '../data/eventData';

export const CharacterShowcase: React.FC = () => {
  const getIconSvg = (type: string, color: string) => {
    switch (type) {
      case 'cloud':
        return (
          <svg viewBox="0 0 40 40" fill="none" width="38" height="38">
            <circle cx="20" cy="20" r="18" fill={`${color}22`} stroke={color} strokeWidth="1.5" />
            <path d="M12 26 C10 26 8 24 8 22 C8 20 10 18 12 18 C12 16 14 14 17 14 C20 14 22 16.5 22 18 C24 18 26 20 26 22 C26 24 24 26 22 26 Z" fill={color} opacity="0.9" />
            <circle cx="20" cy="15" r="4" fill={`${color}`} opacity="0.7" />
          </svg>
        );
      case 'skull':
        return (
          <svg viewBox="0 0 40 40" fill="none" width="38" height="38">
            <circle cx="20" cy="20" r="18" fill={`${color}22`} stroke={color} strokeWidth="1.5" />
            <circle cx="20" cy="18" r="9" fill={color} opacity="0.85" />
            <circle cx="17" cy="17" r="2.5" fill="#06080e" />
            <circle cx="23" cy="17" r="2.5" fill="#06080e" />
            <path d="M17 24 L17 26 L19 26 L19 24 M21 24 L21 26 L23 26 L23 24" stroke="#06080e" strokeWidth="1.5" />
            <path d="M16 27 L16 28 L24 28 L24 27" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case 'sun':
        return (
          <svg viewBox="0 0 40 40" fill="none" width="38" height="38">
            <circle cx="20" cy="20" r="18" fill={`${color}22`} stroke={color} strokeWidth="1.5" />
            <circle cx="20" cy="20" r="7" fill={color} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
              <line key={i} x1="20" y1="20"
                x2={20 + 13 * Math.cos(a * Math.PI / 180)}
                y2={20 + 13 * Math.sin(a * Math.PI / 180)}
                stroke={color} strokeWidth="2" strokeLinecap="round"
                opacity="0.7"
              />
            ))}
          </svg>
        );
      case 'flame':
        return (
          <svg viewBox="0 0 40 40" fill="none" width="38" height="38">
            <circle cx="20" cy="20" r="18" fill={`${color}22`} stroke={color} strokeWidth="1.5" />
            <path d="M20 8 C20 8 26 14 26 20 C26 24 24 27 22 27 C22 22 18 20 18 20 C18 20 20 24 18 27 C16 27 14 24 14 20 C14 14 20 8 20 8 Z"
              fill={color} opacity="0.9" />
          </svg>
        );
      case 'quake':
        return (
          <svg viewBox="0 0 40 40" fill="none" width="38" height="38">
            <circle cx="20" cy="20" r="18" fill={`${color}22`} stroke={color} strokeWidth="1.5" />
            <path d="M8 22 L13 16 L18 22 L20 14 L24 22 L28 18 L32 22" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section style={{
      background: 'linear-gradient(180deg, #06080e 0%, #0a0d1a 50%, #06080e 100%)',
      padding: '80px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(157, 78, 221, 0.06) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
        {/* Nakama Tribute Banner */}
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '48px',
          height: '280px'
        }}>
          <img
            src="/images/nakama_tribute.jpg"
            alt="Nakama Tribute"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(6, 8, 14, 0.9) 0%, rgba(6, 8, 14, 0.6) 50%, rgba(6, 8, 14, 0.9) 100%)'
          }} />

          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}>
            <div style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.3em',
              color: '#ffb703',
              marginBottom: '12px',
              textTransform: 'uppercase'
            }}>
              SAME PASSION • DIFFERENT PATHS • A BIGGER TOMORROW
            </div>

            <div style={{
              fontFamily: 'Yuji Syuku, serif',
              fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: '8px',
              textShadow: '0 0 20px rgba(255, 183, 3, 0.5)'
            }}>
              "夢があるから、人生は楽しい。"
            </div>

            <div style={{
              fontSize: '0.88rem',
              color: '#a0aec0',
              letterSpacing: '0.1em',
              fontStyle: 'italic'
            }}>
              — Because when you stop dreaming, whatever happens is just a dream.
            </div>

            <div style={{
              marginTop: '20px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              background: 'rgba(255, 51, 68, 0.15)',
              border: '1px solid rgba(255, 51, 68, 0.3)',
              borderRadius: '30px',
              padding: '6px 18px'
            }}>
              <span style={{ color: '#ff3344', fontSize: '1rem' }}>✕</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.15em', color: '#ff8fa3' }}>
                NAKAMA MARK • SEE YOU AT WANO FEST
              </span>
              <span style={{ color: '#ff3344', fontSize: '1rem' }}>✕</span>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px'
          }}>
            <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, transparent, #9d4edd)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.25em', color: '#9d4edd' }}>
              LEGENDS OF WANO
            </span>
            <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #9d4edd, transparent)' }} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.08em',
            margin: 0
          }}>
            CREW <span style={{
              background: 'linear-gradient(135deg, #9d4edd, #00e5ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>SHOWCASE</span>
          </h2>
        </div>

        {/* Character Cards */}
        <div style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '16px',
          scrollbarWidth: 'none',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {CHARACTER_CARDS.map((char) => (
            <div
              key={char.id}
              style={{
                background: 'rgba(14, 20, 36, 0.82)',
                border: `1px solid ${char.accentColor}44`,
                borderRadius: '20px',
                padding: '24px 20px',
                width: '200px',
                minWidth: '180px',
                textAlign: 'center',
                cursor: 'default',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(12px)',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = char.accentColor;
                e.currentTarget.style.boxShadow = `0 15px 35px rgba(0,0,0,0.6), 0 0 25px ${char.accentColor}44`;
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${char.accentColor}44`;
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Icon */}
              <div style={{
                width: '62px',
                height: '62px',
                borderRadius: '50%',
                margin: '0 auto 16px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `radial-gradient(circle, ${char.accentColor}33 0%, transparent 70%)`,
                border: `2px solid ${char.accentColor}66`,
                boxShadow: `0 0 20px ${char.accentColor}44`
              }}>
                {getIconSvg(char.icon, char.accentColor)}
              </div>

              {/* Jolly Roger Emblem */}
              <div style={{
                fontSize: '0.62rem',
                fontFamily: 'var(--font-jp)',
                color: char.accentColor,
                fontWeight: 700,
                letterSpacing: '0.12em',
                marginBottom: '4px',
                opacity: 0.8
              }}>
                {char.jpName}
              </div>

              <h4 style={{
                fontFamily: 'var(--font-title)',
                fontSize: '0.9rem',
                fontWeight: 900,
                color: '#ffffff',
                margin: '0 0 4px 0',
                letterSpacing: '0.04em',
                lineHeight: 1.2
              }}>
                {char.name}
              </h4>

              <div style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: char.accentColor,
                letterSpacing: '0.12em',
                marginBottom: '10px',
                textTransform: 'uppercase'
              }}>
                {char.subTitle}
              </div>

              <div style={{
                display: 'inline-block',
                padding: '2px 10px',
                borderRadius: '20px',
                background: `${char.accentColor}22`,
                border: `1px solid ${char.accentColor}44`,
                fontSize: '0.6rem',
                color: char.accentColor,
                fontWeight: 700,
                marginBottom: '10px',
                letterSpacing: '0.08em'
              }}>
                {char.element}
              </div>

              <p style={{
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                lineHeight: 1.55,
                margin: 0
              }}>
                {char.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
