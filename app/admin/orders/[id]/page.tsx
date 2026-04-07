'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { updateOrderStatus } from '@/lib/admin-orders';
import { Order, Product } from '@/lib/types';
import { getProductById } from '@/lib/products';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<{ [key: string]: Product }>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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

  const handleStatusChange = async (newStatus: Order['status']) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrder(
        order
          ? {
              ...order,
              status: newStatus,
            }
          : null
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <p className="text-gray-600">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  const shippingCost = order.total > 100 ? 0 : 10;
  const finalTotal = order.total + shippingCost;

  const statusOptions: Order['status'][] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="p-8">
      <Link
        href="/admin/orders"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Orders
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
        <p className="text-gray-600">Order ID: {order.id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Name:</span>{' '}
                {order.shippingAddress.fullName}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{' '}
                {order.shippingAddress.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{' '}
                {order.shippingAddress.phone}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{' '}
                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} {order.shippingAddress.zipCode},{' '}
                {order.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => {
                const product = products[item.productId];
                if (!product) return null;

                return (
                  <div key={item.productId} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grow">
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Timeline</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <span className="font-semibold">Created:</span>{' '}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Last Updated:</span>{' '}
                {new Date(order.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Status Update */}
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Status</h2>

            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Current Status</p>
              <p className="text-xl font-bold text-gray-900 capitalize">{order.status}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Update Status
              </label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
                disabled={updating}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status} className="capitalize">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Order Total */}
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Shipping {shippingCost === 0 && <span className="text-green-600">(FREE)</span>}
                  </span>
                  <span className="font-semibold text-gray-900">
                    ${shippingCost.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-blue-600">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
