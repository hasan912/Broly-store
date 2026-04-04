'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Muhammad Hasan Baig',
    role: 'Streetwear Enthusiast',
    rating: 5,
    text: "Best caps I've ever owned. The quality is outstanding and they fit perfectly. I've already ordered three more!",
  },
  {
    id: 2,
    name: 'Haider Ali',
    role: 'Fashion Blogger',
    rating: 5,
    text: "Broly Caps has become my go-to for headwear. The attention to detail and premium materials really show.",
  },
  {
    id: 3,
    name: 'Izhan Ali',
    role: 'Athlete',
    rating: 5,
    text: "Perfect for my workouts and casual wear. These caps are breathable, stylish, and incredibly durable.",
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
    <section className="w-full py-20 md:py-28" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#1c1917' }}>
            What Our Customers Say
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#57534e' }}>
            Join thousands of satisfied customers who have made Broly Caps their choice.
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl p-8 md:p-12 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', border: '2px solid #e7e5e4' }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5" style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-lg md:text-xl leading-relaxed mb-8" style={{ color: '#44403c' }}>
                &ldquo;{testimonials[currentIndex].text}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#c7d2fe' }}>
                  <span className="font-bold text-lg" style={{ color: '#4f46e5' }}>
                    {testimonials[currentIndex].name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold" style={{ color: '#1c1917' }}>
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-sm" style={{ color: '#78716c' }}>
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#ffffff', border: '2px solid #e7e5e4', color: '#57534e' }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className="h-2.5 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: index === currentIndex ? '#4f46e5' : '#d6d3d1',
                    width: index === currentIndex ? '2rem' : '0.625rem'
                  }}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#ffffff', border: '2px solid #e7e5e4', color: '#57534e' }}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
