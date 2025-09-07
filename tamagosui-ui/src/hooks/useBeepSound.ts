import { useCallback, useRef } from 'react';
import { useSoundContext } from '@/contexts/SoundContext';

interface BeepOptions {
  frequency?: number;
  duration?: number;
  volume?: number;
  type?: OscillatorType;
}

export const useBeepSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const { isSoundEnabled, masterVolume } = useSoundContext();

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playBeep = useCallback((options: BeepOptions = {}) => {
    if (!isSoundEnabled) return;

    const {
      frequency = 800,
      duration = 200,
      volume = 0.3,
      type = 'sine'
    } = options;

    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * masterVolume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Failed to play beep sound:', error);
    }
  }, [isSoundEnabled, masterVolume, getAudioContext]);

  return {
    playFeedBeep: () => playBeep({ frequency: 600, duration: 300, type: 'square' }),
    playSleepBeep: () => playBeep({ frequency: 300, duration: 800, type: 'sine' }),
    playPlayBeep: () => playBeep({ frequency: 800, duration: 200, type: 'triangle' }),
    playWorkBeep: () => playBeep({ frequency: 400, duration: 400, type: 'sawtooth' }),
    playLevelUpBeep: () => {
      // Play ascending notes for level up
      setTimeout(() => playBeep({ frequency: 523, duration: 150 }), 0);    // C5
      setTimeout(() => playBeep({ frequency: 659, duration: 150 }), 150);  // E5
      setTimeout(() => playBeep({ frequency: 784, duration: 300 }), 300);  // G5
    },
    playWakeUpBeep: () => playBeep({ frequency: 1000, duration: 100, type: 'square' }),
    playClickBeep: () => playBeep({ frequency: 1200, duration: 50, type: 'square', volume: 0.1 }),
  };
};
