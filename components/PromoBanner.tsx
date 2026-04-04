'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="w-full py-12 md:py-16 px-6 md:px-12 lg:px-20" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 md:p-12 lg:p-16 flex flex-col justify-center"
            style={{ background: 'linear-gradient(135deg, #e8f5f7 0%, #f0e8f5 50%, #fff5e6 100%)' }}
          >
            <span className="inline-block w-fit px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
              Limited Time Offer
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight" style={{ color: '#1a1a1a' }}>
              Summer Sale
              <br />
              <span style={{ background: 'linear-gradient(90deg, #fbbf24, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Up to 70% off
              </span>
            </h2>
            
            <p className="text-base md:text-lg mb-8 max-w-md leading-relaxed" style={{ color: 'rgba(0,0,0,0.6)' }}>
              Don&apos;t miss out on our biggest sale of the season. Premium caps at unbeatable prices.
            </p>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 w-fit px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
            >
              Shop the Sale
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right Side - Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative min-h-[300px] lg:min-h-[400px] flex items-center justify-center p-8"
            style={{ background: 'linear-gradient(135deg, #fff5e6 0%, #ffe8d6 50%, #ffe0f0 100%)' }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full"
            >
              <Image
                src="/ai-caps/promo.png"
                alt="Summer Sale Cap"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>
            
            {/* Decorative Elements */}
            <div className="absolute top-8 right-8 w-16 h-16 rounded-full blur-xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <div className="absolute bottom-8 left-8 w-12 h-12 rounded-full blur-xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
