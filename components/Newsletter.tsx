'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="w-full py-20 md:py-32 bg-transparent relative z-10 border-t border-[rgba(255,255,255,0.05)]">
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 text-center relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-10"
        >
          {/* Badge */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-8 bg-[#8b7355]" />
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#64748b]">
              Communications
            </span>
            <div className="h-px w-8 bg-[#8b7355]" />
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#f5f0eb] leading-tight">
            The <span className="italic font-light text-[#94a3b8]">Bulletin.</span>
          </h2>

          {/* Description */}
          <p className="text-sm md:text-base max-w-xl mx-auto font-sans text-[#64748b] leading-[1.8]">
            Register your detail to receive curated fabrication notes, acquisition opportunities, and design updates from the atelier.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto pt-4"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 pl-14 pr-4 rounded-none border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] backdrop-blur-md text-[#f5f0eb] text-xs font-mono tracking-widest transition-all duration-500 focus:outline-none focus:border-[#8b7355] placeholder:text-[#64748b]"
                required
              />
            </div>
            <button
              type="submit"
              className="h-14 px-8 bg-[#8b7355] text-white text-xs uppercase font-mono tracking-widest transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#a68c68] flex items-center justify-center gap-3 shrink-0"
            >
              {isSubmitted ? (
                'Confirmed'
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-[10px] tracking-widest font-mono text-[#4a5568] uppercase pt-4">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8b7355]" />
              Curated Logs
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8b7355]" />
              Opt-out Always
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
