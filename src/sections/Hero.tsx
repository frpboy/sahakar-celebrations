import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { weddingData } from '../config/wedding';

const SparkleText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <span className="relative inline-block px-2 font-bold text-lg md:text-2xl font-serif">
      <span className="gold-gradient-text drop-shadow-[0_0_12px_rgba(223,186,115,0.45)] not-italic">
        {children}
      </span>
      <span className="absolute inset-0 pointer-events-none">
        {/* Top left sparkle */}
        <span 
          className="absolute -top-1 -left-2 w-3.5 h-3.5 animate-[sparkle_2.5s_infinite_ease-in-out] block"
          style={{ animationDelay: '0.2s' }}
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,243,209,0.9)]">
            <path d="M8 0L9.5 5.5L15 8L9.5 10.5L8 16L6.5 10.5L1 8L6.5 5.5L8 0Z" fill="#FFF3D1" />
          </svg>
        </span>
        {/* Top right sparkle */}
        <span 
          className="absolute -top-3 right-2 w-2.5 h-2.5 animate-[sparkle_2s_infinite_ease-in-out] block"
          style={{ animationDelay: '0.8s' }}
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-full h-full drop-shadow-[0_0_6px_rgba(255,243,209,0.8)]">
            <path d="M8 0L9.5 5.5L15 8L9.5 10.5L8 16L6.5 10.5L1 8L6.5 5.5L8 0Z" fill="#DFBA73" />
          </svg>
        </span>
        {/* Bottom right sparkle */}
        <span 
          className="absolute -bottom-2 -right-1.5 w-3 h-3 animate-[sparkle_3s_infinite_ease-in-out] block"
          style={{ animationDelay: '1.4s' }}
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,243,209,0.9)]">
            <path d="M8 0L9.5 5.5L15 8L9.5 10.5L8 16L6.5 10.5L1 8L6.5 5.5L8 0Z" fill="#FFF3D1" />
          </svg>
        </span>
        {/* Bottom left sparkle */}
        <span 
          className="absolute -bottom-3 left-4 w-2 h-2 animate-[sparkle_2.2s_infinite_ease-in-out] block"
          style={{ animationDelay: '0.5s' }}
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-full h-full drop-shadow-[0_0_6px_rgba(255,243,209,0.8)]">
            <path d="M8 0L9.5 5.5L15 8L9.5 10.5L8 16L6.5 10.5L1 8L6.5 5.5L8 0Z" fill="#DFBA73" />
          </svg>
        </span>
      </span>
    </span>
  );
};

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
    <section className="relative w-full overflow-hidden">
      {/* Cinematic Atmospheric Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Moving Light Rays */}
        <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] opacity-20 rotate-[-15deg]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,rgba(223,186,115,0.05)_45px,transparent_50px)] blur-[30px] animate-[drift_20s_linear_infinite]" />
        </div>
        
        {/* Volumetric Haze */}
        <div className="absolute inset-0 bg-radial-gradient(circle_at_50%_40%,rgba(223,186,115,0.08),transparent_70%) blur-[100px]" />
        
        {/* Layered Depth Motion Blobs */}
        <motion.div 
          animate={{ 
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full"
        />
      </div>

      {/* First Fold: Welcome Title Block */}
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center pt-24 px-4">
        <div className="z-20 text-center max-w-4xl w-full mx-auto px-4 flex flex-col justify-center items-center flex-grow">
          <span ref={welcomeRef} className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-gold mb-6 block font-sans font-bold">
            Sahakar Medical Ventures
          </span>
          <h1 ref={titleRef} className="text-4xl md:text-8xl font-serif text-ivory tracking-[0.2em] mb-10 uppercase leading-[1.1] drop-shadow-2xl">
            Family <br /> Celebrations
          </h1>
          <div className="w-12 h-[1px] bg-gold/30 mx-auto mb-10" />
          <h2 className="text-sm md:text-lg font-serif text-ivory/70 tracking-widest max-w-2xl mx-auto leading-relaxed italic uppercase">
            Cordially inviting you to an evening of elegance as we celebrate the matrimonial unions of <SparkleText>Shabin & Sana</SparkleText> and <SparkleText>Sameer & Nihala</SparkleText> within the Sahakar Family.
          </h2>
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
      </div>

      {/* Second Fold: Glassmorphic Invitation Summary Card */}
      <div className="w-full flex justify-center px-4 pb-32">
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
              
              <span className="block text-[10px] tracking-[0.25em] text-gold-dark uppercase mb-1">Venue</span>
              <span className="font-serif text-sm tracking-[0.1em] text-ivory uppercase">{weddingData.wedding.venue}</span>
            </div>

            <div className="text-center md:text-left md:pl-8">
              <span className="block text-[10px] tracking-[0.25em] text-gold-dark uppercase mb-1">Time</span>
              <span className="font-serif text-sm tracking-[0.1em] text-ivory uppercase">4:30 PM Onwards</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
