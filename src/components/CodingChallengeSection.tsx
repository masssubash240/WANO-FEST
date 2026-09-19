import { useEffect, useRef, useState } from 'react';

/**
 * CODING CHALLENGE — "PIRATES OF LOGIC"
 * Full-bleed poster-style section, modelled on the official event poster
 * (public/images/ai_prompt.png): red/black grunge texture, brush-stroke
 * title, katakana strip, poster artwork and a Register CTA.
 */

const POSTER_ART = '/images/coding_challenge.png';

export function CodingChallengeSection({
  onRegister,
  onOpenDetail,
}: {
  onRegister: () => void;
  onOpenDetail?: () => void;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setParallax((window.innerHeight - rect.top) * 0.06);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const reveal = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(40px)',
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  });

  return (
    <section
      ref={sectionRef}
      id="coding-challenge"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        padding: 'clamp(60px, 8vw, 120px) clamp(20px, 6vw, 80px)',
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(217, 4, 41, 0.35), transparent 70%),
          radial-gradient(ellipse 60% 50% at 15% 90%, rgba(120, 10, 20, 0.5), transparent 70%),
          linear-gradient(160deg, #14060a 0%, #1a070c 45%, #0d0507 100%)
        `,
        overflow: 'hidden',
        fontFamily: "'Russo One', sans-serif",
      }}
    >
      {/* ─── GRUNGE SCRATCH TEXTURE ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.5,
          backgroundImage: `
            repeating-linear-gradient(115deg, transparent 0px, transparent 60px, rgba(217,4,41,0.06) 60px, rgba(217,4,41,0.06) 62px),
            repeating-linear-gradient(-50deg, transparent 0px, transparent 90px, rgba(0,0,0,0.25) 90px, rgba(0,0,0,0.25) 93px)
          `,
        }}
      />


      {/* ─── KATAKANA / JP VERTICAL STRIPS ─── */}
      <div
        style={{
          position: 'absolute',
          left: '2%',
          top: '10%',
          writingMode: 'vertical-rl',
          fontFamily: 'var(--font-jp, "Yuji Syuku", serif)',
          fontSize: 'clamp(1.4rem, 3vw, 2.6rem)',
          color: 'rgba(217, 4, 41, 0.18)',
          letterSpacing: '0.4em',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        論理の海賊
      </div>
      <div
        style={{
          position: 'absolute',
          right: '2%',
          bottom: '8%',
          writingMode: 'vertical-rl',
          fontFamily: 'var(--font-jp, "Yuji Syuku", serif)',
          fontSize: 'clamp(1.2rem, 2.4vw, 2rem)',
          color: 'rgba(255, 255, 255, 0.06)',
          letterSpacing: '0.4em',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        速さの戦い
      </div>

      <div
        style={{
          position: 'relative',
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))',
          gap: 'clamp(30px, 5vw, 70px)',
          alignItems: 'center',
        }}
      >
        {/* ─── LEFT: POSTER COPY ─── */}
        <div>
          {/* Event tag */}
          <div
            style={{
              ...reveal(0),
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 18px',
              background: '#d90429',
              clipPath: 'polygon(0 0, 100% 0, 96% 100%, 2% 100%)',
              color: '#fff',
              fontSize: '0.72rem',
              letterSpacing: '0.3em',
              fontWeight: 700,
            }}
          >
            ⚔ ZORO DIVISION — TECHNICAL · PROGRAMMING
          </div>

          {/* Brush-stroke title */}
          <h2
            style={{
              ...reveal(0.12),
              margin: '26px 0 0 0',
              fontFamily: 'var(--font-brush, "Russo One", sans-serif)',
              fontSize: 'clamp(2.6rem, 7vw, 5rem)',
              lineHeight: 1.02,
              color: '#ffffff',
              textShadow: '4px 4px 0 rgba(217, 4, 41, 0.85), 8px 8px 24px rgba(0,0,0,0.8)',
              textTransform: 'uppercase',
            }}
          >
            Coding
            <br />
            <span style={{ color: '#d90429', WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>
              Challenge
            </span>
          </h2>

          {/* Tagline */}
          <div style={{ ...reveal(0.24), marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 3, background: '#d90429', transform: 'skewX(-30deg)' }} />
            <span
              style={{
                fontSize: 'clamp(0.95rem, 2.2vw, 1.3rem)',
                letterSpacing: '0.35em',
                color: '#f9c74f',
                textTransform: 'uppercase',
              }}
            >
              Pirates of Logic
            </span>
          </div>

          <p
            style={{
              ...reveal(0.34),
              marginTop: 24,
              maxWidth: 480,
              fontFamily: 'var(--font-body, sans-serif)',
              fontSize: 'clamp(0.92rem, 1.6vw, 1.05rem)',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            Solve the given coding problems under strict time limits. Speed, correctness and
            clean logic decide who claims the treasure. Only one pirate walks away with the
            crown — will it be you?
          </p>

          {/* Quick facts */}
          <div style={{ ...reveal(0.44), marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {[
              { k: 'MODE', v: 'SOLO' },
              { k: 'JUDGING', v: 'SPEED + CORRECTNESS' },
              { k: 'ARENA', v: 'ROUND-BASED' },
            ].map((f) => (
              <div
                key={f.k}
                style={{
                  padding: '10px 16px',
                  border: '1px solid rgba(217, 4, 41, 0.45)',
                  background: 'rgba(217, 4, 41, 0.08)',
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                }}
              >
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.5)' }}>
                  {f.k}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#fff', marginTop: 4, letterSpacing: '0.08em' }}>
                  {f.v}
                </div>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div style={{ ...reveal(0.54), marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <button
              onClick={onRegister}
              style={{
                cursor: 'pointer',
                border: 'none',
                padding: '16px 42px',
                background: 'linear-gradient(135deg, #d90429, #8c0d20)',
                color: '#fff',
                fontFamily: "'Russo One', sans-serif",
                fontSize: '1rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)',
                boxShadow: '0 8px 30px rgba(217, 4, 41, 0.4)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 14px 40px rgba(217, 4, 41, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(217, 4, 41, 0.4)';
              }}
            >
              ⚑ Register Your Crew
            </button>
            {onOpenDetail && (
              <button
                onClick={onOpenDetail}
                style={{
                  cursor: 'pointer',
                  background: 'transparent',
                  border: '2px solid rgba(255,255,255,0.3)',
                  padding: '16px 34px',
                  color: '#fff',
                  fontFamily: "'Russo One', sans-serif",
                  fontSize: '0.9rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  transition: 'border-color 0.2s ease, background 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d90429';
                  e.currentTarget.style.background = 'rgba(217, 4, 41, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                View Rules & Details
              </button>
            )}
          </div>
        </div>

        {/* ─── RIGHT: POSTER ARTWORK ─── */}
        <div style={{ ...reveal(0.3), position: 'relative', display: 'flex', justifyContent: 'center' }}>
          {/* Red glow behind poster */}
          <div
            style={{
              position: 'absolute',
              inset: '-8%',
              background: 'radial-gradient(ellipse at center, rgba(217,4,41,0.35), transparent 65%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }}
          />
          <button
            onClick={onOpenDetail}
            style={{
              cursor: onOpenDetail ? 'pointer' : 'default',
              position: 'relative',
              display: 'block',
              width: 'min(100%, 460px)',
              padding: 0,
              border: '3px solid rgba(255,255,255,0.12)',
              outline: '3px solid rgba(217, 4, 41, 0.6)',
              outlineOffset: 6,
              background: 'transparent',
              transform: `rotate(-2deg) translateY(${-parallax}px)`,
              transition: 'transform 0.3s ease',
              boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
            }}
          >
            <img
              src={POSTER_ART}
              alt="Coding Challenge — Pirates of Logic event poster"
              loading="lazy"
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                filter: 'contrast(1.05) saturate(1.1)',
              }}
            />
            {/* Corner rip accents */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: '54px 54px 0 0',
                borderColor: 'rgba(10,4,6,0.85) transparent transparent transparent',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: '0 0 54px 54px',
                borderColor: 'transparent transparent rgba(10,4,6,0.85) transparent',
              }}
            />
          </button>

          {/* Wanted-style stamp */}
          <div
            style={{
              position: 'absolute',
              top: '-6%',
              right: '4%',
              transform: 'rotate(12deg)',
              padding: '8px 16px',
              border: '3px solid #d90429',
              color: '#d90429',
              fontSize: '0.85rem',
              letterSpacing: '0.3em',
              background: 'rgba(20, 6, 10, 0.85)',
              textTransform: 'uppercase',
              boxShadow: '0 4px 18px rgba(0,0,0,0.5)',
            }}
          >
            Solo Bounty
          </div>
        </div>
      </div>
    </section>
  );
}

