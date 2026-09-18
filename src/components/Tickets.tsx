import React, { useState } from 'react';
import { TICKET_TIERS } from '../data/eventData';

interface TicketsProps {
  onSelectTier: (tierId: string) => void;
}

export const Tickets: React.FC<TicketsProps> = ({ onSelectTier }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getRankIcon = (id: string) => {
    if (id === 'rookie') return '⚓';
    if (id === 'supernova') return '☠️';
    return '👑';
  };

  return (
    <section id="tickets" style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '80px 24px',
    }}>
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, transparent, #ff3344)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.25em', color: '#ff3344' }}>
            YOUR BOUNTY LEVEL
          </span>
          <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #ff3344, transparent)' }} />
        </div>
        <h2 style={{
          fontFamily: 'var(--font-title)',
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '0.08em',
          margin: '0 0 8px 0'
        }}>
          CLAIM YOUR <span style={{ color: '#ff3344' }}>PASS</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto', fontSize: '0.95rem' }}>
          Every pirate needs their rank. Choose your tier and set sail for the Grand Line.
        </p>
      </div>

      {/* Ticket Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {TICKET_TIERS.map((tier) => (
          <div
            key={tier.id}
            onMouseEnter={() => setHoveredId(tier.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              background: tier.popular
                ? 'linear-gradient(160deg, rgba(157, 78, 221, 0.2) 0%, rgba(0, 119, 255, 0.15) 100%)'
                : 'rgba(14, 20, 36, 0.85)',
              border: tier.popular
                ? '2px solid rgba(157, 78, 221, 0.7)'
                : `1px solid ${hoveredId === tier.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)'}`,
              borderRadius: '24px',
              padding: '32px 28px',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: tier.popular
                ? 'scale(1.03)'
                : hoveredId === tier.id ? 'translateY(-6px)' : 'none',
              boxShadow: tier.popular
                ? '0 25px 55px rgba(0,0,0,0.6), 0 0 40px rgba(157, 78, 221, 0.3)'
                : hoveredId === tier.id
                ? '0 20px 40px rgba(0,0,0,0.5)'
                : '0 8px 20px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(14px)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Popular Ribbon */}
            {tier.popular && (
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '-28px',
                background: 'linear-gradient(135deg, #9d4edd, #7b2cbf)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                padding: '4px 40px',
                transform: 'rotate(42deg)',
                boxShadow: '0 0 15px rgba(157, 78, 221, 0.5)'
              }}>
                POPULAR
              </div>
            )}

            {/* Jolly Roger Icon */}
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '16px',
              filter: `drop-shadow(0 0 10px ${tier.popular ? '#9d4edd' : 'rgba(255,255,255,0.3)'})`
            }}>
              {getRankIcon(tier.id)}
            </div>

            {/* Tier Name & JP Rank */}
            <div style={{ marginBottom: '8px' }}>
              <h3 style={{
                fontFamily: 'var(--font-title)',
                fontSize: '1.3rem',
                fontWeight: 900,
                color: tier.popular ? '#c77dff' : '#ffffff',
                margin: '0 0 4px 0',
                letterSpacing: '0.06em'
              }}>
                {tier.name}
              </h3>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-jp)'
              }}>
                {tier.jpRank}
              </div>
            </div>

            {/* Bounty Level */}
            <div style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: '20px',
              background: 'rgba(255, 183, 3, 0.12)',
              border: '1px solid rgba(255, 183, 3, 0.3)',
              color: '#ffb703',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              marginBottom: '20px'
            }}>
              BOUNTY: {tier.bounty}
            </div>

            {/* Price */}
            <div style={{ marginBottom: '24px' }}>
              <span style={{
                fontFamily: 'var(--font-title)',
                fontSize: '2.8rem',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1
              }}>
                {tier.price}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                / per pirate
              </span>
            </div>

            {/* Divider */}
            <div style={{
              height: '1px',
              background: tier.popular
                ? 'linear-gradient(90deg, transparent, rgba(157, 78, 221, 0.5), transparent)'
                : 'rgba(255,255,255,0.08)',
              marginBottom: '20px'
            }} />

            {/* Features */}
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tier.features.map((feature, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{
                    color: tier.popular ? '#c77dff' : '#00e5ff',
                    fontSize: '0.85rem',
                    flexShrink: 0,
                    marginTop: '1px'
                  }}>✦</span>
                  <span style={{ fontSize: '0.85rem', color: '#b8c4d8', lineHeight: 1.4 }}>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              onClick={() => onSelectTier(tier.id)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                border: 'none',
                fontFamily: 'var(--font-title)',
                fontWeight: 900,
                fontSize: '0.9rem',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: tier.popular
                  ? 'linear-gradient(135deg, #9d4edd 0%, #7b2cbf 100%)'
                  : tier.id === 'yonko'
                  ? 'linear-gradient(135deg, #ffb703 0%, #fb8500 100%)'
                  : 'rgba(255,255,255,0.08)',
                color: tier.id === 'rookie' ? '#b8c4d8' : tier.popular ? '#ffffff' : '#111',
                boxShadow: tier.popular ? '0 0 25px rgba(157, 78, 221, 0.5)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                if (tier.popular) e.currentTarget.style.boxShadow = '0 0 35px rgba(157, 78, 221, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                if (tier.popular) e.currentTarget.style.boxShadow = '0 0 25px rgba(157, 78, 221, 0.5)';
              }}
            >
              {tier.cta} ➔
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Note */}
      <p style={{
        textAlign: 'center',
        marginTop: '32px',
        color: 'var(--text-muted)',
        fontSize: '0.82rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <span>🔒</span>
        All passes include a personalized WANTED Bounty Poster. Secure payment via Razorpay & UPI.
      </p>
    </section>
  );
};
