'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCategories, getProducts } from '@/lib/products';

interface Category {
  name: string;
  image: string;
  bgColor: string;
  count: number;
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bgColors = [
    '#eef2ff', // indigo-50
    '#fffbeb', // amber-50
    '#ecfdf5', // emerald-50
    '#fff1f2', // rose-50
    '#eff6ff', // blue-50
    '#faf5ff', // purple-50
    '#f0fdfa', // teal-50
    '#fdf2f8'  // pink-50
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryNames = await getCategories();
        const allProducts = await getProducts();

        const categoriesData: Category[] = categoryNames.map((categoryName, index) => {
          const productCount = allProducts.filter((p) => p.category === categoryName).length;
          const product = allProducts.find((p) => p.category === categoryName);

          return {
            name: categoryName,
            image: product?.image || '/ai-caps/cap-01.svg',
            bgColor: bgColors[index % bgColors.length] || '#ffffff',
            count: productCount,
          };
        });

        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error || (categories.length === 0 && !loading)) {
    return null;
  }
  return (
    <section className="w-full py-20 md:py-28" style={{ backgroundColor: '#ffffff' }}>
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
            Shop by Category
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#1c1917' }}>
            Find Your Perfect Fit
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#57534e' }}>
            Browse through our carefully curated categories and discover the cap that matches your vibe.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/products?category=${category.name}`} className="block group">
                <div className="rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300" style={{ backgroundColor: category.bgColor, border: '2px solid #e7e5e4' }}>
                  
                  {/* Cap Image */}
                  <div className="w-full h-64 flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(to bottom, #fafaf9, #f5f5f4)' }}>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Category Info */}
                  <div className="p-6" style={{ backgroundColor: '#ffffff' }}>
                    <h3 className="text-xl font-bold mb-3 transition-colors" style={{ color: '#1c1917' }}>
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: '#f5f5f4', color: '#57534e' }}>
                        {category.count} {category.count === 1 ? 'item' : 'items'}
                      </span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
