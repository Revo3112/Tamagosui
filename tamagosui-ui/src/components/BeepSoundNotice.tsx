import React from 'react';

// Component to show when using beep fallback sounds
export const BeepSoundNotice: React.FC = () => {
  return (
    <div className="text-xs text-yellow-400 mt-1 opacity-70 text-center">
      🎵 Using beep sounds - Add audio files for better experience
    </div>
  );
};
