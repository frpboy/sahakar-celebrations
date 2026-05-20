import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertTriangle, Plus, Minus, Heart, Share2, Instagram } from 'lucide-react';

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

  const shareOnWhatsApp = () => {
    const currentUrl = window.location.origin;
    const text = encodeURIComponent(
      `You are joyfully invited to the wedding celebration of Muhammed Shabin & Sana and Mohammed Sameer & Nihala Jasmin KK on Sunday, July 19, 2026 at Shifa Convention Center. View details & RSVP: ${currentUrl}/`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareOnInstagram = () => {
    // Instagram doesn't have a direct "share text" API like WhatsApp, 
    // but we can copy to clipboard and alert the user or redirect to profile
    const shareUrl = window.location.origin + '/';
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Link copied to clipboard! You can now share it in your Instagram Story or Bio.');
      window.open('https://www.instagram.com/', '_blank');
    });
  };

  return (
    <section className="py-20 px-4 md:px-12 max-w-6xl mx-auto w-full relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: RSVP Form */}
        <div className="glass-card p-8 md:p-10 rounded-[2rem] shadow-2xl relative">
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-gold/80 mb-8 font-semibold">
            RSVP Confirmation
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Name Input */}
            <div className="flex flex-col">
              <label className="text-[9px] font-sans tracking-[0.2em] uppercase text-gold-dark/60 mb-3 font-bold">
                Your Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Your full name"
                className="bg-obsidian/40 border border-gold/10 focus:border-gold/40 py-3.5 px-5 text-sm text-ivory outline-none transition-all duration-300 rounded-2xl placeholder:text-ivory/20"
              />
              {errors.fullName && (
                <span className="text-[9px] text-crimson mt-2 font-sans flex items-center gap-1 uppercase tracking-wider">
                  <AlertTriangle className="w-3 h-3" /> {errors.fullName}
                </span>
              )}
            </div>

            {/* Attendance Toggle */}
            <div className="flex flex-col">
              <label className="text-[9px] font-sans tracking-[0.2em] uppercase text-gold-dark/60 mb-3 font-bold">
                Will you be attending?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, attendance: 'attending' }))}
                  className={`py-4 rounded-2xl text-[10px] tracking-widest uppercase transition-all duration-500 font-bold border flex items-center justify-center gap-2 ${
                    formData.attendance === 'attending'
                      ? 'bg-gold text-obsidian border-gold shadow-[0_8px_20px_rgba(223,186,115,0.2)]'
                      : 'border-gold/10 text-ivory/40 hover:border-gold/30'
                  }`}
                >
                  {formData.attendance === 'attending' && <CheckCircle className="w-3.5 h-3.5" />}
                  Joyfully Accepts
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, attendance: 'declined' }))}
                  className={`py-4 rounded-2xl text-[10px] tracking-widest uppercase transition-all duration-500 font-bold border flex items-center justify-center gap-2 ${
                    formData.attendance === 'declined'
                      ? 'bg-gold text-obsidian border-gold shadow-[0_8px_20px_rgba(223,186,115,0.2)]'
                      : 'border-gold/10 text-ivory/40 hover:border-gold/30'
                  }`}
                >
                  {formData.attendance === 'declined' && <Plus className="w-3.5 h-3.5 rotate-45" />}
                  Regretfully Declines
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
                  <label className="text-[9px] font-sans tracking-[0.2em] uppercase text-gold-dark/60 mb-3 font-bold">
                    Number of Guests
                  </label>
                  <div className="flex items-center gap-6 bg-obsidian/40 border border-gold/10 rounded-2xl p-2 w-fit">
                    <button
                      type="button"
                      onClick={decrementGuests}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-gold/10 text-gold hover:bg-gold/10 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-serif text-ivory w-8 text-center">{formData.guestCount}</span>
                    <button
                      type="button"
                      onClick={incrementGuests}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-gold/10 text-gold hover:bg-gold/10 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message/Wishes */}
            <div className="flex flex-col">
              <label className="text-[9px] font-sans tracking-[0.2em] uppercase text-gold-dark/60 mb-3 font-bold">
                Blessing / Message <span className="lowercase font-normal opacity-60">(optional)</span>
              </label>
              <textarea
                name="wishes"
                value={formData.wishes}
                onChange={handleInputChange}
                placeholder="Write your heartfelt wishes..."
                className="bg-obsidian/40 border border-gold/10 focus:border-gold/40 p-5 text-sm text-ivory outline-none transition-all duration-300 rounded-[1.5rem] resize-none min-h-[140px] placeholder:text-ivory/20"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-gold text-obsidian font-sans font-black text-[11px] tracking-[0.3em] uppercase hover:bg-gold-light active:scale-[0.98] transition-all duration-500 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_25px_rgba(223,186,115,0.15)]"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send RSVP
                </>
              )}
            </button>
          </form>

          {/* Sharing Section - Directly after the form */}
          <div className="mt-12 pt-8 border-t border-gold/10">
            <h2 className="text-[9px] tracking-[0.2em] uppercase text-gold/60 font-bold mb-6 text-center">
              Invite Others to the Celebration
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={shareOnWhatsApp}
                className="flex items-center justify-center gap-3 py-4 px-6 bg-emerald-600/5 border border-emerald-600/10 text-emerald-400 rounded-2xl text-[10px] tracking-widest uppercase font-bold hover:bg-emerald-600/10 transition-all duration-300 group"
              >
                <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Share on WhatsApp
              </button>
              <button
                onClick={shareOnInstagram}
                className="flex items-center justify-center gap-3 py-4 px-6 bg-pink-600/5 border border-pink-600/10 text-pink-400 rounded-2xl text-[10px] tracking-widest uppercase font-bold hover:bg-pink-600/10 transition-all duration-300 group"
              >
                <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Share to Instagram
              </button>
            </div>
          </div>

          {/* Success Overlay */}
          <AnimatePresence>
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-30 bg-obsidian/95 backdrop-blur-md rounded-[2rem] flex flex-col items-center justify-center text-center p-10"
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
        <div className="glass-card p-8 md:p-10 rounded-[2rem] shadow-2xl h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-4 h-4 text-gold/80" />
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-gold/80 font-semibold">
              Wishes & Prayers
            </h2>
          </div>

          <div className="flex flex-col gap-5 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
            {displayWishes.map((wish, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-ivory/[0.03] border border-gold/5 rounded-2xl p-6 hover:bg-ivory/[0.05] transition-colors group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3.5 h-3.5 rounded-full border border-gold/40 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                  </div>
                  <span className="text-[9px] font-bold tracking-[0.15em] text-gold uppercase">
                    {wish.status}
                  </span>
                </div>
                <p className="text-sm text-ivory/80 italic font-serif leading-relaxed mb-4 group-hover:text-ivory transition-colors">
                  "{wish.message}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-gold/30" />
                  <span className="text-[10px] font-sans tracking-wide text-gold/70">— {wish.name}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-auto pt-6 text-center">
            <p className="text-[9px] text-gold-dark/40 tracking-[0.2em] uppercase italic">
              Sharing the love of family & friends
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
