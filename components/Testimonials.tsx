'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Muhammad Hasan Baig',
    role: 'Aesthetics Director',
    rating: 5,
    text: "The structural integrity and absolute minimalism in these caps are unmatched. A necessary addition to the modern wardrobe.",
  },
  {
    id: 2,
    name: 'Haider Ali',
    role: 'Editorial Curator',
    rating: 5,
    text: "Broly entirely redefines headwear. The attention to material honesty and spatial design is evident in every piece.",
  },
  {
    id: 3,
    name: 'Izhan Ali',
    role: 'Industrial Designer',
    rating: 5,
    text: "Form meets function seamlessly. The fabrics breathe, the shape holds, and the aesthetic remains uncompromisingly professional.",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="w-full py-20 md:py-32 bg-transparent relative z-10 border-t border-[rgba(255,255,255,0.05)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-8 bg-[#8b7355]" />
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#64748b]">
              Acquisition Logs
            </span>
            <div className="h-px w-8 bg-[#8b7355]" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#f5f0eb] leading-tight mb-6">
            Client <span className="italic font-light text-[#94a3b8]">Perspectives.</span>
          </h2>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl p-10 md:p-14 bg-[#0e0e0e] border border-[rgba(255,255,255,0.05)]"
              >
                {/* Rating */}
                <div className="flex gap-2 mb-8">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <div key={i} className="w-2 relative h-2 bg-transparent border border-[#8b7355] rotate-45" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-xl md:text-2xl font-serif tracking-wide leading-relaxed mb-10 text-[#f5f0eb]">
                  "{testimonials[currentIndex].text}"
                </blockquote>

                {/* Top border divider */}
                <div className="w-12 h-px bg-[rgba(255,255,255,0.1)] mb-6" />

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-sans font-medium text-sm text-[#f5f0eb] mb-1 uppercase tracking-widest">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-[10px] font-mono tracking-[0.2em] text-[#64748b] uppercase">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons positioned perfectly on edges */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 -left-4 md:-left-6 lg:-left-12 -translate-y-1/2 w-12 h-12 rounded-full border border-[rgba(255,255,255,0.1)] bg-[#050505] flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#8b7355] text-[#94a3b8] hover:text-[#f5f0eb] z-20"
              aria-label="Previous Perspective"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 -right-4 md:-right-6 lg:-right-12 -translate-y-1/2 w-12 h-12 rounded-full border border-[rgba(255,255,255,0.1)] bg-[#050505] flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#8b7355] text-[#94a3b8] hover:text-[#f5f0eb] z-20"
              aria-label="Next Perspective"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator placed below */}
          <div className="flex items-center justify-center gap-3 mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="group py-2"
                aria-label={`Go to perspective ${index + 1}`}
              >
                <div 
                  className="h-px transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ 
                    backgroundColor: index === currentIndex ? '#8b7355' : 'rgba(255,255,255,0.1)',
                    width: index === currentIndex ? '3rem' : '1rem'
                  }}
                />
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
