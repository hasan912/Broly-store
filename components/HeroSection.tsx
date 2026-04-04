'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const carouselImages = [
  { src: '/Hero2.jpeg', alt: 'Premium Cap Collection' },
  { src: '/Hero1.jpeg', alt: 'Classic Cap Style' },
  { src: '/Hero3.jpeg', alt: 'Classic Cap Style' },
  
];

function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="relative w-fit mx-auto">
      {/* Main Image */}
      <div 
        className="relative w-[350px] md:w-[420px] lg:w-[480px] h-[350px] md:h-[420px] lg:h-[480px] rounded-3xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: '#f5f5f4', border: '4px solid #ffffff' }}
      >
        <AnimatePresence mode="wait">
          {carouselImages.map((image, index) => (
            currentIndex === index && (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 500px, 550px"
                  priority
                  className="object-cover"
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#1c1917' }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#1c1917' }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Image Counter */}
        <div 
          className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-sm font-medium"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#ffffff' }}
        >
          {currentIndex + 1} / {carouselImages.length}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="h-2.5 rounded-full transition-all duration-300"
            style={{ 
              backgroundColor: index === currentIndex ? '#6366f1' : '#d6d3d1',
              width: index === currentIndex ? '2rem' : '0.625rem'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden pt-20" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)' }}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(99, 102, 241, 0.08)' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(168, 85, 247, 0.08)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-200px)]">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ backgroundColor: '#e0e7ff', border: '1px solid #c7d2fe' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: '#f59e0b' }} />
              <span className="text-sm font-medium" style={{ color: '#4f46e5' }}>New Collection 2026</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
            >
              <span style={{ color: '#1c1917' }}>Elevate Your</span>
              <br />
              <span style={{ color: '#a855f7' }}>
                Street Style
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl max-w-lg leading-relaxed"
              style={{ color: '#57534e' }}
            >
              Premium caps crafted for those who dare to stand out. 
              Discover our exclusive collection of handpicked designs.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex gap-8 py-4"
            >
              <div>
                <p className="text-3xl font-bold" style={{ color: '#1c1917' }}>50+</p>
                <p className="text-sm" style={{ color: '#78716c' }}>Premium Styles</p>
              </div>
              <div className="w-px" style={{ backgroundColor: '#e7e5e4' }} />
              <div>
                <p className="text-3xl font-bold" style={{ color: '#1c1917' }}>10k+</p>
                <p className="text-sm" style={{ color: '#78716c' }}>Happy Customers</p>
              </div>
              <div className="w-px" style={{ backgroundColor: '#e7e5e4' }} />
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5" style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                <p className="text-3xl font-bold" style={{ color: '#1c1917' }}>4.9</p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(to right, #6366f1, #8b5cf6)', color: '#ffffff', boxShadow: '0 10px 40px rgba(99, 102, 241, 0.3)' }}
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Collection
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#ffffff', color: '#1c1917', border: '2px solid #e7e5e4' }}
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content - Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative flex flex-col items-center justify-center"
          >
            {/* Glow Ring */}
            <div className="absolute w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full blur-3xl" style={{ background: 'linear-gradient(to right, rgba(99,102,241,0.12), rgba(168,85,247,0.12), rgba(139,92,246,0.12))' }} />
            
            {/* Carousel Container */}
            <ImageCarousel />

            {/* Floating Tags - Below Carousel */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="px-4 py-2 rounded-lg shadow-sm"
                style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}
              >
                <p className="text-sm font-medium" style={{ color: '#92400e' }}>🔥 Trending</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="px-4 py-2 rounded-lg shadow-sm"
                style={{ backgroundColor: '#d1fae5', border: '1px solid #a7f3d0' }}
              >
                <p className="text-sm font-bold" style={{ color: '#065f46' }}>Free Shipping</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="px-4 py-2 rounded-lg shadow-sm"
                style={{ backgroundColor: '#ffe4e6', border: '1px solid #fecdd3' }}
              >
                <p className="text-sm font-bold" style={{ color: '#9f1239' }}>20% OFF</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top, #fafaf9, transparent)' }} />
    </section>
  );
}
