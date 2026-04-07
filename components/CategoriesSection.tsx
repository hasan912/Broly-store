'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';

const categories = [
  { name: 'Core Architecture', id: 'core', image: '/Hero1.jpeg' },
  { name: 'Structural Beanies', id: 'beanies', image: '/Hero2.jpeg' },
];

export default function CategoriesSection() {
  const containerRef = useRef(null);

  // Create a scroll-based parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Different elements move at different speeds
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 150]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={containerRef} className="w-full py-32 md:py-48 bg-[#ffffff] border-b border-[#e8e8e8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-8 relative">

        {/* Background Typography */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0">
          <h2 className="text-[10vw] font-serif text-[#f3f3f3] leading-none whitespace-nowrap">
            SECTORS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 items-center relative z-10">

          {/* Category 1 - Moves Upwards */}
          <motion.div style={{ y: y1 }} className="flex flex-col items-center md:items-start">
            <Link href={`/products?category=${categories[0].id}`} className="group relative block w-full max-w-md aspect-[3/4]">
              <div className="absolute inset-0 bg-[#e8e8e8] -translate-x-4 translate-y-4 border border-[#000000] transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0" />
              <div className="relative w-full h-full overflow-hidden border border-[#000000] bg-[#ffffff]">
                <motion.div style={{ scale: scaleImage }} className="w-full h-full origin-center">
                  <Image
                    src={categories[0].image}
                    alt={categories[0].name}
                    fill
                    className="object-cover mix-blend-multiply grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </motion.div>
              </div>

              {/* Floating Label */}
              <div className="absolute -bottom-6 -right-6 bg-[#000000] text-[#ffffff] px-6 py-4 z-20 group-hover:-translate-y-2 transition-transform duration-500">
                <h3 className="text-xl font-serif">{categories[0].name}</h3>
                <div className="text-[9px] font-mono tracking-widest uppercase mt-1 opacity-70">Access Matrix</div>
              </div>
            </Link>
          </motion.div>

          {/* Category 2 - Moves Downwards (Offset) */}
          <motion.div style={{ y: y2 }} className="flex flex-col items-center md:items-end mt-16 md:mt-32">
            <Link href={`/products?category=${categories[1].id}`} className="group relative block w-full max-w-sm aspect-square">
              {/* Shadow Box */}
              <div className="absolute inset-0 bg-[#e8e8e8] translate-x-4 -translate-y-4 border border-[#000000] transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0" />
              <div className="relative w-full h-full overflow-hidden border border-[#000000] bg-[#ffffff]">
                <motion.div style={{ scale: scaleImage }} className="w-full h-full origin-center">
                  <Image
                    src={categories[1].image}
                    alt={categories[1].name}
                    fill
                    className="object-cover mix-blend-multiply grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </motion.div>
              </div>

              {/* Floating Label */}
              <div className="absolute top-12 -left-8 bg-[#ffffff] border border-[#000000] text-[#000000] px-6 py-4 z-20 group-hover:translate-x-2 transition-transform duration-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xl font-serif">{categories[1].name}</h3>
                <div className="text-[9px] font-mono tracking-widest uppercase mt-1 text-[#5e5e5e]">Access Matrix</div>
              </div>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
