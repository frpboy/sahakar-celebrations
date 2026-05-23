import React, { useEffect, useRef } from 'react';
import { useMusic } from '../../context/MusicContext';
import gsap from 'gsap';

interface SplashIntroProps {
  onEnter: () => void;
}

export const SplashIntro: React.FC<SplashIntroProps> = ({ onEnter }) => {
  const { playMusic } = useMusic();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const crestRef = useRef<SVGSVGElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Initial entry timeline
    const tl = gsap.timeline();
    
    tl.fromTo(crestRef.current, 
      { scale: 0.8, opacity: 0, rotation: -10 },
      { scale: 1, opacity: 1, rotation: 0, duration: 1.8, ease: 'power3.out' }
    );
    
    tl.fromTo(titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' },
      '-=0.8'
    );

    tl.fromTo(buttonRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' },
      '-=0.6'
    );
  }, []);

  const handleEnterClick = () => {
    // Unlock Web Audio API Context and start music
    playMusic();

    // GSAP Exit Sequence
    const exitTl = gsap.timeline({
      onComplete: () => {
        onEnter();
      }
    });

    exitTl.to([crestRef.current, titleRef.current, buttonRef.current], {
      opacity: 0,
      y: -50,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.in'
    });

    exitTl.to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: 'power4.inOut'
    }, '-=0.3');
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-obsidian overflow-hidden select-none"
      style={{
        backgroundImage: 'radial-gradient(circle at center, #1C1924 0%, #0D0C10 100%)'
      }}
    >
      {/* Background ambient circular light aura */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px] animate-pulse pointer-events-none" />

      {/* Luxury Monogram Crest */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-xl">
        <span className="text-[10px] tracking-[0.4em] uppercase text-gold/60 mb-6 font-sans">
          Sahakar Medical Ventures Presents
        </span>
        <svg
          ref={crestRef}
          className="w-40 h-40 md:w-48 md:h-48 drop-shadow-[0_0_20px_rgba(223,186,115,0.3)] mb-8"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Inner circle */}
          <circle cx="50" cy="50" r="42" stroke="url(#goldGradient)" strokeWidth="1" />
          {/* Outer circle */}
          <circle cx="50" cy="50" r="45" stroke="url(#goldGradient)" strokeWidth="0.5" strokeDasharray="4 2" />
          {/* Decorative frame elements */}
          <path d="M50 2 A48 48 0 0 1 98 50" stroke="url(#goldGradient)" strokeWidth="1" />
          <path d="M50 98 A48 48 0 0 1 2 50" stroke="url(#goldGradient)" strokeWidth="1" />
          {/* Elegant Crest Details */}
          <path d="M47 38 L53 38 M47 62 L53 62" stroke="url(#goldGradient)" strokeWidth="1" />
          {/* Letter S (Serif style) */}
          <text
            x="50%"
            y="56%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="url(#goldGradient)"
            fontFamily="'Cinzel', 'Playfair Display', 'serif'"
            fontSize="30"
            fontWeight="bold"
          >
            S
          </text>
          
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F2D794" />
              <stop offset="50%" stopColor="#DFBA73" />
              <stop offset="100%" stopColor="#A48F65" />
            </linearGradient>
          </defs>
        </svg>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-3xl md:text-4xl font-serif tracking-[0.2em] mb-12 text-ivory drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
        >
          SAHAKAR CELEBRATIONS
        </h1>

        {/* CTA Enter Button */}
        <button
          ref={buttonRef}
          onClick={handleEnterClick}
          className="group relative px-8 py-4 font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-gold overflow-hidden rounded-full border border-gold/30 hover:border-gold transition-colors duration-500 bg-velvet/50 backdrop-blur-md active:scale-95"
        >
          {/* Spin Ring Border */}
          <div className="absolute inset-0 border border-gold opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-500 scale-105 group-hover:scale-100" />
          <span className="relative z-10 transition-colors duration-500 group-hover:text-ivory">
            Enter Experience
          </span>
        </button>
      </div>

      {/* Floating Bottom Quote */}
      <div className="absolute bottom-10 z-10 text-[10px] tracking-[0.25em] uppercase text-gold-dark/60 font-serif">
        Prestigious Family Gathering
      </div>
    </div>
  );
};
