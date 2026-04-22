'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/types';
import { getProductById } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingCart, Plus, Minus, ArrowRight, ChevronLeft } from 'lucide-react';
import CartSummary from '@/components/CartSummary';
import EmptyState from '@/components/EmptyState';
import { motion } from 'framer-motion';

export default function CartPage() {
  const { items, removeFromCart, updateCartItem } = useCart();
  const [products, setProducts] = useState<{ [key: string]: Product }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const productMap: { [key: string]: Product } = {};
        for (const item of items) {
          if (!productMap[item.productId]) {
            const product = await getProductById(item.productId);
            if (product) {
              productMap[item.productId] = product;
            }
          }
        }
        setProducts(productMap);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }

    if (items.length > 0) {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [items]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-none border border-t-[#000000] border-r-transparent border-b-transparent border-l-transparent animate-spin mx-auto mb-6" />
          <p className="text-[#474747] font-mono text-[10px] tracking-widest uppercase">Processing Data...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#f9f9f9]">
        <EmptyState
          title="Empty Cart"
          description="You have not initiated any acquisitions. Your space is currently void."
          actionLabel="Access Archives"
          actionHref="/products"
          icon={<ShoppingCart className="w-10 h-10 text-[#474747]" />}
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f9f9f9] text-[#474747] pb-24"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#5e5e5e] hover:text-[#000000] transition-colors duration-500 mb-8 group"
          >
            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform duration-500" />
            Return to Archives
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#000000]" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#000000]">
              Checkout Flow
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-[#000000] mb-4">
            Pending <span className="italic font-light text-[#5e5e5e]">Acquisitions.</span>
          </h1>
          <p className="text-sm border-l border-[#c6c6c6] pl-4 py-1 text-[#474747] leading-relaxed max-w-lg mt-6">
            Review your selected elements before finalizing the transaction signature.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="p-2 border border-[#e8e8e8] bg-[#ffffff] rounded-none shadow-sm relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#f9f9f9] blur-2xl pointer-events-none rounded-none" />
              {items.map((item, index) => {
                const product = products[item.productId];
                if (!product) return null;

                return (
                  <div
                    key={item.productId}
                    className={`flex flex-col sm:flex-row gap-6 p-6 ${
                      index !== items.length - 1 ? 'border-b border-[#e8e8e8]' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <Link href={`/products/${product.id}`} className="group relative">
                      <div className="w-full sm:w-32 h-32 bg-[#f3f3f3] border border-[#e8e8e8] overflow-hidden flex-shrink-0 transition-all duration-700 cursor-pointer flex justify-center items-center">
                        {/* soft ambient light */}
                        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] -translate-x-1/2 -translate-y-1/2 blur-2xl bg-[rgba(26,28,28,0.02)] pointer-events-none rounded-none" />
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-[85%] h-[85%] object-cover mix-blend-multiply group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="grow flex flex-col justify-between pt-1">
                      <div>
                        <Link
                          href={`/products/${product.id}`}
                          className="text-lg font-serif tracking-wide text-[#000000] hover:text-[#5e5e5e] transition-colors duration-500"
                        >
                          {product.name}
                        </Link>
                        <p className="text-[#5e5e5e] text-[10px] font-mono tracking-widest uppercase mt-2">{product.category}</p>
                        {item.selectedSize && (
                          <p className="text-[#5e5e5e] text-[10px] font-mono tracking-widest uppercase mt-2">
                            Size: <span className="text-[#000000] font-bold">{item.selectedSize}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-6 mt-6">
                        {/* Quantity Control */}
                        <div className="flex items-center gap-1 p-0.5 border border-[#e8e8e8] rounded-none bg-[#f9f9f9]">
                          <button
                            onClick={() =>
                              updateCartItem(
                                item.productId,
                                Math.max(1, item.quantity - 1),
                                item.selectedSize
                              )
                            }
                            className="p-2 transition-colors duration-300 hover:text-[#000000]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={product.stock}
                            value={item.quantity}
                            onChange={(e) =>
                              updateCartItem(
                                item.productId,
                                Math.max(1, parseInt(e.target.value) || 1),
                                item.selectedSize
                              )
                            }
                            className="w-8 text-center text-xs font-mono tracking-widest bg-transparent text-[#000000] outline-none"
                          />
                          <button
                            onClick={() =>
                              updateCartItem(
                                item.productId,
                                Math.min(product.stock, item.quantity + 1),
                                item.selectedSize
                              )
                            }
                            className="p-2 transition-colors duration-300 hover:text-[#000000]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.productId, item.selectedSize)}
                          className="text-[#ba1a1a] hover:text-black transition-colors duration-500 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span className="hidden sm:inline pt-0.5">Scrap</span>
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0 flex flex-col justify-between pt-1">
                      <div className="text-lg font-mono text-[#000000] tracking-wide">
                        PKR {(product.price * item.quantity).toFixed(2)}
                      </div>
                      <p className="text-[10px] uppercase font-mono tracking-widest text-[#5e5e5e]">
                        PKR {product.price.toFixed(2)} / UNIT
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-1"
          >
            <CartSummary />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
