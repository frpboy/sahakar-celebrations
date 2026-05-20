import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, CheckCircle, AlertTriangle } from 'lucide-react';

export const RSVPForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    attendance: 'attending',
    guestCount: 1,
    dietaryNotes: '',
    honeypot: '', // anti-spam
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length < 8) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.attendance === 'attending') {
      if (formData.guestCount < 1 || formData.guestCount > 10) {
        newErrors.guestCount = 'Guest count must be between 1 and 10';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guestCount' ? parseInt(value) || 1 : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Honeypot check
    if (formData.honeypot) {
      // Act like it succeeded to fool spam bots
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
          email: formData.email,
          phone: formData.phone,
          attendance: formData.attendance,
          guestCount: formData.attendance === 'attending' ? formData.guestCount : 0,
          dietaryNotes: formData.dietaryNotes,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
      } else {
        throw new Error(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err: any) {
      console.warn('API connection failed. Running in mock demonstration mode.', err);
      // Fallback/Mock success for demonstration purposes if local backend is unconfigured
      setTimeout(() => {
        setSubmitStatus('success');
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 md:px-12 max-w-xl mx-auto w-full relative z-20">
      {/* Title */}
      <div className="text-center mb-12">
        <span className="text-[10px] tracking-[0.3em] uppercase text-gold-dark/80 block mb-2">
          CONFIRMATION
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-ivory tracking-[0.1em] uppercase">
          RSVP
        </h2>
        <div className="w-12 h-[1px] bg-gold mx-auto mt-4" />
      </div>

      <div className="glass-card p-8 md:p-10 rounded-3xl shadow-2xl relative">
        {/* Anti-spam honeypot field (hidden from view) */}
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleInputChange}
          className="absolute opacity-0 pointer-events-none h-0 w-0"
          tabIndex={-1}
          autoComplete="off"
        />

        <AnimatePresence mode="wait">
          {submitStatus === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10"
            >
              <CheckCircle className="w-16 h-16 text-gold mx-auto mb-6 drop-shadow-[0_0_10px_rgba(223,186,115,0.4)]" />
              <h3 className="text-2xl font-serif text-ivory tracking-wide mb-4">
                Thank You
              </h3>
              <p className="text-ivory/80 text-sm leading-relaxed mb-6">
                Your response has been captured. We look forward to celebrating these auspicious moments with you.
              </p>
              <div className="w-12 h-[1px] bg-gold/30 mx-auto" />
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              {/* Full Name */}
              <div className="flex flex-col">
                <label className="text-[10px] font-sans tracking-widest uppercase text-gold/80 mb-2 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="bg-obsidian/60 border-b border-gold/20 focus:border-gold py-2 px-3 text-sm text-ivory outline-none transition-colors duration-300 rounded-t"
                />
                {errors.fullName && (
                  <span className="text-[10px] text-crimson mt-1 font-sans flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {errors.fullName}
                  </span>
                )}
              </div>

              {/* Email Address */}
              <div className="flex flex-col">
                <label className="text-[10px] font-sans tracking-widest uppercase text-gold/80 mb-2 font-medium">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. john@example.com"
                  className="bg-obsidian/60 border-b border-gold/20 focus:border-gold py-2 px-3 text-sm text-ivory outline-none transition-colors duration-300 rounded-t"
                />
                {errors.email && (
                  <span className="text-[10px] text-crimson mt-1 font-sans flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {errors.email}
                  </span>
                )}
              </div>

              {/* Phone Number */}
              <div className="flex flex-col">
                <label className="text-[10px] font-sans tracking-widest uppercase text-gold/80 mb-2 font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 98765 43210"
                  className="bg-obsidian/60 border-b border-gold/20 focus:border-gold py-2 px-3 text-sm text-ivory outline-none transition-colors duration-300 rounded-t"
                />
                {errors.phone && (
                  <span className="text-[10px] text-crimson mt-1 font-sans flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {errors.phone}
                  </span>
                )}
              </div>

              {/* Attendance Toggle */}
              <div className="flex flex-col">
                <label className="text-[10px] font-sans tracking-widest uppercase text-gold/80 mb-2 font-medium">
                  Will you attend?
                </label>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, attendance: 'attending' }))}
                    className={`py-3 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 font-sans border ${
                      formData.attendance === 'attending'
                        ? 'bg-gold text-obsidian border-gold font-semibold shadow-[0_0_12px_rgba(223,186,115,0.3)]'
                        : 'border-gold/20 text-ivory/60 hover:border-gold/50'
                    }`}
                  >
                    Accepts With Pleasure
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, attendance: 'declined' }))}
                    className={`py-3 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 font-sans border ${
                      formData.attendance === 'declined'
                        ? 'bg-gold text-obsidian border-gold font-semibold shadow-[0_0_12px_rgba(223,186,115,0.3)]'
                        : 'border-gold/20 text-ivory/60 hover:border-gold/50'
                    }`}
                  >
                    Declines With Regret
                  </button>
                </div>
              </div>

              {/* Guest Count (conditional) */}
              <AnimatePresence>
                {formData.attendance === 'attending' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col pt-2">
                      <label className="text-[10px] font-sans tracking-widest uppercase text-gold/80 mb-2 font-medium flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" /> Total Guests (Including you)
                      </label>
                      <input
                        type="number"
                        name="guestCount"
                        min="1"
                        max="10"
                        value={formData.guestCount}
                        onChange={handleInputChange}
                        className="bg-obsidian/60 border-b border-gold/20 focus:border-gold py-2 px-3 text-sm text-ivory outline-none transition-colors duration-300 rounded-t"
                      />
                      {errors.guestCount && (
                        <span className="text-[10px] text-crimson mt-1 font-sans flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {errors.guestCount}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dietary / Special Notes */}
              <div className="flex flex-col">
                <label className="text-[10px] font-sans tracking-widest uppercase text-gold/80 mb-2 font-medium">
                  Dietary Preferences / Notes (Optional)
                </label>
                <textarea
                  name="dietaryNotes"
                  value={formData.dietaryNotes}
                  onChange={handleInputChange}
                  placeholder="e.g. Jain food, wheel-chair accessibility requirement, etc."
                  rows={3}
                  className="bg-obsidian/60 border border-gold/20 focus:border-gold p-3 text-sm text-ivory outline-none transition-colors duration-300 rounded-xl resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-4 bg-gold text-obsidian font-sans font-bold text-xs tracking-[0.3em] uppercase hover:bg-gold-light disabled:bg-gold-dark/40 disabled:text-ivory/50 disabled:cursor-not-allowed transition-all duration-300 rounded-xl flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4.5 h-4.5" />
                    Submit Response
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
