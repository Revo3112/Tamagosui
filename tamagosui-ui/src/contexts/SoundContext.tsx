import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SoundContextType {
  isSoundEnabled: boolean;
  masterVolume: number;
  toggleSound: () => void;
  setMasterVolume: (volume: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

interface SoundProviderProps {
  children: ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [masterVolume, setMasterVolumeState] = useState(0.7);

  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };

  const setMasterVolume = (volume: number) => {
    setMasterVolumeState(Math.max(0, Math.min(1, volume)));
  };

  const value: SoundContextType = {
    isSoundEnabled,
    masterVolume,
    toggleSound,
    setMasterVolume,
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundContext = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundContext must be used within a SoundProvider');
  }
  return context;
};
