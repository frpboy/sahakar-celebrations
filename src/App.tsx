import React, { Suspense, lazy, useState, useEffect } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import { MusicProvider } from './context/MusicContext';
import { SplashIntro } from './components/cinematic/SplashIntro';
import { Hero } from './sections/Hero';
import './App.css';

const WebGLCanvas = lazy(() => import('./components/effects/WebGLCanvas').then((m) => ({ default: m.WebGLCanvas })));
const SilkMouseTrail = lazy(() => import('./components/effects/SilkMouseTrail').then((m) => ({ default: m.SilkMouseTrail })));
const AudioToggle = lazy(() => import('./components/ui/AudioToggle').then((m) => ({ default: m.AudioToggle })));
const CoupleShowcase = lazy(() => import('./sections/CoupleShowcase').then((m) => ({ default: m.CoupleShowcase })));
const EventTimeline = lazy(() => import('./sections/EventTimeline').then((m) => ({ default: m.EventTimeline })));
const VenueMap = lazy(() => import('./sections/VenueMap').then((m) => ({ default: m.VenueMap })));
const RSVPForm = lazy(() => import('./sections/RSVPForm').then((m) => ({ default: m.RSVPForm })));
const SharingSection = lazy(() => import('./sections/SharingSection').then((m) => ({ default: m.SharingSection })));

const AppContent: React.FC = () => {
  const [entered, setEntered] = useState(false);
  const [splashActive, setSplashActive] = useState(true);

  useEffect(() => {
    // Automatically update the address bar and status bar to match the active preset theme
    const themeColor = '#05060A';
    
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', themeColor);

    let metaAppleStatus = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!metaAppleStatus) {
      metaAppleStatus = document.createElement('meta');
      metaAppleStatus.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      document.head.appendChild(metaAppleStatus);
    }
    metaAppleStatus.setAttribute('content', 'black-translucent');

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
    <div className="relative min-h-screen text-ivory bg-[#05060A]">
      {entered && (
        <>
          <Suspense fallback={null}>
            <WebGLCanvas />
            <SilkMouseTrail />
            <AudioToggle />
          </Suspense>

          {/* Main Scroller Layout */}
          <main className="relative z-10 w-full">
            <Hero />
            <Suspense fallback={null}>
              <CoupleShowcase />
              <EventTimeline />
              <VenueMap />
              <RSVPForm />
              <SharingSection />
            </Suspense>
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
        </>
      )}

      {/* Splash Intro overlays the content initially */}
      {splashActive && (
        <SplashIntro 
          onEnter={() => setEntered(true)} 
          onComplete={() => setSplashActive(false)} 
        />
      )}
    </div>
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
