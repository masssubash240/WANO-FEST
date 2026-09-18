import { useState, useEffect, useRef } from 'react';

export interface ScrollMetrics {
  scrollY: number;
  velocity: number; // smoothed velocity in px per frame
  rawVelocity: number;
  direction: 'down' | 'up' | 'idle';
  progress: number; // 0 to 1 across document height
  isScrolling: boolean;
}

export function useScrollVelocity(): ScrollMetrics {
  const [metrics, setMetrics] = useState<ScrollMetrics>({
    scrollY: 0,
    velocity: 0,
    rawVelocity: 0,
    direction: 'idle',
    progress: 0,
    isScrolling: false,
  });

  const lastScrollY = useRef(0);
  const smoothedVelocity = useRef(0);
  const rawVelocity = useRef(0);
  const idleTimeout = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset;
      const delta = currentScrollY - lastScrollY.current;
      rawVelocity.current = delta;

      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      ) - window.innerHeight;

      const progress = docHeight > 0 ? Math.min(1, Math.max(0, currentScrollY / docHeight)) : 0;
      const direction = delta > 0 ? 'down' : delta < 0 ? 'up' : 'idle';

      lastScrollY.current = currentScrollY;

      if (idleTimeout.current) {
        window.clearTimeout(idleTimeout.current);
      }

      idleTimeout.current = window.setTimeout(() => {
        rawVelocity.current = 0;
      }, 120);

      if (prefersReducedMotion) {
        setMetrics({
          scrollY: currentScrollY,
          velocity: 0,
          rawVelocity: 0,
          direction,
          progress,
          isScrolling: false,
        });
      }
    };

    // Smooth physics loop with RAF
    const tick = () => {
      if (!prefersReducedMotion) {
        // Exponential lerp dampening
        smoothedVelocity.current += (rawVelocity.current - smoothedVelocity.current) * 0.18;

        const currentScrollY = window.scrollY || window.pageYOffset;
        const docHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        ) - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(1, Math.max(0, currentScrollY / docHeight)) : 0;
        const isScrolling = Math.abs(smoothedVelocity.current) > 0.15;
        const direction = smoothedVelocity.current > 0.2 ? 'down' : smoothedVelocity.current < -0.2 ? 'up' : 'idle';

        setMetrics({
          scrollY: currentScrollY,
          velocity: Math.round(smoothedVelocity.current * 100) / 100,
          rawVelocity: rawVelocity.current,
          direction,
          progress,
          isScrolling,
        });
      }

      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
    };
  }, []);

  return metrics;
}
