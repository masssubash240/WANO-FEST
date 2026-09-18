import React, { useState, useRef, useEffect } from 'react';

interface CrewMember {
  id: string;
  name: string;
  shortName: string;
  degree: string;
  role: string;
  expertise?: string;
  department?: string;
  phone: string;
  tel: string;
  visualIdentity: string;
  color: string;
  secondaryColor: string;
  kanji: string;
  quote: string;
  bounty: string;
  // Specific object-position or scale in crew_artwork.jpg
  portraitCrop: {
    objectPosition: string;
    scale: string;
  };
  mangaGear: string;
  mangaQuote: string;
  symbols: string[];
}

const CREW_MEMBERS: CrewMember[] = [
  {
    id: 'sathi',
    name: 'SATHIYASEELAN',
    shortName: 'SATHI',
    degree: 'B.TECH IT',
    role: 'AI DEVELOPER',
    expertise: 'NEURAL NETWORKS & APPLIED AI',
    phone: '+91 96267 44195',
    tel: '+919626744195',
    visualIdentity: 'AI Navigator / Intelligence Crew',
    color: '#00e676',
    secondaryColor: '#00e5ff',
    kanji: '智将',
    quote: '“Charting unseen intelligence across the digital Grand Line.”',
    bounty: '₹ 5,00,000',
    portraitCrop: {
      objectPosition: '27% 48%',
      scale: '2.1',
    },
    mangaGear: 'NEURAL ALGORITHM CORES & CYBER BLADE',
    mangaQuote: '“SYNAPSE AWAKENED: NAVIGATING TO LAUGH TALE!”',
    symbols: ['[AI] TENSOR FLOW', 'NODE: 0x7E3A', 'σ(W·x + b)', 'HOLO MAP READY'],
  },
  {
    id: 'subash',
    name: 'M. SUBASH KUMAR',
    shortName: 'SUBASH',
    degree: 'B.E. CYBER SECURITY',
    role: 'CTF COORDINATOR',
    expertise: 'ETHICAL HACKER • TECH SOLUTIONS',
    phone: '6383853695',
    tel: '6383853695',
    visualIdentity: 'Cyber Pirate / Security Captain',
    color: '#00e5ff',
    secondaryColor: '#d90429',
    kanji: '船長',
    quote: '“Inherited will, root privilege, and unbreakable security.”',
    bounty: '₹ 5,00,000',
    portraitCrop: {
      objectPosition: '50% 48%',
      scale: '2.1',
    },
    mangaGear: 'ETHICAL EXPLOIT RIG & PIRATE STRAW HAT',
    mangaQuote: '“ROOT ACCESS GRANTED: THE DIGITAL KING RISES!”',
    symbols: ['$ sudo su -c wano', 'FIREWALL: SECURE', 'PORT: 2026 OPEN', 'SHA-256 HASH'],
  },
  {
    id: 'raj',
    name: 'RAJ',
    shortName: 'RAJ',
    department: 'AIDS',
    degree: 'B.TECH AIDS',
    role: 'DIGITAL STRATEGIST',
    expertise: 'DATA ARCHITECTURE & TACTICAL STRATEGY',
    phone: '+91 93611 84362',
    tel: '+919361184362',
    visualIdentity: 'Digital Strategist / Crew Member',
    color: '#ffb703',
    secondaryColor: '#ff3366',
    kanji: '軍師',
    quote: '“Every move calculated, every opportunity seized with precision.”',
    bounty: '₹ 5,00,000',
    portraitCrop: {
      objectPosition: '75% 48%',
      scale: '2.1',
    },
    mangaGear: 'NAUTICAL COMPASS & DATA VECTOR STREAM',
    mangaQuote: '“TACTICAL MATRIX DEPLOYED: ZERO DEVIATION!”',
    symbols: ['AIDS DATA ENGINE', 'COORDINATES LOCKED', 'STRATEGY: ONSLAUGHT', 'PIRATE SEAL ✓'],
  },
];

export const CrewContactSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'subash' | 'sathi' | 'raj'>('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [cardTilt, setCardTilt] = useState<{ [key: string]: { rx: number; ry: number } }>({});
  const [mangaModalMember, setMangaModalMember] = useState<CrewMember | null>(null);
  const [isMangaExploded, setIsMangaExploded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse move for ambient harbour lights
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rx = -(y / (rect.height / 2)) * 10;
    const ry = (x / (rect.width / 2)) * 10;
    setCardTilt((prev) => ({ ...prev, [id]: { rx, ry } }));
  };

  const handleCardMouseLeave = (id: string) => {
    setHoveredCard(null);
    setCardTilt((prev) => ({ ...prev, [id]: { rx: 0, ry: 0 } }));
  };

  const openMangaModal = (member: CrewMember) => {
    setMangaModalMember(member);
    setIsMangaExploded(false);
    // Auto-explode into color after brief manga build-up
    setTimeout(() => {
      setIsMangaExploded(true);
    }, 1800);
  };

  return (
    <section
      id="crew"
      ref={containerRef}
      style={{
        position: 'relative',
        backgroundColor: '#030407',
        color: '#fff',
        padding: '120px 20px 100px 20px',
        overflow: 'hidden',
        borderTop: '2px solid rgba(255, 183, 3, 0.3)',
      }}
    >
      {/* ─── ANCHOR FOR #contact AS WELL ─── */}
      <div id="contact" style={{ position: 'absolute', top: 0, left: 0 }} />

      {/* ─── ATMOSPHERIC SHIP-DECK & HARBOUR ENVIRONMENT BACKGROUND ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255, 183, 3, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 20% 20%, rgba(0, 229, 255, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, rgba(217, 4, 41, 0.1) 0%, transparent 60%),
            linear-gradient(180deg, rgba(3, 4, 7, 0.95) 0%, rgba(8, 12, 22, 0.92) 50%, rgba(4, 5, 8, 0.98) 100%)
          `,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Wood plank texture lines in background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 48px, rgba(255, 255, 255, 0.015) 49px, transparent 50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Floating Ember & Mist Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(255, 183, 3, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          animation: 'shipBobbing 8s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          animation: 'shipBobbing 10s ease-in-out infinite reverse',
        }}
      />

      <div style={{ maxWidth: '1360px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* ─── PAGE TITLE & HEADER ─── */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          {/* Hanko Seal & Category Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 20px',
              background: 'rgba(255, 183, 3, 0.08)',
              border: '1px solid rgba(255, 183, 3, 0.35)',
              borderRadius: '30px',
              backdropFilter: 'blur(10px)',
              marginBottom: '18px',
            }}
          >
            <span
              className="wano-hanko-seal"
              style={{ width: '26px', height: '26px', fontSize: '0.8rem', background: '#d90429' }}
            >
              仲間
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.28em',
                color: '#ffb703',
                textTransform: 'uppercase',
              }}
            >
              MEET THE CREW BEHIND THE VOYAGE
            </span>
            <span className="lantern-glow" style={{ fontSize: '1rem' }}>
              🏮
            </span>
          </div>

          {/* Huge Distressed Pirate Lettering with 3D Extrusion & Light Sweep */}
          <div className="pirate-crew-shimmer" style={{ display: 'inline-block' }}>
            <h2
              className="pirate-crew-title"
              style={{
                fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              THE CREW
            </h2>
          </div>

          <p
            style={{
              color: 'rgba(230, 240, 255, 0.8)',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              maxWidth: '680px',
              margin: '20px auto 0 auto',
              lineHeight: 1.6,
              fontFamily: 'var(--font-body)',
            }}
          >
            Architects of the CybiTradic Grand Line — commanding ethical cyber security, autonomous intelligence, and
            cutting-edge digital strategies for WANOFEST 2026.
          </p>

          {/* Fleet Filter Tabs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '36px',
            }}
          >
            {[
              { id: 'all', label: '⚔️ FLEET FORMATION' },
              { id: 'subash', label: '👑 SUBASH (CAPTAIN)' },
              { id: 'sathi', label: '🧠 SATHI (AI NAVIGATOR)' },
              { id: 'raj', label: '🧭 RAJ (STRATEGIST)' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, #ffb703 0%, #d90429 100%)'
                      : 'rgba(14, 20, 36, 0.75)',
                    color: isActive ? '#000' : '#dce6f5',
                    border: `1.5px solid ${isActive ? '#ffd166' : 'rgba(255, 183, 3, 0.25)'}`,
                    padding: '10px 22px',
                    borderRadius: '25px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 0 25px rgba(255, 183, 3, 0.5)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.borderColor = '#00e5ff';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.borderColor = 'rgba(255, 183, 3, 0.25)';
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── CREW MEMBER CARDS (WANTED POSTER + PIRATE CREW + 3D HUD) ─── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              activeTab === 'all'
                ? 'repeat(auto-fit, minmax(320px, 1fr))'
                : 'minmax(320px, 640px)',
            justifyContent: 'center',
            gap: '36px',
            marginBottom: '90px',
            alignItems: 'stretch',
          }}
        >
          {CREW_MEMBERS.filter((m) => activeTab === 'all' || activeTab === m.id).map((member) => {
            const isHovered = hoveredCard === member.id;
            const tilt = cardTilt[member.id] || { rx: 0, ry: 0 };

            return (
              <div
                key={member.id}
                className="perspective-container"
                style={{
                  perspective: '1200px',
                  display: 'flex',
                }}
              >
                <div
                  onMouseMove={(e) => handleCardMouseMove(e, member.id)}
                  onMouseEnter={() => setHoveredCard(member.id)}
                  onMouseLeave={() => handleCardMouseLeave(member.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '24px',
                    background: 'linear-gradient(180deg, #111726 0%, #090c14 100%)',
                    border: `2px solid ${isHovered ? member.color : 'rgba(255, 183, 3, 0.3)'}`,
                    boxShadow: isHovered
                      ? `0 30px 70px rgba(0,0,0,0.95), 0 0 50px ${member.color}55`
                      : '0 20px 50px rgba(0,0,0,0.7)',
                    transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) ${isHovered ? 'scale(1.02)' : 'scale(1)'}`,
                    transition: 'transform 0.15s ease-out, box-shadow 0.4s ease, border-color 0.4s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Metal corner rivets on ship brackets */}
                  <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, opacity: 0.6, fontSize: '0.8rem' }}>🔩</div>
                  <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, opacity: 0.6, fontSize: '0.8rem' }}>🔩</div>
                  <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 10, opacity: 0.6, fontSize: '0.8rem' }}>🔩</div>
                  <div style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 10, opacity: 0.6, fontSize: '0.8rem' }}>🔩</div>

                  {/* Top Wanted Header Bar */}
                  <div
                    style={{
                      background: 'radial-gradient(circle, #2d1d11 0%, #170d06 100%)',
                      borderBottom: '2px solid rgba(255, 183, 3, 0.4)',
                      padding: '14px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>☠️</span>
                      <span
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.85rem',
                          fontWeight: 900,
                          letterSpacing: '0.25em',
                          color: '#f4ecd8',
                        }}
                      >
                        WANTED DEAD OR ALIVE
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-brush)',
                        fontSize: '1.5rem',
                        color: member.color,
                        fontWeight: 900,
                      }}
                    >
                      {member.kanji}
                    </span>
                  </div>

                  {/* ─── CHARACTER PORTRAIT FRAME (Crop from master artwork with 3D aura) ─── */}
                  <div
                    style={{
                      position: 'relative',
                      height: '380px',
                      overflow: 'hidden',
                      backgroundColor: '#05070d',
                      borderBottom: `2px solid ${member.color}44`,
                    }}
                  >
                    {/* Master Artwork Image with Focused Zoom on Character */}
                    <img
                      src="/images/crew_artwork.jpg"
                      alt={member.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: member.portraitCrop.objectPosition,
                        transform: `scale(${member.portraitCrop.scale})`,
                        transformOrigin: member.portraitCrop.objectPosition,
                        filter: isHovered
                          ? 'brightness(1.15) contrast(1.1)'
                          : 'brightness(0.95) contrast(1.05)',
                        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease',
                      }}
                    />

                    {/* Character Specific Holographic HUD Overlays */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(180deg, transparent 0%, rgba(4, 6, 12, 0.1) 40%, rgba(4, 6, 12, 0.95) 100%)`,
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Member Aura Glow on Hover */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `radial-gradient(circle at 50% 40%, ${member.color}25 0%, transparent 70%)`,
                        opacity: isHovered ? 1 : 0.3,
                        transition: 'opacity 0.4s ease',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Floating HUD Cyber/AI/Nautical Symbols */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        zIndex: 4,
                      }}
                    >
                      {member.symbols.map((sym, i) => (
                        <div
                          key={i}
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(5, 8, 15, 0.8)',
                            border: `1px solid ${member.color}66`,
                            color: member.color,
                            backdropFilter: 'blur(6px)',
                            transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                            transition: 'transform 0.3s ease',
                          }}
                        >
                          {sym}
                        </div>
                      ))}
                    </div>

                    {/* Manga Cut-In Interactive Button */}
                    <button
                      onClick={() => openMangaModal(member)}
                      data-cursor="button"
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(10, 14, 24, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        color: '#fff',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                        zIndex: 5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
                        transition: 'all 0.25s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = member.color;
                        e.currentTarget.style.color = '#000';
                        e.currentTarget.style.borderColor = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(10, 14, 24, 0.85)';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                      }}
                    >
                      <span>📜</span> MANGA CUT-IN
                    </button>

                    {/* Bounty Ribbon at bottom of image */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '16px',
                        left: '20px',
                        right: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        zIndex: 4,
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            letterSpacing: '0.2em',
                            color: member.color,
                            textTransform: 'uppercase',
                            display: 'block',
                          }}
                        >
                          {member.visualIdentity}
                        </span>
                        <div
                          style={{
                            fontFamily: 'var(--font-title)',
                            fontSize: '1.4rem',
                            color: '#fff',
                            letterSpacing: '0.04em',
                            textShadow: `0 0 15px ${member.color}`,
                          }}
                        >
                          {member.shortName}
                        </div>
                      </div>

                      <div
                        style={{
                          background: 'rgba(0, 0, 0, 0.85)',
                          border: `1.5px solid ${member.color}`,
                          padding: '4px 12px',
                          borderRadius: '8px',
                          textAlign: 'right',
                        }}
                      >
                        <span style={{ fontSize: '0.62rem', color: '#ffb703', fontWeight: 800, display: 'block' }}>
                          BOUNTY
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-title)',
                            fontSize: '0.95rem',
                            color: '#fff',
                            fontWeight: 900,
                          }}
                        >
                          {member.bounty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ─── CARD DETAILS BODY ─── */}
                  <div
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      {/* Full Name & Degree */}
                      <h3
                        style={{
                          fontFamily: 'var(--font-title)',
                          fontSize: '1.35rem',
                          fontWeight: 900,
                          color: '#ffffff',
                          letterSpacing: '0.04em',
                          margin: '0 0 6px 0',
                        }}
                      >
                        {member.name}
                      </h3>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '16px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: 'rgba(255, 183, 3, 0.15)',
                            border: '1px solid rgba(255, 183, 3, 0.4)',
                            color: '#ffb703',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                          }}
                        >
                          {member.degree}
                        </span>

                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: `${member.color}22`,
                            border: `1px solid ${member.color}55`,
                            color: member.color,
                            fontSize: '0.75rem',
                            fontWeight: 800,
                          }}
                        >
                          {member.role}
                        </span>
                      </div>

                      {/* Expertise */}
                      {member.expertise && (
                        <div
                          style={{
                            fontSize: '0.82rem',
                            color: 'rgba(215, 225, 240, 0.85)',
                            lineHeight: 1.5,
                            marginBottom: '16px',
                            padding: '10px 14px',
                            backgroundColor: 'rgba(6, 10, 18, 0.6)',
                            borderRadius: '10px',
                            borderLeft: `3px solid ${member.color}`,
                          }}
                        >
                          <strong style={{ color: '#fff' }}>EXPERTISE: </strong>
                          {member.expertise}
                        </div>
                      )}

                      {/* Quote */}
                      <blockquote
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontStyle: 'italic',
                          fontSize: '0.86rem',
                          color: '#f4ecd8',
                          margin: '0 0 20px 0',
                          lineHeight: 1.5,
                          opacity: 0.9,
                        }}
                      >
                        {member.quote}
                      </blockquote>
                    </div>

                    {/* Direct Contact Button */}
                    <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                      <a
                        href={`tel:${member.tel}`}
                        data-cursor="button"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          width: '100%',
                          padding: '13px 20px',
                          borderRadius: '16px',
                          background: `linear-gradient(135deg, ${member.color}33 0%, rgba(14, 20, 36, 0.9) 100%)`,
                          border: `1.5px solid ${member.color}`,
                          color: '#fff',
                          textDecoration: 'none',
                          fontFamily: 'var(--font-title)',
                          fontSize: '0.92rem',
                          fontWeight: 800,
                          letterSpacing: '0.06em',
                          boxShadow: isHovered ? `0 0 25px ${member.color}66` : 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = member.color;
                          e.currentTarget.style.color = '#000';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `linear-gradient(135deg, ${member.color}33 0%, rgba(14, 20, 36, 0.9) 100%)`;
                          e.currentTarget.style.color = '#fff';
                        }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>📞</span>
                        CALL {member.shortName}: {member.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── CONTACT THE CREW ACTION DOCK ─── */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(14, 20, 36, 0.9) 0%, rgba(8, 12, 22, 0.95) 100%)',
            border: '2px solid rgba(255, 183, 3, 0.35)',
            borderRadius: '28px',
            padding: '40px 32px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(255, 183, 3, 0.15)',
            marginBottom: '90px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.25em',
                color: '#ffb703',
                textTransform: 'uppercase',
              }}
            >
              COMMUNICATION MATRIX
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 900,
                color: '#fff',
                letterSpacing: '0.05em',
                margin: '8px 0',
              }}
            >
              CONTACT THE CREW
            </h3>
            <p style={{ color: 'rgba(220, 230, 245, 0.75)', fontSize: '0.95rem', margin: 0 }}>
              Need CTF challenges, AI symposium details, or summit access? Reach out directly to the coordinators.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {CREW_MEMBERS.map((m) => (
              <a
                key={`action-${m.id}`}
                href={`tel:${m.tel}`}
                data-cursor="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '18px 24px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(6, 9, 16, 0.75)',
                  border: `1.5px solid ${m.color}55`,
                  textDecoration: 'none',
                  color: '#fff',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = m.color;
                  e.currentTarget.style.boxShadow = `0 14px 35px rgba(0,0,0,0.8), 0 0 25px ${m.color}55`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = `${m.color}55`;
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.5)';
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: `${m.color}22`,
                    border: `1.5px solid ${m.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    flexShrink: 0,
                  }}
                >
                  📞
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: m.color, fontWeight: 800, letterSpacing: '0.15em' }}>
                    CALL {m.shortName}
                  </div>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1rem', fontWeight: 900, color: '#fff' }}>
                    {m.phone}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                    {m.role}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ─── MORE DETAILS: TREASURE MAP BUTTON LEADING TO OFFICIAL COLLEGE ─── */}
        <div style={{ textAlign: 'center', marginBottom: '100px' }}>
          <div
            style={{
              display: 'inline-block',
              position: 'relative',
            }}
          >
            <a
              href="https://reccbe.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="spin-on-hover"
              data-cursor="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '18px',
                padding: '20px 42px',
                borderRadius: '40px',
                background: 'linear-gradient(135deg, #2b1f14 0%, #170d06 50%, #3a2614 100%)',
                border: '2px solid #ffb703',
                boxShadow: '0 15px 45px rgba(0,0,0,0.9), 0 0 35px rgba(255, 183, 3, 0.4), inset 0 0 20px rgba(255, 183, 3, 0.2)',
                color: '#f4ecd8',
                textDecoration: 'none',
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                fontWeight: 900,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                e.currentTarget.style.borderColor = '#ffffff';
                e.currentTarget.style.boxShadow =
                  '0 25px 60px rgba(0,0,0,0.95), 0 0 50px rgba(255, 183, 3, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = '#ffb703';
                e.currentTarget.style.boxShadow =
                  '0 15px 45px rgba(0,0,0,0.9), 0 0 35px rgba(255, 183, 3, 0.4), inset 0 0 20px rgba(255, 183, 3, 0.2)';
              }}
            >
              {/* Spinning Compass Icon */}
              <span
                className="compass-needle"
                style={{
                  display: 'inline-block',
                  fontSize: '1.8rem',
                  filter: 'drop-shadow(0 0 8px #ffb703)',
                }}
              >
                🧭
              </span>

              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#ffb703', letterSpacing: '0.25em' }}>
                  OFFICIAL INSTITUTION PORTAL
                </span>
                <span>EXPLORE MORE • REC CBE</span>
              </div>

              {/* Pirate Seal Stamp */}
              <span
                className="wano-hanko-seal"
                style={{
                  width: '32px',
                  height: '32px',
                  fontSize: '0.9rem',
                  background: '#d90429',
                  border: '1.5px solid #ffb703',
                }}
              >
                印
              </span>
            </a>
          </div>
        </div>

        {/* ─── FINAL CREW SCENE: MASTER ARTWORK REVEAL ─── */}
        <div
          className="ship-deck-float"
          style={{
            position: 'relative',
            borderRadius: '28px',
            overflow: 'hidden',
            border: '2px solid rgba(255, 183, 3, 0.5)',
            boxShadow: '0 35px 100px rgba(0,0,0,0.95), 0 0 50px rgba(255, 183, 3, 0.25)',
            marginBottom: '80px',
            backgroundColor: '#05070e',
          }}
        >
          {/* Complete Uncropped Master Artwork */}
          <img
            src="/images/crew_artwork.jpg"
            alt="CYBITRADIC WANO FEST DEVELOPERS — SUBASH, SATHI, RAJ"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '720px',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />

          {/* Sunset Gradient & Lighting Shimmer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(4,5,8,0.2) 0%, transparent 40%, rgba(4,5,8,0.7) 75%, rgba(4,5,8,0.95) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Bottom Grand Line Banner */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '30px',
              textAlign: 'center',
              zIndex: 3,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(6, 8, 14, 0.85)',
                padding: '6px 20px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 183, 3, 0.4)',
                backdropFilter: 'blur(10px)',
                marginBottom: '10px',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: '#ffb703', fontWeight: 800, letterSpacing: '0.2em' }}>
                M. SUBASH KUMAR  •  SATHIYASEELAN  •  RAJ
              </span>
            </div>

            <h4
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1.4rem, 3.2vw, 2.4rem)',
                fontWeight: 900,
                color: '#fff',
                letterSpacing: '0.08em',
                margin: 0,
                textShadow: '0 2px 20px rgba(0,0,0,0.9)',
              }}
            >
              BUILD. EXPLORE. CREATE. TOGETHER.
            </h4>
          </div>
        </div>

        {/* ─── FINAL ANIMATION: OCEAN WAVE & PARCHMENT TO WANOFEST 2026 ─── */}
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'radial-gradient(ellipse at center, rgba(0, 229, 255, 0.08) 0%, transparent 70%)',
            borderTop: '1px dashed rgba(255, 183, 3, 0.3)',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌊 🧭 ⛵</div>
          <div
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: '1.2rem',
              color: '#ffb703',
              letterSpacing: '0.15em',
              marginBottom: '14px',
            }}
          >
            THE COMPASS POINTS TOWARD WANOFEST 2026
          </div>
          <a
            href="#home"
            data-cursor="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#fff',
              padding: '10px 24px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d90429';
              e.currentTarget.style.borderColor = '#ff5a6e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }}
          >
            RETURN TO GRAND LINE SUMMIT ➔
          </a>
        </div>
      </div>

      {/* ─── FULLSCREEN MANGA CUT-IN TRANSITION MODAL ─── */}
      {mangaModalMember && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setMangaModalMember(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setMangaModalMember(null)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '28px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              color: '#fff',
              fontSize: '1.4rem',
              cursor: 'pointer',
              zIndex: 1010,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>

          {/* Manga Frame Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={isMangaExploded ? 'ink-exploded' : ''}
            style={{
              maxWidth: '900px',
              width: '100%',
              backgroundColor: '#0a0d16',
              border: `3px solid ${isMangaExploded ? mangaModalMember.color : '#fff'}`,
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: isMangaExploded
                ? `0 0 60px ${mangaModalMember.color}88, 0 30px 90px rgba(0,0,0,0.9)`
                : '0 0 40px rgba(255,255,255,0.3)',
              position: 'relative',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Speed Lines for Manga Impact */}
            <div
              className="manga-speed-lines"
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isMangaExploded ? 0.15 : 0.45,
                pointerEvents: 'none',
              }}
            />

            {/* 4-Panel Comic Layout */}
            <div style={{ padding: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  borderBottom: '2px solid rgba(255,255,255,0.2)',
                  paddingBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>⚡</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.9rem',
                      letterSpacing: '0.2em',
                      color: isMangaExploded ? mangaModalMember.color : '#fff',
                      fontWeight: 900,
                    }}
                  >
                    CHAPTER: AWAKENING OF {mangaModalMember.shortName}
                  </span>
                </div>
                <div
                  className="font-brush"
                  style={{
                    fontSize: '2rem',
                    color: isMangaExploded ? mangaModalMember.color : '#fff',
                    fontWeight: 900,
                  }}
                >
                  {mangaModalMember.kanji}
                </div>
              </div>

              {/* 4 Comic Panels Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                  gap: '14px',
                  marginBottom: '20px',
                }}
              >
                {/* Panel 1: Eye Focus */}
                <div
                  style={{
                    height: '180px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.4)',
                    position: 'relative',
                    backgroundColor: '#000',
                  }}
                >
                  <img
                    src="/images/crew_artwork.jpg"
                    alt="Eyes Focus"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: mangaModalMember.portraitCrop.objectPosition,
                      transform: 'scale(3.4)',
                      transformOrigin: mangaModalMember.portraitCrop.objectPosition,
                      filter: isMangaExploded ? 'none' : 'grayscale(100%) contrast(180%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 6,
                      left: 8,
                      background: 'rgba(0,0,0,0.85)',
                      padding: '2px 8px',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      color: '#fff',
                    }}
                  >
                    PANEL 01 • RESOLVE
                  </div>
                </div>

                {/* Panel 2: Gear / Weapon */}
                <div
                  style={{
                    height: '180px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.4)',
                    position: 'relative',
                    backgroundColor: '#090d18',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '14px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
                    {mangaModalMember.id === 'subash' ? '🛡️' : mangaModalMember.id === 'sathi' ? '⚡' : '🧭'}
                  </div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.72rem',
                      color: isMangaExploded ? mangaModalMember.color : '#fff',
                      fontWeight: 800,
                      lineHeight: 1.4,
                    }}
                  >
                    {mangaModalMember.mangaGear}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 6,
                      left: 8,
                      background: 'rgba(0,0,0,0.85)',
                      padding: '2px 8px',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      color: '#fff',
                    }}
                  >
                    PANEL 02 • GEAR
                  </div>
                </div>

                {/* Panel 3: Character Portrait */}
                <div
                  style={{
                    height: '180px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.4)',
                    position: 'relative',
                    backgroundColor: '#000',
                  }}
                >
                  <img
                    src="/images/crew_artwork.jpg"
                    alt="Character Manga Portrait"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: mangaModalMember.portraitCrop.objectPosition,
                      transform: `scale(${mangaModalMember.portraitCrop.scale})`,
                      transformOrigin: mangaModalMember.portraitCrop.objectPosition,
                      filter: isMangaExploded ? 'none' : 'grayscale(100%) contrast(160%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 6,
                      left: 8,
                      background: 'rgba(0,0,0,0.85)',
                      padding: '2px 8px',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      color: '#fff',
                    }}
                  >
                    PANEL 03 • CAPTAIN
                  </div>
                </div>

                {/* Panel 4: Signature Kanji & Title */}
                <div
                  style={{
                    height: '180px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.4)',
                    position: 'relative',
                    backgroundColor: '#0b0f1a',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '14px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    className="font-brush"
                    style={{
                      fontSize: '3rem',
                      color: isMangaExploded ? mangaModalMember.color : '#fff',
                      lineHeight: 1,
                      textShadow: isMangaExploded ? `0 0 20px ${mangaModalMember.color}` : 'none',
                    }}
                  >
                    {mangaModalMember.kanji}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: '0.85rem',
                      color: '#fff',
                      marginTop: '6px',
                    }}
                  >
                    {mangaModalMember.shortName}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 6,
                      left: 8,
                      background: 'rgba(0,0,0,0.85)',
                      padding: '2px 8px',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      color: '#fff',
                    }}
                  >
                    PANEL 04 • CREST
                  </div>
                </div>
              </div>

              {/* Ink Explode Impact Callout */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  border: `1px solid ${isMangaExploded ? mangaModalMember.color : 'rgba(255,255,255,0.2)'}`,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: '1.2rem',
                    color: isMangaExploded ? mangaModalMember.color : '#fff',
                    letterSpacing: '0.08em',
                    marginBottom: '6px',
                  }}
                >
                  {isMangaExploded ? '💥 INK SPLASH: FULL COLOR AWAKENED!' : '⚡ FOCUSING HAKI...'}
                </div>
                <div style={{ fontStyle: 'italic', color: '#ffb703', fontSize: '0.92rem' }}>
                  {mangaModalMember.mangaQuote}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
