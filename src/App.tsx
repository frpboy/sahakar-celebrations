import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import { MusicProvider } from './context/MusicContext';
import { SplashIntro } from './components/cinematic/SplashIntro';
import { WebGLCanvas } from './components/effects/WebGLCanvas';
import { AudioToggle } from './components/ui/AudioToggle';
import { Hero } from './sections/Hero';
import { CoupleShowcase } from './sections/CoupleShowcase';
import { EventTimeline } from './sections/EventTimeline';
import { VenueMap } from './sections/VenueMap';
import { RSVPForm } from './sections/RSVPForm';
import { SharingSection } from './sections/SharingSection';
import './App.css';

const AppContent: React.FC = () => {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!entered) return;

    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let animationId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      animationId = requestAnimationFrame(raf);
    };

    animationId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(animationId);
    };
  }, [entered]);

  return (
    <>
      {!entered ? (
        <SplashIntro onEnter={() => setEntered(true)} />
      ) : (
        <div className="relative min-h-screen text-ivory">
          {/* WebGL 3D Landscape Canvas & FX Engine */}
          <WebGLCanvas />
          <AudioToggle />

          {/* Main Scroller Layout */}
          <main className="relative z-10 w-full">

            <Hero />
            <CoupleShowcase />
            <EventTimeline />
            <VenueMap />
            <RSVPForm />
            <SharingSection />
          </main>

          {/* Luxury Footer with Emotional Landing */}
          <footer className="relative z-20 py-32 px-4 text-center bg-transparent max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="mb-24"
            >
              <div className="w-16 h-[1px] bg-gold/30 mx-auto mb-12" />
              <h3 className="text-xl md:text-3xl font-serif text-ivory tracking-[0.2em] uppercase leading-relaxed max-w-2xl mx-auto mb-6">
                With heartfelt gratitude and best wishes, we look forward to your gracious presence.
              </h3>
              <div className="w-8 h-[1px] bg-gold/20 mx-auto" />
            </motion.div>

            <div className="text-gold-dark/40 text-[10px] tracking-[0.25em] uppercase space-y-4">
              <div className="font-serif italic normal-case tracking-normal text-gold/50">
                Crafted with heartfelt appreciation by <a href="https://github.com/frpboy" target="_blank" rel="noopener noreferrer" className="text-gold/60 hover:text-gold transition-colors duration-300 not-italic font-sans uppercase tracking-[0.2em]">Rahul</a>
              </div>
              <div>
                © {new Date().getFullYear()} Sahakar Medical Ventures. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
};

export default App;
