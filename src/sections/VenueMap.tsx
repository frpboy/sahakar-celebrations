import React from 'react';
import { MapPin, Navigation, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { weddingData } from '../config/wedding';
import { getGoogleMapsQueryEmbedUrl } from '../lib/maps';

export const VenueMap: React.FC = () => {
  const mapEmbedUrl = getGoogleMapsQueryEmbedUrl(weddingData.wedding.mapEmbedQuery);
  const directionsUrl = weddingData.wedding.mapsUrl;

  return (
    <section className="py-20 px-4 md:px-12 max-w-6xl mx-auto w-full relative z-20">
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-[10px] tracking-[0.3em] uppercase text-gold-dark/80 block mb-2">
          WHERE OUR SACRED JOURNEY BEGINS
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-ivory tracking-[0.1em] uppercase">
          The Venue
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
        {/* Contact & Address panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-2 glass-card p-8 rounded-2xl flex flex-col justify-between shadow-2xl relative"
        >
          {/* Accent border */}
          <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-gold/60 to-transparent" />
          
          <div>
            <span className="text-[10px] font-sans tracking-[0.2em] text-gold uppercase block mb-2">
              Ceremony Destination
            </span>
            <h3 className="text-2xl md:text-3xl font-serif text-ivory tracking-wide mb-6">
              {weddingData.wedding.venue}
            </h3>
            
            <div className="flex flex-col gap-6 text-sm text-ivory/80">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gold/70 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-ivory mb-1">Address</p>
                  <p className="leading-relaxed">{weddingData.wedding.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-gold/70 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-ivory mb-1">Family Concierge</p>
                  <p>+91 22 6668 1234</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-gold text-obsidian font-sans font-semibold text-xs tracking-[0.25em] uppercase hover:bg-gold-light active:scale-95 transition-all duration-300 rounded-xl flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4 fill-obsidian" />
              Navigate to Venue
            </a>
          </div>
        </motion.div>

        {/* Map visualization frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-3 glass-card p-2 rounded-2xl overflow-hidden shadow-2xl h-[350px] lg:h-auto min-h-[350px] relative"
        >
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(110%)' }}
            allowFullScreen={false}
            loading="lazy"
            title="Google Maps Location Frame"
            className="rounded-xl"
          />
        </motion.div>
      </div>
    </section>
  );
};
