import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  playMusic: () => void;
  pauseMusic: () => void;
  hasInteracted: boolean;
  setHasInteracted: (val: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Create audio element with a high-quality ambient luxury track
    // Using a reliable royalty-free ambient track link
    const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    // Visibility change logic to pause/resume audio
    const handleVisibilityChange = () => {
      if (!audioRef.current || !hasInteracted) return;

      if (document.hidden) {
        // Fade out quickly and pause
        fadeVolume(0, 500, () => {
          audioRef.current?.pause();
          setIsPlaying(false);
        });
      } else {
        // Resume and fade in
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          fadeVolume(0.3, 1500);
        }).catch((err) => console.log('Audio resume blocked:', err));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [hasInteracted]);

  const fadeVolume = (targetVolume: number, durationMs: number, onComplete?: () => void) => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const startVolume = audioRef.current.volume;
    const steps = 30;
    const stepDuration = durationMs / steps;
    const volumeDelta = (targetVolume - startVolume) / steps;
    let currentStep = 0;

    fadeIntervalRef.current = window.setInterval(() => {
      if (!audioRef.current) return;
      currentStep++;
      const nextVolume = startVolume + (volumeDelta * currentStep);
      audioRef.current.volume = Math.max(0, Math.min(0.5, nextVolume));

      if (currentStep >= steps) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
        audioRef.current.volume = targetVolume;
        if (onComplete) onComplete();
      }
    }, stepDuration);
  };

  const playMusic = () => {
    if (!audioRef.current) return;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      fadeVolume(0.3, 2000);
    }).catch(err => {
      console.error('Audio play failed:', err);
    });
  };

  const pauseMusic = () => {
    if (!audioRef.current) return;
    fadeVolume(0, 1000, () => {
      audioRef.current?.pause();
      setIsPlaying(false);
    });
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      setHasInteracted(true);
      playMusic();
    }
  };

  return (
    <MusicContext.Provider value={{ isPlaying, togglePlay, playMusic, pauseMusic, hasInteracted, setHasInteracted }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
