'use client';

import { useEffect, useState } from 'react';
import { deleteOrder, getOrders } from '@/lib/admin-orders';
import { Order } from '@/lib/types';
import Link from 'next/link';
import { Eye, Clock, Trash2 } from 'lucide-react';

import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const getStatusStyle = (status: Order['status']) => {
    const styles: Record<Order['status'], string> = {
      pending: 'border-amber-200 text-amber-700 bg-amber-50/50',
      confirmed: 'border-blue-200 text-blue-700 bg-blue-50/50',
      shipped: 'border-purple-200 text-purple-700 bg-purple-50/50',
      delivered: 'border-primary text-primary bg-muted',
      cancelled: 'border-destructive/20 text-destructive bg-destructive/5',
    };
    return styles[status] || 'border-border text-muted-foreground';
  };

  async function handleDeleteOrder(orderId: string) {
    if (!confirm('Are you sure you want to delete this order?')) return;

    setDeletingId(orderId);
    try {
      await deleteOrder(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    } catch (error: any) {
      console.error('Error deleting order:', error);
      const code = error?.code || 'unknown-error';
      if (code === 'admin-auth-missing' || code === 'permission-denied') {
        alert(`Delete blocked (${code}). Please logout and login again as admin.`);
      } else {
        alert(`Failed to delete order (${code})`);
      }
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="p-8 md:p-16 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-[1px] bg-primary/20 relative overflow-hidden">
             <div className="absolute inset-0 bg-primary animate-slide-right" />
          </div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">Processing Manifests</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-1 px-3 py-1 bg-primary" />
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-primary uppercase">ORDERS</h1>
        </div>
        <p className="text-sm font-medium text-muted-foreground tracking-wide max-w-2xl">
          Monitor and fulfill client requests. Every order is a commitment to excellence and prompt delivery.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-32 text-center border border-dashed border-border/60">
          <p className="text-sm font-medium text-muted-foreground mb-4 tracking-widest uppercase">No orders recorded yet</p>
          <div className="flex items-center justify-center gap-2 text-primary opacity-50">
             <Clock className="w-4 h-4" />
             <span className="text-[10px] font-bold tracking-widest">AWAITING TRANSACTIONS</span>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/10">
                <th className="pb-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Order Reference</th>
                <th className="pb-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase px-4">Client Detail</th>
                <th className="pb-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase text-center px-4">Volume</th>
                <th className="pb-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase text-right px-4">Valuation</th>
                <th className="pb-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase px-4">Status</th>
                <th className="pb-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase text-right">Date</th>
                <th className="pb-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {orders.map((order) => (
                <tr key={order.id} className="group hover:bg-muted/30 transition-colors duration-500">
                  <td className="py-8 pr-4">
                    <span className="font-mono text-xs text-primary/60 group-hover:text-primary transition-colors">
                      {order.id.substring(0, 12).toUpperCase()}
                    </span>
                  </td>
                  <td className="py-8 px-4">
                    <div>
                      <p className="text-sm font-bold text-primary group-hover:translate-x-1 transition-transform duration-700">
                        {order.shippingAddress.fullName.toUpperCase()}
                      </p>
                      <p className="text-[10px] text-muted-foreground tracking-wider underline underline-offset-4 decoration-border/40">
                        {order.shippingAddress.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-8 px-4 text-center">
                    <span className="text-xs font-bold text-muted-foreground">
                      {order.items.length.toString().padStart(2, '0')} PCS
                    </span>
                  </td>
                  <td className="py-8 px-4 text-right">
                    <span className="text-lg font-serif tracking-tighter text-primary">
                      ${order.total.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-8 px-4 whitespace-nowrap">
                    <span
                      className={`px-4 py-1.5 border text-[10px] font-extrabold tracking-[0.1em] uppercase transition-all duration-700 ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-8 px-4 text-right">
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] font-bold text-primary">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                      </span>
                      <span className="text-[8px] font-bold text-muted-foreground tracking-tighter">REGISTRATION</span>
                    </div>
                  </td>
                  <td className="py-8 pl-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="group/btn inline-flex items-center gap-3 px-6 py-3 bg-white border border-border/40 text-primary hover:bg-primary hover:text-white transition-all duration-700 shadow-soft"
                      >
                        <span className="text-[10px] font-bold tracking-widest uppercase">Inspect</span>
                        <Eye className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                      </Link>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={deletingId === order.id}
                        className="p-3 border border-destructive/20 bg-white text-destructive hover:bg-destructive hover:text-white transition-all duration-500 shadow-soft disabled:opacity-50"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
