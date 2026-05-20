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

const EventCard: React.FC<EventProps> = ({ title, date, time, location, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass-card glass-card-hover p-5 md:p-6 rounded-xl relative shadow-xl w-full max-w-2xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-[9px] font-sans tracking-[0.2em] text-gold uppercase block mb-0.5">
            {date} • {time}
          </span>
          <h3 className="text-lg md:text-xl font-serif text-ivory tracking-wider uppercase">
            {title}
          </h3>
        </div>
      </div>

      {description && (
        <p className="text-ivory/70 text-xs md:text-sm font-sans leading-relaxed mb-4">
          {description}
        </p>
      )}

      <div className="border-t border-gold/10 pt-3 text-[10px] md:text-xs text-ivory/75">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-gold/60 shrink-0" />
          <span>{location}</span>
        </div>
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
      description: 'We request the honor of your presence at our Grand Reception as we celebrate this joyous milestone with our esteemed guests and partners.',
    },
  ];

  return (
    <section className="py-16 px-4 md:px-12 max-w-4xl mx-auto w-full relative z-20">
      {/* Title */}
      <div className="text-center mb-10">
        <span className="text-[9px] tracking-[0.3em] uppercase text-gold-dark/80 block mb-2 font-bold">
          Official Invitation
        </span>
        <h2 className="text-2xl md:text-4xl font-serif text-ivory tracking-[0.1em] uppercase">
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
