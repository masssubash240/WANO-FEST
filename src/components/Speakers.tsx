import React, { useState } from 'react';
import { SPEAKERS } from '../data/eventData';

export const Speakers: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="speakers" style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '80px 24px',
    }}>
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px'
        }}>
          <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, transparent, #00e5ff)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.25em', color: '#00e5ff' }}>
            THE GRAND FLEET
          </span>
          <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #00e5ff, transparent)' }} />
        </div>
        <h2 style={{
          fontFamily: 'var(--font-title)',
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '0.08em',
          margin: '0 0 12px 0'
        }}>
          KEYNOTE <span style={{ color: '#00e5ff' }}>SPEAKERS</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto', fontSize: '0.95rem' }}>
          Industry veterans, tech giants, and creative visionaries setting course for the future.
        </p>
      </div>

      {/* Speaker Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {SPEAKERS.map((speaker) => (
          <div
            key={speaker.id}
            onMouseEnter={() => setHoveredId(speaker.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              background: 'rgba(14, 20, 36, 0.85)',
              border: `1px solid ${hoveredId === speaker.id ? 'rgba(0, 229, 255, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
              borderRadius: '20px',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: hoveredId === speaker.id ? 'translateY(-6px)' : 'none',
              boxShadow: hoveredId === speaker.id
                ? '0 20px 45px rgba(0,0,0,0.6), 0 0 30px rgba(0, 229, 255, 0.25)'
                : '0 8px 20px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Speaker Headshot */}
            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
              <img
                src={speaker.avatar}
                alt={speaker.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  transform: hoveredId === speaker.id ? 'scale(1.05)' : 'scale(1)',
                  filter: 'saturate(0.9)'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(14,20,36,0.85) 100%)'
              }} />
              {/* Badge */}
              <div style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                background: speaker.badge === 'KEYNOTE'
                  ? 'linear-gradient(135deg, #ffb703, #fb8500)'
                  : 'rgba(0, 229, 255, 0.25)',
                color: speaker.badge === 'KEYNOTE' ? '#111' : '#00e5ff',
                border: speaker.badge === 'KEYNOTE' ? 'none' : '1px solid rgba(0, 229, 255, 0.4)',
                boxShadow: speaker.badge === 'KEYNOTE' ? '0 0 12px rgba(255,183,3,0.5)' : 'none'
              }}>
                ★ {speaker.badge}
              </div>
            </div>

            {/* Speaker Info */}
            <div style={{ padding: '20px' }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 4px 0'
              }}>
                {speaker.name}
              </h3>
              <p style={{
                fontSize: '0.8rem',
                color: '#00e5ff',
                fontWeight: 700,
                margin: '0 0 2px 0',
                letterSpacing: '0.04em'
              }}>
                {speaker.title}
              </p>
              <p style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                margin: '0 0 14px 0',
                fontWeight: 600
              }}>
                {speaker.organization}
              </p>

              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start'
              }}>
                <span style={{ color: '#ffb703', fontSize: '0.85rem', flexShrink: 0, marginTop: '1px' }}>🎙️</span>
                <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  margin: 0,
                  lineHeight: 1.5,
                  fontStyle: 'italic'
                }}>
                  "{speaker.topic}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
