import React from 'react';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventProps {
  title: string;
  date: string;
  time: string;
  location: string;
  dressCode: string;
  googleCalendarUrl: string;
}

const EventCard: React.FC<EventProps> = ({ title, date, time, location, dressCode, googleCalendarUrl }) => {
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
            {date}
          </span>
          <h3 className="text-xl md:text-2xl font-serif text-ivory tracking-wide">
            {title}
          </h3>
        </div>
        
        {/* Calendar button */}
        <a
          href={googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start md:self-center px-4 py-2 border border-gold/20 hover:border-gold text-gold hover:text-obsidian hover:bg-gold transition-all duration-300 rounded-full text-[10px] tracking-widest uppercase font-sans flex items-center gap-2"
        >
          <Calendar className="w-3.5 h-3.5" />
          Add to Calendar
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gold/10 pt-4 text-xs md:text-sm text-ivory/75">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-gold/60 shrink-0" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-gold/60 shrink-0" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-3">
          <Tag className="w-4 h-4 text-gold/60 shrink-0" />
          <span><strong className="text-gold/80">Dress:</strong> {dressCode}</span>
        </div>
      </div>
    </motion.div>
  );
};

export const EventTimeline: React.FC = () => {
  const events = [
    {
      title: 'Welcome Shubh Aagman Brunch',
      date: 'SATURDAY, OCTOBER 24, 2026',
      time: '11:00 AM onwards',
      location: 'The Palm Court, Sahakar Palace',
      dressCode: 'Royal Pastel Ethnic / Casual Smart',
      googleCalendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Welcome+Shubh+Aagman+Brunch+-+Sahakar+Celebrations&dates=20261024T053000Z/20261024T083000Z&details=Inaugural+brunch+welcoming+guests+for+the+Sahakar+Celebrations.&location=The+Palm+Court,+Sahakar+Palace',
    },
    {
      title: 'Sangeet & Cocktail Soiree',
      date: 'SATURDAY, OCTOBER 24, 2026',
      time: '07:00 PM onwards',
      location: 'Grand Ballroom, Sahakar Palace',
      dressCode: 'Glitz & Glamour Indowestern',
      googleCalendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sangeet+%26+Cocktail+Soiree+-+Sahakar+Celebrations&dates=20261024T133000Z/20261024T173000Z&details=An+evening+of+music,+dance,+and+toasts.&location=Grand+Ballroom,+Sahakar+Palace',
    },
    {
      title: 'Manglik Haldi & Mehendi Utsav',
      date: 'SUNDAY, OCTOBER 25, 2026',
      time: '10:00 AM onwards',
      location: 'Royal Gardens, Sahakar Palace',
      dressCode: 'Traditional Yellow / Festive Floral',
      googleCalendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Haldi+%26+Mehendi+Utsav+-+Sahakar+Celebrations&dates=20261025T043000Z/20261025T083000Z&details=Traditional+Haldi+and+Mehendi+ceremonies.&location=Royal+Gardens,+Sahakar+Palace',
    },
    {
      title: 'Grand Matrimonial Reception Feast',
      date: 'MONDAY, OCTOBER 26, 2026',
      time: '07:30 PM onwards',
      location: 'The Palace lawns, Sahakar Palace',
      dressCode: 'Royal Formal Ethnic / Black Tie',
      googleCalendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Grand+Matrimonial+Reception+-+Sahakar+Celebrations&dates=20261026T140000Z/20261026T180000Z&details=The+reception+dinner+in+honor+of+the+couples.&location=Palace+lawns,+Sahakar+Palace',
    },
  ];

  return (
    <section className="py-20 px-4 md:px-12 max-w-4xl mx-auto w-full relative z-20">
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-[10px] tracking-[0.3em] uppercase text-gold-dark/80 block mb-2">
          SCHEDULE
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-ivory tracking-[0.1em] uppercase">
          Celebration Timeline
        </h2>
        <div className="w-12 h-[1px] bg-gold mx-auto mt-4" />
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
