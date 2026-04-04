'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Order, Product } from '@/lib/types';
import { getProductById } from '@/lib/products';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = order.total > 100 ? 0 : 10;
  const finalTotal = order.total + shippingCost;
  const orderDateTime = toSafeDate(order.createdAt);
  const estimatedDeliveryDate = new Date(orderDateTime);
  estimatedDeliveryDate.setDate(orderDateTime.getDate() + 2);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your order has been placed</h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          <p className="text-gray-600">
            Order Number: <span className="font-bold text-gray-900">{order.id}</span>
          </p>
          <p className="text-gray-600 mt-2">
            Ordered on: <span className="font-semibold text-gray-900">{orderDateTime.toLocaleDateString()}</span>
            {' '}at{' '}
            <span className="font-semibold text-gray-900">{orderDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </p>
          <p className="text-green-700 mt-2 font-medium">
            Expected delivery by: {estimatedDeliveryDate.toLocaleDateString()} (within 2 days)
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
            {/* Shipping Address */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-gray-700 space-y-1">
                <p className="font-semibold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-3 text-sm">
                  <span className="font-semibold">Email:</span> {order.shippingAddress.email}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Phone:</span> {order.shippingAddress.phone}
                </p>
              </div>
            </div>

            {/* Order Status */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Status</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                      {order.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold text-gray-900">
                    {orderDateTime.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Time</p>
                  <p className="font-semibold text-gray-900">
                    {orderDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-semibold text-green-700">
                    {estimatedDeliveryDate.toLocaleDateString()} (within 2 days)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => {
                const product = products[item.productId];
                if (!product) return null;

                return (
                  <div key={item.productId} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">${product.price.toFixed(2)} each</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Total */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Shipping {shippingCost === 0 && <span className="text-green-600">(FREE)</span>}
                </span>
                <span className="font-semibold text-gray-900">${shippingCost.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">What&apos;s Next?</h2>
          <ol className="space-y-3 list-decimal list-inside text-gray-700">
            <li>You&apos;ll receive an email confirmation shortly</li>
            <li>Your order is being prepared for dispatch now</li>
            <li>Your parcel is expected to arrive within 2 days</li>
            <li>You&apos;ll receive shipping updates once it is dispatched</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="max-w-sm mx-auto">
          <Link
            href="/products"
            className="block text-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
