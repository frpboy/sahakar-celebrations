import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SharingSection: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  const shareOnWhatsApp = () => {
    const currentUrl = window.location.origin;
    const text = encodeURIComponent(
      `You are cordially invited to the wedding celebration of Muhammed Shabin & Sana and Mohammed Sameer & Nihala Jasmin KK on Sunday, July 19, 2026 at Shifa Convention Center. View details & RSVP: ${currentUrl}/`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareOnInstagram = async () => {
    const currentUrl = window.location.origin;
    const title = 'Sahakar Family Celebrations';
    const text = 'You are cordially invited to the wedding celebration of Muhammed Shabin & Sana and Mohammed Sameer & Nihala Jasmin KK on Sunday, July 19, 2026 at Shifa Convention Center.';
    
    // 1. Try native Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: currentUrl,
        });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }

    // 2. Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(`${text}\n\nView details & RSVP: ${currentUrl}/`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section className="py-24 px-4 md:px-12 max-w-4xl mx-auto w-full relative z-20 flex flex-col items-center text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-12 w-full"
      >
        <p className="text-[10px] md:text-[12px] tracking-[0.4em] uppercase text-gold-dark/80 font-medium">
          Sunday, July 19, 2026 <span className="mx-3 text-gold/20 font-light">|</span> Shifa Convention Center
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl mb-20"
      >
        <button
          onClick={shareOnWhatsApp}
          className="group flex-1 w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-10 bg-gold/5 text-gold rounded-xl text-[11px] tracking-[0.15em] uppercase font-bold hover:bg-gold/10 transition-all duration-500 shadow-2xl border border-gold/20 hover:border-gold/40"
        >
          <div className="w-5 h-5 text-gold/80 transition-transform duration-500 group-hover:scale-110">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.76.46 3.42 1.26 4.86L2 22l5.3-.7c1.4.8 3.06 1.2 4.7 1.2 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.8 14.8c-.24.68-1.4 1.24-1.92 1.32-.48.08-1.08.12-1.72-.08-.4-.12-.92-.28-1.56-.56-2.72-1.16-4.48-3.92-4.6-4.08-.12-.16-1-1.32-1-2.52 0-1.2.64-1.8 0.88-2.04.24-.24.52-.36.72-.36h.48c.16 0 .36-.04.56.4.24.56.8 1.96.88 2.12.08.16.12.36.04.56-.08.2-.16.32-.32.52l-.48.56c-.16.2-.32.4-.12.76.2.36.88 1.44 1.88 2.32 1.28 1.12 2.36 1.48 2.72 1.64.36.16.56.12.76-.12.2-.24.88-1.04 1.12-1.4.24-.36.48-.28.8-.16.32.12 2.04 1 2.4 1.16.36.16.6.24.68.4.08.16.08 1.12-.16 1.8z" />
            </svg>
          </div>
          Share on WhatsApp
        </button>
        <button
          onClick={shareOnInstagram}
          className="group flex-1 w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-10 bg-gold/5 text-gold rounded-xl text-[11px] tracking-[0.15em] uppercase font-bold hover:bg-gold/10 transition-all duration-500 shadow-2xl border border-gold/20 hover:border-gold/40"
        >
          <div className="w-5 h-5 text-gold/80 transition-transform duration-500 group-hover:scale-110">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </div>
          Share to Instagram
        </button>
      </motion.div>

      {/* Toast Notification */}
      <div className="h-12 flex items-center justify-center mb-8">
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="px-6 py-2 bg-gold/10 border border-gold/30 rounded-full text-[10px] tracking-wider uppercase text-gold font-bold shadow-lg backdrop-blur-sm"
            >
              Link copied! Paste it into your Instagram Story or DM.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="max-w-xl mx-auto"
      >
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent mx-auto mb-10" />
        <p className="text-base md:text-lg font-serif text-ivory/60 italic leading-relaxed">
          "May this union be blessed with enduring happiness, mutual respect, and a lifetime of shared success."
        </p>
      </motion.div>
    </section>
  );
};
