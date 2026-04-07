'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Order, Product } from '@/lib/types';
import { getProductById } from '@/lib/products';
import Link from 'next/link';
import { Check } from 'lucide-react';
import Image from 'next/image';

function toSafeDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return new Date(value);
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate();
  }

  return new Date();
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<{ [key: string]: Product }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
        if (orderDoc.exists()) {
          const orderData = orderDoc.data() as Order;
          setOrder({ ...orderData, id: orderId });

          // Load product details
          const productMap: { [key: string]: Product } = {};
          for (const item of orderData.items) {
            const product = await getProductById(item.productId);
            if (product) {
              productMap[item.productId] = product;
            }
          }
          setProducts(productMap);
        }
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border border-[#000000] border-t-transparent animate-spin rounded-none mb-8" />
        <div className="text-[10px] font-mono tracking-widest uppercase text-[#474747]">Fetching Transaction Data...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif text-[#000000] mb-4">Transaction Nullified</h1>
        <Link href="/" className="text-[10px] font-mono tracking-widest uppercase text-[#5e5e5e] hover:text-[#000000] transition-colors border-b border-[#e8e8e8] hover:border-[#000000]">
          Return to Architecture
        </Link>
      </div>
    );
  }

  const shippingCost = order.total > 100 ? 0 : 10;
  const finalTotal = order.total + shippingCost;
  const orderDateTime = toSafeDate(order.createdAt);
  const estimatedDeliveryDate = new Date(orderDateTime);
  estimatedDeliveryDate.setDate(orderDateTime.getDate() + 2);

  return (
    <div className="bg-[#f9f9f9] min-h-screen py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-16 border-b border-[#e8e8e8] pb-16">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-[#ffffff] border border-[#e8e8e8] flex items-center justify-center shadow-sm">
              <Check className="w-6 h-6 text-[#000000]" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#000000] mb-6">Acquisition Confirmed.</h1>
          <p className="text-sm font-sans text-[#474747] mb-8">
            Transaction successful. Elements are being prepared for dispatch.
          </p>
          
          <div className="inline-block bg-[#ffffff] border border-[#e8e8e8] p-6 text-left shadow-sm">
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#5e5e5e] mb-2">
              Transaction ID: <span className="font-semibold text-[#000000]">{order.id}</span>
            </p>
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#5e5e5e] mb-2">
              Processing Time: <span className="font-semibold text-[#000000]">{orderDateTime.toLocaleDateString()} / {orderDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </p>
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#000000] font-semibold border-t border-[#e8e8e8] pt-2 mt-2">
              Expected Arrival: {estimatedDeliveryDate.toLocaleDateString()} (02 DAYS)
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-[#ffffff] border border-[#e8e8e8] shadow-sm p-8 md:p-12 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-[#e8e8e8] pb-12 mb-12">
            {/* Shipping Address */}
            <div>
              <h2 className="text-sm font-serif text-[#000000] uppercase tracking-wide mb-6">Logistics Target</h2>
              <div className="text-[#474747] space-y-2 font-sans text-sm">
                <p className="font-semibold text-[#000000]">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <div className="pt-4 mt-4 border-t border-[#f3f3f3] text-[10px] font-mono tracking-widest uppercase">
                  <p className="mb-1"><span className="text-[#000000] font-semibold">Comm:</span> {order.shippingAddress.email}</p>
                  <p><span className="text-[#000000] font-semibold">Freq:</span> {order.shippingAddress.phone}</p>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div>
              <h2 className="text-sm font-serif text-[#000000] uppercase tracking-wide mb-6">Status Signature</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-mono tracking-widest uppercase text-[#5e5e5e] mb-1">State</p>
                  <p className="font-sans text-sm font-semibold text-[#000000] uppercase">
                    <span className="inline-block px-3 py-1 bg-[#f3f3f3] border border-[#e8e8e8]">
                      {order.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-mono tracking-widest uppercase text-[#5e5e5e] mb-1">Authorization</p>
                  <p className="font-sans text-sm text-[#000000]">
                    Verified
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-12">
            <h2 className="text-sm font-serif text-[#000000] uppercase tracking-wide mb-8">Acquired Elements</h2>
            <div className="space-y-6">
              {order.items.map((item) => {
                const product = products[item.productId];
                if (!product) return null;

                return (
                  <div key={item.productId} className="flex gap-6 pb-6 border-b border-[#e8e8e8] last:border-b-0 last:pb-0">
                    <div className="w-24 h-24 bg-[#f3f3f3] border border-[#e8e8e8] flex-shrink-0 flex items-center justify-center p-2">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>
                    <div className="grow flex flex-col justify-between py-2">
                      <div>
                        <p className="font-serif text-lg text-[#000000]">{product.name}</p>
                        <p className="text-[10px] font-mono tracking-widest uppercase text-[#5e5e5e] mt-1">VOL: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between py-2">
                      <p className="font-mono text-lg text-[#000000]">
                        ${(product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-[10px] font-mono tracking-widest uppercase text-[#5e5e5e]">
                        ${product.price.toFixed(2)} / EA
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Total */}
          <div className="bg-[#f9f9f9] border border-[#e8e8e8] p-8">
            <div className="space-y-4 mb-6 pb-6 border-b border-[#e8e8e8]">
              <div className="flex justify-between text-[10px] font-mono tracking-widest uppercase">
                <span className="text-[#5e5e5e]">Subtotal</span>
                <span className="text-[#000000]">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono tracking-widest uppercase">
                <span className="text-[#5e5e5e]">
                  Logistics {shippingCost === 0 && <span className="text-[#000000] font-semibold">(COMPLIMENTARY)</span>}
                </span>
                <span className="text-[#000000]">${shippingCost.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase">
              <span className="font-semibold text-[#000000]">Final Amount</span>
              <span className="text-3xl font-mono text-[#000000]">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-[#f3f3f3] border border-[#e8e8e8] p-8 mb-12 shadow-sm">
          <h2 className="text-sm font-serif text-[#000000] uppercase tracking-wide mb-6">Continuation Protocol</h2>
          <ol className="space-y-4 list-decimal list-inside text-[#474747] font-sans text-sm">
            <li>Electronic receipt dispatched to designated comms channel.</li>
            <li>Elements currently undergoing staging and preparation.</li>
            <li>Physical package arrival scheduled within a 48 hour orbital window.</li>
            <li>Real-time telemetry link provided upon dispatch.</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-block bg-[#000000] text-[#ffffff] px-8 py-4 text-[10px] font-mono tracking-widest uppercase hover:bg-[#5e5e5e] transition-colors shadow-sm"
          >
            Access Archives
          </Link>
        </div>
      </div>
    </div>
  );
}
