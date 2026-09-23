import React, { useEffect, useRef } from 'react';
import { useScrollVelocity } from '../hooks/useScrollVelocity';

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  type: 'ember' | 'dust' | 'sakura';
  spin?: number;
  spinSpeed?: number;
}

export const AtmosphereParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { velocity } = useScrollVelocity();
  const velocityRef = useRef(0);

  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Throttled resize for mobile — avoid layout thrashing
    let resizeTimeout: number | null = null;
    const handleResize = () => {
      if (resizeTimeout) return;
      resizeTimeout = window.setTimeout(() => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        resizeTimeout = null;
      }, isMobile ? 300 : 100);
    };

    window.addEventListener('resize', handleResize);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Drastically reduce particle count on mobile for smooth 60fps
    const count = isMobile ? 10 : 45;
    const particles: Particle[] = [];

    const colors = [
      'rgba(255, 183, 3, ', // gold ember
      'rgba(217, 4, 41, ',  // samurai red ember
      'rgba(0, 229, 255, ', // tech cyan spark
      'rgba(244, 236, 216, ', // parchment dust
    ];

    for (let i = 0; i < count; i++) {
      const type = i % 4 === 0 ? 'sakura' : i % 2 === 0 ? 'ember' : 'dust';
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: type === 'sakura' ? Math.random() * 4 + 3 : Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2,
        alpha: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        type,
        spin: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.03,
      });
    }

    let animId: number;
    let time = 0;
    let lastFrameTime = 0;
    // Mobile: target ~30fps (33ms), Desktop: full 60fps
    const frameBudget = isMobile ? 33 : 0;

    const render = (timestamp: number) => {
      // Frame rate throttle on mobile
      if (frameBudget > 0 && timestamp - lastFrameTime < frameBudget) {
        animId = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = timestamp;

      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      const scrollBoost = velocityRef.current * 0.05;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply scroll-linked velocity
        p.y += p.vy - scrollBoost;
        p.x += p.vx + Math.sin(time + i) * 0.3;

        if (p.spin !== undefined && p.spinSpeed !== undefined) {
          p.spin += p.spinSpeed;
        }

        // Wrap around boundaries
        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        } else if (p.y > height + 20) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        if (p.x < -20) p.x = width + 10;
        else if (p.x > width + 20) p.x = -10;

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);

        if (p.type === 'sakura' && p.spin !== undefined) {
          ctx.rotate(p.spin);
          ctx.fillStyle = `${p.color}${p.alpha * 0.75})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Ember or dust — disable shadowBlur on mobile (GPU-expensive)
          ctx.fillStyle = `${p.color}${p.alpha})`;
          if (!isMobile) {
            ctx.shadowColor = p.color.includes('217') ? '#d90429' : '#ffb703';
            ctx.shadowBlur = p.type === 'ember' ? 6 : 0;
          }
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 3, // floats above background layers, behind cards
        opacity: 0.85,
      }}
    />
  );
};
