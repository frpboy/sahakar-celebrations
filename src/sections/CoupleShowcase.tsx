import React from 'react';
import { motion } from 'framer-motion';

interface CoupleCardProps {
  names: string;
  role: string;
  desc: string;
  imageSrc: string;
  inviteLink: string;
}

const CoupleCard: React.FC<CoupleCardProps> = ({ names, role, desc, imageSrc, inviteLink }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
      className="glass-card rounded-2xl overflow-hidden shadow-2xl relative group flex flex-col items-center justify-end h-[450px] md:h-[550px] w-full"
    >
      {/* Background Gradient Texture overlay representing visual placeholder */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(13, 12, 16, 0.1) 0%, rgba(22, 20, 29, 0.95) 90%), url(${imageSrc})`
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
        <button
          onClick={() => window.open(inviteLink, '_blank')}
          className="px-6 py-3 border border-gold/30 text-gold text-[10px] tracking-[0.2em] uppercase rounded-full bg-obsidian/40 backdrop-blur-sm group-hover:bg-gold group-hover:text-obsidian transition-all duration-500 font-sans"
        >
          View Invitation
        </button>
      </div>
    </motion.div>
  );
};

export const CoupleShowcase: React.FC = () => {
  const couples = [
    {
      names: 'Kabir & Kiara',
      role: 'Wedding Celebration',
      desc: 'The union of Kabir Sahakar and Kiara Sen. Celebrating lifetime bonds and eternal companionship.',
      imageSrc: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      inviteLink: 'https://example.com/kabir-kiara',
    },
    {
      names: 'Arav & Ahaana',
      role: 'Wedding Celebration',
      desc: 'The union of Arav Sahakar and Ahaana Roy. Celebrating new horizons and relational commitments.',
      imageSrc: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
      inviteLink: 'https://example.com/arav-ahaana',
    },
  ];

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
        <div className="w-12 h-[1px] bg-gold mx-auto mt-4" />
      </div>

      {/* Grid of couple cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {couples.map((couple, index) => (
          <CoupleCard key={index} {...couple} />
        ))}
      </div>
    </section>
  );
};
