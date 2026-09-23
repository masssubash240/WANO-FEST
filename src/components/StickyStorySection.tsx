import React, { useState, useEffect, useRef } from 'react';

interface StoryChapter {
  id: string;
  step: string;
  kanji: string;
  title: string;
  subtitle: string;
  quote: string;
  description: string;
  image: string;
  video?: string;
  accent: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 'ch-01',
    step: 'STORY 01',
    kanji: '出航',
    title: 'THE CALL TO ADVENTURE',
    subtitle: 'THE GOLDEN AGE OF TECH',
    quote: '“Inherited will, the swelling of the era, and the dreams of its people — these are things that cannot be stopped.”',
    description:
      'Wano Fest is not merely a symposium; it is a legendary pilgrimage. Across the digital Grand Line, brightest engineering prodigies, digital artists, and creative rebels gather under one banner to challenge existing horizons.',
    image: '/images/will_of_d.jpg',
    video: '/luffy.mp4',
    accent: '#00e5ff',
  },
  {
    id: 'ch-02',
    step: 'STORY 02',
    kanji: '刀魂',
    title: 'THE CYBER SAMURAI',
    subtitle: 'BLADES OF CODE & ARCHITECTURE',
    quote: '“When you decide to follow your dream, you have to be ready to cut through impossible odds.”',
    description:
      'In the Zoro Tech Division, code is treated as steel. Algorithms are honed with discipline, neural nets are forged with precision, and every security exploit patched is a duel won against chaos.',
    image: '/images/zoro_tech.jpg',
    video: '/luffy2.mp4',
    accent: '#d90429',
  },
  {
    id: 'ch-03',
    step: 'STORY 03',
    kanji: '仲間',
    title: 'THE STRAW HAT ALLIANCE',
    subtitle: 'ONE CREW, UNBROKEN BONDS',
    quote: '“No matter how deep the sea or how fierce the storm, we navigate forward together.”',
    description:
      'From vibrant cosplay masquerades to midnight hackathons, the power of CybiTradic lies in Nakama. Tech and Non-Tech dissolve into a single electrifying celebration where everyone finds their crew.',
    image: '/images/nakama_tribute.jpg',
    video: '/lufy3.mp4',
    accent: '#ffb703',
  },
  {
    id: 'ch-04',
    step: 'STORY 04',
    kanji: '夜明け',
    title: 'THE DAWN OF LEGENDS',
    subtitle: 'THE FINAL SHOWDOWN',
    quote: '“The dawn always follows the darkest hour. Open the borders of your potential!”',
    description:
      'When the final clue is solved and the last match ends, champions will rise. Winners will be crowned across nine events — and your story becomes part of the symposium legend.',
    image: '/images/grand_line_visuals.jpg',
    video: '/luffy.mp4',
    accent: '#9d4edd',
  },
];

export const StickyStorySection: React.FC = () => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      chapterRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // When chapter enters viewport center
        if (rect.top <= vh * 0.45 && rect.bottom >= vh * 0.2) {
          setActiveChapterIndex(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentChapter = CHAPTERS[activeChapterIndex] || CHAPTERS[0];

  return (
    <section
      id="story"
      style={{
        position: 'relative',
        backgroundColor: '#040508',
        padding: '120px 24px',
        overflow: 'clip',
      }}
    >
      {/* Background Ambient Aura */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '600px',
          height: '600px',
          background: `radial-gradient(circle, ${currentChapter.accent}22 0%, transparent 70%)`,
          filter: 'blur(70px)',
          transition: 'background 0.8s ease',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Section Pill & Title */}
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}
          >
            <span className="wano-hanko-seal" style={{ width: '26px', height: '26px', fontSize: '0.85rem' }}>
              伝
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.25em',
                color: '#ffb703',
                textTransform: 'uppercase',
              }}
            >
              CINEMATIC NARRATIVE CHRONICLES
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #ffffff 0%, #00e5ff 50%, #d90429 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.06em',
              margin: '0 0 10px 0',
            }}
          >
            CHRONICLES OF WANO
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            A four-part journey into the origin, spirit, and future of CybiTradic Wano Fest.
          </p>
        </div>

        {/* ─── TWO-COLUMN STICKY LAYOUT ─── */}
        <div className="sticky-story-grid">
          {/* LEFT: STICKY CINEMATIC VISUAL FRAME */}
          <div
            style={{
              position: 'sticky',
              top: '120px',
              borderRadius: '24px',
              overflow: 'hidden',
              height: 'clamp(440px, 68vh, 620px)',
              border: `2px solid ${currentChapter.accent}`,
              boxShadow: `0 25px 60px rgba(0,0,0,0.9), 0 0 45px ${currentChapter.accent}44`,
              transition: 'border-color 0.6s ease, box-shadow 0.6s ease',
              backgroundColor: '#080c16',
            }}
          >
            {/* BACKGROUND VIDEO — LUFFY 2 (full frame) */}
            <video
              key={currentChapter.video || '/luffy2.mp4'}
              src={currentChapter.video || '/luffy2.mp4'}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />

            {/* Soft dark gradient so badges & tracker stay readable */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                pointerEvents: 'none',
                background:
                  'linear-gradient(180deg, rgba(4,5,8,0.85) 0%, rgba(4,5,8,0) 22%, rgba(4,5,8,0) 74%, rgba(4,5,8,0.85) 100%)',
              }}
            />

            {/* Sticky Frame Overlay Badges */}
            <div
              style={{
                position: 'absolute',
                top: '24px',
                left: '24px',
                right: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 5,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(6, 8, 14, 0.85)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: `1px solid ${currentChapter.accent}66`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: currentChapter.accent, letterSpacing: '0.15em' }}>
                  {currentChapter.step}
                </span>
              </div>

              <div
                className="font-brush"
                style={{
                  fontSize: '2rem',
                  color: currentChapter.accent,
                  textShadow: `0 0 15px ${currentChapter.accent}`,
                  fontWeight: 900,
                }}
              >
                {currentChapter.kanji}
              </div>
            </div>

            {/* Bottom Floating Step Tracker */}
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                right: '24px',
                display: 'flex',
                gap: '8px',
                zIndex: 5,
              }}
            >
              {CHAPTERS.map((ch, idx) => (
                <div
                  key={ch.id}
                  style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '2px',
                    backgroundColor: idx <= activeChapterIndex ? currentChapter.accent : 'rgba(255,255,255,0.15)',
                    boxShadow: idx === activeChapterIndex ? `0 0 10px ${currentChapter.accent}` : 'none',
                    transition: 'all 0.4s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: SCROLLING STORY CHAPTERS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '40px' }}>
            {CHAPTERS.map((ch, idx) => {
              const isCurrent = idx === activeChapterIndex;
              return (
                <div
                  key={ch.id}
                  ref={(el) => { chapterRefs.current[idx] = el; }}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '36px',
                    borderRadius: '20px',
                    background: isCurrent ? 'rgba(14, 20, 36, 0.85)' : 'rgba(10, 14, 24, 0.4)',
                    border: `1.5px solid ${isCurrent ? ch.accent : 'rgba(255, 255, 255, 0.08)'}`,
                    boxShadow: isCurrent
                      ? `0 20px 50px rgba(0,0,0,0.7), 0 0 30px ${ch.accent}33`
                      : 'none',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {/* Background video specifically for Story 03 (The Straw Hat Alliance) */}
                  {ch.id === 'ch-03' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 0,
                        pointerEvents: 'none',
                        overflow: 'hidden',
                        borderRadius: '20px',
                      }}
                    >
                      <video
                        src="/luffy2.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: isCurrent ? 0.38 : 0.18,
                          filter: 'contrast(1.15) brightness(0.85)',
                          transition: 'opacity 0.5s ease',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(135deg, rgba(8, 12, 24, 0.94) 0%, rgba(14, 20, 36, 0.82) 50%, rgba(8, 12, 24, 0.94) 100%)',
                        }}
                      />
                    </div>
                  )}

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '10px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-title)',
                          fontSize: '0.85rem',
                          fontWeight: 900,
                          color: ch.accent,
                          letterSpacing: '0.2em',
                        }}
                      >
                        {ch.step}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: 'var(--text-muted)',
                          letterSpacing: '0.15em',
                        }}
                      >
                        {ch.subtitle}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-title)',
                        fontSize: 'clamp(1.6rem, 2.5vw, 2.3rem)',
                        fontWeight: 900,
                        color: '#ffffff',
                        letterSpacing: '0.04em',
                        margin: '0 0 16px 0',
                      }}
                    >
                      {ch.title}
                    </h3>

                    <blockquote
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontStyle: 'italic',
                        fontSize: '0.98rem',
                        color: '#ffb703',
                        lineHeight: 1.6,
                        margin: '0 0 16px 0',
                        paddingLeft: '16px',
                        borderLeft: `3px solid ${ch.accent}`,
                      }}
                    >
                      {ch.quote}
                    </blockquote>

                    <p
                      style={{
                        fontSize: '0.94rem',
                        color: 'rgba(220, 230, 245, 0.85)',
                        lineHeight: 1.8,
                        margin: 0,
                      }}
                    >
                      {ch.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── IMAGE GALLERY BELOW STICKY SECTION ─── */}
        <div
          style={{
            marginTop: '120px',
            display: 'flex',
            flexDirection: 'column',
            gap: '80px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.25em',
                color: '#ffb703',
                textTransform: 'uppercase',
              }}
            >
              VISUAL CHRONICLES
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.05em',
                margin: '12px 0 0 0',
              }}
            >
              THE SAGA IN FRAMES
            </h3>
          </div>

          {CHAPTERS.map((ch) => (
            <div
              key={`gallery-${ch.id}`}
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                height: 'clamp(380px, 55vh, 560px)',
                border: `2px solid ${ch.accent}55`,
                boxShadow: `0 30px 80px rgba(0,0,0,0.8), 0 0 40px ${ch.accent}22`,
                cursor: 'pointer',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.015)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 40px 100px rgba(0,0,0,0.9), 0 0 60px ${ch.accent}44`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 30px 80px rgba(0,0,0,0.8), 0 0 40px ${ch.accent}22`;
              }}
            >
              {/* Chapter Media: Video for Story 03, image for others */}
              {ch.id === 'ch-03' ? (
                <video
                  src="/luffy2.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
              ) : (
                <img
                  src={ch.image}
                  alt={ch.title}
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
              )}

              {/* Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(180deg, rgba(4,5,8,0.3) 0%, rgba(4,5,8,0.1) 40%, rgba(4,5,8,0.7) 75%, rgba(4,5,8,0.95) 100%)`,
                  pointerEvents: 'none',
                }}
              />

              {/* Left accent bar */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '15%',
                  bottom: '15%',
                  width: '4px',
                  background: `linear-gradient(180deg, transparent, ${ch.accent}, transparent)`,
                  borderRadius: '2px',
                }}
              />

              {/* Top-left badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '28px',
                  left: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(6, 8, 14, 0.8)',
                  padding: '8px 18px',
                  borderRadius: '20px',
                  border: `1px solid ${ch.accent}66`,
                  backdropFilter: 'blur(10px)',
                  zIndex: 3,
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    color: ch.accent,
                    letterSpacing: '0.15em',
                  }}
                >
                  {ch.step}
                </span>
              </div>

              {/* Top-right kanji */}
              <div
                className="font-brush"
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '32px',
                  fontSize: '3rem',
                  color: ch.accent,
                  textShadow: `0 0 25px ${ch.accent}88`,
                  fontWeight: 900,
                  zIndex: 3,
                  opacity: 0.7,
                }}
              >
                {ch.kanji}
              </div>

              {/* Bottom content overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '40px 36px',
                  zIndex: 3,
                }}
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: ch.accent,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  {ch.subtitle}
                </span>
                <h4
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '0.04em',
                    margin: '0 0 14px 0',
                    textShadow: '0 2px 20px rgba(0,0,0,0.7)',
                  }}
                >
                  {ch.title}
                </h4>
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: 'rgba(220, 230, 245, 0.85)',
                    lineHeight: 1.75,
                    margin: 0,
                    maxWidth: '650px',
                  }}
                >
                  {ch.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
