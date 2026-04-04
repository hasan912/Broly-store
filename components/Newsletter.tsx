'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';
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
    <section className="w-full py-20 md:py-28" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #312e81 50%, #0f172a 100%)' }}>
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#fbbf24' }} />
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>Get Exclusive Offers</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: '#ffffff' }}>
            Stay in the Loop
          </h2>

          {/* Description */}
          <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Subscribe to our newsletter for exclusive drops, style tips, and members-only discounts.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'rgba(255,255,255,0.5)' }} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-xl transition-all focus:outline-none"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff' }}
                required
              />
            </div>
            <button
              type="submit"
              className="h-14 px-8 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#ffffff' }}
            >
              {isSubmitted ? (
                'Subscribed!'
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm pt-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#34d399' }} />
              No spam, ever
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#34d399' }} />
              Unsubscribe anytime
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#34d399' }} />
              10% off first order
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
