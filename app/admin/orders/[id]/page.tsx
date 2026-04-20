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
import { ChevronLeft, Info, Package, Truck, CreditCard } from 'lucide-react';

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
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 md:p-16 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-[1px] bg-primary/20 relative overflow-hidden">
             <div className="absolute inset-0 bg-primary animate-slide-right" />
          </div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">Decrypting Order Data</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 md:p-16 text-center">
        <p className="text-sm font-bold tracking-widest text-destructive uppercase mb-8">Order reference not found.</p>
        <Link href="/admin/orders" className="text-xs font-bold text-primary underline underline-offset-8 uppercase">RETURN TO MANIFEST</Link>
      </div>
    );
  }

  const shippingCost = order.total > 100 ? 0 : 10;
  const finalTotal = order.total + shippingCost;
  const statusOptions: Order['status'][] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto animate-fade-in-up">
      <div className="mb-16">
        <Link
          href="/admin/orders"
          className="group inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-12 transition-all duration-500"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2 duration-500" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Return to Manifest</span>
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
           <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-1 px-3 py-1 bg-primary" />
                <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-primary uppercase">INSPECT ORDER</h1>
              </div>
              <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">REFERENCE ID: {order.id.toUpperCase()}</p>
           </div>
           <div className="px-6 py-3 bg-muted border border-border/40">
              <span className="text-[10px] font-bold tracking-widest text-primary uppercase">STATUS: {order.status}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Client Information */}
          <section className="p-10 border border-border/40 bg-white shadow-soft">
            <div className="flex items-center gap-4 mb-8">
               <Info className="w-4 h-4 text-primary" />
               <h2 className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">CLIENT IDENTITY</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div>
                  <label className="block text-[8px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase mb-2">FULL NAME</label>
                  <p className="text-lg font-serif text-primary tracking-tight">{order.shippingAddress.fullName}</p>
               </div>
               <div>
                  <label className="block text-[8px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase mb-2">EMAIL ADDRESS</label>
                  <p className="text-sm font-bold tracking-tight text-primary underline underline-offset-4 decoration-border/40">{order.shippingAddress.email}</p>
               </div>
               <div>
                  <label className="block text-[8px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase mb-2">CONTACT NUMBER</label>
                  <p className="text-sm font-bold tracking-tight text-primary">{order.shippingAddress.phone}</p>
               </div>
               <div>
                  <label className="block text-[8px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase mb-2">SHIPPING DESTINATION</label>
                  <p className="text-sm font-bold tracking-tight text-primary leading-relaxed">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.country.toUpperCase()}
                  </p>
               </div>
            </div>
          </section>

          {/* Consignment Items */}
          <section className="p-10 border border-border/40 bg-white shadow-soft">
            <div className="flex items-center gap-4 mb-8">
               <Package className="w-4 h-4 text-primary" />
               <h2 className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">CONSIGNMENT COMPOSITION</h2>
            </div>
            <div className="divide-y divide-border/20">
              {order.items.map((item) => {
                const product = products[item.productId];
                if (!product) return null;

                return (
                  <div key={item.productId} className="py-8 first:pt-0 last:pb-0 flex items-center gap-8 group">
                    <div className="w-24 h-32 bg-muted relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-serif tracking-tight text-primary mb-1">{product.name}</p>
                      <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">QUANTITY: {item.quantity.toString().padStart(2, '0')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold tracking-widest text-muted-foreground mb-1 uppercase">UNIT PRICE</p>
                      <p className="text-2xl font-serif tracking-tighter text-primary">
                        ${(product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Chronology */}
          <section className="p-10 border border-border/40 bg-white shadow-soft">
             <div className="flex items-center gap-4 mb-6">
                <Truck className="w-4 h-4 text-primary" />
                <h2 className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">CHRONOLOGY</h2>
             </div>
             <div className="flex gap-12">
                <div>
                   <label className="block text-[8px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase mb-2">REGISTRATION DATE</label>
                   <p className="text-xs font-bold tracking-widest text-primary">{new Date(order.createdAt).toLocaleString().toUpperCase()}</p>
                </div>
                <div>
                   <label className="block text-[8px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase mb-2">LAST SYNCHRONISATION</label>
                   <p className="text-xs font-bold tracking-widest text-primary">{new Date(order.updatedAt).toLocaleString().toUpperCase()}</p>
                </div>
             </div>
          </section>
        </div>

        {/* Control Panel */}
        <div className="space-y-8">
          <section className="p-10 border border-border/40 bg-white shadow-soft sticky top-10">
            <h2 className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-8">CONTROL INTERFACE</h2>

            <div className="mb-10 p-6 bg-primary text-white">
              <p className="text-[9px] font-bold tracking-widest opacity-60 mb-2 uppercase">CURRENT CLASSIFICATION</p>
              <p className="text-xl font-serif tracking-tight uppercase">{order.status}</p>
            </div>

            <div className="mb-12">
              <label className="block text-[9px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-4">
                MODIFY STATE
              </label>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updating || order.status === status}
                    className={`w-full px-6 py-4 text-[10px] font-bold tracking-widest border text-left transition-all duration-500 uppercase ${
                      order.status === status
                        ? 'bg-primary text-white border-primary cursor-default'
                        : 'bg-transparent text-primary border-border/60 hover:bg-muted disabled:opacity-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-border/40">
              <div className="flex items-center gap-3 mb-6">
                 <CreditCard className="w-4 h-4 text-primary" />
                 <h3 className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">VALUATION SUMMARY</h3>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-[10px] font-bold tracking-widest">
                  <span className="text-muted-foreground uppercase">SUBTOTAL</span>
                  <span className="text-primary">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold tracking-widest">
                  <span className="text-muted-foreground uppercase">LOGISTICS</span>
                  <span className="text-primary">${shippingCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-6 border-t border-border/60">
                <span className="text-[10px] font-extrabold tracking-[0.3em] text-primary uppercase">GRAND TOTAL</span>
                <span className="text-3xl font-serif tracking-tighter text-primary">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
