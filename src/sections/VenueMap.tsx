import React from 'react';
import { MapPin, Calendar, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { weddingData } from '../config/wedding';
import { getGoogleMapsQueryEmbedUrl } from '../lib/maps';
import { generateGoogleCalendarUrl } from '../lib/calendar';

export const VenueMap: React.FC = () => {
  const mapEmbedUrl = getGoogleMapsQueryEmbedUrl(weddingData.wedding.mapEmbedQuery);
  const directionsUrl = weddingData.wedding.mapsUrl;

  const googleCalendarUrl = generateGoogleCalendarUrl({
    title: `Family Celebration: Shabin & Sana and Sameer & Nihala`,
    details: `You are cordially invited to celebrate the matrimonial unions of:\n\nMuhammed Shabin & Sana\nMohammed Sameer Kallangadan & Nihala Jasmin KK\n\nDate: Sunday, July 19, 2026\nTime: 4:30 PM Onwards\nVenue: Shifa Convention Center, Perinthalmanna\n\nVenue Link: https://maps.app.goo.gl/JDr5v3dgUuwPNbnJA\n\nWe look forward to your gracious presence.`,
    location: `${weddingData.wedding.venue}, ${weddingData.wedding.address}`,
    startDateIso: weddingData.wedding.date,
  });

  return (
    <section className="py-24 px-4 md:px-12 max-w-4xl mx-auto w-full relative z-20">
      {/* Centered Map Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-card p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative flex flex-col items-center text-center overflow-hidden"
      >
        {/* Edge Lighting & Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        
        {/* Top Icon */}
        <div className="relative z-10 w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center mb-6 bg-gold/5">
          <MapPin className="w-5 h-5 text-gold/70" />
        </div>

        <span className="text-[10px] tracking-[0.3em] uppercase text-gold-dark/80 block mb-2 font-bold">
          Wedding Location
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-ivory tracking-[0.05em] uppercase mb-2">
          {weddingData.wedding.venue}
        </h2>
        <p className="text-ivory/60 text-sm font-sans mb-10 tracking-wide">
          {weddingData.wedding.address}
        </p>

        {/* Embedded Map */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden border border-gold/10 mb-10 shadow-inner">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180) brightness(95%) contrast(90%)' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Venue Map"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold text-obsidian px-6 py-4 rounded-xl font-sans font-bold text-[10px] tracking-[0.25em] uppercase flex items-center justify-center gap-3 hover:bg-gold-light transition-all duration-300 shadow-lg shadow-gold/10"
          >
            <Send className="w-3.5 h-3.5" />
            Navigate
          </a>
          
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gold/20 text-gold px-6 py-4 rounded-xl font-sans font-bold text-[10px] tracking-[0.25em] uppercase flex items-center justify-center gap-3 hover:bg-gold/10 transition-all duration-300"
          >
            <Calendar className="w-3.5 h-3.5" />
            Add to Calendar
          </a>
        </div>
      </motion.div>
    </section>
  );
};
