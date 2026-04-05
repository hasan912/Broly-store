'use client';

import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';
import { motion } from 'framer-motion';
import { Import, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
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
              className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft"
            >
              <Image src="/logo.png" alt="Logo" width={48} height={48} />
            </motion.div>
            <span className="text-2xl font-bold text-gradient-primary">
              Broly Store
            </span>
          </Link>
          <p className="mt-3 text-muted-foreground">Welcome back! Sign in to your account</p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
