'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

const images = [
  { src: '/Hero1.jpeg', alt: 'Luxury Cap 1', className: 'w-full aspect-[3/4] md:translate-y-12' },
  { src: '/Hero2.jpeg', alt: 'Luxury Cap 2', className: 'w-full aspect-square md:-translate-y-12' },
  { src: '/Hero3.jpeg', alt: 'Luxury Cap 3', className: 'w-full aspect-[4/5] md:translate-y-24' },
  { src: '/Hero4.jpeg', alt: 'Luxury Cap 4', className: 'w-full aspect-[16/9] md:col-span-2' },
  { src: '/Hero5.jpeg', alt: 'Luxury Cap 5', className: 'w-full aspect-[3/4] md:-translate-y-12' },
  { src: '/Hero6.jpeg', alt: 'Luxury Cap 6', className: 'w-full aspect-square md:translate-y-8' },
];

export default function LookbookSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const imageY1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const imageY2 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section ref={containerRef} className="py-32 bg-[#0a0a0a] overflow-hidden relative">
      {/* Background Decorative Text */}
      <motion.div 
        style={{ y: textY }}
        className="absolute top-1/4 -left-20 text-[15rem] font-serif font-black text-white/5 whitespace-nowrap pointer-events-none select-none uppercase transition-opacity duration-1000"
      >
        Collection 2025
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="mb-24 flex flex-col md:flex-row items-baseline gap-8">
          <motion.div
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
             className="flex-1"
          >
            <h2 className="text-6xl md:text-9xl font-serif font-black text-white leading-none tracking-tighter uppercase mb-6">
              Visual<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 italic pl-12 md:pl-24">
                Lookbook.
              </span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md"
          >
            <p className="text-gray-400 font-sans text-lg leading-relaxed mb-8">
              Explore Broly Store curation in urban and architectural contexts. A dialogue between high-end construction and everyday expression.
            </p>
            <div className="h-[1px] w-24 bg-gray-500" />
          </motion.div>
        </div>

        {/* Asymmetrical Immersive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-x-16 md:gap-y-32">
          
          {/* Row 1 */}
          <LookbookItem 
            {...images[0]} 
            y={imageY1} 
            index={0} 
            title="Structural" 
            desc="Model 01 — Urban Gray" 
          />
          <LookbookItem 
            {...images[1]} 
            y={imageY2} 
            index={1} 
            title="Perspective" 
            desc="Model 02 — Obsidian Black" 
          />
          <LookbookItem 
            {...images[2]} 
            y={imageY1} 
            index={2} 
            title="Form" 
            desc="Model 03 — Concrete" 
          />

          {/* Row 2 - Feature Section */}
          <div className="md:col-span-2 lg:col-span-2 relative h-[500px] md:h-[700px] group overflow-hidden">
             <motion.div 
               style={{ scale: 1.1 }}
               whileInView={{ scale: 1 }}
               transition={{ duration: 2, ease: "easeOut" }}
               className="w-full h-full"
             >
                <Image 
                  src={images[3].src} 
                  alt={images[3].alt} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
             </motion.div>
             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
             <div className="absolute bottom-12 left-12">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white text-xs uppercase tracking-[0.4em] mb-4 block"
                >
                  Featured Exhibit
                </motion.span>
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-5xl font-serif italic text-white"
                >
                  Architectural Synthesis
                </motion.h3>
             </div>
          </div>
          
          <div className="hidden lg:block lg:col-span-1 pt-24 pl-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-8"
            >
               <p className="text-gray-500 uppercase text-[10px] tracking-widest font-bold">Concept</p>
               <p className="text-gray-400 text-sm italic font-serif leading-loose">
                 "Our design philosophy is anchored in the concept of The Monolith Gallery. It treats the digital interface not as a collection of widgets, but as a curated architectural space."
               </p>
               <motion.button
                whileHover={{ x: 10 }}
                className="flex items-center gap-4 text-white uppercase text-xs tracking-widest group"
               >
                 View Collection <span className="w-12 h-[1px] bg-white group-hover:w-16 transition-all" />
               </motion.button>
            </motion.div>
          </div>

          {/* Row 3 */}
          <LookbookItem 
            {...images[4]} 
            y={imageY2} 
            index={4} 
            title="Ethereal" 
            desc="Model 04 — Desert Sand" 
          />
          <div className="lg:col-span-1" /> {/* Spacer */}
          <LookbookItem 
            {...images[5]} 
            y={imageY1} 
            index={5} 
            title="Minimalist" 
            desc="Model 05 — Pearl White" 
          />

        </div>
      </div>
    </section>
  );
}

function LookbookItem({ src, alt, className, y, index, title, desc }: any) {
  return (
    <motion.div
      style={{ y }}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay: (index % 3) * 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`relative group ${className}`}
    >
      <div className="overflow-hidden relative w-full h-full bg-[#1a1a1a]">
        <Image 
          src={src} 
          alt={alt} 
          fill 
          className="object-cover transition-all duration-[1500ms] ease-out group-hover:scale-110 group-hover:rotate-1"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-700 pointer-events-none" />
        
        {/* Floating Title on Hover */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 text-center">
           <span className="text-white text-[10px] uppercase tracking-[0.5em] mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
             Collection
           </span>
           <h4 className="text-white font-serif italic text-3xl mb-4 scale-110 group-hover:scale-100 transition-all duration-500">
             {title}
           </h4>
           <div className="w-0 group-hover:w-12 h-[1px] bg-white transition-all duration-700" />
        </div>
      </div>
      
      {/* Static Description Below (Only on Mobile or always for clarity) */}
      <div className="mt-6 flex justify-between items-start opacity-70 group-hover:opacity-100 transition-opacity duration-500">
        <div>
          <p className="text-white text-xs uppercase tracking-widest">{desc}</p>
        </div>
        <p className="text-gray-500 text-[10px] font-mono leading-none">[{index + 1}/06]</p>
      </div>
    </motion.div>
  );
}

