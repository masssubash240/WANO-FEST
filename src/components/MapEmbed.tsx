import React from 'react';
import { Compass, ExternalLink, MapPin } from 'lucide-react';
import { SITE_CONFIG } from '../data/siteConfig';

interface MapEmbedProps {
  compact?: boolean;
  title?: string;
  subtitle?: string;
}

export const MapEmbed: React.FC<MapEmbedProps> = ({
  compact = false,
  title = 'HARBOR POSITION & NAVIGATIONAL CHART',
  subtitle = 'Sri Sai Ranganathan Engineering College, REC Kalvi Nagar, Thondamuthur',
}) => {
  return (
    <div
      className="parchment-map-wrapper"
      style={{
        position: 'relative',
        borderRadius: compact ? '20px' : '28px',
        padding: compact ? '16px' : '24px',
        background: 'linear-gradient(145deg, #1b140c 0%, #100b06 50%, #20170e 100%)',
        border: '2px solid rgba(212, 175, 55, 0.45)',
        boxShadow:
          '0 25px 60px rgba(0, 0, 0, 0.85), inset 0 0 35px rgba(212, 175, 55, 0.15), 0 0 25px rgba(255, 183, 3, 0.2)',
        overflow: 'hidden',
      }}
    >
      {/* Torn Edge Parchment Overlay Decor */}
      <div
        className="parchment-torn-edge"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(217, 4, 41, 0.06) 0%, transparent 40%)',
          zIndex: 1,
        }}
      />

      {/* Decorative Corner Kanji Seals */}
      <span
        style={{
          position: 'absolute',
          top: '12px',
          left: '16px',
          fontFamily: 'serif',
          fontSize: '1.2rem',
          color: 'rgba(212, 175, 55, 0.6)',
          userSelect: 'none',
          zIndex: 3,
        }}
      >
        港
      </span>
      <span
        style={{
          position: 'absolute',
          top: '12px',
          right: '16px',
          fontFamily: 'serif',
          fontSize: '1.2rem',
          color: 'rgba(217, 4, 41, 0.6)',
          userSelect: 'none',
          zIndex: 3,
        }}
      >
        海
      </span>

      {/* Top Header Bar with Rotating Compass */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px dashed rgba(212, 175, 55, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Rotating Compass Icon */}
          <div
            className="compass-spin-container"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              border: '1.5px solid #d4af37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)',
              flexShrink: 0,
            }}
          >
            <Compass size={24} className="compass-needle-spin text-amber-400" />
          </div>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: compact ? '0.88rem' : '1.05rem',
                fontWeight: 900,
                color: '#ffd166',
                letterSpacing: '0.08em',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: compact ? '0.74rem' : '0.84rem',
                color: 'rgba(255, 255, 255, 0.65)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '2px',
              }}
            >
              <MapPin size={13} className="text-red-400" />
              <span>{subtitle}</span>
            </div>
          </div>
        </div>

        {/* Open in Google Maps Button */}
        <a
          href={SITE_CONFIG.college.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Sri Sai Ranganathan Engineering College location in Google Maps"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            minHeight: '44px',
            padding: '8px 20px',
            borderRadius: '25px',
            background: 'linear-gradient(135deg, #d4af37 0%, #aa820a 100%)',
            color: '#080c14',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
            transition: 'all 0.25s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)';
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(212, 175, 55, 0.65)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.4)';
          }}
        >
          <span>OPEN IN GOOGLE MAPS</span>
          <ExternalLink size={15} />
        </a>
      </div>

      {/* Embedded Map Frame with Parchment Edges */}
      <div
        className="map-iframe-container"
        style={{
          position: 'relative',
          zIndex: 2,
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1.5px solid rgba(212, 175, 55, 0.3)',
          boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8)',
          height: compact ? '280px' : '440px',
          backgroundColor: '#0a0e1a',
        }}
      >
        <iframe
          title="Sri Sai Ranganathan Engineering College Campus Map"
          src={SITE_CONFIG.college.googleMapsEmbedUrl}
          width="100%"
          height="100%"
          style={{
            border: 0,
            filter: 'contrast(1.08) saturate(1.1) brightness(0.92)',
            display: 'block',
          }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};
