'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const images = [
  { src: '/Hero1.jpeg', alt: 'Model Cap 1', className: 'col-span-1 row-span-1 h-[300px]' },
  { src: '/Hero2.jpeg', alt: 'Model Cap 2', className: 'col-span-1 md:col-span-2 row-span-2 h-[300px] md:h-[624px]' },
  { src: '/Hero3.jpeg', alt: 'Model Cap 3', className: 'col-span-1 row-span-1 h-[300px]' },
  { src: '/Hero1.jpeg', alt: 'Model Cap 4', className: 'col-span-1 md:col-span-2 row-span-1 h-[300px]' },
  { src: '/Hero2.jpeg', alt: 'Model Cap 5', className: 'col-span-1 row-span-1 h-[300px]' },
];

export default function LookbookSection() {
  return (
    <section className="py-24 bg-[#f9f9f9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-serif font-black text-[#000000] uppercase tracking-tighter">
              Visual <span className="text-gray-400 italic">Lookbook</span>.
            </h2>
            <p className="text-gray-600 mt-4 max-w-lg font-sans text-sm md:text-base">
              Explore our products curated in natural urban environments. See how high-end construction maps to everyday expression.
            </p>
          </motion.div>
        </div>

        {/* Masonry-Style Grid to fill space heavily */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative overflow-hidden group w-full bg-gray-200 ${img.className}`}
            >
              <Image 
                src={img.src} 
                alt={img.alt} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
