import React, { useState, useEffect, useRef } from 'react';

interface TreasureMapNavigatorProps {
  onOpenEventDetail: (eventId: string, rect?: DOMRect) => void;
}

interface IslandNode {
  id: string;
  order: number;
  islandName: string;
  eventTitle: string;
  category: 'tech' | 'non-tech';
  coordinator: string;
  teamSize: string;
  icon: string;
  x: number; // percentage on desktop map
  y: number; // percentage on desktop map
  lore: string;
}

const ISLANDS: IslandNode[] = [
  {
    id: 'will-of-d',
    order: 1,
    islandName: 'ISLE OF WILL',
    eventTitle: 'Will of D (Quiz)',
    category: 'non-tech',
    coordinator: 'To Be Announced',
    teamSize: 'Max 2',
    icon: '🧠',
    x: 10,
    y: 65,
    lore: 'Ancient ciphers, rapid fire trivia & buzzer showdowns.'
  },
  {
    id: 'red-line-rush',
    order: 2,
    islandName: 'RED LINE REEF',
    eventTitle: 'Red Line Rush',
    category: 'non-tech',
    coordinator: 'Surya Mathavan (III CSE)',
    teamSize: '4 Members',
    icon: '🏴‍☠️',
    x: 20,
    y: 30,
    lore: 'Campus-wide checkpoint chase to locate the grand treasure.'
  },
  {
    id: 'nikas-dance-arena',
    order: 3,
    islandName: 'SUN GOD ATOLL',
    eventTitle: "Nika's Dance Arena",
    category: 'non-tech',
    coordinator: 'Vishwa & Saathish',
    teamSize: '8–10 Members',
    icon: '💃',
    x: 32,
    y: 75,
    lore: 'Liberation of rhythm across classical, western & fusion.'
  },
  {
    id: 'binks-rhythm',
    order: 4,
    islandName: 'SIREN SOUND SHORE',
    eventTitle: "Bink's Rhythm (Singing)",
    category: 'non-tech',
    coordinator: 'Vishwa & Saathish',
    teamSize: 'Solo / Duet / Group',
    icon: '🎵',
    x: 44,
    y: 35,
    lore: 'Vocal melodies echoing across the midnight ocean.'
  },
  {
    id: 'pirate-portraits',
    order: 5,
    islandName: 'LENS LAGOON',
    eventTitle: 'Pirate Portraits',
    category: 'non-tech',
    coordinator: 'Yokesh & Seeman',
    teamSize: 'Solo (3 Photos)',
    icon: '📸',
    x: 55,
    y: 70,
    lore: 'Freeze time and capture authentic fest emotions.'
  },
  {
    id: 'grand-line-visuals',
    order: 6,
    islandName: 'CINEMATIC COVES',
    eventTitle: 'Grand Line Visuals',
    category: 'non-tech',
    coordinator: 'Yokesh & Seeman',
    teamSize: 'Solo / Duo',
    icon: '🎬',
    x: 66,
    y: 30,
    lore: 'Dynamic 1080p reels and cinematic storytelling.'
  },
  {
    id: 'straw-hat-studios',
    order: 7,
    islandName: 'STRAW HAT ARCHIPELAGO',
    eventTitle: 'Straw Hat Studios',
    category: 'non-tech',
    coordinator: 'Sivanesan & Rajkumar',
    teamSize: '1–4 Crew',
    icon: '🎞️',
    x: 77,
    y: 65,
    lore: 'Original short films screened in the main auditorium.'
  },
  {
    id: 'e-sports',
    order: 8,
    islandName: 'COLOSSEUM BAY',
    eventTitle: 'E-Sports',
    category: 'non-tech',
    coordinator: 'Sivanesan • Rajkumar • Dhanush Priyan • Ranjan M. • Saathish Kambattan • Vishwa • Yogesh • Barani Kumar',
    teamSize: 'PUBG • FREE FIRE • CHESS • CARROM POOL',
    icon: '🎮',
    x: 87,
    y: 28,
    lore: 'One combined arena for PUBG, Free Fire, Chess and Carrom Pool.'
  },
  {
    id: 'coding-challenge',
    order: 9,
    islandName: 'ALGORITHM APEX',
    eventTitle: 'Coding Challenge',
    category: 'tech',
    coordinator: 'Event Coordinator',
    teamSize: 'Solo Coder',
    icon: '💻',
    x: 93,
    y: 72,
    lore: 'High-speed algorithmic problem solving & correctness duels.'
  }
];

export const TreasureMapNavigator: React.FC<TreasureMapNavigatorProps> = ({ onOpenEventDetail }) => {
  const [selectedIslandId, setSelectedIslandId] = useState<string>('will-of-d');
  const [hoveredIslandId, setHoveredIslandId] = useState<string | null>(null);
  const [compassAngle, setCompassAngle] = useState(45);
  const [shipPosition, setShipPosition] = useState({ x: 10, y: 65 });
  const [showExpeditionIntro, setShowExpeditionIntro] = useState(true);
  const expeditionVideoRef = useRef<HTMLVideoElement | null>(null);
  const expeditionSectionRef = useRef<HTMLElement | null>(null);

  const activeIsland = ISLANDS.find(i => i.id === (hoveredIslandId || selectedIslandId)) || ISLANDS[0];

  // Play the supplied Grand Line expedition video when this section enters the viewport.
  useEffect(() => {
    const section = expeditionSectionRef.current;
    const video = expeditionVideoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {
          // The global ambient audio handles sound; the map intro itself stays muted for autoplay.
        });
      }
    }, { threshold: 0.25 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Update ship position and compass angle when active island changes
  useEffect(() => {
    setShipPosition({ x: activeIsland.x, y: activeIsland.y });
    const angle = (activeIsland.order * 37) % 360;
    setCompassAngle(angle);
  }, [activeIsland]);

  const handleIslandClick = (island: IslandNode, e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedIslandId(island.id);
    const rect = e.currentTarget.getBoundingClientRect();
    onOpenEventDetail(island.id, rect);
  };

  return (
    <section
      ref={expeditionSectionRef}
      id="treasure-map"
      style={{
        position: 'relative',
        padding: '100px 24px 80px',
        backgroundColor: '#030712',
        backgroundImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, rgba(10, 24, 48, 0.8) 0%, rgba(3, 7, 18, 1) 100%)',
        overflow: 'hidden',
        color: '#f8fafc',
      }}
    >
      {/* ─── GRAND LINE EXPEDITION OPENING VIDEO ─── */}
      {showExpeditionIntro && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            minHeight: '100%',
            background: 'radial-gradient(circle at center, rgba(35, 24, 12, 0.12), rgba(3, 7, 18, 0.98) 78%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '90px 24px 70px',
          }}
        >
          <div style={{ width: 'min(1280px, 100%)', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '7px 18px',
              borderRadius: '999px',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              background: 'rgba(15, 23, 42, 0.75)',
              color: '#d4af37',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.18em',
              marginBottom: '18px',
            }}>
              🧭 GRAND LINE EXPEDITION
            </div>
            <h2 style={{
              margin: '0 0 20px',
              color: '#f8fafc',
              fontFamily: "'Cinzel', 'Playfair Display', serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: '0.05em',
              textShadow: '0 0 30px rgba(212, 175, 55, 0.28)',
            }}>
              THE VOYAGE BEGINS
            </h2>
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              maxHeight: '68vh',
              margin: '0 auto',
              overflow: 'hidden',
              borderRadius: '24px',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.72), 0 0 45px rgba(212, 175, 55, 0.08)',
              background: '#080b12',
            }}>
              <video
                ref={expeditionVideoRef}
                muted
                playsInline
                preload="auto"
                onEnded={() => setShowExpeditionIntro(false)}
                onError={() => setShowExpeditionIntro(false)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              >
                <source src="/media/grand-line-expedition-intro.mp4" type="video/mp4" />
              </video>
              <div style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.32))',
              }} />
              <div style={{
                position: 'absolute',
                left: '50%',
                bottom: '18px',
                transform: 'translateX(-50%)',
                color: 'rgba(255,255,255,0.78)',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.18em',
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
              }}>
                MAP INITIALIZING • FOLLOW THE GRAND LINE
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── BACKGROUND NAUTICAL GRID & OCEAN CURRENTS ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(212, 175, 55, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(212, 175, 55, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '70px 70px',
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      />

      {/* Decorative Ocean Waves Watermark */}
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '140px',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#0284c7"
          d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,165.3C672,171,768,213,864,208C960,203,1056,149,1152,138.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      {/* ─── SECTION HEADER ─── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 50px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: 'rgba(212, 175, 55, 0.12)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            color: '#d4af37',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.85rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          <span>🧭</span> GRAND LINE EXPEDITION MAP <span>⚓</span>
        </div>

        <h2
          style={{
            fontFamily: "'Cinzel', 'Playfair Display', serif",
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            fontWeight: 800,
            letterSpacing: '0.04em',
            color: '#f8fafc',
            textShadow: '0 0 35px rgba(212, 175, 55, 0.3)',
            marginBottom: '14px',
          }}
        >
          VOYAGE ACROSS THE <span style={{ color: '#d4af37' }}>9 REALMS</span>
        </h2>

        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            maxWidth: '680px',
            margin: '0 auto',
            color: '#94a3b8',
            fontSize: '1.05rem',
            lineHeight: 1.6,
          }}
        >
          Plot your coordinates. Follow the ancient currents from the Quiz island of Ohara all the way
          to the final algorithmic battle. Click any waypoint to view rules and register your crew.
        </p>

        {/* ─── COMPASS & LOG POSE WIDGET ─── */}
        <div
          style={{
            marginTop: '28px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '18px',
            padding: '10px 22px',
            borderRadius: '40px',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          }}
        >
          {/* Compass Icon */}
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '2px solid #d4af37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: '#0a0f1d',
            }}
          >
            <div
              style={{
                width: '4px',
                height: '24px',
                background: 'linear-gradient(to bottom, #ef4444 50%, #94a3b8 50%)',
                borderRadius: '2px',
                transform: `rotate(${compassAngle}deg)`,
                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: '0 0 6px rgba(239, 68, 68, 0.7)',
              }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.72rem', color: '#d4af37', letterSpacing: '0.1em', fontWeight: 600 }}>
              LOG POSE BEARING:
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
              {activeIsland.islandName} ({activeIsland.eventTitle})
            </div>
          </div>
        </div>
      </div>

      {/* ─── DESKTOP PANORAMIC MAP CHART (Hidden on Mobile) ─── */}
      <div
        className="treasure-map-desktop"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          height: '520px',
          position: 'relative',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, rgba(8, 20, 42, 0.9) 0%, rgba(3, 10, 24, 0.95) 100%)',
          border: '2px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), inset 0 0 80px rgba(212, 175, 55, 0.05)',
          overflow: 'hidden',
          display: 'block',
        }}
      >
        {/* Parchment Corner Emblems */}
        <div style={{ position: 'absolute', top: 16, left: 16, color: '#d4af37', opacity: 0.4, fontSize: '0.8rem', fontFamily: 'serif' }}>
          ✦ GRAND LINE CHART // SYMPOSIUM GRID 2026
        </div>
        <div style={{ position: 'absolute', bottom: 16, right: 16, color: '#d4af37', opacity: 0.4, fontSize: '0.8rem', fontFamily: 'serif' }}>
          ⚓ CARTOGRAPHY BY ORDER OF SYMPOSIUM HEADQUARTERS
        </div>

        {/* ─── SVG ROUTE LINE CONNECTING ALL 9 ISLANDS ─── */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Glowing underlay path */}
          <path
            d="M 10 65 Q 15 45 20 30 T 32 75 T 44 35 T 55 70 T 66 30 T 77 65 T 87 28 T 93 72"
            fill="none"
            stroke="rgba(212, 175, 55, 0.25)"
            strokeWidth="2.5"
          />
          {/* Animated dashed sea current line */}
          <path
            d="M 10 65 Q 15 45 20 30 T 32 75 T 44 35 T 55 70 T 66 30 T 77 65 T 87 28 T 93 72"
            fill="none"
            stroke="#d4af37"
            strokeWidth="0.8"
            strokeDasharray="2, 2"
          />
        </svg>

        {/* ─── SAILING SHIP ICON TRAVERSING MAP ─── */}
        <div
          style={{
            position: 'absolute',
            left: `${shipPosition.x}%`,
            top: `${shipPosition.y}%`,
            transform: 'translate(-50%, -100%) translateY(-12px)',
            transition: 'left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: 15,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: '2rem',
              filter: 'drop-shadow(0 4px 12px rgba(212, 175, 55, 0.8))',
              animation: 'shipFloat 2.5s ease-in-out infinite alternate',
            }}
          >
            ⛵
          </div>
        </div>

        {/* ─── 9 INTERACTIVE ISLAND NODES ─── */}
        {ISLANDS.map((island) => {
          const isSelected = selectedIslandId === island.id;
          const isHovered = hoveredIslandId === island.id;
          const isTech = island.category === 'tech';
          const nodeColor = isTech ? '#00e5ff' : '#ffb703';

          return (
            <div
              key={island.id}
              style={{
                position: 'absolute',
                left: `${island.x}%`,
                top: `${island.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isHovered || isSelected ? 20 : 10,
              }}
              onMouseEnter={() => setHoveredIslandId(island.id)}
              onMouseLeave={() => setHoveredIslandId(null)}
            >
              {/* Island Beacon Button */}
              <button
                type="button"
                onClick={(e) => handleIslandClick(island, e)}
                style={{
                  background: isSelected
                    ? `radial-gradient(circle, ${nodeColor} 0%, #030712 90%)`
                    : 'rgba(15, 23, 42, 0.95)',
                  border: `2px solid ${isHovered || isSelected ? nodeColor : 'rgba(212, 175, 55, 0.4)'}`,
                  borderRadius: '50%',
                  width: isSelected || isHovered ? '56px' : '46px',
                  height: isSelected || isHovered ? '56px' : '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isSelected || isHovered ? '1.5rem' : '1.25rem',
                  cursor: 'pointer',
                  boxShadow: isHovered || isSelected
                    ? `0 0 25px ${nodeColor}, 0 0 50px rgba(0, 0, 0, 0.8)`
                    : '0 4px 14px rgba(0,0,0,0.6)',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  position: 'relative',
                }}
                title={island.eventTitle}
              >
                <span>{island.icon}</span>

                {/* Pulsing ring for active island */}
                {(isSelected || isHovered) && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: '-6px',
                      borderRadius: '50%',
                      border: `1.5px dashed ${nodeColor}`,
                      animation: 'spinSlow 10s linear infinite',
                    }}
                  />
                )}
              </button>

              {/* Waypoint Number Stamp */}
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '-6px',
                  background: isTech ? '#00e5ff' : '#ffb703',
                  color: '#030712',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  borderRadius: '999px',
                  padding: '1px 6px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                  pointerEvents: 'none',
                }}
              >
                0{island.order}
              </div>

              {/* Permanent Island Label Tag */}
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%) translateY(6px)',
                  whiteSpace: 'nowrap',
                  background: 'rgba(3, 7, 18, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: isHovered || isSelected ? nodeColor : '#cbd5e1',
                  letterSpacing: '0.04em',
                  pointerEvents: 'none',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {island.eventTitle}
              </div>

              {/* Hover Inspection Parchment Card */}
              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '125%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '260px',
                    padding: '14px',
                    borderRadius: '14px',
                    background: '#09101f',
                    border: `1.5px solid ${nodeColor}`,
                    boxShadow: '0 16px 40px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
                    zIndex: 30,
                    pointerEvents: 'none',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: isTech ? 'rgba(0,229,255,0.15)' : 'rgba(255,183,3,0.15)',
                        color: nodeColor,
                      }}
                    >
                      {island.category.toUpperCase()} EVENT
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{island.teamSize}</span>
                  </div>

                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', marginBottom: '2px' }}>
                    {island.eventTitle}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#d4af37', marginBottom: '6px' }}>
                    👤 {island.coordinator}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.4, marginBottom: '8px' }}>
                    {island.lore}
                  </div>

                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: nodeColor,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    Click node to view full rules ➔
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── MOBILE SCROLLABLE ADVENTURE ROUTE (Cards Grid for Mobile & Tablet) ─── */}
      <div
        className="treasure-map-mobile"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        {ISLANDS.map((island) => {
          const isTech = island.category === 'tech';
          const nodeColor = isTech ? '#00e5ff' : '#ffb703';

          return (
            <div
              key={island.id}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                onOpenEventDetail(island.id, rect);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                borderRadius: '16px',
                background: 'rgba(15, 23, 42, 0.75)',
                border: `1px solid rgba(212, 175, 55, 0.25)`,
                cursor: 'pointer',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: isTech ? 'rgba(0,229,255,0.12)' : 'rgba(255,183,3,0.12)',
                  border: `1px solid ${nodeColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  flexShrink: 0,
                }}
              >
                {island.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#d4af37' }}>
                    REALM 0{island.order}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: nodeColor,
                      textTransform: 'uppercase',
                    }}
                  >
                    • {island.category}
                  </span>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {island.eventTitle}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Coord: {island.coordinator} | {island.teamSize}
                </div>
              </div>

              <div style={{ color: '#d4af37', fontSize: '1.2rem', paddingLeft: '8px' }}>
                ➔
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes shipFloat {
          0% { transform: translate(-50%, -100%) translateY(-10px) rotate(-3deg); }
          100% { transform: translate(-50%, -100%) translateY(-16px) rotate(3deg); }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .treasure-map-desktop {
            display: none !important;
          }
          .treasure-map-mobile {
            display: flex !important;
          }
        }
        @media (min-width: 901px) {
          .treasure-map-mobile {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};
