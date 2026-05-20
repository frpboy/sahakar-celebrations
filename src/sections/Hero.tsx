import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { weddingData } from '../config/wedding';

export const Hero: React.FC = () => {
  const welcomeRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Reveal animations
    const tl = gsap.timeline();

    tl.fromTo(welcomeRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.5 }
    );

    tl.fromTo(titleRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
      '-=0.8'
    );

    tl.fromTo(cardRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
      '-=1'
    );
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center pt-24 pb-32 px-4 overflow-hidden">
      <div className="z-20 text-center max-w-4xl w-full mx-auto px-4 mb-12">
        <span ref={welcomeRef} className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-gold mb-6 block font-sans font-bold">
          Sahakar Medical Ventures
        </span>
        <h1 ref={titleRef} className="text-4xl md:text-8xl font-serif text-ivory tracking-[0.2em] mb-10 uppercase leading-[1.1] drop-shadow-2xl">
          Family <br /> Celebrations
        </h1>
        <div className="w-12 h-[1px] bg-gold/30 mx-auto mb-10" />
        <h2 className="text-sm md:text-lg font-serif text-ivory/70 tracking-widest max-w-2xl mx-auto leading-relaxed italic uppercase">
          Cordially inviting you to an evening of elegance as we celebrate the matrimonial unions within the Sahakar Family.
        </h2>
      </div>

      {/* Glassmorphic Invitation Summary Card */}
      <div
        ref={cardRef}
        className="z-20 glass-card px-8 py-12 md:px-16 md:py-16 rounded-3xl max-w-3xl w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative border border-gold/20"
      >
        {/* Soft gold border corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold/40 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold/40 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold/40 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold/40 rounded-br-lg" />

        <p className="font-serif text-gold-light tracking-[0.15em] text-xs md:text-sm uppercase mb-4">
          Request the Honor of your Presence
        </p>
        <p className="text-ivory/80 text-sm md:text-base font-sans leading-relaxed tracking-wide mb-8 max-w-md mx-auto">
          To join us in celebrating the grand matrimonial unions and ceremonial gatherings of our family as we step into a new chapter of love and lineage.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-6 md:gap-4 border-t border-gold/10 pt-8 mt-4">
          <div className="text-center md:text-right md:pr-8">
            <span className="block text-[10px] tracking-[0.25em] text-gold-dark uppercase mb-1">Date</span>
            <span className="font-serif text-sm tracking-[0.1em] text-ivory">JULY 19, 2026</span>
          </div>
          
          <div className="text-center relative py-2 md:py-0">
            {/* Desktop Vertical Dividers */}
            <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-10 bg-gold/10" />
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-10 bg-gold/10" />
            
            <span className="block text-[10px] tracking-[0.25em] text-gold-dark uppercase mb-1">Time</span>
            <span className="font-serif text-sm tracking-[0.1em] text-ivory uppercase">4:30 PM Onwards</span>
          </div>

          <div className="text-center md:text-left md:pl-8">
            <span className="block text-[10px] tracking-[0.25em] text-gold-dark uppercase mb-1">Venue</span>
            <span className="font-serif text-sm tracking-[0.1em] text-ivory uppercase">{weddingData.wedding.venue}</span>
          </div>
        </div>
      </div>

      {/* Downward indicator arrow */}
      <div 
        ref={scrollIndicatorRef}
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 cursor-pointer transition-all duration-700 ease-in-out ${
          hasScrolled ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0 animate-bounce'
        }`}
      >
        <span className="text-[9px] tracking-[0.3em] uppercase text-gold-dark/60">Scroll to Explore</span>
        <svg className="w-4 h-4 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};
