import React, { useState, useEffect, useRef } from 'react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // fallback duration until loaded
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync audio events with state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(Math.floor(audio.currentTime));
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
    };
  }, []);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio playback error:', err);
      });
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = pct * duration;

    audio.currentTime = newTime;
    setCurrentTime(Math.floor(newTime));
  };

  const handleSkip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const targetTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
    audio.currentTime = targetTime;
    setCurrentTime(Math.floor(targetTime));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div
      style={{
        maxWidth: '720px',
        margin: '-40px auto 40px auto',
        position: 'relative',
        zIndex: 25,
        padding: '0 20px',
      }}
    >
      {/* Hidden Native Audio Element serving captain.mp3 */}
      <audio
        ref={audioRef}
        src="/captain.mp3"
        preload="metadata"
        playsInline
      />

      <div
        style={{
          background: 'rgba(10, 14, 26, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(0, 229, 255, 0.35)',
          borderRadius: '24px',
          padding: '16px 24px',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 229, 255, 0.22)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        {/* Album Artwork */}
        <div
          data-cursor="view"
          data-cursor-text="PLAY"
          onClick={togglePlay}
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
            border: `2px solid ${isPlaying ? '#00e5ff' : 'rgba(255, 183, 3, 0.6)'}`,
            boxShadow: isPlaying ? '0 0 20px rgba(0, 229, 255, 0.5)' : '0 0 15px rgba(255, 183, 3, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          <img
            src="/images/luffy_nontech.jpg"
            alt="Captain Theme"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: isPlaying ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
              fontSize: '0.62rem',
              textAlign: 'center',
              padding: '3px 0',
              color: '#ffffff',
              fontWeight: 800,
              fontFamily: 'var(--font-title)',
              letterSpacing: '0.08em',
            }}
          >
            CAPTAIN
          </div>
        </div>

        {/* Track Info & Visualizer */}
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: '1.08rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  fontFamily: 'var(--font-heading)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                CAPTAIN'S ANTHEM
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: isPlaying ? 'rgba(0, 229, 255, 0.25)' : 'rgba(255, 183, 3, 0.2)',
                    color: isPlaying ? '#00e5ff' : '#ffb703',
                    border: `1px solid ${isPlaying ? 'rgba(0, 229, 255, 0.5)' : 'rgba(255, 183, 3, 0.4)'}`,
                    fontWeight: 800,
                  }}
                >
                  {isPlaying ? 'PLAYING ⚡' : 'OST'}
                </span>
              </h4>
              <p
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  margin: '2px 0 0 0',
                  letterSpacing: '0.04em',
                }}
              >
                ONE PIECE • Captain Theme (captain.mp3) // Wano Fest
              </p>
            </div>

            {/* Like Heart Button */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              data-cursor="button"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.3rem',
                color: isLiked ? '#ff3366' : '#777',
                transition: 'transform 0.2s',
                padding: '4px',
              }}
              title="Add to Favorites"
            >
              {isLiked ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Waveform Visualizer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              height: '24px',
              margin: '8px 0',
              overflow: 'hidden',
            }}
          >
            {Array.from({ length: 36 }).map((_, idx) => (
              <div
                key={idx}
                className={isPlaying ? 'wave-bar' : ''}
                style={{
                  width: '3px',
                  height: isPlaying ? undefined : `${6 + ((idx * 7) % 14)}px`,
                  background: isPlaying
                    ? 'linear-gradient(to top, #00e5ff, #d90429)'
                    : 'rgba(255,255,255,0.22)',
                  borderRadius: '2px',
                  transition: 'height 0.3s ease',
                  animationDelay: `${(idx % 8) * 0.12}s`,
                }}
              />
            ))}
          </div>

          {/* Time & Progress Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.75rem',
              color: '#8e9bb4',
            }}
          >
            <span style={{ minWidth: '32px' }}>{formatTime(currentTime)}</span>
            <div
              onClick={handleSeek}
              data-cursor="button"
              data-cursor-text="SEEK"
              style={{
                flex: 1,
                height: '6px',
                background: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '3px',
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #00e5ff 0%, #ffb703 70%, #d90429 100%)',
                  borderRadius: '3px',
                  transition: 'width 0.15s linear',
                }}
              />
            </div>
            <span style={{ minWidth: '32px' }}>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Rewind 10s */}
          <button
            onClick={() => handleSkip(-10)}
            data-cursor="button"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#ffffff',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            title="Rewind 10s"
          >
            ⏮
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            data-cursor="button"
            data-cursor-text={isPlaying ? 'PAUSE' : 'PLAY'}
            style={{
              background: isPlaying
                ? 'linear-gradient(135deg, #d90429 0%, #fb8500 100%)'
                : 'linear-gradient(135deg, #00e5ff 0%, #0077b6 100%)',
              border: 'none',
              borderRadius: '50%',
              width: '52px',
              height: '52px',
              color: '#ffffff',
              fontSize: '1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isPlaying
                ? '0 0 25px rgba(217, 4, 41, 0.7)'
                : '0 0 25px rgba(0, 229, 255, 0.7)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            title={isPlaying ? 'Pause' : "Play Captain's Anthem"}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Forward 10s */}
          <button
            onClick={() => handleSkip(10)}
            data-cursor="button"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#ffffff',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            title="Forward 10s"
          >
            ⏭
          </button>

          {/* Mute/Unmute Mini Button & Volume Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              data-cursor="button"
              style={{
                background: 'transparent',
                border: 'none',
                color: isMuted ? '#ff4d6d' : 'rgba(255,255,255,0.7)',
                fontSize: '1.1rem',
                cursor: 'pointer',
                padding: '2px',
              }}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              style={{
                width: '50px',
                height: '4px',
                accentColor: '#00e5ff',
                cursor: 'pointer',
              }}
              title="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
