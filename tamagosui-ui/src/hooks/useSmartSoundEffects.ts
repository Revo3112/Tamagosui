import { useState, useEffect } from 'react';
import { useSoundEffects } from './useSound';
import { useEnhancedBeepSounds } from './useEnhancedBeepSounds';

// Hook to detect if audio files are available
const useAudioAvailability = () => {
  const [hasAudioFiles, setHasAudioFiles] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkAudioFiles = async () => {
      try {
        // Try to load one of the audio files to check if they exist
        const audio = new Audio('/sounds/click.mp3');

        const checkPromise = new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Timeout'));
          }, 3000);

          audio.addEventListener('canplay', () => {
            clearTimeout(timeout);
            resolve(true);
          });

          audio.addEventListener('error', () => {
            clearTimeout(timeout);
            reject(new Error('Audio file not found'));
          });
        });

        await checkPromise;
        setHasAudioFiles(true);
      } catch (error) {
        console.info('Audio files not found, using beep sounds as fallback');
        setHasAudioFiles(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAudioFiles();
  }, []);

  return { hasAudioFiles, isChecking };
};

// Smart hook that chooses between audio files and beep sounds
export const useSmartSoundEffects = () => {
  const { hasAudioFiles, isChecking } = useAudioAvailability();
  const audioSounds = useSoundEffects();
  const beepSounds = useEnhancedBeepSounds();

  return {
    soundEffects: hasAudioFiles ? audioSounds : beepSounds,
    hasAudioFiles,
    isChecking,
    usingBeepFallback: !hasAudioFiles && !isChecking,
  };
};
