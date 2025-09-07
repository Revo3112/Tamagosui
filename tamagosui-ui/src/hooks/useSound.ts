import { useCallback, useRef, useState } from 'react';
import { useSoundContext } from '@/contexts/SoundContext';

interface SoundOptions {
  volume?: number;
  playbackRate?: number;
  loop?: boolean;
}

interface UseSoundReturn {
  play: () => void;
  stop: () => void;
  isPlaying: boolean;
  setVolume: (volume: number) => void;
}

export const useSound = (
  src: string,
  options: SoundOptions = {}
): UseSoundReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { isSoundEnabled, masterVolume } = useSoundContext();

  // Initialize audio element
  if (!audioRef.current) {
    audioRef.current = new Audio(src);
    audioRef.current.volume = (options.volume ?? 0.5) * masterVolume;
    audioRef.current.playbackRate = options.playbackRate ?? 1;
    audioRef.current.loop = options.loop ?? false; // Set loop from options

    // Add event listeners
    audioRef.current.addEventListener('play', () => setIsPlaying(true));
    audioRef.current.addEventListener('pause', () => setIsPlaying(false));
    audioRef.current.addEventListener('ended', () => setIsPlaying(false));

    // Handle audio loading errors gracefully
    audioRef.current.addEventListener('error', (e) => {
      console.warn(`Failed to load audio: ${src}`, e);
      setIsPlaying(false);
    });
  }

  // Update volume when masterVolume changes
  if (audioRef.current) {
    audioRef.current.volume = (options.volume ?? 0.5) * masterVolume;
    audioRef.current.loop = options.loop ?? false; // Update loop setting
  }

  const play = useCallback(() => {
    if (audioRef.current && isSoundEnabled) {
      // Reset audio to beginning if it's ended and not looping
      if (!audioRef.current.loop) {
        audioRef.current.currentTime = 0;
      }

      // Play with error handling
      audioRef.current.play().catch((error) => {
        console.warn(`Failed to play audio: ${src}`, error);
        setIsPlaying(false);
      });
    }
  }, [src, isSoundEnabled]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume * masterVolume));
    }
  }, [masterVolume]);

  return {
    play,
    stop,
    isPlaying,
    setVolume,
  };
};

// Hook for managing multiple sounds
export const useSoundEffects = () => {
  const feedSound = useSound('/sounds/feed.mp3', { volume: 0.6 });
  const sleepSound = useSound('/sounds/sleep.mp3', { volume: 0.4, loop: true }); // Loop enabled for sleep
  const playSound = useSound('/sounds/play.mp3', { volume: 0.7 });
  const workSound = useSound('/sounds/work.mp3', { volume: 0.5 });
  const levelUpSound = useSound('/sounds/levelup.mp3', { volume: 0.8 });
  const wakeUpSound = useSound('/sounds/wakeup.mp3', { volume: 0.6 });
  const clickSound = useSound('/sounds/click.mp3', { volume: 0.3 });

  return {
    feedSound,
    sleepSound,
    playSound,
    workSound,
    levelUpSound,
    wakeUpSound,
    clickSound,
  };
};
