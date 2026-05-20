import React from 'react';
import { MapPin, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { weddingData } from '../config/wedding';

interface EventProps {
  title: string;
  date: string;
  time: string;
  location: string;
  dressCode?: string;
  description?: string;
}

const EventCard: React.FC<EventProps> = ({ title, date, time, location, dressCode, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass-card glass-card-hover p-6 md:p-8 rounded-2xl relative shadow-xl w-full"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] font-sans tracking-[0.25em] text-gold uppercase block mb-1">
            {date} • {time}
          </span>
          <h3 className="text-xl md:text-2xl font-serif text-ivory tracking-wide uppercase">
            {title}
          </h3>
        </div>
      </div>

      {description && (
        <p className="text-ivory/70 text-sm font-sans leading-relaxed mb-6 max-w-2xl">
          {description}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gold/10 pt-4 text-xs md:text-sm text-ivory/75">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-gold/60 shrink-0" />
          <span>{location}</span>
        </div>
        {dressCode && (
          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-gold/60 shrink-0" />
            <span><strong className="text-gold/80">Dress:</strong> {dressCode}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const EventTimeline: React.FC = () => {
  const events = [
    {
      title: 'Grand Reception',
      date: 'JULY 19, 2026',
      time: weddingData.wedding.time,
      location: weddingData.wedding.venue,
      description: 'Join us for an evening of celebration, love, and a traditional feast as we mark the beginning of our married life.',
    },
  ];

  return (
    <section className="py-20 px-4 md:px-12 max-w-4xl mx-auto w-full relative z-20">
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-[10px] tracking-[0.3em] uppercase text-gold-dark/80 block mb-2">
          THE TIMELINE OF OUR AUSPICIOUS DAY
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-ivory tracking-[0.1em] uppercase">
          Event Schedule
        </h2>
      </div>


      {/* Events layout */}
      <div className="flex flex-col gap-6 relative">
        {/* Timeline bar (Desktop only) */}
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gold/10 hidden md:block" />
        
        {events.map((event, index) => (
          <div key={index} className="relative md:pl-10">
            {/* Timeline node marker */}
            <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gold border border-obsidian hidden md:block shadow-[0_0_8px_rgba(223,186,115,0.8)]" />
            <EventCard {...event} />
          </div>
        ))}
      </div>
    </section>
  );
};
