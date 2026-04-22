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
    <div className="rounded-none border border-[#e8e8e8] bg-[#ffffff] sticky top-32 group hover:border-[#c6c6c6] transition-colors duration-500 overflow-hidden shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-8 border-b border-[#e8e8e8]">
        <h2 className="text-sm font-serif text-[#000000] tracking-wide uppercase">Financial Summary</h2>
      </div>

      {/* Summary Details */}
      <div className="p-8 space-y-6 border-b border-[#e8e8e8] text-xs font-mono tracking-widest text-[#474747] uppercase">
        <div className="flex justify-between items-center">
          <span className="text-[#474747]">Subtotal ({items.length} {items.length === 1 ? 'UNIT' : 'UNITS'})</span>
          <span className="text-[#000000]">PKR {total.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-[#474747]">Logistics</span>
            {shippingCost > 0 && <Truck className="w-3 h-3 text-[#1a1c1c]" />}
          </div>
          <div className="text-right">
            {shippingCost === 0 ? (
              <span className="text-green-600 flex items-center gap-2 justify-end">
                <CheckCircle className="w-3 h-3" />
                COMPLIMENTARY
              </span>
            ) : (
              <span className="text-[#000000]">PKR {shippingCost.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Variant Preview */}
      {items.length > 0 && (
        <div className="p-8 border-b border-[#e8e8e8] bg-[#ffffff] space-y-4">
          <p className="text-[10px] font-mono tracking-widest uppercase text-[#474747]">Selected Variants</p>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={`${item.productId}-${item.selectedSize || 'default'}-${index}`} className="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-[#1a1c1c]">
                <span>Unit {String(index + 1).padStart(2, '0')}</span>
                <span>
                  Size: <span className="text-[#000000] font-bold">{item.selectedSize || 'N/A'}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total */}
      <div className="p-8 border-b border-[#e8e8e8] bg-background">
        <div className="flex justify-between items-end">
          <span className="text-xs font-mono tracking-widest text-[#474747] uppercase">Final Amount</span>
          <span className="text-3xl font-mono text-[#000000]">
            PKR {finalTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="p-8 space-y-4">
        {showCheckoutButton && (
          <Link
            href="/checkout"
            className="group/btn relative w-full flex items-center justify-between px-6 py-4 border border-[#000000] bg-[#000000] text-[#ffffff] text-[10px] font-mono tracking-widest uppercase transition-all duration-700 hover:bg-transparent hover:text-[#000000]"
          >
            <span>Proceed to Signature</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-1" />
          </Link>
        )}

        <Link
          href="/products"
          className="w-full flex items-center justify-center px-6 py-4 border border-[#e8e8e8] text-muted-foreground text-[10px] font-mono tracking-widest uppercase transition-all duration-700 hover:border-[#000000] hover:text-[#000000]"
        >
          Resume Browsing
        </Link>
      </div>

      {/* Security Badge */}
      <div className="px-8 py-6 bg-[#f3f3f3] flex items-center justify-center gap-3 text-[10px] font-mono tracking-widest uppercase text-muted-foreground mt-auto">
        <Lock className="w-3 h-3 text-[#1a1c1c]" />
        <span>Hardware Encrypted Tunnel</span>
      </div>
    </div>
  );
}
