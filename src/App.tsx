import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MusicProvider } from './context/MusicContext';
import { SplashIntro } from './components/cinematic/SplashIntro';
import { ParticleCanvas } from './components/effects/ParticleCanvas';
import { MouseGlow } from './components/effects/MouseGlow';
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
  
  // Track scroll for parallax terrain backdrop
  const { scrollY } = useScroll();
  const landscapeY = useTransform(scrollY, [0, 4000], [0, -180]);
  const landscapeScale = useTransform(scrollY, [0, 4000], [1.02, 1.12]);

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
          {/* Ambient FX Engine */}
          <ParticleCanvas />
          <MouseGlow />
          <AudioToggle />

          {/* Main Scroller Layout */}
          <main className="relative z-10 w-full">
            {/* Global Ambient Backgrounds & 3D Landscape Terrain */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
              {/* 3D Landscape Backdrop Wrapper with Scroll Parallax */}
              <motion.div
                style={{
                  y: landscapeY,
                  scale: landscapeScale,
                }}
                className="absolute -inset-20 z-0"
              >
                {/* Landscape Image with continuous slow camera-drift animation */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-85"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(5, 6, 10, 0.4) 0%, rgba(5, 6, 10, 0.8) 55%, #05060A 95%), url('/wedding-landscape.png')`,
                    animation: 'landscapeDrift 30s ease-in-out infinite',
                  }}
                />
              </motion.div>

              {/* Ambient Colored Smudges overlaying the landscape */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.06, 1],
                  rotate: [0, 1.5, 0],
                }}
                transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-10"
              >
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-sapphire/15 blur-[140px] rounded-full animate-pulse" />
                <div className="absolute top-[25%] right-[-10%] w-[55%] h-[55%] bg-gold/8 blur-[150px] rounded-full" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[55%] left-[-5%] w-[50%] h-[50%] bg-sapphire-dark/10 blur-[130px] rounded-full" style={{ animationDelay: '4s' }} />
                <div className="absolute bottom-[-10%] right-[10%] w-[60%] h-[60%] bg-gold/5 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '6s' }} />
              </motion.div>
              
              {/* Scene Transition Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-obsidian/20 to-transparent z-20" />
            </div>

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
