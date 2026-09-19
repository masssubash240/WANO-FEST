import React, { useState } from 'react';
import { SITE_CONFIG } from '../data/siteConfig';
import { LinkCard } from './LinkCard';
import { MapEmbed } from './MapEmbed';

export const FindOurHarborSection: React.FC = () => {
  const [copyToast, setCopyToast] = useState<string | null>(null);

  const handleShowToast = (msg: string) => {
    setCopyToast(msg);
    setTimeout(() => setCopyToast(null), 3000);
  };

  return (
    <section
      id="harbor"
      style={{
        position: 'relative',
        backgroundColor: '#04060c',
        color: '#fff',
        padding: '100px 24px 120px 24px',
        overflow: 'hidden',
        borderTop: '1px solid rgba(212, 175, 55, 0.25)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 18px',
              borderRadius: '25px',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              marginBottom: '14px',
            }}
          >
            <span className="wano-hanko-seal" style={{ width: '24px', height: '24px', fontSize: '0.8rem' }}>
              港
            </span>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.24em',
                color: '#ffb703',
                textTransform: 'uppercase',
              }}
            >
              FIND OUR HARBOR
            </span>
            <span style={{ fontSize: '0.9rem' }}>⚓</span>
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(2rem, 4.2vw, 3.2rem)',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #ffffff 0%, #ffd166 60%, #ff5400 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.06em',
              margin: '0 0 12px 0',
            }}
          >
            SANCTUARY BEACONS & DIRECTIONS
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', maxWidth: '620px', margin: '0 auto' }}>
            Four vital transmission portals to reach Sri Sai Ranganathan Engineering College and chart your voyage.
          </p>
        </div>

        {/* 4 Animated Link Cards */}
        <div className="harbor-cards-grid">
          {SITE_CONFIG.harborCards.map((card, idx) => (
            <LinkCard
              key={card.id}
              data={card}
              index={idx}
              onToast={(msg) => handleShowToast(msg)}
            />
          ))}
        </div>

        {/* Lazy-loaded Mini Map Preview in Torn-edge Parchment Frame with Rotating Compass */}
        <div style={{ marginTop: '55px' }}>
          <MapEmbed compact title="MINI HARBOR PREVIEW • REC CBE" subtitle="Sri Sai Ranganathan Engineering College, Thondamuthur" />
        </div>
      </div>

      {/* COPY FEEDBACK TOAST */}
      {copyToast && (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 24px',
            borderRadius: '16px',
            background: 'rgba(8, 14, 26, 0.96)',
            border: '1.5px solid #00e676',
            boxShadow: '0 15px 45px rgba(0, 0, 0, 0.85), 0 0 25px rgba(0, 230, 118, 0.4)',
            backdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.25s ease',
            color: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          <span style={{ fontSize: '1.3rem' }}>📋</span>
          <div>{copyToast}</div>
        </div>
      )}
    </section>
  );
};
