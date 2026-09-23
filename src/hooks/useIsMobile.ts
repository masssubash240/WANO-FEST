import { useState, useEffect } from 'react';

/**
 * Detects if the user is on a mobile device (viewport < 768px or touch-primary).
 * Used to conditionally disable heavy effects (particles, custom cursor, etc.)
 * for improved mobile performance.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint || window.matchMedia('(pointer: coarse)').matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const handleChange = () => {
      setIsMobile(
        window.innerWidth < breakpoint || window.matchMedia('(pointer: coarse)').matches
      );
    };

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return isMobile;
}
