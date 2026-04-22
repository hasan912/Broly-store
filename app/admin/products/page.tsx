'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/products';
import { deleteProduct } from '@/lib/admin-products';
import { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, ArrowUpRight, Search } from 'lucide-react';

import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
    } catch (error: any) {
      console.error('Error deleting product:', error);
      const code = error?.code || 'unknown-error';
      const message = error?.message || 'No additional details';

      let alertMessage = '';
      if (code === 'admin-auth-missing') {
        alertMessage = `Delete blocked.\n\nYour admin session has expired.\n\nPlease logout and login again.`;
      } else if (code === 'firebase-setup-required') {
        alertMessage = `Firebase Authentication Setup Required:\n\n${message}\n\nPlease ensure:\n1. A Firebase user exists\n2. Email/Password authentication is enabled in Firebase Console\n3. Restart the app after setup`;
      } else if (code === 'permission-denied') {
        alertMessage = `Delete blocked (permission-denied).\n\n${message}`;
      } else {
        alertMessage = `Failed to delete product.\n\n${message}`;
      }

      alert(alertMessage);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-1 px-3 py-1 bg-primary" />
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-primary uppercase">INVENTORY</h1>
          </div>
          <p className="text-sm font-medium text-muted-foreground tracking-wide">
            Curate and manage your luxury collection. Ensure each piece is presented with architectural precision.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="group flex items-center gap-4 bg-primary text-white px-8 py-5 transition-all duration-700 hover:bg-muted-foreground"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase">Add New Product</span>
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-500" />
        </Link>
      </div>

      {/* Search & Filter Bar (Minimalist) */}
      <div className="flex items-center gap-6 mb-12 pb-6 border-b border-border/40">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="SEARCH COLLECTION..." 
          className="bg-transparent border-none outline-none text-xs font-bold tracking-widest w-full placeholder:text-muted-foreground/50"
        />
      </div>

      {products.length === 0 ? (
        <div className="py-32 text-center border border-dashed border-border/60">
          <p className="text-sm font-medium text-muted-foreground mb-8 tracking-widest uppercase">The collection is currently empty</p>
          <Link
            href="/admin/products/new"
            className="text-xs font-bold text-primary underline underline-offset-8 tracking-widest hover:text-muted-foreground transition-colors"
          >
            CREATE FIRST MASTERPIECE
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/10">
                <th className="pb-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Product Details</th>
                <th className="pb-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Category</th>
                <th className="pb-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase text-center">Stock</th>
                <th className="pb-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase text-right">Price</th>
                <th className="pb-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {products.map((product) => (
                <tr key={product.id} className="group hover:bg-muted/30 transition-colors duration-500">
                  <td className="py-8 pr-6">
                    <div className="flex items-center gap-8">
                       <div className="w-20 h-24 bg-muted relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <p className="text-lg font-serif tracking-tight text-primary mb-1 group-hover:translate-x-1 transition-transform duration-700">{product.name}</p>
                        <p className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">UID: {product.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-8 px-4">
                    <span className="text-[10px] font-bold tracking-widest text-primary/70 uppercase px-3 py-1 bg-muted group-hover:bg-primary group-hover:text-white transition-all duration-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-8 px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-base font-bold ${product.stock > 0 ? 'text-primary' : 'text-destructive'}`}>
                        {product.stock.toString().padStart(2, '0')}
                      </span>
                      <span className="text-[8px] font-bold tracking-tighter text-muted-foreground uppercase">AVAILABLE</span>
                    </div>
                  </td>
                  <td className="py-8 px-4 text-right">
                    <span className="text-xl font-serif tracking-tighter text-primary">
                      PKR {product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-8 pl-6 text-right">
                    <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-3 border border-border/40 bg-white hover:bg-primary hover:text-white transition-all duration-500 shadow-soft"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="p-3 border border-destructive/20 bg-white text-destructive hover:bg-destructive hover:text-white transition-all duration-500 shadow-soft disabled:opacity-50"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/products/${product.id}`}
                        className="p-3 border border-border/40 bg-white text-primary hover:bg-muted transition-all duration-500 shadow-soft"
                        title="Preview in Store"
                        target="_blank"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
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
