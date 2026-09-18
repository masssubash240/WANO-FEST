import React from 'react';

interface DualPortalsProps {
  onSelectCategory: (cat: 'tech' | 'non-tech') => void;
}

export const DualPortals: React.FC<DualPortalsProps> = ({ onSelectCategory }) => {
  return (
    <section id="portals" style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '40px 24px',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {/* TECH EVENTS - Zoro Card */}
        <div
          onClick={() => onSelectCategory('tech')}
          style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            cursor: 'pointer',
            border: '2px solid rgba(0, 229, 255, 0.4)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 229, 255, 0.25)',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '28px',
            backgroundImage: `linear-gradient(to right, rgba(6, 12, 26, 0.95) 0%, rgba(6, 14, 30, 0.6) 60%, rgba(0, 229, 255, 0.2) 100%), url('/images/zoro_tech.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px) scale(1.015)';
            e.currentTarget.style.borderColor = '#00e5ff';
            e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 229, 255, 0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px) scale(1)';
            e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.4)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 229, 255, 0.25)';
          }}
        >
          {/* Card Badge */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 229, 255, 0.15)',
            border: '1px solid rgba(0, 229, 255, 0.4)',
            borderRadius: '20px',
            padding: '4px 12px',
            backdropFilter: 'blur(8px)'
          }}>
            <span style={{ fontSize: '0.9rem' }}>⚔️</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#00e5ff', letterSpacing: '0.1em' }}>
              ZORO DIVISION
            </span>
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              color: '#ffffff',
              margin: '0 0 4px 0',
              lineHeight: 1.1,
              textShadow: '0 0 20px rgba(0, 229, 255, 0.8)'
            }}>
              TECH <span style={{ color: '#00e5ff' }}>EVENTS</span>
            </h2>

            <p style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#90e0ef',
              letterSpacing: '0.2em',
              margin: '0 0 16px 0',
              textTransform: 'uppercase'
            }}>
              CODE • BUILD • INNOVATE
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 20px',
              background: 'rgba(0, 229, 255, 0.2)',
              border: '1px solid #00e5ff',
              borderRadius: '25px',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)'
            }}>
              EXPLORE TECH EVENTS ➔
            </div>
          </div>
        </div>

        {/* NON-TECH EVENTS - Luffy Card */}
        <div
          onClick={() => onSelectCategory('non-tech')}
          style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            cursor: 'pointer',
            border: '2px solid rgba(255, 170, 0, 0.4)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 170, 0, 0.25)',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '28px',
            backgroundImage: `linear-gradient(to right, rgba(26, 14, 6, 0.95) 0%, rgba(28, 16, 6, 0.6) 60%, rgba(255, 170, 0, 0.2) 100%), url('/images/luffy_nontech.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px) scale(1.015)';
            e.currentTarget.style.borderColor = '#ffb703';
            e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 183, 3, 0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px) scale(1)';
            e.currentTarget.style.borderColor = 'rgba(255, 170, 0, 0.4)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 170, 0, 0.25)';
          }}
        >
          {/* Card Badge */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 170, 0, 0.15)',
            border: '1px solid rgba(255, 170, 0, 0.4)',
            borderRadius: '20px',
            padding: '4px 12px',
            backdropFilter: 'blur(8px)'
          }}>
            <span style={{ fontSize: '0.9rem' }}>🍖</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffb703', letterSpacing: '0.1em' }}>
              LUFFY DIVISION
            </span>
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              color: '#ffffff',
              margin: '0 0 4px 0',
              lineHeight: 1.1,
              textShadow: '0 0 20px rgba(255, 170, 0, 0.8)'
            }}>
              NON-TECH <span style={{ color: '#ffb703' }}>EVENTS</span>
            </h2>

            <p style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#ffd166',
              letterSpacing: '0.2em',
              margin: '0 0 16px 0',
              textTransform: 'uppercase'
            }}>
              CREATE • EXPRESS • COMPETE
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 20px',
              background: 'rgba(255, 170, 0, 0.2)',
              border: '1px solid #ffb703',
              borderRadius: '25px',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              boxShadow: '0 0 15px rgba(255, 170, 0, 0.4)'
            }}>
              EXPLORE NON-TECH EVENTS ➔
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
