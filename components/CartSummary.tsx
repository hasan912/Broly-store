'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CheckCircle, Truck, Lock, ArrowRight } from 'lucide-react';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

export default function CartSummary({ showCheckoutButton = true }: CartSummaryProps) {
  const { items, total } = useCart();
  const shippingCost = total > 0 ? (total > 100 ? 0 : 10) : 0;
  const finalTotal = total + shippingCost;

  return (
    <div className="rounded-2xl glass shadow-elevated sticky top-24 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <h2 className="text-xl font-bold text-foreground">Order Summary</h2>
      </div>

      {/* Summary Details */}
      <div className="p-6 space-y-4 border-b border-white/20">
        <div className="flex justify-between text-sm">
          <span className="text-foreground/70">Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
          <span className="font-semibold text-foreground">${total.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-foreground/70">Shipping</span>
            <Truck className="w-3 h-3 text-indigo-600" />
          </div>
          <div className="text-right">
            {shippingCost === 0 ? (
              <span className="text-green-600 font-semibold flex items-center gap-1 justify-end">
                <CheckCircle className="w-3 h-3" />
                FREE
              </span>
            ) : (
              <span className="font-semibold text-foreground">${shippingCost.toFixed(2)}</span>
            )}
          </div>
        </div>

        {shippingCost > 0 && (
          <p className="text-xs text-green-600 font-medium">
            Free shipping available on orders over $100
          </p>
        )}
      </div>

      {/* Total */}
      <div className="p-6 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-b border-white/20">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-foreground">Total Amount</span>
          <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
            ${finalTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="p-6 space-y-3">
        {showCheckoutButton && (
          <Link
            href="/checkout"
            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-elevated transition-all duration-300 hover:scale-105 active:scale-98"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5" />
          </Link>
        )}

        <Link
          href="/products"
          className="w-full px-6 py-4 rounded-xl border-2 border-foreground/20 text-foreground font-semibold flex items-center justify-center gap-2 hover:bg-foreground/5 transition-all duration-300 depth-1"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Security Badge */}
      <div className="px-6 py-4 bg-white/30 dark:bg-slate-800/30 border-t border-white/20 flex items-center justify-center gap-2 text-xs text-foreground/70">
        <Lock className="w-3 h-3" />
        <span>Secure & Encrypted Checkout</span>
      </div>
    </div>
  );
}
