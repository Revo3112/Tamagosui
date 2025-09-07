import React from 'react';
import { VolumeX, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSoundContext } from '@/contexts/SoundContext';

export const SoundControlButton: React.FC = () => {
  const { isSoundEnabled, toggleSound } = useSoundContext();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSound}
      className="text-white hover:text-yellow-400 hover:bg-white/10"
      title={isSoundEnabled ? 'Mute sounds' : 'Enable sounds'}
    >
      {isSoundEnabled ? (
        <Volume2 className="h-5 w-5" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
    </Button>
  );
};
