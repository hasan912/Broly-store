'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function PromoBanner() {
  return (
    <section className="relative w-full py-24 md:py-32 bg-[#000000] overflow-hidden">

      {/* Massive Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/Hero1.jpeg"
          fill
          alt="Promo Texture"
          className="object-cover opacity-40 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block border border-white/30 px-6 py-2 mb-8 text-white text-xs tracking-widest uppercase bg-white/5 backdrop-blur-md">
            VIP Limited Protocol
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-[6rem] font-black font-serif text-white uppercase tracking-tighter leading-none mb-8 drop-shadow-2xl"
        >
          Unlock 20% <br className="hidden md:block" /> Privileges.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 font-sans max-w-2xl mx-auto mb-12 shadow-black drop-shadow-lg"
        >
          Secure your priority access to the global street-archive. Initializing your client profile grants immediate commercial clearance on limited series drops.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            href="/register"
            className="group relative overflow-hidden bg-white text-black px-12 py-5 font-bold uppercase tracking-widest text-sm inline-flex items-center gap-4 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
          >
            <span className="relative z-10">Access The Vault</span>
            <div className="absolute inset-0 w-0 bg-gray-200 transition-all duration-500 ease-out group-hover:w-full" />
          </Link>
        </motion.div>
      </div>

    </section>
  );
}
