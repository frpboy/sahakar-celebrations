import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertTriangle, Plus, Minus, Heart } from 'lucide-react';

interface Wish {
  name: string;
  message: string;
  status: 'ATTENDING' | 'DECLINED';
}

export const RSVPForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    attendance: 'attending',
    guestCount: 1,
    wishes: '',
    honeypot: '', // anti-spam
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  // Dynamic wishes from database
  const [displayWishes, setDisplayWishes] = useState<Wish[]>([]);

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    try {
      const response = await fetch('/api/rsvp');
      const result = await response.json();
      if (result.success) {
        // Convert status to uppercase for the UI
        const formattedData = result.data.map((item: any) => ({
          ...item,
          status: item.attendance === 'attending' ? 'ATTENDING' : 'DECLINED'
        }));
        setDisplayWishes(formattedData);
      }
    } catch (err) {
      console.error('Failed to fetch wishes:', err);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Your full name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const incrementGuests = () => {
    if (formData.guestCount < 10) {
      setFormData(prev => ({ ...prev, guestCount: prev.guestCount + 1 }));
    }
  };

  const decrementGuests = () => {
    if (formData.guestCount > 1) {
      setFormData(prev => ({ ...prev, guestCount: prev.guestCount - 1 }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (formData.honeypot) {
      setSubmitStatus('success');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          attendance: formData.attendance,
          guestCount: formData.attendance === 'attending' ? formData.guestCount : 0,
          wishes: formData.wishes,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        // Refresh the wishes wall
        fetchWishes();
      } else {
        throw new Error(result.message || 'Something went wrong.');
      }
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <section className="py-20 px-4 md:px-12 max-w-6xl mx-auto w-full relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: RSVP Form */}
        <div className="glass-card p-6 md:p-8 rounded-2xl shadow-2xl relative">
          <h2 className="text-[9px] tracking-[0.2em] uppercase text-gold/80 mb-6 font-bold">
            Guest Confirmation
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Name Input */}
            <div className="flex flex-col">
              <label className="text-[8px] font-sans tracking-[0.2em] uppercase text-gold-dark/60 mb-2 font-bold">
                Full Name / Organization
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Name of attendee or firm"
                className="bg-obsidian/40 border border-gold/10 focus:border-gold/40 py-2.5 px-4 text-sm text-ivory outline-none transition-all duration-300 rounded-xl placeholder:text-ivory/20"
              />
              {errors.fullName && (
                <span className="text-[8px] text-crimson mt-1 font-sans flex items-center gap-1 uppercase tracking-wider">
                  <AlertTriangle className="w-3 h-3" /> {errors.fullName}
                </span>
              )}
            </div>

            {/* Attendance Toggle */}
            <div className="flex flex-col">
              <label className="text-[8px] font-sans tracking-[0.2em] uppercase text-gold-dark/60 mb-2 font-bold">
                Will you be attending?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, attendance: 'attending' }))}
                  className={`py-3 rounded-xl text-[9px] tracking-widest uppercase transition-all duration-500 font-bold border flex flex-col items-center justify-center gap-1 leading-tight ${
                    formData.attendance === 'attending'
                      ? 'bg-gold text-obsidian border-gold'
                      : 'border-gold/10 text-ivory/40 hover:border-gold/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {formData.attendance === 'attending' && <CheckCircle className="w-3 h-3" />}
                    Joyfully
                  </div>
                  <span>Accepts</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, attendance: 'declined' }))}
                  className={`py-3 rounded-xl text-[9px] tracking-widest uppercase transition-all duration-500 font-bold border flex flex-col items-center justify-center gap-1 leading-tight ${
                    formData.attendance === 'declined'
                      ? 'bg-gold text-obsidian border-gold'
                      : 'border-gold/10 text-ivory/40 hover:border-gold/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {formData.attendance === 'declined' && <Plus className="w-3 h-3 rotate-45" />}
                    Regretfully
                  </div>
                  <span>Declines</span>
                </button>
              </div>
            </div>

            {/* Guest Counter */}
            <AnimatePresence>
              {formData.attendance === 'attending' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col"
                >
                  <label className="text-[8px] font-sans tracking-[0.2em] uppercase text-gold-dark/60 mb-2 font-bold">
                    Number of Attendees
                  </label>
                  <div className="flex items-center gap-4 bg-obsidian/40 border border-gold/10 rounded-xl p-1.5 w-fit">
                    <button
                      type="button"
                      onClick={decrementGuests}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border border-gold/10 text-gold hover:bg-gold/10 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-lg font-serif text-ivory w-6 text-center">{formData.guestCount}</span>
                    <button
                      type="button"
                      onClick={incrementGuests}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border border-gold/10 text-gold hover:bg-gold/10 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message/Wishes */}
            <div className="flex flex-col">
              <label className="text-[8px] font-sans tracking-[0.2em] uppercase text-gold-dark/60 mb-2 font-bold">
                Congratulatory Note <span className="lowercase font-normal opacity-60">(optional)</span>
              </label>
              <textarea
                name="wishes"
                value={formData.wishes}
                onChange={handleInputChange}
                placeholder="Leave a message for the families..."
                className="bg-obsidian/40 border border-gold/10 focus:border-gold/40 p-4 text-sm text-ivory outline-none transition-all duration-300 rounded-xl resize-none min-h-[100px] placeholder:text-ivory/20"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gold text-obsidian font-sans font-black text-[10px] tracking-[0.25em] uppercase hover:bg-gold-light active:scale-[0.98] transition-all duration-500 rounded-xl flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Submit RSVP
                </>
              )}
            </button>
          </form>

          {/* Success Overlay */}
          <AnimatePresence>
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-30 bg-obsidian/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center p-10"
              >
                <CheckCircle className="w-16 h-16 text-gold mb-6" />
                <h3 className="text-2xl font-serif text-ivory mb-2">Thank You</h3>
                <p className="text-ivory/60 text-sm">Your response has been beautifully captured.</p>
                <button 
                  onClick={() => setSubmitStatus(null)}
                  className="mt-8 text-[10px] uppercase tracking-widest text-gold border-b border-gold/30 pb-1"
                >
                  Send another
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Wishes Wall */}
        <div className="glass-card p-6 md:p-8 rounded-2xl shadow-2xl h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-4 h-4 text-gold/80" />
            <h2 className="text-[9px] tracking-[0.2em] uppercase text-gold/80 font-bold">
              Wishes & Prayers
            </h2>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {displayWishes.map((wish, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-ivory/[0.03] border border-gold/5 rounded-xl p-5 hover:bg-ivory/[0.05] transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full border border-gold/40 flex items-center justify-center">
                    <div className="w-1 h-1 bg-gold rounded-full" />
                  </div>
                  <span className="text-[8px] font-bold tracking-[0.1em] text-gold uppercase">
                    {wish.status}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-ivory/80 italic font-serif leading-relaxed mb-3 group-hover:text-ivory transition-colors">
                  "{wish.message}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-[1px] bg-gold/30" />
                  <span className="text-[9px] font-sans tracking-wide text-gold/70">— {wish.name}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-auto pt-6 text-center">
            <p className="text-[8px] text-gold-dark/40 tracking-[0.2em] uppercase italic">
              Sharing the love of family & friends
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
