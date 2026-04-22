'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[90vh] md:h-screen overflow-hidden bg-[#0A0A0A]">
      {/* Dynamic Background Image Array */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="/HeroSection.png"
          alt="Premium Collection"
          fill
          priority
          className="object-cover object-top opacity-70"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/25 via-65% to-[#e9e9e9]/45" />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-linear-to-t from-background via-background/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-5 blur-xl bg-background/70" />

      <div className="relative z-10 flex flex-col justify-center h-full max-w-7xl mx-auto px-6 lg:px-8 mt-12 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-3xl"
        >
          {/* Tag */}
          <div className="inline-block bg-[#ffffff] text-[#000000] px-4 py-2 text-xs font-bold tracking-widest uppercase mb-8 shadow-lg">
            Saison 2026 Exclusive
          </div>

          {/* Massive Dense Title */}
          <h1 className="text-5xl sm:text-7xl md:text-[6rem] lg:text-[7.5rem] font-serif font-black text-white leading-[0.95] tracking-tight mb-8 drop-shadow-2xl">
           LEGENDS <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-200 to-gray-500 italic font-light font-sans">REIMAGINED.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 font-sans max-w-xl leading-relaxed mb-10 shadow-black drop-shadow-md">
            Exclusive special-edition jerseys featuring intricate artisan designs. High-performance fabrics, unmatched expression.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/products" className="px-8 py-4 bg-[#ffffff] text-[#000000] font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl">
              Shop Now
            </Link>
            <Link href="/about" className="px-8 py-4 bg-transparent border-2 border-[#ffffff] text-[#dddbdb] font-bold uppercase tracking-widest text-sm hover:bg-[#ffffff] hover:text-[#000000] transition-colors shadow-xl">
              View Our Story
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Floating Dense UI Elements (To make it NOT empty) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-12 right-6 md:right-12 hidden md:flex flex-col gap-4"
      >
        <div className="relative w-[180px] bg-white/10 backdrop-blur-xl border border-white/20 p-4 shadow-2xl rounded-sm">
          <div className="relative w-[120px] h-[180px] m-auto overflow-hidden mb-4">
            <Image src="/1.jpg" alt="Trending" fill className="object-cover hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="flex justify-center  items-center gap-2">
            <div>
              <p className="text-white font-bold font-serif text-xl">The Signature</p>
              <p className="text-white/60 text-xs uppercase tracking-widest mt-1">Trending Unit</p>
            </div>
           
          </div>
        </div>

        {/* Small Highlight Box */}
        
      </motion.div>
    </section>
  );
}
