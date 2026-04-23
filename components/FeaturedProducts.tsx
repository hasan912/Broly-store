'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/products';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getProducts();
        setProducts(allProducts.slice(0, 8));
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (error || (products.length === 0 && !loading)) {
    return null;
  }

  return (
    <section className="w-full py-24 md:py-32 bg-[#ffffff] border-b border-[#e8e8e8]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-left mb-16 flex flex-col md:flex-row md:items-end justify-between border-b border-[#e8e8e8] pb-10"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-1 h-1 bg-[#000000]" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#5e5e5e]">
                01 — Curated Matrix
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#000000] leading-none tracking-tight">
              Featured Units
            </h2>
          </div>

          <Link
            href="/products"
            className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-widest font-mono text-[#000000] border border-[#e8e8e8] px-6 py-3 transition-colors hover:bg-[#f9f9f9] hover:border-[#000000] mt-8 md:mt-0"
          >
            <span>View Directory</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
