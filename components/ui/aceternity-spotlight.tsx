'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpotlightProps {
  className?: string;
  colorClassName?: string;
}

export function AceternitySpotlight({ className, colorClassName }: SpotlightProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <div
        className={cn(
          'absolute left-1/2 top-[-30%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-3xl',
          colorClassName ?? 'bg-blue-500/25'
        )}
      />
      <div className="absolute right-[-8rem] top-[25%] h-[18rem] w-[18rem] rounded-full bg-sky-400/20 blur-3xl" />
      <div className="absolute left-[-8rem] bottom-[10%] h-[20rem] w-[20rem] rounded-full bg-green-500/20 blur-3xl" />
    </motion.div>
  );
}
