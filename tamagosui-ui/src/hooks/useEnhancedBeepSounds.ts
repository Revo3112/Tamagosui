import { useSoundContext } from '@/contexts/SoundContext';

// Simple beep sound generator using Web Audio API
// This is used as fallback when no audio files are available
export const generateBeepDataURL = (_frequency: number, _duration: number, _type: OscillatorType = 'sine'): string => {
  // Create a simple beep sound and return as data URL
  // For now, we'll return empty data URL and use Web Audio API directly
  return '';
};

// Enhanced beep sound effects with different tones for each action
export const useEnhancedBeepSounds = () => {
  const { isSoundEnabled, masterVolume } = useSoundContext();

  // Keep track of active oscillators for stopping them if needed
  let activeSleepOscillators: OscillatorNode[] = [];
  let sleepInterval: NodeJS.Timeout | null = null;

  const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
    if (!isSoundEnabled) return null;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      const finalVolume = volume * masterVolume;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(finalVolume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);

      return oscillator;
    } catch (error) {
      console.warn('Failed to play beep sound:', error);
      return null;
    }
  };

  const startSleepLoop = () => {
    if (!isSoundEnabled) return;

    const playSleepTone = () => {
      const osc1 = playTone(400, 300, 'sine', 0.3);
      const osc2 = playTone(350, 400, 'sine', 0.25);
      const osc3 = playTone(300, 500, 'sine', 0.2);

      if (osc1) activeSleepOscillators.push(osc1);
      if (osc2) activeSleepOscillators.push(osc2);
      if (osc3) activeSleepOscillators.push(osc3);
    };

    playSleepTone();
    sleepInterval = setInterval(playSleepTone, 1000);
  };

  const stopSleepLoop = () => {
    if (sleepInterval) {
      clearInterval(sleepInterval);
      sleepInterval = null;
    }

    activeSleepOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    activeSleepOscillators = [];
  };

  return {
    // Feed sound - crunchy bite sound simulation
    feedSound: {
      play: () => {
        playTone(600, 150, 'square', 0.4);
        setTimeout(() => playTone(400, 100, 'square', 0.3), 150);
      },
      stop: () => {} // No-op for non-looping sounds
    },

    // Sleep sound - peaceful descending tone with loop capability
    sleepSound: {
      play: startSleepLoop,
      stop: stopSleepLoop
    },

    // Play sound - happy bouncy sound
    playSound: {
      play: () => {
        playTone(800, 100, 'triangle', 0.4);
        setTimeout(() => playTone(1000, 100, 'triangle', 0.4), 100);
        setTimeout(() => playTone(1200, 150, 'triangle', 0.3), 200);
      },
      stop: () => {} // No-op for non-looping sounds
    },

    // Work sound - rhythmic working sound
    workSound: {
      play: () => {
        playTone(440, 200, 'sawtooth', 0.3);
        setTimeout(() => playTone(440, 100, 'sawtooth', 0.2), 250);
        setTimeout(() => playTone(440, 100, 'sawtooth', 0.2), 400);
      },
      stop: () => {} // No-op for non-looping sounds
    },

    // Level up sound - ascending victory fanfare
    levelUpSound: {
      play: () => {
        playTone(523, 150, 'sine', 0.5);  // C5
        setTimeout(() => playTone(659, 150, 'sine', 0.5), 150);  // E5
        setTimeout(() => playTone(784, 200, 'sine', 0.5), 300);  // G5
        setTimeout(() => playTone(1047, 300, 'sine', 0.6), 500); // C6
      },
      stop: () => {} // No-op for non-looping sounds
    },

    // Wake up sound - energetic alert
    wakeUpSound: {
      play: () => {
        playTone(1000, 80, 'square', 0.4);
        setTimeout(() => playTone(1200, 80, 'square', 0.4), 100);
        setTimeout(() => playTone(1000, 80, 'square', 0.3), 200);
      },
      stop: () => {} // No-op for non-looping sounds
    },

    // Click sound - subtle UI feedback
    clickSound: {
      play: () => {
        playTone(1200, 50, 'square', 0.15);
      },
      stop: () => {} // No-op for non-looping sounds
    },
  };
};
