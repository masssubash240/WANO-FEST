import React, { useEffect } from 'react';
import {
  ensureAudio,
  startGlobalAmbientAudio,
  setGlobalAmbientMuted,
  isListenersInstalled,
  setListenersInstalled,
} from '../utils/ambientAudio';

export const GlobalAmbientAudio: React.FC = () => {
  useEffect(() => {
    const audio = ensureAudio();
    if (!audio) return;

    const tryStart = () => {
      void startGlobalAmbientAudio();
    };

    // Autoplay with sound is normally blocked until the visitor interacts.
    tryStart();

    if (!isListenersInstalled()) {
      setListenersInstalled(true);
      const unlock = () => {
        tryStart();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('touchstart', unlock);
        setListenersInstalled(false);
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
