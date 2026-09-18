import React, { useState, useEffect, useRef } from 'react';
import { DETAILED_EVENTS } from '../data/eventDetailData';
import type { DetailedEventData } from '../data/eventDetailData';

interface EventDetailPageProps {
  eventId?: string;
  initialTab?: string;
  onBackToHome?: () => void;
  onSelectEvent?: (id: string) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  eventId = 'will-of-d',
  initialTab = 'overview',
  onBackToHome
}) => {
  const event: DetailedEventData = DETAILED_EVENTS[eventId] || DETAILED_EVENTS['will-of-d'] || Object.values(DETAILED_EVENTS)[0];

  // ─────────────────────────────────────────────────────────────
  // SCENE 01: CINEMATIC LOADING STATE (00 → 25 → 50 → 75 → 100)
  // ─────────────────────────────────────────────────────────────
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [isMaskTransitioning, setIsMaskTransitioning] = useState(false);

  useEffect(() => {
    // Check if user has already loaded this session or run quick loading
    const timerSteps = [
      { progress: 25, delay: 250 },
      { progress: 50, delay: 600 },
      { progress: 75, delay: 1000 },
      { progress: 100, delay: 1400 }
    ];

    timerSteps.forEach(({ progress, delay }) => {
      setTimeout(() => {
        setLoadingProgress(progress);
      }, delay);
    });

    const finishTimer = setTimeout(() => {
      setIsMaskTransitioning(true);
      setTimeout(() => {
        setIsLoadingComplete(true);
      }, 700);
    }, 1800);

    return () => clearTimeout(finishTimer);
  }, [eventId]);

  // Auto-scroll to requested section if initialTab is specified
  useEffect(() => {
    if (initialTab === 'rules') {
      const timer = setTimeout(() => {
        const el = document.getElementById('rules');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [initialTab, eventId]);

  // ─────────────────────────────────────────────────────────────
  // CAMERA SCROLL & SIDE-MOVING BACKGROUND TEXT LISTENER
  // ─────────────────────────────────────────────────────────────
  const [scrollY, setScrollY] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isCursorHovering, setIsCursorHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // SCENE 08: STICKY STORY SCROLL STATE
  // ─────────────────────────────────────────────────────────────
  const stickyStoryRef = useRef<HTMLDivElement>(null);
  const [activeStoryStage, setActiveStoryStage] = useState(0);

  useEffect(() => {
    const handleStickyProgress = () => {
      if (!stickyStoryRef.current) return;
      const rect = stickyStoryRef.current.getBoundingClientRect();
      const totalHeight = rect.height - window.innerHeight;
      if (totalHeight <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / totalHeight));
      const stageCount = event.stickyStory.length;
      const currentStage = Math.min(stageCount - 1, Math.floor(progress * stageCount));
      setActiveStoryStage(currentStage);
    };

    window.addEventListener('scroll', handleStickyProgress, { passive: true });
    return () => window.removeEventListener('scroll', handleStickyProgress);
  }, [event.stickyStory.length]);

  // ─────────────────────────────────────────────────────────────
  // SCENE 12: CREW SYSTEM SELECTION
  // ─────────────────────────────────────────────────────────────
  const [selectedCrewTier, setSelectedCrewTier] = useState<'SOLO' | 'DUO' | 'TRIO' | 'SQUAD'>('TRIO');

  // ─────────────────────────────────────────────────────────────
  // SCENE 13: LIVE STATUS COUNTDOWN (driven by admin-editable data)
  // ─────────────────────────────────────────────────────────────
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const hasTargetDate = !!event.liveStatus.targetDate;
  useEffect(() => {
    if (!event.liveStatus.targetDate) return;
    const compute = () => {
      const diff = Math.max(0, new Date(event.liveStatus.targetDate).getTime() - Date.now());
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        mins: Math.floor((diff / 60000) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    };
    compute();
    const timer = setInterval(compute, 1000);
    return () => clearInterval(timer);
  }, [eventId, event.liveStatus.targetDate]);

  // ─────────────────────────────────────────────────────────────
  // SCENE 15: VENUE SELECTION
  // ─────────────────────────────────────────────────────────────
  const [selectedVenueId, setSelectedVenueId] = useState<string>(event.venueLocations[0]?.id || 'tech-arena');

  // ─────────────────────────────────────────────────────────────
  // SCENE 16: FAQ ACCORDION EXPANSION
  // ─────────────────────────────────────────────────────────────
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // ─────────────────────────────────────────────────────────────
  // SCENE 18: REGISTRATION TRANSITION MODAL (5 STEPS)
  // ─────────────────────────────────────────────────────────────
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [regForm, setRegForm] = useState({
    crewType: 'TRIO',
    crewName: '',
    callsign: '',
    captainName: '',
    captainEmail: '',
    captainPhone: '',
    college: '',
    members: ['', '']
  });
  const [regNotice, setRegNotice] = useState(false);
  const openRegistration = () => {
    // Spec Section 20: open the registration link when available,
    // otherwise show the "announced soon" confirmation.
    if (event.registrationLink) {
      window.open(event.registrationLink, '_blank', 'noopener,noreferrer');
      return;
    }
    setIsRegisterOpen(false);
    setRegNotice(true);
    setTimeout(() => setRegNotice(false), 4200);
  };

  // ─────────────────────────────────────────────────────────────
  // 3D CARD TILT HELPER
  // ─────────────────────────────────────────────────────────────
  const [tiltZoneIndex, setTiltZoneIndex] = useState<number | null>(null);
  const [tiltCoords, setTiltCoords] = useState({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });

  const handleZoneMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    setTiltZoneIndex(index);
    setTiltCoords({ rotateX, rotateY, shineX, shineY });
  };

  const handleZoneMouseLeave = () => {
    setTiltZoneIndex(null);
    setTiltCoords({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });
  };

  // ─────────────────────────────────────────────────────────────
  // MAP NODE SELECTION
  // ─────────────────────────────────────────────────────────────
  const [activeMapNode, setActiveMapNode] = useState(event.battleMap.nodes[0] || null);

  // Calculate Camera Zoom (1 → 1.12) and vertical offsets
  const cameraProgress = Math.min(1, scrollY / (window.innerHeight || 800));
  const cameraZoom = 1 + cameraProgress * 0.12;
  const bgY = scrollY * 0.15;
  const midY = scrollY * 0.35;
  const charY = scrollY * 0.55;
  const textX = scrollY * 0.4;
  const fogX = Math.sin(scrollY * 0.005) * 40;

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#04060c',
        color: '#f0f4fc',
        overflowX: 'hidden',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          CUSTOM CURSOR (Desktop only)
      ───────────────────────────────────────────────────────────── */}
      {!isTouchDevice && (
        <div
          style={{
            position: 'fixed',
            top: cursorPos.y,
            left: cursorPos.x,
            width: isCursorHovering ? 64 : 16,
            height: isCursorHovering ? 64 : 16,
            borderRadius: '50%',
            background: isCursorHovering
              ? 'rgba(0, 229, 255, 0.25)'
              : 'rgba(255, 51, 68, 0.9)',
            border: isCursorHovering ? '1px solid #00e5ff' : 'none',
            boxShadow: isCursorHovering
              ? '0 0 20px rgba(0, 229, 255, 0.6)'
              : '0 0 12px rgba(255, 51, 68, 0.8)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9999,
            transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '0.65rem',
            fontWeight: 900,
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}
        >
          {isCursorHovering ? cursorText : ''}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCENE 01: CINEMATIC LOADING SCREEN
      ───────────────────────────────────────────────────────────── */}
      {!isLoadingComplete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: '#04060c',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            clipPath: isMaskTransitioning
              ? 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
              : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            transition: 'clip-path 0.7s cubic-bezier(0.77, 0, 0.175, 1)'
          }}
        >
          {/* Subtle Ambient Red Glow and Grid */}
          <div
            style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(255, 51, 68, 0.22) 0%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none'
            }}
          />

          {/* Official CYBITRADIC WANO FEST Logo */}
          <img
            src="/images/logo.png"
            alt="CYBITRADIC WANO FEST Logo"
            style={{
              width: '130px',
              height: 'auto',
              marginBottom: '28px',
              filter: 'drop-shadow(0 0 25px rgba(0, 229, 255, 0.6))',
              animation: 'pulse 2s infinite ease-in-out'
            }}
          />

          {/* Loading Titles */}
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.35em',
              color: '#00e5ff',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}
          >
            ENTERING THE MISSION...
          </div>

          <h1
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
              letterSpacing: '0.15em',
              color: '#ffffff',
              margin: '0 0 28px 0',
              textShadow: '0 0 30px rgba(255, 51, 68, 0.7)'
            }}
          >
            CYBITRADIC WANO FEST
          </h1>

          {/* Animated 00 → 25 → 50 → 75 → 100 Progress */}
          <div
            style={{
              width: '280px',
              background: 'rgba(255, 255, 255, 0.08)',
              height: '4px',
              borderRadius: '2px',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '16px'
            }}
          >
            <div
              style={{
                width: `${loadingProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #ff3344, #00e5ff)',
                boxShadow: '0 0 15px #00e5ff',
                transition: 'width 0.35s ease-out'
              }}
            />
          </div>

          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '1rem',
              color: '#8e9bb4',
              letterSpacing: '0.2em'
            }}
          >
            {loadingProgress < 10 ? `0${loadingProgress}` : loadingProgress}% // READYING BATTLEFIELD
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FLOATING CINEMATIC NAVIGATION BAR
      ───────────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(94%, 1280px)',
          padding: '10px 24px',
          background: scrollY > 50 ? 'rgba(6, 9, 18, 0.88)' : 'rgba(6, 9, 18, 0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 229, 255, 0.22)',
          borderRadius: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1000,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Left: Back + Official Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              onMouseEnter={() => {
                setIsCursorHovering(true);
                setCursorText('HOME');
              }}
              onMouseLeave={() => setIsCursorHovering(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f0f4fc',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <span>←</span> RETURN TO FLEET
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/images/logo.png"
              alt="Official Wano Fest Logo"
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: "'Russo One', sans-serif",
                  fontSize: '0.85rem',
                  letterSpacing: '0.12em',
                  color: '#ffffff'
                }}
              >
                CYBITRADIC WANO FEST
              </span>
              <span style={{ fontSize: '0.65rem', color: '#00e5ff', letterSpacing: '0.2em' }}>
                {event.missionNumber} // {event.missionType}
              </span>
            </div>
          </div>
        </div>

        {/* Center: 5 Quick Navigation Tabs per Master Prompt */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', maxWidth: '480px', padding: '2px 0' }}>
          {[
            { label: 'Overview', target: 'story' },
            { label: 'Rules', target: 'rules' },
            { label: 'Judging', target: 'judging' },
            { label: 'Submission', target: 'submission' },
            { label: 'Coordinator', target: 'venue' },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                const el = document.getElementById(tab.target);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '16px',
                padding: '5px 12px',
                color: '#e2e8f0',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                e.currentTarget.style.borderColor = '#d4af37';
                e.currentTarget.style.color = '#ffd700';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                e.currentTarget.style.color = '#e2e8f0';
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Quick CTA */}
        <button
          onClick={openRegistration}
          onMouseEnter={() => {
            setIsCursorHovering(true);
            setCursorText('JOIN');
          }}
          onMouseLeave={() => setIsCursorHovering(false)}
          style={{
            background: 'linear-gradient(135deg, #ff3344 0%, #ff8800 100%)',
            border: 'none',
            color: '#ffffff',
            padding: '8px 22px',
            borderRadius: '25px',
            fontSize: '0.8rem',
            fontWeight: 900,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(255, 51, 68, 0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
        >
          <span>⚔️</span> REGISTER NOW
        </button>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          SIDE-MOVING GIANT BACKGROUND TEXT (Scroll Velocity)
      ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: 0,
          width: '200vw',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.035,
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontFamily: "'Russo One', sans-serif",
          fontSize: '18vw',
          letterSpacing: '0.08em',
          transform: `translateX(-${textX % 1000}px)`,
          willChange: 'transform'
        }}
      >
        {event.title} • {event.missionNumber} • {event.category} •
      </div>

      <div
        style={{
          position: 'fixed',
          top: '60%',
          left: '-50vw',
          width: '200vw',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.025,
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontFamily: "'Russo One', sans-serif",
          fontSize: '16vw',
          letterSpacing: '0.12em',
          transform: `translateX(${textX % 800}px)`,
          willChange: 'transform'
        }}
      >
        WANO FEST • GRAND LINE BATTLE • CLASSIFIED S-RANK •
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 02 & SCROLL CAMERA: EVENT HERO (100vh Camera Parallax)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          perspective: '1000px'
        }}
      >
        {/* Layer 1: Far Background (Moon, Mountains, Dark Japanese Atmosphere) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${event.heroArtwork})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${cameraZoom}) translateY(${bgY}px)`,
            transition: 'transform 0.1s cubic-bezier(0.1, 0.8, 0.3, 1)',
            filter: 'brightness(0.55) contrast(1.18)',
            zIndex: 0
          }}
        />

        {/* Layer 2: Red Blood Moon / Atmospheric Fog Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(circle at 75% 25%, rgba(255, 51, 68, 0.28) 0%, transparent 50%),
              radial-gradient(circle at 20% 70%, rgba(0, 229, 255, 0.18) 0%, transparent 60%),
              linear-gradient(180deg, rgba(4, 6, 12, 0.4) 0%, rgba(4, 6, 12, 0.6) 60%, #04060c 100%)
            `,
            transform: `translateX(${fogX}px) translateY(${midY}px)`,
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {/* Layer 3: Hero Foreground Content & Typography */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '1200px',
            width: '90%',
            textAlign: 'center',
            transform: `translateY(-${charY * 0.4}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Mission Tag Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 20px',
              borderRadius: '30px',
              background: 'rgba(255, 51, 68, 0.15)',
              border: '1px solid rgba(255, 51, 68, 0.4)',
              backdropFilter: 'blur(10px)',
              marginBottom: '20px'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ff3344',
                boxShadow: '0 0 10px #ff3344',
                display: 'inline-block'
              }}
            />
            <span
              style={{
                fontFamily: "'Russo One', sans-serif",
                fontSize: '0.8rem',
                color: '#ff3344',
                letterSpacing: '0.25em',
                textTransform: 'uppercase'
              }}
            >
              WANO FEST // {event.missionNumber}
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
            <span
              style={{
                fontSize: '0.78rem',
                color: '#00e5ff',
                letterSpacing: '0.15em',
                fontWeight: 700
              }}
            >
              {event.bounty.difficulty}
            </span>
          </div>

          {/* Japanese Main Typography */}
          <div
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.4em',
              marginBottom: '4px',
              fontWeight: 700
            }}
          >
            {event.japaneseTitle}
          </div>

          {/* Giant Hero Event Name */}
          <h1
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(2.8rem, 8vw, 6.4rem)',
              lineHeight: 1.05,
              letterSpacing: '0.06em',
              margin: '0 0 20px 0',
              background: 'linear-gradient(180deg, #ffffff 0%, #e0e7ff 60%, #8e9bb4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 20px 60px rgba(0, 0, 0, 0.9)'
            }}
          >
            {event.title}
          </h1>

          {/* Short Event Tagline */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.35rem)',
              color: '#00e5ff',
              fontWeight: 700,
              letterSpacing: '0.18em',
              maxWidth: '820px',
              margin: '0 auto 36px auto',
              textTransform: 'uppercase',
              textShadow: '0 0 20px rgba(0, 229, 255, 0.4)'
            }}
          >
            {event.tagline}
          </p>

          {/* Hero Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap'
            }}
          >
            <button
              onClick={openRegistration}
              onMouseEnter={() => {
                setIsCursorHovering(true);
                setCursorText('ENTER');
              }}
              onMouseLeave={() => setIsCursorHovering(false)}
              style={{
                background: 'linear-gradient(135deg, #ff3344 0%, #ff8800 100%)',
                border: 'none',
                color: '#ffffff',
                padding: '16px 42px',
                borderRadius: '40px',
                fontFamily: "'Russo One', sans-serif",
                fontSize: '1rem',
                letterSpacing: '0.15em',
                cursor: 'pointer',
                boxShadow: '0 0 35px rgba(255, 51, 68, 0.55)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <span>⚔️</span> REGISTER NOW
            </button>

            <a
              href="#rules"
              onMouseEnter={() => {
                setIsCursorHovering(true);
                setCursorText('RULES');
              }}
              onMouseLeave={() => setIsCursorHovering(false)}
              style={{
                textDecoration: 'none',
                background: 'rgba(14, 20, 36, 0.8)',
                border: '1px solid rgba(0, 229, 255, 0.4)',
                color: '#f0f4fc',
                padding: '16px 36px',
                borderRadius: '40px',
                fontFamily: "'Russo One', sans-serif",
                fontSize: '1rem',
                letterSpacing: '0.12em',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span>📜</span> VIEW RULES
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            opacity: 0.7,
            zIndex: 2
          }}
        >
          <span style={{ fontSize: '0.68rem', letterSpacing: '0.25em', color: '#8e9bb4' }}>
            SCROLL TO COMMENCE
          </span>
          <div
            style={{
              width: '2px',
              height: '32px',
              background: 'linear-gradient(180deg, #ff3344 0%, transparent 100%)',
              animation: 'pulse 1.5s infinite'
            }}
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 03: EVENT FILE / CLASSIFIED POSTER (Paper Texture + Red Stamp)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '-60px auto 100px auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div
          onMouseEnter={() => {
            setIsCursorHovering(true);
            setCursorText('FILE');
          }}
          onMouseLeave={() => setIsCursorHovering(false)}
          style={{
            background: 'linear-gradient(145deg, #131724 0%, #0d101b 100%)',
            border: '1px solid rgba(184, 151, 88, 0.45)',
            borderRadius: '20px',
            padding: '40px 48px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(184, 151, 88, 0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Authentic Red Japanese Samurai Seal / Stamp */}
          <div
            style={{
              position: 'absolute',
              top: '28px',
              right: '36px',
              width: '100px',
              height: '100px',
              border: '3px solid #ff3344',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff3344',
              transform: 'rotate(-12deg)',
              opacity: 0.9,
              fontFamily: "'Noto Sans JP', serif",
              fontWeight: 900,
              fontSize: '1rem',
              lineHeight: 1.2,
              letterSpacing: '0.15em',
              textAlign: 'center',
              boxShadow: '0 0 15px rgba(255, 51, 68, 0.3)',
              userSelect: 'none'
            }}
          >
            <div>任務</div>
            <div>開戦</div>
            <div style={{ fontSize: '0.65rem', borderTop: '1px solid #ff3344', marginTop: '3px' }}>
              OFFICIAL
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span
              style={{
                fontFamily: "'Russo One', sans-serif",
                fontSize: '0.78rem',
                color: '#f9c74f',
                letterSpacing: '0.3em'
              }}
            >
              SHOGUNATE ARCHIVES // CLASSIFIED INTEL
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '24px',
              borderBottom: '1px dashed rgba(184, 151, 88, 0.35)',
              paddingBottom: '24px',
              marginBottom: '24px'
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', color: '#8e9bb4', letterSpacing: '0.15em' }}>
                EVENT FILE:
              </div>
              <h2
                style={{
                  fontFamily: "'Russo One', sans-serif",
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: '#ffffff',
                  margin: '4px 0',
                  letterSpacing: '0.05em'
                }}
              >
                {event.title}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#8e9bb4', letterSpacing: '0.15em' }}>
                  MISSION TYPE
                </div>
                <div
                  style={{
                    fontFamily: "'Russo One', sans-serif",
                    fontSize: '1.2rem',
                    color: '#00e5ff'
                  }}
                >
                  [{event.missionType}]
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#8e9bb4', letterSpacing: '0.15em' }}>
                  STATUS
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: "'Russo One', sans-serif",
                    fontSize: '1.2rem',
                    color: '#2ec4b6'
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#2ec4b6',
                      boxShadow: '0 0 10px #2ec4b6',
                      display: 'inline-block'
                    }}
                  />
                  OPEN FOR CREWS
                </div>
              </div>
            </div>
          </div>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#d0d8ea',
              lineHeight: 1.75,
              maxWidth: '880px',
              margin: 0
            }}
          >
            {event.story.paragraph1}
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 04: BOUNTY / EVENT STATS (Huge Numbers)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: '1240px',
          margin: '0 auto 120px auto',
          padding: '0 24px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: '0.85rem',
              color: '#f9c74f',
              letterSpacing: '0.3em'
            }}
          >
            THE SUPREME REWARD
          </span>
          <h2
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              margin: '8px 0',
              letterSpacing: '0.06em',
              background: 'linear-gradient(135deg, #ffffff 0%, #ffaa00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            EVENT BOUNTY & INTEL
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px'
          }}
        >
          {/* Stat 1: Prize Pool */}
          <div
            style={{
              background: 'rgba(14, 20, 36, 0.85)',
              border: '1px solid rgba(255, 170, 0, 0.35)',
              borderRadius: '16px',
              padding: '30px 24px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#8e9bb4', letterSpacing: '0.2em', marginBottom: '8px' }}>
              PRIZE POOL
            </div>
            <div
              style={{
                fontFamily: "'Russo One', sans-serif",
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                color: '#ffaa00',
                textShadow: '0 0 25px rgba(255, 170, 0, 0.45)'
              }}
            >
              {event.bounty.prizePool}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#f0f4fc', marginTop: '6px' }}>
              1st: {event.bounty.firstPlace}
            </div>
          </div>

          {/* Stat 2: Crew Size */}
          <div
            style={{
              background: 'rgba(14, 20, 36, 0.85)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: '16px',
              padding: '30px 24px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#8e9bb4', letterSpacing: '0.2em', marginBottom: '8px' }}>
              CREW SIZE
            </div>
            <div
              style={{
                fontFamily: "'Russo One', sans-serif",
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                color: '#00e5ff',
                textShadow: '0 0 25px rgba(0, 229, 255, 0.4)'
              }}
            >
              {event.bounty.crewSize}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#8e9bb4', marginTop: '6px' }}>
              Cross-College Welcome
            </div>
          </div>

          {/* Stat 3: Battle Time */}
          <div
            style={{
              background: 'rgba(14, 20, 36, 0.85)',
              border: '1px solid rgba(255, 51, 68, 0.3)',
              borderRadius: '16px',
              padding: '30px 24px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#8e9bb4', letterSpacing: '0.2em', marginBottom: '8px' }}>
              BATTLE TIME
            </div>
            <div
              style={{
                fontFamily: "'Russo One', sans-serif",
                fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)',
                color: '#ff3344',
                textShadow: '0 0 25px rgba(255, 51, 68, 0.4)'
              }}
            >
              {event.bounty.battleTime}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#8e9bb4', marginTop: '6px' }}>
              Non-Stop Action
            </div>
          </div>

          {/* Stat 4: Difficulty */}
          <div
            style={{
              background: 'rgba(14, 20, 36, 0.85)',
              border: '1px solid rgba(157, 78, 221, 0.3)',
              borderRadius: '16px',
              padding: '30px 24px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#8e9bb4', letterSpacing: '0.2em', marginBottom: '8px' }}>
              DIFFICULTY
            </div>
            <div
              style={{
                fontFamily: "'Russo One', sans-serif",
                fontSize: 'clamp(1.6rem, 2.6vw, 2.2rem)',
                color: '#9d4edd',
                textShadow: '0 0 25px rgba(157, 78, 221, 0.4)'
              }}
            >
              {event.bounty.difficulty}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#8e9bb4', marginTop: '6px' }}>
              {event.bounty.mode}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 05: EVENT STORY ("YOUR MISSION")
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto 130px auto',
          padding: '0 24px'
        }}
      >
        <div
          style={{
            borderLeft: '4px solid #ff3344',
            paddingLeft: '24px',
            marginBottom: '32px'
          }}
        >
          <span
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: '0.85rem',
              color: '#ff3344',
              letterSpacing: '0.25em'
            }}
          >
            SCENE 05 // MISSION LORE
          </span>
          <h2
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              color: '#ffffff',
              margin: '6px 0 12px 0'
            }}
          >
            YOUR MISSION: {event.story.heading}
          </h2>
          <p style={{ color: '#00e5ff', fontSize: '1.15rem', fontWeight: 600 }}>
            {event.story.subheading}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '1.05rem', color: '#d0d8ea', lineHeight: 1.8 }}>
              {event.story.paragraph1}
            </p>
            <p style={{ fontSize: '1.05rem', color: '#8e9bb4', lineHeight: 1.8 }}>
              {event.story.paragraph2}
            </p>

            <div
              style={{
                background: 'rgba(255, 51, 68, 0.08)',
                border: '1px solid rgba(255, 51, 68, 0.25)',
                borderRadius: '12px',
                padding: '18px 24px',
                marginTop: '10px'
              }}
            >
              <div
                style={{
                  fontFamily: "'Russo One', sans-serif",
                  fontSize: '0.78rem',
                  color: '#ff3344',
                  letterSpacing: '0.2em',
                  marginBottom: '6px'
                }}
              >
                TACTICAL CHALLENGE
              </div>
              <div style={{ fontSize: '0.95rem', color: '#ffffff' }}>
                {event.story.challengeCore}
              </div>
            </div>
          </div>

          {/* Lore Quote Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(14, 20, 36, 0.95), rgba(6, 8, 14, 0.95))',
              border: '1px solid rgba(249, 199, 79, 0.4)',
              borderRadius: '20px',
              padding: '40px 32px',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '3rem',
                lineHeight: 1,
                color: '#f9c74f',
                opacity: 0.5,
                marginBottom: '10px'
              }}
            >
              “
            </div>
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '1.25rem',
                fontStyle: 'italic',
                color: '#f0f4fc',
                lineHeight: 1.6,
                marginBottom: '16px'
              }}
            >
              {event.story.loreQuote}
            </p>
            <div
              style={{
                fontSize: '0.85rem',
                color: '#f9c74f',
                letterSpacing: '0.15em',
                fontWeight: 700
              }}
            >
              — {event.story.loreAuthor}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 06: BATTLE MAP (Interactive Ancient Chart + Cyber Topology)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: '1240px',
          margin: '0 auto 140px auto',
          padding: '0 24px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: '0.85rem',
              color: '#00e5ff',
              letterSpacing: '0.3em'
            }}
          >
            TACTICAL RADAR
          </span>
          <h2
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3.4rem)',
              margin: '8px 0',
              color: '#ffffff'
            }}
          >
            {event.battleMap.title}
          </h2>
          <p style={{ color: '#8e9bb4', maxWidth: '640px', margin: '0 auto' }}>
            {event.battleMap.description} Click any node to review tactical parameters.
          </p>
        </div>

        {/* Interactive Chart Canvas Simulation */}
        <div
          style={{
            position: 'relative',
            height: '420px',
            background: 'radial-gradient(ellipse at center, rgba(14, 25, 48, 0.9) 0%, #060914 100%)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), inset 0 0 50px rgba(0, 229, 255, 0.08)'
          }}
        >
          {/* Cyber Topography Grid Lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(0, 229, 255, 0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 229, 255, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              pointerEvents: 'none'
            }}
          />

          {/* SVG Vector Connecting Lines */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
            <polyline
              points={event.battleMap.nodes
                .map(n => `${(n.x / 100) * 1100 + 40},${(n.y / 100) * 380 + 20}`)
                .join(' ')}
              fill="none"
              stroke="#00e5ff"
              strokeWidth="2"
              strokeDasharray="6,6"
              opacity="0.65"
            />
          </svg>

          {/* Interactive Nodes */}
          {event.battleMap.nodes.map(node => {
            const isSelected = activeMapNode?.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setActiveMapNode(node)}
                onMouseEnter={() => {
                  setIsCursorHovering(true);
                  setCursorText('NODE');
                }}
                onMouseLeave={() => setIsCursorHovering(false)}
                style={{
                  position: 'absolute',
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: isSelected
                    ? 'linear-gradient(135deg, #ff3344, #ff8800)'
                    : 'rgba(14, 20, 36, 0.95)',
                  border: isSelected ? '2px solid #ffffff' : '1px solid #00e5ff',
                  boxShadow: isSelected
                    ? '0 0 25px rgba(255, 51, 68, 0.8)'
                    : '0 0 15px rgba(0, 229, 255, 0.4)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isSelected ? '#ffffff' : '#00e5ff',
                    boxShadow: isSelected ? '0 0 8px #ffffff' : '0 0 8px #00e5ff'
                  }}
                />
                <span style={{ fontFamily: "'Russo One', sans-serif", fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                  {node.type}
                </span>
              </button>
            );
          })}

          {/* Active Node Floating Briefing Card */}
          {activeMapNode && (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '20px',
                right: '20px',
                background: 'rgba(6, 9, 18, 0.92)',
                border: '1px solid rgba(0, 229, 255, 0.4)',
                borderRadius: '16px',
                padding: '16px 24px',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                zIndex: 20
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#ff3344', fontWeight: 800 }}>
                    {activeMapNode.code}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#8e9bb4' }}>|</span>
                  <span style={{ fontSize: '0.72rem', color: '#f9c74f', fontWeight: 700 }}>
                    DIFFICULTY: {activeMapNode.difficulty}
                  </span>
                </div>
                <h4 style={{ fontFamily: "'Russo One', sans-serif", fontSize: '1.1rem', color: '#fff', margin: '2px 0' }}>
                  {activeMapNode.name}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#8e9bb4', margin: 0 }}>
                  {activeMapNode.description}
                </p>
              </div>

              <button
                onClick={openRegistration}
                style={{
                  background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
                  border: 'none',
                  color: '#fff',
                  padding: '8px 18px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  letterSpacing: '0.08em'
                }}
              >
                DEPLOY CREW ➔
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 07: CHALLENGE ZONES ("THE BATTLEFIELD") + 3D Tilt
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: '1240px',
          margin: '0 auto 140px auto',
          padding: '0 24px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: '0.85rem',
              color: '#ff3344',
              letterSpacing: '0.3em'
            }}
          >
            SCENE 07 // ARENAS OF GLORY
          </span>
          <h2
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              margin: '8px 0',
              color: '#ffffff'
            }}
          >
            THE BATTLEFIELD ZONES
          </h2>
          <p style={{ color: '#8e9bb4', maxWidth: '600px', margin: '0 auto' }}>
            Explore each sector. Hover to experience 3D sensor illumination.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px'
          }}
        >
          {event.challengeZones.map((zone, idx) => {
            const isTilted = tiltZoneIndex === idx;
            return (
              <div
                key={zone.zoneNumber}
                onMouseMove={e => handleZoneMouseMove(e, idx)}
                onMouseLeave={handleZoneMouseLeave}
                onMouseEnter={() => {
                  setIsCursorHovering(true);
                  setCursorText('ZONE');
                }}
                style={{
                  background: 'linear-gradient(145deg, rgba(14, 20, 36, 0.95), rgba(8, 12, 22, 0.95))',
                  border: isTilted
                    ? '1px solid #00e5ff'
                    : '1px solid rgba(0, 229, 255, 0.18)',
                  borderRadius: '20px',
                  padding: '32px 28px',
                  boxShadow: isTilted
                    ? '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 229, 255, 0.3)'
                    : '0 10px 30px rgba(0, 0, 0, 0.5)',
                  transform: isTilted
                    ? `perspective(800px) rotateX(${tiltCoords.rotateX}deg) rotateY(${tiltCoords.rotateY}deg) scale(1.02)`
                    : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)',
                  transition: isTilted
                    ? 'transform 0.08s ease-out, border 0.2s'
                    : 'transform 0.4s ease, border 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                {/* 3D Mouse Light Follow Reflection */}
                {isTilted && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `radial-gradient(circle at ${tiltCoords.shineX}% ${tiltCoords.shineY}%, rgba(0, 229, 255, 0.15) 0%, transparent 60%)`,
                      pointerEvents: 'none'
                    }}
                  />
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Russo One', sans-serif",
                      fontSize: '0.8rem',
                      color: '#ff3344',
                      letterSpacing: '0.2em'
                    }}
                  >
                    {zone.zoneNumber}
                  </span>

                  <span
                    style={{
                      fontFamily: "'Russo One', sans-serif",
                      fontSize: '0.85rem',
                      color: '#f9c74f',
                      background: 'rgba(249, 199, 79, 0.12)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      border: '1px solid rgba(249, 199, 79, 0.3)'
                    }}
                  >
                    +{zone.points} PTS
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Russo One', sans-serif",
                    fontSize: '1.4rem',
                    color: '#ffffff',
                    margin: '0 0 6px 0',
                    letterSpacing: '0.04em'
                  }}
                >
                  {zone.name}
                </h3>

                <div
                  style={{
                    fontSize: '0.76rem',
                    color: '#00e5ff',
                    fontWeight: 800,
                    letterSpacing: '0.15em',
                    marginBottom: '16px'
                  }}
                >
                  {zone.category}
                </div>

                <p style={{ fontSize: '0.92rem', color: '#8e9bb4', lineHeight: 1.6, marginBottom: '20px' }}>
                  {zone.description}
                </p>

                {/* Difficulty Stars */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#8e9bb4', letterSpacing: '0.1em' }}>
                    DIFFICULTY:
                  </span>
                  <div style={{ color: '#ff3344', fontSize: '0.9rem', letterSpacing: '2px' }}>
                    {'★'.repeat(zone.difficulty) + '☆'.repeat(5 - zone.difficulty)}
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {zone.tags.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.72rem',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#d0d8ea'
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 08: STICKY STORYTELLING SECTION (300vh Scroll Lock)
      ───────────────────────────────────────────────────────────── */}
      <section
        ref={stickyStoryRef}
        style={{
          position: 'relative',
          height: `${event.stickyStory.length * 100}vh`,
          background: '#04060c'
        }}
      >
        {/* Sticky Container */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              maxWidth: '1240px',
              width: '90%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center'
            }}
          >
            {/* Left: Dynamic Sticky Artwork (Crossfade + Scale) */}
            <div
              style={{
                position: 'relative',
                height: '480px',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 229, 255, 0.25)'
              }}
            >
              {event.stickyStory.map((stage, idx) => (
                <div
                  key={stage.step}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${stage.artwork})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: activeStoryStage === idx ? 1 : 0,
                    transform: activeStoryStage === idx ? 'scale(1)' : 'scale(1.08)',
                    transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-out'
                  }}
                />
              ))}

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(4, 6, 12, 0.85) 100%)'
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  right: '24px',
                  zIndex: 2
                }}
              >
                <div
                  style={{
                    fontFamily: "'Russo One', sans-serif",
                    fontSize: '0.8rem',
                    color: '#ff3344',
                    letterSpacing: '0.25em'
                  }}
                >
                  STAGE {event.stickyStory[activeStoryStage]?.step}
                </div>
                <div
                  style={{
                    fontFamily: "'Russo One', sans-serif",
                    fontSize: '1.6rem',
                    color: '#ffffff'
                  }}
                >
                  {event.stickyStory[activeStoryStage]?.jpTitle}
                </div>
              </div>
            </div>

            {/* Right: Mission Stages Text & Progress Line */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <span
                style={{
                  fontFamily: "'Russo One', sans-serif",
                  fontSize: '0.85rem',
                  color: '#00e5ff',
                  letterSpacing: '0.3em'
                }}
              >
                SCENE 08 // THE 5 STAGES OF COMBAT
              </span>

              {/* Progress Step Selector Indicator */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {event.stickyStory.map((s, idx) => (
                  <button
                    key={s.step}
                    onClick={() => setActiveStoryStage(idx)}
                    style={{
                      flex: 1,
                      height: '4px',
                      borderRadius: '2px',
                      background: activeStoryStage >= idx ? '#ff3344' : 'rgba(255, 255, 255, 0.15)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.3s'
                    }}
                  />
                ))}
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "'Russo One', sans-serif",
                    fontSize: '3rem',
                    color: '#ff3344',
                    lineHeight: 1
                  }}
                >
                  {event.stickyStory[activeStoryStage]?.step}
                </div>
                <h3
                  style={{
                    fontFamily: "'Russo One', sans-serif",
                    fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                    color: '#ffffff',
                    margin: '6px 0'
                  }}
                >
                  {event.stickyStory[activeStoryStage]?.title}
                </h3>
                <p style={{ color: '#00e5ff', fontSize: '1.1rem', fontWeight: 600 }}>
                  {event.stickyStory[activeStoryStage]?.subtitle}
                </p>
                <p style={{ color: '#d0d8ea', fontSize: '1.02rem', lineHeight: 1.8 }}>
                  {event.stickyStory[activeStoryStage]?.description}
                </p>
              </div>

              {/* Tactical Intel Pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                {event.stickyStory[activeStoryStage]?.intel.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.85rem',
                      color: '#8e9bb4'
                    }}
                  >
                    <span style={{ color: '#00e5ff' }}>⚡</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 09: EVENT JOURNEY TIMELINE
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: '1000px',
          margin: '0 auto 140px auto',
          padding: '0 24px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: '0.85rem',
              color: '#f9c74f',
              letterSpacing: '0.3em'
            }}
          >
            CHRONOLOGICAL EXPEDITION
          </span>
          <h2
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(2.2rem, 4vw, 3.6rem)',
              margin: '8px 0',
              color: '#ffffff'
            }}
          >
            THE JOURNEY
          </h2>
        </div>

        <div style={{ position: 'relative', paddingLeft: '32px' }}>
          {/* Vertical Glowing Timeline Line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '12px',
              width: '2px',
              background: 'linear-gradient(180deg, #ff3344, #00e5ff, #f9c74f)'
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            {event.journey.map(j => (
              <div key={j.stepNumber} style={{ position: 'relative' }}>
                {/* Milestone Dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-26px',
                    top: '4px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: '#ff3344',
                    border: '2px solid #ffffff',
                    boxShadow: '0 0 12px #ff3344'
                  }}
                />

                <div
                  style={{
                    background: 'rgba(14, 20, 36, 0.75)',
                    border: '1px solid rgba(0, 229, 255, 0.2)',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px'
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Russo One', sans-serif",
                        fontSize: '0.8rem',
                        color: '#ff3344',
                        letterSpacing: '0.15em'
                      }}
                    >
                      STAGE {j.stepNumber}
                    </span>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        color: '#00e5ff',
                        fontWeight: 700,
                        background: 'rgba(0, 229, 255, 0.1)',
                        padding: '3px 10px',
                        borderRadius: '12px'
                      }}
                    >
                      {j.time}
                    </span>
                  </div>

                  <h4
                    style={{
                      fontFamily: "'Russo One', sans-serif",
                      fontSize: '1.25rem',
                      color: '#ffffff',
                      margin: '0 0 6px 0'
                    }}
                  >
                    {j.title}
                  </h4>

                  <p style={{ fontSize: '0.92rem', color: '#8e9bb4', margin: 0 }}>
                    {j.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 10: CODE OF BATTLE (Rules)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="rules"
        style={{
          maxWidth: '1100px',
          margin: '0 auto 140px auto',
          padding: '0 24px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: '0.85rem',
              color: '#ff3344',
              letterSpacing: '0.3em'
            }}
          >
            SACRED MARITIME LAWS
          </span>
          <h2
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              margin: '8px 0',
              color: '#ffffff'
            }}
          >
            CODE OF BATTLE
          </h2>
          <p style={{ color: '#8e9bb4', maxWidth: '600px', margin: '0 auto' }}>
            Enforced by the Shogunate High Jury. Zero tolerance for dishonorable conduct.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {event.codeOfBattle.map(rule => {
            const isWarningRule = /prohibit|ban|disqualif|hack|mod|cheat|fire|liquid|hazard|plagiar|zero\s*tolerance|outside\s*help|no\s*phone|restricted/i.test(rule.rule + ' ' + rule.detail);

            return (
              <div
                key={rule.number}
                onMouseEnter={() => {
                  setIsCursorHovering(true);
                  setCursorText('CODE');
                }}
                onMouseLeave={() => setIsCursorHovering(false)}
                style={{
                  background: isWarningRule ? 'rgba(28, 14, 24, 0.85)' : 'rgba(14, 20, 36, 0.8)',
                  border: isWarningRule ? '1px solid rgba(239, 68, 68, 0.45)' : '1px solid rgba(255, 51, 68, 0.25)',
                  borderRadius: '16px',
                  padding: '24px 32px',
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'center',
                  boxShadow: isWarningRule ? '0 10px 30px rgba(239, 68, 68, 0.15)' : '0 10px 30px rgba(0, 0, 0, 0.5)',
                  transition: 'border 0.2s, transform 0.2s'
                }}
              >
                <div
                  style={{
                    fontFamily: "'Russo One', sans-serif",
                    fontSize: '2.5rem',
                    color: isWarningRule ? '#ef4444' : '#ff3344',
                    lineHeight: 1,
                    minWidth: '50px'
                  }}
                >
                  {rule.number}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '4px' }}>
                    <h4
                      style={{
                        fontFamily: "'Russo One', sans-serif",
                        fontSize: '1.25rem',
                        color: '#ffffff',
                        margin: 0
                      }}
                    >
                      {rule.rule}
                    </h4>
                    <span
                      style={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: '0.78rem',
                        color: '#f9c74f',
                        borderLeft: '1px solid rgba(249, 199, 79, 0.4)',
                        paddingLeft: '10px'
                      }}
                    >
                      {rule.jpRule}
                    </span>
                    {isWarningRule && (
                      <span
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid #ef4444',
                          color: '#f87171',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          letterSpacing: '0.05em'
                        }}
                      >
                        ⚠️ CRITICAL RESTRICTION
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
                    {rule.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── FINAL DECISION NOTICE (Master Prompt Section 3) ─── */}
        <div
          style={{
            marginTop: '32px',
            padding: '18px 24px',
            borderRadius: '16px',
            background: 'rgba(212, 175, 55, 0.12)',
            border: '1.5px solid rgba(212, 175, 55, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            color: '#d4af37',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: '1rem',
            letterSpacing: '0.04em',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
          }}
        >
          <span style={{ fontSize: '1.3rem' }}>⚖️</span>
          <span>OFFICIAL DECISION: Judges' and Organizers' decision will be final and binding on all participants.</span>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 10.5: JUDGING CRITERIA (Section 14 of Master Prompt)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="judging"
        style={{
          maxWidth: '1100px',
          margin: '0 auto 120px auto',
          padding: '0 24px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.85rem',
              color: '#d4af37',
              letterSpacing: '0.25em',
              textTransform: 'uppercase'
            }}
          >
            EVALUATION RUBRIC & SCORING
          </span>
          <h2
            style={{
              fontFamily: "'Cinzel', 'Playfair Display', serif",
              fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
              margin: '8px 0',
              color: '#ffffff'
            }}
          >
            JUDGING CRITERIA
          </h2>
          <p style={{ color: '#8e9bb4', maxWidth: '600px', margin: '0 auto' }}>
            Transparent assessment standards applied by our distinguished judging panel.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {(event.judgingRubric || [
            { criterion: 'Creativity & Originality', percentage: 30, marks: 30, description: 'Innovative thinking and novel solutions.' },
            { criterion: 'Technical Execution & Precision', percentage: 30, marks: 30, description: 'Quality of craftsmanship and technical competence.' },
            { criterion: 'Theme Relevance & Storytelling', percentage: 25, marks: 25, description: 'Direct adherence to announced symposium themes.' },
            { criterion: 'Overall Impact & Presentation', percentage: 15, marks: 15, description: 'Stage presence, presentation clarity, and audience impact.' }
          ]).map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(14, 20, 36, 0.85)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '16px',
                padding: '22px 26px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 800 }}>
                  {item.criterion}
                </h4>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#d4af37' }}>
                  {item.marks ? `${item.marks} MARKS` : `${item.percentage}%`}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                {item.description}
              </p>
              {/* Animated Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${item.percentage || item.marks || 25}%`,
                    background: 'linear-gradient(90deg, #d4af37, #ff8800)',
                    borderRadius: '4px',
                    transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 10.6: SUBMISSION REQUIREMENTS & RESTRICTIONS
      ───────────────────────────────────────────────────────────── */}
      <section
        id="submission"
        style={{
          maxWidth: '1100px',
          margin: '0 auto 120px auto',
          padding: '0 24px'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Submission Guidelines */}
          <div
            style={{
              background: 'rgba(10, 16, 32, 0.85)',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.5rem' }}>📦</span>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#00e5ff', fontFamily: "'Cinzel', serif" }}>
                SUBMISSION REQUIREMENTS
              </h3>
            </div>
            <ul style={{ paddingLeft: '20px', margin: 0, color: '#cbd5e1', lineHeight: 1.8, fontSize: '0.92rem' }}>
              {(event.submissionRequirements || [
                'All files must be submitted before the designated event deadline.',
                'Accepted formats: 1080p MP4 (Video), JPG/JPEG (Photography), MP3 (Audio).',
                'Participants must carry a valid College ID card at all times.',
                'Late submissions after the clock expires will not be evaluated.'
              ]).map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Important Restrictions & Team Size */}
          <div
            style={{
              background: 'rgba(10, 16, 32, 0.85)',
              border: '1px solid rgba(255, 51, 68, 0.3)',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ff3344', fontFamily: "'Cinzel', serif" }}>
                CRITICAL RESTRICTIONS
              </h3>
            </div>
            <ul style={{ paddingLeft: '20px', margin: 0, color: '#cbd5e1', lineHeight: 1.8, fontSize: '0.92rem' }}>
              {(event.importantNotes || [
                'Zero tolerance for plagiarism, downloaded footage, or AI-generated media.',
                'Dangerous materials (fire, liquids, powders, sharp objects) strictly prohibited.',
                'Mobile phones and external communication banned during active evaluation.',
                'Unsportsmanlike conduct results in immediate crew disqualification.'
              ]).map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>

            {/* Monumental Visual Team Size Badge */}
            <div
              style={{
                marginTop: '22px',
                padding: '14px 20px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>OFFICIAL TEAM SIZE:</span>
              <span style={{ fontSize: '1.2rem', color: '#d4af37', fontWeight: 900, letterSpacing: '0.06em' }}>
                👥 {event.bounty.crewSize || '1 - 4 MEMBERS'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 11: THE TREASURE (Monumental Prize Section)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: '1240px',
          margin: '0 auto 140px auto',
          padding: '0 24px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: '0.85rem',
              color: '#f9c74f',
              letterSpacing: '0.3em'
            }}
          >
            SCENE 11 // THE GOLDEN PODIUM
          </span>
          <h2
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              margin: '8px 0',
              background: 'linear-gradient(135deg, #ffffff 0%, #ffaa00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            THE TREASURE
          </h2>
        </div>

        {/* 3 Tier Podium Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'flex-end',
            marginBottom: '40px'
          }}
        >
          {/* 2nd Place */}
          <div
            style={{
              background: 'rgba(14, 20, 36, 0.9)',
              border: '1px solid rgba(192, 192, 192, 0.4)',
              borderRadius: '20px',
              padding: '36px 24px',
              textAlign: 'center',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🥈</div>
            <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: '0.85rem', color: '#c0c0c0', letterSpacing: '0.2em' }}>
              2ND CHAMPION
            </div>
            <div
              style={{
                fontFamily: "'Russo One', sans-serif",
                fontSize: '2.4rem',
                color: '#ffffff',
                margin: '8px 0'
              }}
            >
              {event.treasure.secondPrize}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#8e9bb4' }}>
              Silver Shusui Trophy + Badges
            </div>
          </div>

          {/* 1st Place (Heroic Centerpiece) */}
          <div
            style={{
              background: 'linear-gradient(145deg, #1f1807 0%, #0d101b 100%)',
              border: '2px solid #f9c74f',
              borderRadius: '24px',
              padding: '50px 28px',
              textAlign: 'center',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(249, 199, 79, 0.35)',
              transform: 'scale(1.04)'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👑</div>
            <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: '0.9rem', color: '#f9c74f', letterSpacing: '0.25em' }}>
              1ST GRAND CHAMPION
            </div>
            <div
              style={{
                fontFamily: "'Russo One', sans-serif",
                fontSize: '3.4rem',
                color: '#ffb703',
                margin: '10px 0',
                textShadow: '0 0 30px rgba(255, 183, 3, 0.5)'
              }}
            >
              {event.treasure.firstPrize}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#f0f4fc', fontWeight: 700 }}>
              Supreme Trophy Blade + Direct Job Round
            </div>
          </div>

          {/* 3rd Place */}
          <div
            style={{
              background: 'rgba(14, 20, 36, 0.9)',
              border: '1px solid rgba(205, 127, 50, 0.4)',
              borderRadius: '20px',
              padding: '36px 24px',
              textAlign: 'center',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🥉</div>
            <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: '0.85rem', color: '#cd7f32', letterSpacing: '0.2em' }}>
              3RD CHAMPION
            </div>
            <div
              style={{
                fontFamily: "'Russo One', sans-serif",
                fontSize: '2.4rem',
                color: '#ffffff',
                margin: '8px 0'
              }}
            >
              {event.treasure.thirdPrize}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#8e9bb4' }}>
              Bronze Enma Trophy + Crate
            </div>
          </div>
        </div>

        {/* Additional Rewards */}
        <div
          style={{
            background: 'rgba(14, 20, 36, 0.7)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '16px',
            padding: '24px 32px'
          }}
        >
          <div style={{ fontSize: '0.85rem', color: '#00e5ff', fontWeight: 800, letterSpacing: '0.15em', marginBottom: '12px' }}>
            PLUS SPECIAL NAKAMA REWARDS:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {event.treasure.extras.map((extra, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#d0d8ea' }}>
                <span style={{ color: '#f9c74f' }}>✦</span> {extra}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 12: CREW SYSTEM ("BUILD YOUR CREW")
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto 140px auto',
          padding: '0 24px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: '0.85rem',
              color: '#00e5ff',
              letterSpacing: '0.3em'
            }}
          >
            ROSTER SELECTION
          </span>
          <h2
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              margin: '8px 0',
              color: '#ffffff'
            }}
          >
            BUILD YOUR CREW
          </h2>
          <p style={{ color: '#8e9bb4' }}>
            Choose your combat formation to preview character silhouette alignment.
          </p>
        </div>

        {/* Formation Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '36px',
            flexWrap: 'wrap'
          }}
        >
          {event.crewTiers.map(t => (
            <button
              key={t.type}
              onClick={() => setSelectedCrewTier(t.type)}
              style={{
                padding: '10px 24px',
                borderRadius: '30px',
                background: selectedCrewTier === t.type
                  ? 'linear-gradient(135deg, #ff3344, #ff8800)'
                  : 'rgba(14, 20, 36, 0.8)',
                border: selectedCrewTier === t.type ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontFamily: "'Russo One', sans-serif",
                fontSize: '0.85rem',
                letterSpacing: '0.12em',
                cursor: 'pointer',
                transition: 'all 0.25s'
              }}
            >
              {t.name} [{t.type}]
            </button>
          ))}
        </div>

        {/* Crew Visualization Card */}
        {(() => {
          const currentTier = event.crewTiers.find(t => t.type === selectedCrewTier) || event.crewTiers[0];
          return (
            <div
              style={{
                background: 'linear-gradient(145deg, rgba(14, 20, 36, 0.95), rgba(6, 8, 14, 0.95))',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
              }}
            >
              {/* Silhouette Avatars Display */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '24px',
                  padding: '30px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  marginBottom: '28px'
                }}
              >
                {Array.from({ length: currentTier.silhouettesCount }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '72px',
                      height: '96px',
                      background: 'linear-gradient(180deg, #ff3344 0%, #1e1b4b 100%)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      boxShadow: '0 10px 25px rgba(255, 51, 68, 0.4)',
                      animation: `pulse ${1.5 + i * 0.3}s infinite ease-in-out`
                    }}
                  >
                    🏴‍☠️
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '24px'
                }}
              >
                <div>
                  <h4 style={{ fontFamily: "'Russo One', sans-serif", fontSize: '1.4rem', color: '#ffffff', margin: '0 0 8px 0' }}>
                    {currentTier.name}
                  </h4>
                  <p style={{ color: '#8e9bb4', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {currentTier.description}
                  </p>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: '#00e5ff', fontWeight: 800, letterSpacing: '0.15em', marginBottom: '8px' }}>
                    RECOMMENDED PIRATE ROLES:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {currentTier.recommendedSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.78rem',
                          background: 'rgba(0, 229, 255, 0.12)',
                          border: '1px solid rgba(0, 229, 255, 0.3)',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          color: '#f0f4fc'
                        }}
                      >
                        ⚔️ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 13: LIVE STATUS & COUNTDOWN
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto 140px auto',
          padding: '0 24px'
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255, 51, 68, 0.12), rgba(14, 20, 36, 0.95))',
            border: '1px solid rgba(255, 51, 68, 0.4)',
            borderRadius: '24px',
            padding: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '30px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#2ec4b6',
                  boxShadow: '0 0 10px #2ec4b6'
                }}
              />
              <span style={{ fontFamily: "'Russo One', sans-serif", fontSize: '0.85rem', color: '#2ec4b6', letterSpacing: '0.2em' }}>
                MISSION STATUS: REGISTRATION OPEN
              </span>
            </div>

            <h3 style={{ fontFamily: "'Russo One', sans-serif", fontSize: '1.8rem', color: '#ffffff', margin: 0 }}>
              {event.liveStatus.currentRound}
            </h3>

            <div style={{ fontSize: '0.85rem', color: '#8e9bb4', marginTop: '6px' }}>
              {event.liveStatus.registeredCrews > 0
                ? `${event.liveStatus.registeredCrews} Crews Registered • ${event.liveStatus.activeCrews} Max Capacity`
                : 'Registration details will be announced soon.'}
            </div>
          </div>

          {/* Countdown Clock Display — only shown when a date is announced */}
          {hasTargetDate ? (
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { label: 'DAYS', val: countdown.days },
                { label: 'HOURS', val: countdown.hours },
                { label: 'MINS', val: countdown.mins },
                { label: 'SECS', val: countdown.secs }
              ].map(c => (
                <div
                  key={c.label}
                  style={{
                    background: 'rgba(6, 8, 14, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    textAlign: 'center',
                    minWidth: '65px'
                  }}
                >
                  <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: '1.6rem', color: '#ff3344' }}>
                    {c.val < 10 ? `0${c.val}` : c.val}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#8e9bb4', letterSpacing: '0.15em' }}>
                    {c.label}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: 'rgba(6, 8, 14, 0.85)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                borderRadius: '12px',
                padding: '18px 28px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: '1.3rem', color: '#f9c74f', letterSpacing: '0.1em' }}>
                ⏳ DATE TO BE ANNOUNCED
              </div>
              <div style={{ fontSize: '0.8rem', color: '#8e9bb4', marginTop: '4px' }}>
                Registration details will be announced soon.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 14: CREW LEADERBOARD (In-World Ranking)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto 140px auto',
          padding: '0 24px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: '0.85rem',
              color: '#00e5ff',
              letterSpacing: '0.3em'
            }}
          >
            LIVE MARITIME HIERARCHY
          </span>
          <h2
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              margin: '8px 0',
              color: '#ffffff'
            }}
          >
            THE CREWS
          </h2>
        </div>

        <div
          style={{
            background: 'rgba(14, 20, 36, 0.85)',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
          }}
        >
          {event.leaderboard.length > 0 ? event.leaderboard.map(entry => (
            <div
              key={entry.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'background 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    fontFamily: "'Russo One', sans-serif",
                    fontSize: '1.2rem',
                    color: entry.rank === 1 ? '#ffb703' : entry.rank === 2 ? '#c0c0c0' : '#cd7f32',
                    minWidth: '32px'
                  }}
                >
                  #{entry.rank}
                </div>
                <div>
                  <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: '1.05rem', color: '#ffffff' }}>
                    {entry.crewName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#8e9bb4' }}>
                    {entry.affiliation}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: 'rgba(255, 51, 68, 0.15)',
                    color: '#ff3344',
                    fontWeight: 800
                  }}
                >
                  {entry.badge}
                </span>

                <span
                  style={{
                    fontFamily: "'Russo One', sans-serif",
                    fontSize: '1.2rem',
                    color: '#00e5ff'
                  }}
                >
                  {entry.score} PTS
                </span>
              </div>
            </div>
          )) : (
            <div style={{ padding: '30px', textAlign: 'center', color: '#8e9bb4', fontSize: '0.95rem', lineHeight: 1.7 }}>
              🏆 Crew rankings will be published here by the organizing committee after the event.
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 15: VENUE MAP ("FIND THE BATTLEFIELD")
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: '1240px',
          margin: '0 auto 140px auto',
          padding: '0 24px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: '0.85rem',
              color: '#f9c74f',
              letterSpacing: '0.3em'
            }}
          >
            FESTIVAL CITADEL
          </span>
          <h2
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              margin: '8px 0',
              color: '#ffffff'
            }}
          >
            FIND THE BATTLEFIELD
          </h2>
          <p style={{ color: '#8e9bb4' }}>
            Click key checkpoints to view area briefing and access directions.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}
        >
          {event.venueLocations.map(loc => {
            const isSelected = selectedVenueId === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => setSelectedVenueId(loc.id)}
                onMouseEnter={() => {
                  setIsCursorHovering(true);
                  setCursorText('MAP');
                }}
                onMouseLeave={() => setIsCursorHovering(false)}
                style={{
                  background: isSelected
                    ? 'linear-gradient(145deg, rgba(255, 51, 68, 0.15), rgba(14, 20, 36, 0.95))'
                    : 'rgba(14, 20, 36, 0.75)',
                  border: isSelected ? '1px solid #ff3344' : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                  padding: '24px',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 15px 35px rgba(255, 51, 68, 0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#00e5ff', fontWeight: 800, letterSpacing: '0.15em' }}>
                  {loc.area}
                </div>
                <h4 style={{ fontFamily: "'Russo One', sans-serif", fontSize: '1.25rem', color: '#fff', margin: '4px 0 8px 0' }}>
                  {loc.name}
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#8e9bb4', margin: 0, lineHeight: 1.6 }}>
                  {loc.briefing}
                </p>
              </div>
            );
          })}
        </div>

        {/* ─── MISSION COORDINATORS (admin-editable) ─── */}
        {event.coordinatorInfo && event.coordinatorInfo.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span
                style={{
                  fontFamily: "'Russo One', sans-serif",
                  fontSize: '0.85rem',
                  color: '#d4af37',
                  letterSpacing: '0.3em'
                }}
              >
                YOUR POINT OF CONTACT
              </span>
              <h3
                style={{
                  fontFamily: "'Russo One', sans-serif",
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  margin: '8px 0',
                  color: '#ffffff'
                }}
              >
                MISSION COORDINATORS
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {event.coordinatorInfo.map((c, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(14, 20, 36, 0.85)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👤</div>
                  <h4 style={{ fontFamily: "'Russo One', sans-serif", fontSize: '1.2rem', color: '#f8fafc', margin: '0 0 4px 0' }}>
                    {c.name}
                  </h4>
                  {c.role && (
                    <div style={{ fontSize: '0.75rem', color: '#00e5ff', fontWeight: 800, letterSpacing: '0.12em', marginBottom: '6px' }}>
                      {c.role.toUpperCase()}
                    </div>
                  )}
                  <div style={{ fontSize: '0.85rem', color: '#8e9bb4' }}>
                    {[c.year, c.department].filter(Boolean).join(' • ') || 'Department: To Be Announced'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7a94', marginTop: '6px' }}>
                    {c.contact || '📞 Contact details will be announced soon.'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 16: FAQ ACCORDION
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: '1000px',
          margin: '0 auto 140px auto',
          padding: '0 24px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: '0.85rem',
              color: '#00e5ff',
              letterSpacing: '0.3em'
            }}
          >
            CLARIFICATIONS
          </span>
          <h2
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              margin: '8px 0',
              color: '#ffffff'
            }}
          >
            FREQUENTLY ASKED INTEL
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {event.faq.map((item, idx) => {
            const isExpanded = expandedFaqIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(14, 20, 36, 0.85)',
                  border: isExpanded ? '1px solid #00e5ff' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'border 0.2s'
                }}
              >
                <button
                  onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontFamily: "'Russo One', sans-serif",
                    fontSize: '1rem',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span>{item.question}</span>
                  <span
                    style={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      color: '#00e5ff'
                    }}
                  >
                    ▼
                  </span>
                </button>

                {isExpanded && (
                  <div
                    style={{
                      padding: '0 24px 20px 24px',
                      color: '#8e9bb4',
                      fontSize: '0.95rem',
                      lineHeight: 1.7
                    }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCENE 17: FINAL CTA (Monumental Cinematic Ending)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          padding: '120px 24px',
          textAlign: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #04060c 0%, #0a0d1a 100%)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${event.fallbackArtwork})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.18,
            filter: 'blur(3px)'
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <span
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: '0.85rem',
              color: '#ff3344',
              letterSpacing: '0.3em'
            }}
          >
            THE FINAL WHISTLE APPROACHES
          </span>

          <h2
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: '#ffffff',
              margin: '12px 0 24px 0',
              lineHeight: 1.15
            }}
          >
            READY TO ENTER THE BATTLEFIELD?
          </h2>

          <p style={{ fontSize: '1.1rem', color: '#8e9bb4', marginBottom: '40px' }}>
            Assemble your crew, conquer the challenge nodes, and claim your share of the {event.bounty.prizePool} treasure.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <button
              onClick={openRegistration}
              onMouseEnter={() => {
                setIsCursorHovering(true);
                setCursorText('JOIN');
              }}
              onMouseLeave={() => setIsCursorHovering(false)}
              style={{
                background: 'linear-gradient(135deg, #ff3344 0%, #ff8800 100%)',
                border: 'none',
                color: '#ffffff',
                padding: '18px 48px',
                borderRadius: '40px',
                fontFamily: "'Russo One', sans-serif",
                fontSize: '1.1rem',
                letterSpacing: '0.15em',
                cursor: 'pointer',
                boxShadow: '0 0 40px rgba(255, 51, 68, 0.6)'
              }}
            >
              REGISTER NOW ⚔️
            </button>

            {onBackToHome && (
              <button
                onClick={onBackToHome}
                style={{
                  background: 'rgba(14, 20, 36, 0.9)',
                  border: '1px solid rgba(0, 229, 255, 0.4)',
                  color: '#ffffff',
                  padding: '18px 36px',
                  borderRadius: '40px',
                  fontFamily: "'Russo One', sans-serif",
                  fontSize: '1rem',
                  letterSpacing: '0.12em',
                  cursor: 'pointer'
                }}
              >
                VIEW ALL EVENTS
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── REGISTRATION CONFIRMATION TOAST (Spec Section 20) ─── */}
      {regNotice && (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 28px',
            borderRadius: '16px',
            background: 'rgba(10, 14, 26, 0.95)',
            border: '1px solid rgba(212, 175, 55, 0.5)',
            boxShadow: '0 15px 45px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.25)',
            backdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.3s ease',
            maxWidth: 'calc(100vw - 40px)'
          }}
        >
          <span style={{ fontSize: '1.6rem' }}>🏴‍☠️</span>
          <div>
            <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: '1rem', color: '#d4af37', letterSpacing: '0.05em' }}>
              REGISTRATION FLAG RAISED!
            </div>
            <div style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '2px' }}>
              Registration details will be announced soon.
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCENE 18: REGISTRATION TRANSITION MODAL (5-Step Flow)
      ───────────────────────────────────────────────────────────── */}
      {isRegisterOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: 'rgba(4, 6, 14, 0.88)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, #0d1220 0%, #060914 100%)',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              borderRadius: '24px',
              maxWidth: '620px',
              width: '100%',
              padding: '36px 32px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 229, 255, 0.25)',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsRegisterOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: '#8e9bb4',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.75rem', color: '#ff3344', fontFamily: "'Russo One', sans-serif", letterSpacing: '0.2em' }}>
                MISSION ENROLLMENT // STEP 0{regStep} OF 05
              </div>
              <h3 style={{ fontFamily: "'Russo One', sans-serif", fontSize: '1.6rem', color: '#fff', margin: '4px 0' }}>
                {event.title}
              </h3>
            </div>

            {/* Progress Dots */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
              {[1, 2, 3, 4, 5].map(step => (
                <div
                  key={step}
                  style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '2px',
                    background: regStep >= step ? '#ff3344' : 'rgba(255, 255, 255, 0.1)'
                  }}
                />
              ))}
            </div>

            {/* STEP 01: CHOOSE CREW */}
            {regStep === 1 && (
              <div>
                <h4 style={{ color: '#fff', marginBottom: '16px', fontSize: '1.1rem' }}>
                  Choose Your Combat Formation
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {event.crewTiers.map(tier => (
                    <button
                      key={tier.type}
                      onClick={() => setRegForm({ ...regForm, crewType: tier.type })}
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        background: regForm.crewType === tier.type ? 'rgba(255, 51, 68, 0.2)' : 'rgba(14, 20, 36, 0.8)',
                        border: regForm.crewType === tier.type ? '1px solid #ff3344' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontFamily: "'Russo One', sans-serif", fontSize: '0.95rem', color: '#fff' }}>
                        {tier.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#8e9bb4' }}>
                        {tier.minMembers === tier.maxMembers ? `${tier.minMembers} Member` : `${tier.minMembers}-${tier.maxMembers} Members`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 02: CREW NAME & CALLSIGN */}
            {regStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#8e9bb4', display: 'block', marginBottom: '6px' }}>
                    CREW / PIRATE FLEET NAME
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Straw Hat Hackers"
                    value={regForm.crewName}
                    onChange={e => setRegForm({ ...regForm, crewName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(6, 9, 18, 0.8)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#8e9bb4', display: 'block', marginBottom: '6px' }}>
                    BATTLE CALLSIGN (HANDLE)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NIKA-ZERO"
                    value={regForm.callsign}
                    onChange={e => setRegForm({ ...regForm, callsign: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(6, 9, 18, 0.8)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              </div>
            )}

            {/* STEP 03: CAPTAIN & COLLEGE DETAILS */}
            {regStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#8e9bb4', display: 'block', marginBottom: '6px' }}>
                    CAPTAIN / LEAD NAME
                  </label>
                  <input
                    type="text"
                    placeholder="Full Legal Name"
                    value={regForm.captainName}
                    onChange={e => setRegForm({ ...regForm, captainName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(6, 9, 18, 0.8)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#8e9bb4', display: 'block', marginBottom: '6px' }}>
                    COLLEGE / INSTITUTION
                  </label>
                  <input
                    type="text"
                    placeholder="College Name & City"
                    value={regForm.college}
                    onChange={e => setRegForm({ ...regForm, college: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(6, 9, 18, 0.8)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#8e9bb4', display: 'block', marginBottom: '6px' }}>
                    CONTACT EMAIL & PHONE
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="email"
                      placeholder="Email"
                      value={regForm.captainEmail}
                      onChange={e => setRegForm({ ...regForm, captainEmail: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: 'rgba(6, 9, 18, 0.8)',
                        border: '1px solid rgba(0, 229, 255, 0.3)',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <input
                      type="tel"
                      placeholder="WhatsApp Phone"
                      value={regForm.captainPhone}
                      onChange={e => setRegForm({ ...regForm, captainPhone: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: 'rgba(6, 9, 18, 0.8)',
                        border: '1px solid rgba(0, 229, 255, 0.3)',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 04: CONFIRMATION SUMMARY */}
            {regStep === 4 && (
              <div
                style={{
                  background: 'rgba(14, 20, 36, 0.8)',
                  border: '1px dashed rgba(255, 51, 68, 0.4)',
                  borderRadius: '16px',
                  padding: '20px',
                  fontSize: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ color: '#00e5ff', fontWeight: 800 }}>SUMMARY OF ENROLLMENT:</div>
                <div><strong>EVENT:</strong> {event.title} ({event.missionNumber})</div>
                <div><strong>CREW FORMATION:</strong> {regForm.crewType}</div>
                <div><strong>CREW NAME:</strong> {regForm.crewName || 'Lone Pirates'}</div>
                <div><strong>CALLSIGN:</strong> {regForm.callsign || 'CIPHER-1'}</div>
                <div><strong>CAPTAIN:</strong> {regForm.captainName || 'Anonymous Warrior'}</div>
                <div><strong>COLLEGE:</strong> {regForm.college || 'Grand Line Academy'}</div>
                <div style={{ color: '#f9c74f', fontSize: '0.8rem', marginTop: '6px' }}>
                  ⚠️ By confirming, you agree to the 5 Codes of Battle.
                </div>
              </div>
            )}

            {/* STEP 05: MISSION ACCEPTED CELEBRATION */}
            {regStep === 5 && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>🏴‍☠️</div>
                <div
                  style={{
                    fontFamily: "'Russo One', sans-serif",
                    fontSize: '1.8rem',
                    color: '#ff3344',
                    letterSpacing: '0.1em'
                  }}
                >
                  MISSION ACCEPTED!
                </div>
                <h4 style={{ fontFamily: "'Russo One', sans-serif", fontSize: '1.2rem', color: '#fff', margin: '8px 0' }}>
                  WELCOME TO CYBITRADIC WANO FEST
                </h4>
                <p style={{ color: '#8e9bb4', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 20px auto' }}>
                  Your official digital Wanted Pass & credential token has been registered in the Shogunate database.
                </p>
                <div
                  style={{
                    background: 'rgba(0, 229, 255, 0.1)',
                    border: '1px solid #00e5ff',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    display: 'inline-block',
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    color: '#00e5ff'
                  }}
                >
                  WANO-TOKEN-#{Math.floor(100000 + Math.random() * 900000)}
                </div>
              </div>
            )}

            {/* Step Navigation Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
              {regStep > 1 && regStep < 5 && (
                <button
                  onClick={() => setRegStep(regStep - 1)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Back
                </button>
              )}

              {regStep < 4 && (
                <button
                  onClick={() => setRegStep(regStep + 1)}
                  style={{
                    marginLeft: 'auto',
                    background: '#ff3344',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 24px',
                    borderRadius: '20px',
                    fontFamily: "'Russo One', sans-serif",
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Next Step ➔
                </button>
              )}

              {regStep === 4 && (
                <button
                  onClick={() => {
                    setRegStep(5);
                  }}
                  style={{
                    marginLeft: 'auto',
                    background: 'linear-gradient(135deg, #ff3344, #ff8800)',
                    border: 'none',
                    color: '#fff',
                    padding: '12px 28px',
                    borderRadius: '20px',
                    fontFamily: "'Russo One', sans-serif",
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(255, 51, 68, 0.5)'
                  }}
                >
                  CONFIRM & DEPLOY ⚔️
                </button>
              )}

              {regStep === 5 && (
                <button
                  onClick={() => setIsRegisterOpen(false)}
                  style={{
                    margin: '0 auto',
                    background: '#2ec4b6',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 30px',
                    borderRadius: '20px',
                    fontFamily: "'Russo One', sans-serif",
                    cursor: 'pointer'
                  }}
                >
                  CLOSE & RETURN TO FESTIVAL
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
