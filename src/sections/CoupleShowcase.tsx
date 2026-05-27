import React from 'react';
import { motion } from 'framer-motion';
import { couples } from '../content/couples';

interface CoupleCardProps {
  names: string;
  role: string;
  desc: string;
  imageSrc: string;
  images?: string[];
  inviteLink: string;
}

const pickResponsiveImage = (src: string, viewportWidth: number, dpr: number) => {
  const match = src.match(/^(.*)\.(webp|jpeg|jpg)$/i);
  if (!match) return src;
  const [, base, ext] = match;
  const target = viewportWidth * dpr;
  const width = target <= 700 ? 640 : target <= 1100 ? 960 : 1280;
  return `${base}-${width}.${ext}`;
};

const CoupleCard: React.FC<CoupleCardProps> = ({ names, role, desc, imageSrc, images, inviteLink }) => {
  const carouselImages = images && images.length > 0 ? images : [imageSrc];
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [viewportWidth, setViewportWidth] = React.useState<number>(() => (typeof window === 'undefined' ? 1280 : window.innerWidth));
  const currentImage = carouselImages[currentImageIndex] || imageSrc;
  const resolvedImage = pickResponsiveImage(currentImage, viewportWidth, typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1);

  React.useEffect(() => {
    if (carouselImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  React.useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
      className="glass-card rounded-2xl overflow-hidden shadow-2xl relative group flex flex-col items-center justify-end h-[450px] md:h-[550px] w-full"
    >
      {/* Render only active image to avoid downloading every carousel image on initial load */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out group-hover:scale-105 z-0"
        style={{
          backgroundImage: `url(${resolvedImage})`
        }}
      />
      
      {/* Gradient Overlay Layer (Separated to fix iOS/Safari multi-background color-tint bugs) */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to bottom, rgba(13, 12, 16, 0.4) 0%, rgba(22, 20, 29, 0.98) 95%)'
        }}
      />
      
      {/* Decorative Golden Corner Accents */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-gold/30 group-hover:border-gold/80 transition-colors duration-500" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-gold/30 group-hover:border-gold/80 transition-colors duration-500" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-gold/30 group-hover:border-gold/80 transition-colors duration-500" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-gold/30 group-hover:border-gold/80 transition-colors duration-500" />

      {/* Couple details */}
      <div className="relative z-10 p-6 md:p-10 text-center w-full">
        <span className="text-[10px] tracking-[0.25em] uppercase text-gold/80 block mb-1">
          {role}
        </span>
        <h3 className="text-3xl md:text-4xl font-serif text-ivory tracking-wide mb-3 drop-shadow-md">
          {names}
        </h3>
        <p className="text-ivory/60 text-xs md:text-sm font-sans tracking-wide max-w-xs mx-auto mb-6">
          {desc}
        </p>

        {/* View microsite button */}
        {inviteLink && (
          <button
            onClick={() => window.open(inviteLink, '_blank')}
            className="px-6 py-3 rounded-full gold-outline-btn active:scale-[0.98] cursor-pointer text-xs font-sans tracking-[0.2em] uppercase"
          >
            View Invitation
          </button>
        )}
      </div>
    </motion.div>
  );
};

export const CoupleShowcase: React.FC = () => {
  return (
    <section className="py-20 px-4 md:px-12 max-w-6xl mx-auto w-full relative z-20">
      {/* Title block */}
      <div className="text-center mb-16">
        <span className="text-[10px] tracking-[0.3em] uppercase text-gold-dark/80 block mb-2">
          THE COUPLES
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-ivory tracking-[0.1em] uppercase">
          Matrimonial Unions
        </h2>
      </div>

      {/* Grid of couple cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {couples.map((couple) => (
          <CoupleCard
            key={couple.id}
            names={couple.coupleName}
            role="Wedding Celebration"
            desc={couple.desc || ''}
            imageSrc={couple.imageSrc || ''}
            images={couple.images}
            inviteLink={couple.invitationUrl}
          />
        ))}
      </div>
    </section>
  );
};
