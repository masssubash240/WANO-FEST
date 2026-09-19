import React, { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import { SITE_CONFIG } from '../data/siteConfig';

interface VideoModalProps {
  videoId?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  videoId = SITE_CONFIG.college.youtubeVideoId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Click-to-play Thumbnail Card */}
      <div
        className="video-thumbnail-card"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="Play WANO FEST 2026 Official Trailer"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          cursor: 'pointer',
          border: '2px solid rgba(212, 175, 55, 0.45)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(212, 175, 55, 0.25)',
          backgroundColor: '#070b14',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02) translateY(-4px)';
          e.currentTarget.style.borderColor = '#ffd166';
          e.currentTarget.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(255, 183, 3, 0.45)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.45)';
          e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(212, 175, 55, 0.25)';
        }}
      >
        {/* Poster Image */}
        <div style={{ position: 'relative', width: '100%', height: '360px', overflow: 'hidden' }}>
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="WANO FEST 2026 Official Video Trailer"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.75) contrast(1.15)',
              transition: 'transform 0.6s ease',
            }}
            onError={(e) => {
              // Fallback to high quality thumbnail if maxres is unavailable
              (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />

          {/* Dark Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(7, 11, 20, 0.3) 0%, rgba(7, 11, 20, 0.85) 100%)',
            }}
          />

          {/* Central Animated Play Button */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              zIndex: 3,
            }}
          >
            <div
              className="pulse-glow-ring"
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d90429 0%, #ff5400 50%, #ffd166 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 40px rgba(217, 4, 41, 0.8), 0 0 20px rgba(255, 183, 3, 0.5)',
                transition: 'transform 0.3s ease',
              }}
            >
              <Play size={38} fill="#ffffff" color="#ffffff" style={{ marginLeft: '4px' }} />
            </div>

            <span
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '0.85rem',
                fontWeight: 900,
                color: '#ffd166',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              }}
            >
              CLICK TO PLAY TRAILER
            </span>
          </div>

          {/* Bottom Details Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 3,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#ffb703',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                OFFICIAL COLLEGE BROADCAST
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                }}
              >
                Sri Sai Ranganathan Engineering College
              </div>
            </div>

            <span
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: 'rgba(217, 4, 41, 0.3)',
                border: '1px solid rgba(217, 4, 41, 0.6)',
                color: '#ff4d6d',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
              }}
            >
              ▶ HD STREAM
            </span>
          </div>
        </div>
      </div>

      {/* Scale-in Modal Dialog */}
      {isOpen && (
        <div
          className="video-modal-backdrop"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="YouTube Video Player"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: 'rgba(4, 6, 12, 0.92)',
            backdropFilter: 'blur(16px)',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <div
            className="video-modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '960px',
              aspectRatio: '16 / 9',
              borderRadius: '20px',
              overflow: 'hidden',
              backgroundColor: '#000000',
              border: '2px solid rgba(212, 175, 55, 0.6)',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.95), 0 0 60px rgba(212, 175, 55, 0.4)',
              animation: 'videoScaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Video Player"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 10,
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(10, 15, 28, 0.85)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                color: '#ffd166',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d90429';
                e.currentTarget.style.borderColor = '#ff4d6d';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(10, 15, 28, 0.85)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                e.currentTarget.style.color = '#ffd166';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <X size={22} />
            </button>

            {/* YouTube Iframe (Loaded ONLY upon click) */}
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title="Official YouTube Video"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
};
