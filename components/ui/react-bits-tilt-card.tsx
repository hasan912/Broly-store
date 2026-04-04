'use client';

import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ReactBitsTiltCardProps {
  children: ReactNode;
  className?: string;
}

export function ReactBitsTiltCard({ children, className }: ReactBitsTiltCardProps) {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 14;
    const rotateX = ((y / rect.height) - 0.5) * -14;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const resetTransform = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTransform}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ transform, transformStyle: 'preserve-3d' }}
      className={cn(
        'relative rounded-3xl border border-white/20 bg-white/70 p-6 shadow-elevated-lg backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/70',
        className
      )}
    >
      <div style={{ transform: 'translateZ(40px)' }}>{children}</div>
    </motion.div>
  );
}
