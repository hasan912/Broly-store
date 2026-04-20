'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Package, ShieldCheck, Zap } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Absolute Integrity',
    description: 'Every structural unit is mathematically analyzed to guarantee longevity and form preservation before deployment.'
  },
  {
    icon: Package,
    title: 'Zero-G Logistics',
    description: 'Proprietary packaging designed to suspend the product safely. Complimentary expedited orbital drops globally.'
  },
  {
    icon: Zap,
    title: 'Direct Linkage',
    description: 'Bypass standard customer service. Ownership connects you directly to our fabrication engineers for lifecycle support.'
  }
];

function Tilt3DCard({ feature, index }: { feature: any, index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = feature.icon;

  return (
    <div
      className="relative w-full aspect-square"
      style={{ perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="w-full h-full bg-[#ffffff] border border-[#e8e8e8] p-8 md:p-12 shadow-soft hover:shadow-elevated transition-shadow duration-500 cursor-default"
      >
        {/* Inner Content that 'pops' out in 3D */}
        <div style={{ transform: "translateZ(80px)", transformStyle: "preserve-3d" }} className="flex flex-col h-full pointer-events-none justify-between">
          <div className="w-16 h-16 bg-[#f4f4f4] rounded-full flex shrink-0 items-center justify-center mb-auto">
            <Icon className="w-6 h-6 text-[#000000]" strokeWidth={1} />
          </div>
          <div style={{ transform: "translateZ(40px)" }}>
            <h3 className="text-2xl font-serif text-[#000000] mb-4">
              {feature.title}
            </h3>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="w-full py-24 md:py-32 bg-background border-b border-[#e8e8e8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center flex flex-col items-center"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[#000000] tracking-tight mb-4">
            Engineered Advantages.
          </h2>
          <p className="text-sm font-sans text-muted-foreground max-w-xl">
            Every unit is supported by a robust infrastructure designed to eliminate friction and ensure perfection.
          </p>
        </motion.div>

        {/* 3D Tilt Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pl-px">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Tilt3DCard feature={feature} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
