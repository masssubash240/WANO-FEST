import React, { useState, useEffect } from 'react';
import { Phone, Mail, Globe } from 'lucide-react';
import type { Coordinator } from '../data/siteConfig';

interface CoordinatorStripProps {
  coordinators: Coordinator[];
  compact?: boolean;
}

export const CoordinatorStrip: React.FC<CoordinatorStripProps> = ({ coordinators, compact = false }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [rippleTarget, setRippleTarget] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const triggerRipple = (id: string) => {
    setRippleTarget(id);
    setTimeout(() => setRippleTarget(null), 500);
  };

  if (!coordinators || coordinators.length === 0) return null;

  return (
    <div
      className="coordinator-strip-container"
      onClick={(e) => e.stopPropagation()}
      style={{
        marginTop: '14px',
        paddingTop: '12px',
        borderTop: '1px dashed rgba(212, 175, 55, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.68rem',
          fontWeight: 800,
          letterSpacing: '0.15em',
          color: '#d4af37',
          textTransform: 'uppercase',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span>📜</span> QUARTERMASTERS
        </span>
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em' }}>
          DIRECT DISPATCH
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {coordinators.map((coord, idx) => {
          const coordId = `${coord.name}-${idx}`;
          const gmailHref = isMobile
            ? `mailto:${coord.email}`
            : `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(coord.email || '')}`;

          return (
            <div
              key={coordId}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                padding: '6px 10px',
                borderRadius: '10px',
                backgroundColor: 'rgba(10, 15, 28, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Coordinator Name & Role */}
              <div style={{ minWidth: 0, flex: '1 1 auto' }}>
                <div
                  style={{
                    fontSize: compact ? '0.75rem' : '0.82rem',
                    fontWeight: 800,
                    color: '#f8fafc',
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={coord.name}
                >
                  {coord.name}
                </div>
                {coord.role && (
                  <div
                    style={{
                      fontSize: '0.65rem',
                      color: '#00e5ff',
                      fontWeight: 600,
                      letterSpacing: '0.03em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {coord.role}
                  </div>
                )}
              </div>

              {/* Action Buttons: Call & Gmail */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                {/* Call Button */}
                <a
                  href={`tel:${coord.tel}`}
                  aria-label={`Call ${coord.name}`}
                  onClick={() => triggerRipple(`call-${coordId}`)}
                  className={`coordinator-btn ${rippleTarget === `call-${coordId}` ? 'ripple-active' : ''}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    minWidth: '44px',
                    minHeight: '44px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 230, 118, 0.12)',
                    border: '1px solid rgba(0, 230, 118, 0.4)',
                    color: '#00e676',
                    textDecoration: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 230, 118, 0.28)';
                    e.currentTarget.style.borderColor = '#00e676';
                    e.currentTarget.style.boxShadow = '0 0 14px rgba(0, 230, 118, 0.5)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 230, 118, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(0, 230, 118, 0.4)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                >
                  <Phone size={14} className="lucide-icon-pulse" />
                  <span>Call</span>
                </a>

                {/* Gmail Button (Hidden if coordinator has no email) */}
                {coord.email && (
                  <a
                    href={gmailHref}
                    target={isMobile ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={`Email ${coord.name} via Gmail`}
                    onClick={() => triggerRipple(`mail-${coordId}`)}
                    className={`coordinator-btn ${rippleTarget === `mail-${coordId}` ? 'ripple-active' : ''}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      minWidth: '44px',
                      minHeight: '44px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(217, 4, 41, 0.14)',
                      border: '1px solid rgba(217, 4, 41, 0.4)',
                      color: '#ff4d6d',
                      textDecoration: 'none',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(217, 4, 41, 0.28)';
                      e.currentTarget.style.borderColor = '#ff4d6d';
                      e.currentTarget.style.boxShadow = '0 0 14px rgba(217, 4, 41, 0.5)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(217, 4, 41, 0.14)';
                      e.currentTarget.style.borderColor = 'rgba(217, 4, 41, 0.4)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.95)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                  >
                    <Mail size={14} className="lucide-icon-pulse" />
                    <span>Gmail</span>
                  </a>
                )}

                {/* Website / Portfolio Button */}
                {coord.website && (
                  <a
                    href={coord.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${coord.name}'s portfolio`}
                    onClick={() => triggerRipple(`web-${coordId}`)}
                    className={`coordinator-btn ${rippleTarget === `web-${coordId}` ? 'ripple-active' : ''}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      minWidth: '44px',
                      minHeight: '44px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0, 229, 255, 0.14)',
                      border: '1px solid rgba(0, 229, 255, 0.4)',
                      color: '#00e5ff',
                      textDecoration: 'none',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.28)';
                      e.currentTarget.style.borderColor = '#00e5ff';
                      e.currentTarget.style.boxShadow = '0 0 14px rgba(0, 229, 255, 0.5)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.14)';
                      e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.4)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <Globe size={14} className="lucide-icon-pulse" />
                    <span>Site</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
