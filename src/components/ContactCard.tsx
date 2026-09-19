import React, { useState, useRef } from 'react';
import {
  Globe,
  Mail,
  MessageCircle,
  MapPin,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { InstagramIcon as Instagram, YoutubeIcon as Youtube } from './SocialIcons';

export interface ContactCardData {
  id: string;
  title: string;
  badge: string;
  value: string;
  displayValue: string;
  actionLabel: string;
  href: string;
  type: 'website' | 'email' | 'whatsapp' | 'instagram' | 'youtube' | 'location';
  copyable?: boolean;
  copyValue?: string;
}

interface ContactCardProps {
  data: ContactCardData;
  index: number;
  onToast?: (msg: string) => void;
  onVideoClick?: () => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  data,
  index,
  onToast,
  onVideoClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
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
    const text = data.copyValue || data.value;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onToast) onToast(`Copied ${data.title}: "${text}" to clipboard!`);
    setTimeout(() => setCopied(false), 2400);
  };

  const getIcon = () => {
    switch (data.type) {
      case 'website':
        return <Globe size={26} className="text-cyan-400" />;
      case 'email':
        return <Mail size={26} className="text-amber-400" />;
      case 'whatsapp':
        return <MessageCircle size={26} className="text-emerald-400" />;
      case 'instagram':
        return <Instagram size={26} className="text-pink-400" />;
      case 'youtube':
        return <Youtube size={26} className="text-red-400" />;
      case 'location':
        return <MapPin size={26} className="text-amber-300" />;
      default:
        return <ExternalLink size={26} className="text-yellow-400" />;
    }
  };

  const getAccentColor = () => {
    switch (data.type) {
      case 'website':
        return '#00e5ff';
      case 'email':
        return '#ffb703';
      case 'whatsapp':
        return '#00e676';
      case 'instagram':
        return '#ff4d6d';
      case 'youtube':
        return '#d90429';
      case 'location':
        return '#d4af37';
      default:
        return '#d4af37';
    }
  };

  const accent = getAccentColor();

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className="wanted-contact-card-root"
      style={{
        perspective: '1000px',
        animation: `harborFadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s both`,
      }}
    >
      <div
        className="wanted-contact-card-inner"
        style={{
          position: 'relative',
          borderRadius: '22px',
          padding: '24px 22px',
          backgroundColor: '#070a13',
          border: isHovered ? `1.5px solid ${accent}` : '1.5px solid rgba(212, 175, 55, 0.28)',
          boxShadow: isHovered
            ? `0 20px 50px rgba(0,0,0,0.85), 0 0 35px ${accent}44`
            : '0 10px 30px rgba(0,0,0,0.5)',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovered ? 'scale(1.025) translateY(-5px)' : 'scale(1)'}`,
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease' : 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '250px',
          overflow: 'hidden',
        }}
      >
        {/* Parchment Woodgrain Texture Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 100% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(217, 4, 41, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Wanted Poster Corner Kanji Stamps */}
        <span
          style={{
            position: 'absolute',
            top: '8px',
            right: '12px',
            fontFamily: 'serif',
            fontSize: '1.4rem',
            color: 'rgba(212, 175, 55, 0.12)',
            userSelect: 'none',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          手配
        </span>

        {/* Click Ripple Effect */}
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

        {/* Card Header: Badge & Icon */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: `${accent}18`,
                border: `1.5px solid ${accent}55`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isHovered ? `0 0 20px ${accent}44` : 'none',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              {getIcon()}
            </div>

            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                color: accent,
                backgroundColor: `${accent}15`,
                border: `1px solid ${accent}44`,
                padding: '4px 10px',
                borderRadius: '12px',
                textTransform: 'uppercase',
              }}
            >
              {data.badge}
            </span>
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: '1.05rem',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.04em',
              margin: '0 0 6px 0',
            }}
          >
            {data.title}
          </h3>

          <div
            style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#ffd166',
              marginBottom: '4px',
              wordBreak: 'break-word',
            }}
          >
            {data.value}
          </div>

          <p
            style={{
              fontSize: '0.78rem',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {data.displayValue}
          </p>
        </div>

        {/* Card Bottom Actions */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '12px',
            borderTop: '1px dashed rgba(212, 175, 55, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {data.type === 'youtube' ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onVideoClick) onVideoClick();
                else window.open(data.href, '_blank', 'noopener,noreferrer');
              }}
              aria-label={`Play YouTube video trailer`}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '44px',
                padding: '8px 16px',
                borderRadius: '10px',
                backgroundColor: 'rgba(217, 4, 41, 0.18)',
                border: '1.5px solid rgba(217, 4, 41, 0.55)',
                color: '#ff4d6d',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d90429';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(217, 4, 41, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(217, 4, 41, 0.18)';
                e.currentTarget.style.color = '#ff4d6d';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Youtube size={16} />
              <span>PLAY VIDEO</span>
            </button>
          ) : (
            <a
              href={data.href}
              target={data.type === 'email' ? '_self' : '_blank'}
              rel="noopener noreferrer"
              aria-label={`${data.actionLabel} for ${data.title}`}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '44px',
                padding: '8px 16px',
                borderRadius: '10px',
                backgroundColor: `${accent}16`,
                border: `1.5px solid ${accent}55`,
                color: accent,
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${accent}33`;
                e.currentTarget.style.borderColor = accent;
                e.currentTarget.style.boxShadow = `0 0 20px ${accent}55`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${accent}16`;
                e.currentTarget.style.borderColor = `${accent}55`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>{data.actionLabel}</span>
              <ExternalLink size={14} />
            </a>
          )}

          {/* Copy Button if Copyable */}
          {data.copyable && (
            <button
              onClick={handleCopy}
              aria-label={`Copy ${data.title} to clipboard`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '44px',
                minHeight: '44px',
                padding: '8px',
                borderRadius: '10px',
                backgroundColor: copied ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: copied ? '1.5px solid #00e676' : '1px solid rgba(255, 255, 255, 0.15)',
                color: copied ? '#00e676' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title="Copy to clipboard"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
