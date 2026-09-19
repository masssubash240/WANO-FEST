import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'button' | 'card' | 'text' | 'register'>('default');
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mouseX = useRef(-100);
  const mouseY = useRef(-100);
  const ringX = useRef(-100);
  const ringY = useRef(-100);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    setIsEnabled(true);
    document.body.classList.add('custom-cursor-enabled');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cardEl = target.closest('[data-cursor="card"], .event-card, [data-event-card]');
      const registerEl = target.closest('[data-cursor="register"], .btn-register, a[href*="ticket"]');
      const imageEl = target.closest('[data-cursor="view"], .card-image-wrap, img');
      const btnEl = target.closest('button, a, [role="button"], input[type="submit"]');

      if (registerEl || (btnEl && btnEl.textContent?.toLowerCase().includes('register'))) {
        setCursorVariant('register');
        setCursorText('JOIN');
      } else if (cardEl) {
        setCursorVariant('card');
        const customTxt = cardEl.getAttribute('data-cursor-text');
        setCursorText(customTxt || 'EXPAND');
      } else if (imageEl && !btnEl) {
        setCursorVariant('text');
        const customTxt = imageEl.getAttribute('data-cursor-text');
        setCursorText(customTxt || 'VIEW');
      } else if (btnEl) {
        setCursorVariant('button');
        const customTxt = btnEl.getAttribute('data-cursor-text');
        setCursorText(customTxt || null);
      } else {
        setCursorVariant('default');
        setCursorText(null);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Smooth lerp loop for the outer cursor ring
    const render = () => {
      const ease = 0.18;
      ringX.current += (mouseX.current - ringX.current) * ease;
      ringY.current += (mouseY.current - ringY.current) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX.current}px, ${ringY.current}px, 0)`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    rafId.current = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('custom-cursor-enabled');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (!isEnabled) return null;

  // Derive ring dimensions & color based on cursor variant
  let ringSize = 36;
  let ringBorder = '1.5px solid rgba(0, 229, 255, 0.6)';
  let ringBg = 'rgba(0, 229, 255, 0.05)';
  let ringShadow = '0 0 15px rgba(0, 229, 255, 0.35)';

  if (cursorVariant === 'register') {
    ringSize = 64;
    ringBorder = '2px solid #d90429';
    ringBg = 'rgba(217, 4, 41, 0.2)';
    ringShadow = '0 0 25px rgba(217, 4, 41, 0.65)';
  } else if (cursorVariant === 'card') {
    ringSize = 60;
    ringBorder = '2px solid #ffb703';
    ringBg = 'rgba(255, 183, 3, 0.15)';
    ringShadow = '0 0 22px rgba(255, 183, 3, 0.5)';
  } else if (cursorVariant === 'text') {
    ringSize = 54;
    ringBorder = '1.5px solid #00e5ff';
    ringBg = 'rgba(0, 229, 255, 0.18)';
    ringShadow = '0 0 20px rgba(0, 229, 255, 0.5)';
  } else if (cursorVariant === 'button') {
    ringSize = 46;
    ringBorder = '1.5px solid rgba(255, 255, 255, 0.8)';
    ringBg = 'rgba(255, 255, 255, 0.1)';
    ringShadow = '0 0 15px rgba(255, 255, 255, 0.4)';
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 999999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
    >
      {/* Outer Floating Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'absolute',
          top: -ringSize / 2,
          left: -ringSize / 2,
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: ringBorder,
          backgroundColor: ringBg,
          boxShadow: ringShadow,
          backdropFilter: cursorText ? 'blur(4px)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1), height 0.22s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
          willChange: 'transform',
        }}
      >
        {cursorText && (
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 900,
              fontFamily: 'var(--font-title)',
              letterSpacing: '0.12em',
              color: cursorVariant === 'register' ? '#ff4d6d' : cursorVariant === 'card' ? '#ffb703' : '#ffffff',
              textShadow: '0 0 6px rgba(0,0,0,0.8)',
              userSelect: 'none',
            }}
          >
            {cursorText}
          </span>
        )}
      </div>

      {/* Center Precise Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'absolute',
          top: -3.5,
          left: -3.5,
          width: 7,
          height: 7,
          borderRadius: '50%',
          backgroundColor: cursorVariant === 'register' ? '#d90429' : cursorVariant === 'card' ? '#ffb703' : '#00e5ff',
          boxShadow: `0 0 8px ${cursorVariant === 'register' ? '#d90429' : cursorVariant === 'card' ? '#ffb703' : '#00e5ff'}`,
          opacity: cursorText ? 0 : 1,
          transition: 'opacity 0.15s ease, background-color 0.2s ease',
          willChange: 'transform',
        }}
      />
    </div>
  );
};
