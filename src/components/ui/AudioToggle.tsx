import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AudioToggle: React.FC = () => {
  const { isPlaying, togglePlay, hasInteracted } = useMusic();

  if (!hasInteracted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className="w-12 h-12 rounded-full glass-card hover:border-gold flex items-center justify-center shadow-2xl relative group transition-colors duration-500 bg-velvet/80 text-gold hover:text-ivory"
        aria-label="Toggle Background Music"
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Volume2 className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="muted"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <VolumeX className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Small animated music waves indicator */}
        {isPlaying && (
          <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-3">
            <span className="w-0.5 bg-gold animate-[pulseGlow_1s_infinite_alternate] h-2" />
            <span className="w-0.5 bg-gold animate-[pulseGlow_0.7s_infinite_alternate_delay] h-3" style={{ animationDelay: '0.2s' }} />
            <span className="w-0.5 bg-gold animate-[pulseGlow_1.2s_infinite_alternate] h-1.5" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
      </motion.button>
    </div>
  );
};
