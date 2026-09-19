import React, { useEffect } from 'react';

let sharedAudio: HTMLAudioElement | null = null;
let listenersInstalled = false;

// This is the audio track supplied by the user for the website-wide ambience.
const AUDIO_SRC = '/media/user-uploaded-wano-fest-audio.mp3';
const AUDIO_VOLUME = 0.40;

const ensureAudio = () => {
  if (typeof window === 'undefined') return null;
  if (!sharedAudio) {
    sharedAudio = new Audio(AUDIO_SRC);
    sharedAudio.loop = true;
    sharedAudio.preload = 'auto';
    sharedAudio.volume = AUDIO_VOLUME;
    sharedAudio.setAttribute('aria-hidden', 'true');
  }
  return sharedAudio;
};

export const startGlobalAmbientAudio = () => {
  const audio = ensureAudio();
  if (!audio) return Promise.resolve();
  audio.volume = AUDIO_VOLUME;
  return audio.play().catch(() => undefined);
};

export const setGlobalAmbientMuted = (muted: boolean) => {
  const audio = ensureAudio();
  if (!audio) return;
  audio.muted = muted;
  if (!muted) void startGlobalAmbientAudio();
};

export const GlobalAmbientAudio: React.FC = () => {
  useEffect(() => {
    const audio = ensureAudio();
    if (!audio) return;

    const tryStart = () => {
      void startGlobalAmbientAudio();
    };

    // Autoplay with sound is normally blocked until the visitor interacts.
    tryStart();

    if (!listenersInstalled) {
      listenersInstalled = true;
      const unlock = () => {
        tryStart();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('touchstart', unlock);
        listenersInstalled = false;
      };
      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('keydown', unlock);
      window.addEventListener('touchstart', unlock, { passive: true });
    }

    const onAudioControl = (event: Event) => {
      const muted = (event as CustomEvent<{ muted: boolean }>).detail?.muted;
      setGlobalAmbientMuted(Boolean(muted));
    };
    window.addEventListener('global-ambient-control', onAudioControl);

    return () => {
      window.removeEventListener('global-ambient-control', onAudioControl);
    };
  }, []);

  return null;
};
