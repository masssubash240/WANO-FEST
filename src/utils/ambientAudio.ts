let sharedAudio: HTMLAudioElement | null = null;
let listenersInstalled = false;

// This is the audio track supplied by the user for the website-wide ambience.
const AUDIO_SRC = '/media/user-uploaded-wano-fest-audio.mp3';
const AUDIO_VOLUME = 0.40;

export const ensureAudio = () => {
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

export const isListenersInstalled = () => listenersInstalled;
export const setListenersInstalled = (val: boolean) => { listenersInstalled = val; };
