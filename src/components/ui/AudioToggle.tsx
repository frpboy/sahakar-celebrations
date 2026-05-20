import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../../context/MusicContext';
import { VolumeX } from 'lucide-react';

export const AudioToggle: React.FC = () => {
  const { isPlaying, toggleMusic } = useMusic();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-8 right-8 z-[100]"
    >
      <button
        onClick={toggleMusic}
        className="relative w-14 h-14 rounded-full border border-gold/20 flex items-center justify-center bg-obsidian/40 backdrop-blur-md group transition-all duration-500 hover:border-gold/40"
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-end gap-[3px] h-5"
            >
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [
                      '40%', '100%', '60%', '90%', '50%', '100%', '40%'
                    ],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                  className="w-[3px] bg-gold rounded-full"
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="muted"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-gold/60 group-hover:text-gold transition-colors"
            >
              <VolumeX className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer pulse effect when playing */}
        {isPlaying && (
          <motion.div
            initial={{ scale: 1, opacity: 0.4 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-gold/30 pointer-events-none"
          />
        )}
      </button>
    </motion.div>
  );
};
