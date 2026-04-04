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
import { Card3D } from '@/components/ui/card-3d';
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <EmptyState
          title="Your Cart is Empty"
          description="Start shopping and add some premium products to your cart."
          actionLabel="Continue Shopping"
          actionHref="/products"
          icon={<ShoppingCart className="w-16 h-16 text-foreground/20" />}
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-3 ">
            Shopping Cart
          </h1>
          <p className="text-lg text-muted-foreground">Review your items and proceed to checkout</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <Card3D depth="md" className="p-6 md:p-8 glass-subtle">
              {items.map((item, index) => {
                const product = products[item.productId];
                if (!product) return null;

                return (
                  <div
                    key={item.productId}
                    className={`flex flex-col sm:flex-row gap-6 py-6 ${
                      index !== items.length - 1 ? 'border-b border-foreground/10' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <Link href={`/products/${product.id}`} className="group">
                      <div className="w-full sm:w-28 h-28 bg-gradient-to-br from-background to-card rounded-xl overflow-hidden flex-shrink-0 shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${product.id}`}
                          className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {product.name}
                        </Link>
                        <p className="text-muted-foreground text-sm mt-1">{product.category}</p>
                      </div>

                      <div className="flex items-center gap-3 mt-4">
                        {/* Quantity Control */}
                        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-card border border-border shadow-soft">
                          <button
                            onClick={() =>
                              updateCartItem(
                                item.productId,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="p-1.5 rounded-md hover:bg-primary/10 hover:text-primary transition-all depth-interactive"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={product.stock}
                            value={item.quantity}
                            onChange={(e) =>
                              updateCartItem(
                                item.productId,
                                Math.max(1, parseInt(e.target.value) || 1)
                              )
                            }
                            className="w-12 text-center bg-transparent font-semibold text-foreground outline-none"
                          />
                          <button
                            onClick={() =>
                              updateCartItem(
                                item.productId,
                                Math.min(product.stock, item.quantity + 1)
                              )
                            }
                            className="p-1.5 rounded-md hover:bg-primary/10 hover:text-primary transition-all depth-interactive"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-500/10 transition-all depth-interactive flex items-center gap-2 text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0 flex flex-col justify-between">
                      <div className="text-2xl font-bold text-gradient-primary">
                        ${(product.price * item.quantity).toFixed(2)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ${product.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                );
              })}
            </Card3D>
          </motion.div>

          {/* Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <CartSummary />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
