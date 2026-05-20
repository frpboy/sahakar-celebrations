import React from 'react';
import { MapPin } from 'lucide-react';
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass-card glass-card-hover p-8 md:p-10 rounded-2xl relative shadow-2xl w-full max-w-2xl mx-auto text-center overflow-hidden"
    >
      {/* Edge Lighting & Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
      
      <div className="flex flex-col items-center justify-center gap-2 mb-6 relative z-10">
        <span className="text-[10px] font-sans tracking-[0.3em] text-gold uppercase block mb-1 font-bold">
          {date} <span className="mx-2 text-gold/30">•</span> {time}
        </span>
        <h3 className="text-2xl md:text-3xl font-serif text-ivory tracking-[0.15em] uppercase leading-tight">
          {title}
        </h3>
      </div>

      {description && (
        <p className="text-ivory/70 text-sm md:text-base font-sans leading-relaxed mb-8 max-w-lg mx-auto">
          {description}
        </p>
      )}

      <div className="border-t border-gold/10 pt-6 text-xs md:text-sm text-ivory/75 flex items-center justify-center gap-3">
        <MapPin className="w-4 h-4 text-gold/60 shrink-0" />
        <span className="tracking-wide uppercase font-medium">{location}</span>
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
      <div className="text-center mb-16">
        <span className="text-[10px] tracking-[0.4em] uppercase text-gold-dark/80 block mb-3 font-bold">
          Official Invitation
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-ivory tracking-[0.1em] uppercase">
          Event Schedule
        </h2>
      </div>

      {/* Events layout - Center Aligned */}
      <div className="flex flex-col gap-10 relative">
        {events.map((event, index) => (
          <div key={index} className="w-full">
            <EventCard {...event} />
          </div>
        ))}
      </div>
    </section>
  );
};
