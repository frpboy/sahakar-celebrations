import React, { useEffect, useRef } from 'react';
import { useGuest } from '../hooks/useGuest';
import gsap from 'gsap';

export const Hero: React.FC = () => {
  const { name, inviteType } = useGuest();
  const welcomeRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

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
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-4 overflow-hidden">
      {/* Background vignette & ambient gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian pointer-events-none z-10" />
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Guest greeting node */}
      <div ref={welcomeRef} className="z-20 text-center mb-6">
        <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-gold font-sans font-medium block mb-2">
          {inviteType === 'vip' ? '◆ Distinguished Guest Invitation ◆' : '◆ Cordial Invitation ◆'}
        </span>
        <h2 className="text-xl md:text-3xl font-serif text-ivory tracking-wide max-w-2xl px-4 mx-auto leading-relaxed italic">
          Welcome, {name}
        </h2>
        {/* Diamond Gold Divider */}
        <div className="flex items-center justify-center mt-4">
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-gold/50" />
          <div className="w-2 h-2 rotate-45 border border-gold/60 mx-2 bg-obsidian" />
          <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-gold/50" />
        </div>
      </div>

      {/* Main Ceremonial Header */}
      <div ref={titleRef} className="z-20 text-center max-w-4xl px-2 mb-10">
        <h1 className="text-4xl md:text-7xl font-serif tracking-[0.15em] leading-[1.2] uppercase">
          <span className="block text-stroke-gold drop-shadow-[0_2px_15px_rgba(223,186,115,0.15)] mb-2 font-black">
            Sahakar Family
          </span>
          <span className="block text-2xl md:text-4xl tracking-[0.3em] font-sans font-light text-gold mt-4">
            Celebrations
          </span>
        </h1>
      </div>

      {/* Glassmorphic Invitation Summary Card */}
      <div
        ref={cardRef}
        className="z-20 glass-card px-8 py-10 md:px-12 md:py-12 rounded-2xl max-w-2xl text-center shadow-2xl relative"
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

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 border-t border-gold/10 pt-6">
          <div className="text-center">
            <span className="block text-[10px] tracking-[0.25em] text-gold-dark uppercase mb-1">Date</span>
            <span className="font-serif text-sm tracking-[0.1em] text-ivory">OCTOBER 24-26, 2026</span>
          </div>
          <div className="hidden md:block w-[1px] h-8 bg-gold/20" />
          <div className="text-center">
            <span className="block text-[10px] tracking-[0.25em] text-gold-dark uppercase mb-1">Venues</span>
            <span className="font-serif text-sm tracking-[0.1em] text-ivory">SAHAKAR PALACE & GARDENS</span>
          </div>
        </div>
      </div>

      {/* Downward indicator arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 cursor-pointer animate-bounce">
        <span className="text-[9px] tracking-[0.3em] uppercase text-gold-dark/60">Scroll to Explore</span>
        <svg className="w-4 h-4 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};
