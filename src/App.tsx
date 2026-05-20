import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
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
          {/* Ambient FX Engine */}
          <ParticleCanvas />
          <MouseGlow />
          <AudioToggle />

          {/* Main Scroller Layout */}
          <main className="relative z-10 w-full overflow-hidden">
            <Hero />
            
            {/* Elegant Section Divider */}
            <div className="flex items-center justify-center my-6">
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-gold/30" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold mx-4">◆</span>
              <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-gold/30" />
            </div>

            <CoupleShowcase />

            <div className="flex items-center justify-center my-6">
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-gold/30" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold mx-4">◆</span>
              <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-gold/30" />
            </div>

            <EventTimeline />

            <div className="flex items-center justify-center my-6">
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-gold/30" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold mx-4">◆</span>
              <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-gold/30" />
            </div>

            <VenueMap />

            <div className="flex items-center justify-center my-6">
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-gold/30" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold mx-4">◆</span>
              <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-gold/30" />
            </div>

            <RSVPForm />
          </main>

          {/* Luxury Footer */}
          <footer className="relative z-20 py-12 text-center text-gold-dark/50 text-[10px] tracking-[0.25em] uppercase border-t border-gold/5 bg-obsidian">
            © {new Date().getFullYear()} Sahakar Family Celebrations. All rights reserved.
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
