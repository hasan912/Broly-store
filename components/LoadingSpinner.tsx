'use client';

import React, { useEffect, useState } from 'react';

/**
 * LoadingSpinner component reimagined as a premium "Atelier Monolith" loader.
 * Features architectural minimalism, high-contrast typography, and smooth transitions.
 */
export default function LoadingSpinner() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        // Simulate architectural loading with varying speeds
        const increment = Math.random() * 15;
        return Math.min(prev + increment, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#ffffff] transition-all duration-1000 ease-in-out">
      {/* Background architectural grid - very subtle */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
             backgroundSize: '100px 100px'
           }} 
      />

      <div className="relative w-full max-w-sm px-10 text-center">
        {/* Top Decorative Line */}
        <div className="mx-auto w-px h-12 bg-[#000000] mb-8 animate-pulse" />

        {/* Brand/Identity */}
        <div className="mb-12 overflow-hidden">
          <h2 className="text-2xl md:text-3xl font-serif tracking-[-0.05em] text-[#000000] animate-reveal-up border-b border-[#000000]/10 pb-4">
            BROLY STORE
          </h2>
          <div className="flex items-center justify-between mt-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#5e5e5e] uppercase">
              Initialising...
            </span>
            <span className="text-[10px] font-mono text-[#000000]">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* High-End Progress Bar */}
        <div className="relative w-full h-[2px] bg-[#e8e8e8] overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[#000000] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Bottom Metadata */}
        <div className="mt-12 opacity-40">
          <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-[#1a1c1c]">
            Atelier Monolith / V2.0
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes reveal-up {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-reveal-up {
          animation: reveal-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
