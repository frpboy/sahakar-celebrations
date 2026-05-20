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
          {/* Ambient FX Engine */}
          <ParticleCanvas />
          <MouseGlow />
          <AudioToggle />

          {/* Main Scroller Layout */}
          <main className="relative z-10 w-full">
            {/* Global Ambient Smudge Backgrounds */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[120px] rounded-full animate-pulse" />
              <div className="absolute top-[30%] right-[-10%] w-[45%] h-[45%] bg-gold/3 blur-[150px] rounded-full" style={{ animationDelay: '2s' }} />
              <div className="absolute top-[60%] left-[-5%] w-[40%] h-[40%] bg-gold/4 blur-[130px] rounded-full" style={{ animationDelay: '4s' }} />
              <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-gold/5 blur-[140px] rounded-full animate-pulse" />
            </div>

            <Hero />
            <CoupleShowcase />
            <EventTimeline />
            <VenueMap />
            <RSVPForm />
            <SharingSection />
          </main>

          {/* Luxury Footer */}
          <footer className="relative z-20 py-16 text-center text-gold-dark/40 text-[10px] tracking-[0.25em] uppercase bg-transparent">
            <div className="mb-2 font-serif italic normal-case tracking-normal text-gold/50">
              Crafted with heartfelt duas by <a href="https://github.com/frpboy" target="_blank" rel="noopener noreferrer" className="text-gold/60 hover:text-gold transition-colors duration-300 not-italic font-sans uppercase tracking-[0.2em]">Rahul</a>
            </div>
            <div className="mt-4">
              © {new Date().getFullYear()} Sahakar Medical Ventures. All rights reserved.
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
