import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
  playMusic: () => void;
  pauseMusic: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = new Audio('/ambient-luxury.mp3');
    audio.loop = true;
    audio.volume = 0;
    
    // Add error handling for missing audio source
    audio.onerror = () => {
      console.warn("Audio source not found or not supported. Please ensure '/ambient-luxury.mp3' exists in the public folder.");
    };

    audioRef.current = audio;

    // Handle visibility/focus changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseAudio();
      } else if (isPlaying) {
        playAudio();
      }
    };

    const handleFocus = () => {
      if (isPlaying) playAudio();
    };

    const handleBlur = () => {
      pauseAudio();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      pauseAudio();
      audioRef.current = null;
    };
  }, [isPlaying]);

  const playAudio = () => {
    if (!audioRef.current) return;
    
    audioRef.current.play().catch(err => console.warn("Autoplay blocked:", err));
    
    // Volume Ramping Logic: 0 -> 0.25 -> 0.50 over 7 seconds
    if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
    
    let startTime = Date.now();
    const duration = 7000; // 7 seconds total

    volumeIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed >= duration) {
        if (audioRef.current) audioRef.current.volume = 0.5;
        if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
        return;
      }

      // Step-based ramping as requested: 
      // First 3.5s: 0 to 0.25
      // Next 3.5s: 0.25 to 0.50
      if (elapsed < duration / 2) {
        const progress = elapsed / (duration / 2);
        if (audioRef.current) audioRef.current.volume = progress * 0.25;
      } else {
        const progress = (elapsed - duration / 2) / (duration / 2);
        if (audioRef.current) audioRef.current.volume = 0.25 + (progress * 0.25);
      }
    }, 50);
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
        volumeIntervalRef.current = null;
      }
      audioRef.current.volume = 0;
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  const playMusic = () => {
    playAudio();
    setIsPlaying(true);
  };

  const pauseMusic = () => {
    pauseAudio();
    setIsPlaying(false);
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic, playMusic, pauseMusic }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within MusicProvider');
  return context;
};
