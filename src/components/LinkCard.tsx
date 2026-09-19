import React, { useState, useRef } from 'react';
import { Globe, MapPin, Mail, Copy, Check, Heart, ExternalLink } from 'lucide-react';
import { InstagramIcon as Instagram } from './SocialIcons';

export interface LinkCardData {
  id: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  href: string;
  type: 'website' | 'maps' | 'mail' | 'instagram';
  valueToCopy?: string;
}

interface LinkCardProps {
  data: LinkCardData;
  index: number;
  onToast?: (message: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ data, index, onToast }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const [ripplePos, setRipplePos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setRipplePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipplePos(null), 600);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const textToCopy = data.valueToCopy || data.subtitle || data.href;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    if (onToast) onToast(`Copied ${textToCopy} to clipboard!`);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleInstagramFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartBurst(true);
    setTimeout(() => {
      setHeartBurst(false);
      window.open(data.href, '_blank', 'noopener,noreferrer');
    }, 450);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className="harbor-link-card-root"
      style={{
        perspective: '1000px',
        animation: `harborFadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s both`,
      }}
    >
      <div
        className={`harbor-card-inner ${data.type === 'instagram' ? 'instagram-glow' : ''}`}
        style={{
          position: 'relative',
          padding: '28px 24px',
          borderRadius: '20px',
          backgroundColor: '#070b16',
          border: isHovered ? '1.5px solid #d4af37' : '1px solid rgba(212, 175, 55, 0.25)',
          boxShadow: isHovered
            ? '0 20px 45px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.35)'
            : '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 229, 255, 0.05)',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovered ? 'scale(1.03) translateY(-4px)' : 'scale(1)'}`,
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease' : 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '220px',
        }}
      >
        {/* Subtle Japanese Crest Watermark */}
        <div
          style={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            fontSize: '5.5rem',
            color: 'rgba(212, 175, 55, 0.04)',
            fontFamily: 'serif',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          港
        </div>

        {/* Click Ripple Indicator */}
        {ripplePos && (
          <span
            className="click-ripple"
            style={{
              position: 'absolute',
              left: `${ripplePos.x}px`,
              top: `${ripplePos.y}px`,
            }}
          />
        )}

        {/* Top Header: Icon & Category */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div
              className={`harbor-icon-box ${data.type}`}
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  data.type === 'instagram'
                    ? 'rgba(217, 4, 41, 0.15)'
                    : data.type === 'mail'
                    ? 'rgba(255, 183, 3, 0.15)'
                    : data.type === 'maps'
                    ? 'rgba(0, 230, 118, 0.15)'
                    : 'rgba(0, 229, 255, 0.15)',
                border:
                  data.type === 'instagram'
                    ? '1.5px solid rgba(255, 77, 109, 0.45)'
                    : data.type === 'mail'
                    ? '1.5px solid rgba(255, 183, 3, 0.45)'
                    : data.type === 'maps'
                    ? '1.5px solid rgba(0, 230, 118, 0.45)'
                    : '1.5px solid rgba(0, 229, 255, 0.45)',
              }}
            >
              {data.type === 'website' && <Globe size={28} className="globe-slow-spin text-cyan-400" />}
              {data.type === 'maps' && <MapPin size={28} className="map-pin-drop-bounce text-emerald-400" />}
              {data.type === 'mail' && (
                <div className={`mail-envelope-flap-box ${isHovered ? 'open' : ''}`}>
                  <Mail size={28} className="mail-flap-icon text-amber-400" />
                </div>
              )}
              {data.type === 'instagram' && (
                <Instagram size={28} className="instagram-gradient-icon text-rose-400" />
              )}
            </div>

            <span
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                color: '#d4af37',
                padding: '4px 10px',
                borderRadius: '12px',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
              }}
            >
              HARBOR 0{index + 1}
            </span>
          </div>

          {/* Title & Subtitle */}
          <h3
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: '1.1rem',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.04em',
              margin: '0 0 6px 0',
            }}
          >
            {data.title}
          </h3>

          <p
            style={{
              fontSize: '0.84rem',
              color: '#94a3b8',
              margin: 0,
              lineHeight: 1.4,
              wordBreak: 'break-word',
            }}
          >
            {data.subtitle}
          </p>
        </div>

        {/* Bottom Actions */}
        <div style={{ marginTop: '22px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2 }}>
          {data.type === 'mail' ? (
            <>
              <a
                href={data.href}
                aria-label={`Send transmission to ${data.subtitle}`}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  minHeight: '44px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 183, 3, 0.15)',
                  border: '1px solid rgba(255, 183, 3, 0.5)',
                  color: '#ffb703',
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 183, 3, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 183, 3, 0.15)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Mail size={16} />
                <span>WRITE MAIL</span>
              </a>

              <button
                onClick={handleCopy}
                aria-label="Copy college email address"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  minWidth: '44px',
                  minHeight: '44px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  backgroundColor: copied ? 'rgba(0, 230, 118, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  border: copied ? '1px solid #00e676' : '1px solid rgba(255, 255, 255, 0.2)',
                  color: copied ? '#00e676' : '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                title="Copy email to clipboard"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'COPIED!' : 'COPY'}</span>
              </button>
            </>
          ) : data.type === 'instagram' ? (
            <button
              onClick={handleInstagramFollow}
              aria-label="Follow official Instagram account with heart burst"
              style={{
                width: '100%',
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '44px',
                padding: '10px 18px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ff5400 0%, #d90429 50%, #ffd166 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(217, 4, 41, 0.45)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 28px rgba(217, 4, 41, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(217, 4, 41, 0.45)';
              }}
            >
              <Heart size={16} className={heartBurst ? 'heart-burst-anim' : ''} fill="#fff" />
              <span>FOLLOW ON INSTAGRAM</span>
              {heartBurst && (
                <div className="heart-burst-particles">
                  <span className="heart-particle p1">❤️</span>
                  <span className="heart-particle p2">💖</span>
                  <span className="heart-particle p3">✨</span>
                  <span className="heart-particle p4">🔥</span>
                </div>
              )}
            </button>
          ) : (
            <a
              href={data.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${data.actionLabel} - ${data.title}`}
              style={{
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '44px',
                padding: '10px 18px',
                borderRadius: '12px',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                border: '1.5px solid rgba(212, 175, 55, 0.45)',
                color: '#ffd166',
                textDecoration: 'none',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.3)';
                e.currentTarget.style.borderColor = '#ffd166';
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.45)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>{data.actionLabel}</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
