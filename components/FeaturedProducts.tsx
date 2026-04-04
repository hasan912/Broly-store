'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/products';
import { Product } from '@/lib/types';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getProducts();
        setProducts(allProducts.slice(0, 4));
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
            Featured Collection
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#1c1917' }}>
            Trending This Season
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: '#57534e' }}>
            Discover our most loved styles, handpicked for quality and design excellence.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/products/${product.id}`} className="block group">
                <div className="rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300" style={{ backgroundColor: '#ffffff', border: '2px solid #e7e5e4' }}>
                  
                  {/* Product Image */}
                  <div className="w-full h-64 flex items-center justify-center overflow-hidden relative" style={{ backgroundColor: '#f5f5f4' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Name */}
                    <h3 className="text-base font-semibold mb-1 line-clamp-1" style={{ color: '#1c1917' }}>
                      {product.name}
                    </h3>

                    {/* Category */}
                    <p className="text-xs mb-3 line-clamp-1" style={{ color: '#78716c' }}>
                      by {product.category}
                    </p>

                    {/* Price */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-lg font-bold" style={{ color: '#1c1917' }}>
                        ${product.price.toFixed(2)}
                      </p>
                      <button className="p-2 rounded-md transition-colors" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#ffffff' }}
          >
            View All Products
            <ShoppingBag className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
