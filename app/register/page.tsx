'use client';

import { Suspense } from 'react';
import RegisterForm from '@/components/RegisterForm';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; 
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[rgba(26,28,28,0.02)] rounded-none blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[rgba(26,28,28,0.01)] rounded-none blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full"
      >
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-12 h-12 flex items-center justify-center"
            >
              <Image src="/logo.PNG" alt="Logo" width={48} height={48} className="mix-blend-multiply opacity-90" />
            </motion.div>
            <span className="text-2xl font-serif text-[#1a1c1c] tracking-widest">
              ATELIER MONOLITH
            </span>
          </Link>
          <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-[#474747]">Initialize new client profile.</p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center">
            <div className="w-12 h-12 border border-[#000000] border-t-transparent animate-spin rounded-none" />
          </div>
        }>
          <RegisterForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
