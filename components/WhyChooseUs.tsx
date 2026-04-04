'use client';

import { motion } from 'framer-motion';
import { Shield, Truck, Award, Headphones, Leaf, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Crafted from the finest materials for lasting comfort and durability.',
    bgColor: '#fef3c7',
    iconColor: '#d97706',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Complimentary delivery on all orders over $50. Fast and reliable.',
    bgColor: '#d1fae5',
    iconColor: '#059669',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: 'Your transactions are protected with bank-level security.',
    bgColor: '#e0e7ff',
    iconColor: '#4f46e5',
  },
  {
    icon: RefreshCw,
    title: '30-Day Returns',
    description: 'Not satisfied? Return within 30 days for a full refund.',
    bgColor: '#ffe4e6',
    iconColor: '#e11d48',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our friendly team is here to help you anytime you need.',
    bgColor: '#f3e8ff',
    iconColor: '#9333ea',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    description: 'Sustainable practices and materials for a better planet.',
    bgColor: '#ccfbf1',
    iconColor: '#0d9488',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full py-20 md:py-28" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
            Why Broly Caps?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#1c1917' }}>
            The Broly Difference
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#57534e' }}>
            We&apos;re committed to delivering excellence in every cap and every experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300" style={{ backgroundColor: '#ffffff', border: '2px solid #e7e5e4' }}>
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: feature.bgColor }}>
                  <feature.icon className="w-7 h-7" style={{ color: feature.iconColor }} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 transition-colors" style={{ color: '#1c1917' }}>
                  {feature.title}
                </h3>
                <p className="leading-relaxed" style={{ color: '#57534e' }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
