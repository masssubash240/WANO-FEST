import React, { useEffect, useRef, useState } from 'react';
import { startGlobalAmbientAudio } from './GlobalAmbientAudio';

interface OpeningLoaderProps {
  onComplete: () => void;
}

/** Full-screen opening sequence. Existing site UI stays untouched underneath. */
export const OpeningLoader: React.FC<OpeningLoaderProps> = ({ onComplete }) => {
  const completedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [soundUnlocked, setSoundUnlocked] = useState(false);

  const unlockSound = () => {
    void startGlobalAmbientAudio();
    setSoundUnlocked(true);
  };

  const complete = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  const apply2xSpeed = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2.0;
    }
  };

  useEffect(() => {
    apply2xSpeed();
    // Safety fallback in case the browser blocks video playback or does not emit ended (reduced for 2x speed)
    const fallback = window.setTimeout(complete, 7000);
    return () => window.clearTimeout(fallback);
  }, []);

  return (
    <div
      aria-label="CybiTradic Wano Fest opening"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: '#02040a',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onLoadedMetadata={apply2xSpeed}
        onPlay={apply2xSpeed}
        onCanPlay={apply2xSpeed}
        onEnded={complete}
        onError={complete}
        onClick={unlockSound}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        <source src="/media/cybitradic-opening.mp4" type="video/mp4" />
      </video>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.05), rgba(0,0,0,0.48) 78%, rgba(0,0,0,0.72))',
          pointerEvents: 'none',
        }}
      />


      {!soundUnlocked && (
        <button
          type="button"
          onClick={unlockSound}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '12%',
            transform: 'translateX(-50%)',
            zIndex: 4,
            padding: '13px 24px',
            borderRadius: '999px',
            border: '1px solid rgba(0,229,255,0.65)',
            background: 'rgba(3,8,18,0.78)',
            color: '#fff',
            fontWeight: 800,
            letterSpacing: '0.12em',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 24px rgba(0,229,255,0.22)',
          }}
        >
          🔊 ENTER • SOUND ON
        </button>
      )}

      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '7%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          color: 'rgba(255,255,255,0.8)',
          fontFamily: "'Outfit', 'Rajdhani', sans-serif",
          fontSize: '0.72rem',
          letterSpacing: '0.34em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        SET SAIL • WANO FEST
      </div>

      <style>{`\n        @keyframes openingLogoPulse {\n          0%, 100% { transform: scale(0.985); opacity: 0.92; }\n          50% { transform: scale(1.015); opacity: 1; }\n        }\n      `}</style>
    </div>
  );
};
