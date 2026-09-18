import React, { useEffect, useState } from 'react';

interface EventDetailTransitionProps {
  initialRect?: DOMRect | null;
  eventImage: string;
  eventTitle: string;
  eventCategory?: string;
  onComplete: () => void;
}

export const EventDetailTransition: React.FC<EventDetailTransitionProps> = ({
  initialRect,
  eventImage,
  eventTitle,
  eventCategory = 'TECH',
  onComplete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Trigger transition expansion in next tick
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 20);

    // Call onComplete after animation finishes
    const finishTimer = setTimeout(() => {
      onComplete();
    }, 600);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  const defaultRect = {
    top: window.innerHeight / 3,
    left: window.innerWidth / 3,
    width: window.innerWidth / 3,
    height: window.innerHeight / 3,
  };

  const startTop = initialRect ? initialRect.top : defaultRect.top;
  const startLeft = initialRect ? initialRect.left : defaultRect.left;
  const startWidth = initialRect ? initialRect.width : defaultRect.width;
  const startHeight = initialRect ? initialRect.height : defaultRect.height;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        backgroundColor: isExpanded ? '#040508' : 'transparent',
        transition: 'background-color 0.5s ease',
      }}
    >
      {/* Expanding Card Hero Container */}
      <div
        style={{
          position: 'absolute',
          top: isExpanded ? 0 : startTop,
          left: isExpanded ? 0 : startLeft,
          width: isExpanded ? '100vw' : startWidth,
          height: isExpanded ? '100vh' : startHeight,
          borderRadius: isExpanded ? '0px' : '24px',
          overflow: 'hidden',
          transition: 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.95), 0 0 60px rgba(0, 229, 255, 0.5)',
          backgroundColor: '#040508',
        }}
      >
        <img
          src={eventImage}
          alt={eventTitle}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isExpanded ? 'scale(1)' : 'scale(1.15)',
            transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Cinematic Darkness Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(4,5,8,0.3) 0%, rgba(4,5,8,0.85) 75%, #040508 100%)',
            opacity: isExpanded ? 1 : 0.4,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Morphing Typography */}
        <div
          style={{
            position: 'absolute',
            bottom: isExpanded ? '120px' : '30px',
            left: isExpanded ? 'clamp(32px, 6vw, 100px)' : '24px',
            right: '24px',
            zIndex: 10,
            transition: 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span
            style={{
              fontSize: isExpanded ? '0.9rem' : '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.3em',
              color: '#00e5ff',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '10px',
            }}
          >
            {eventCategory} // EXPEDITION ENGAGED
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: isExpanded ? 'clamp(2.4rem, 5.5vw, 4.5rem)' : '1.4rem',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '0.04em',
              margin: 0,
              textShadow: '0 5px 25px rgba(0,0,0,0.9)',
            }}
          >
            {eventTitle}
          </h1>
        </div>
      </div>
    </div>
  );
};
