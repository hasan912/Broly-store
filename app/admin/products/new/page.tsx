'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminProductForm from '@/components/AdminProductForm';
import { ProductFormData } from '@/lib/validation';
import { createProduct } from '@/lib/admin-products';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: ProductFormData, imageInputs?: Array<File | string>) => {
    setLoading(true);
    try {
      await createProduct(
        {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          stock: data.stock,
          sizes: data.sizes,
          sizeGuide: data.sizeGuide,
          image: '',
        },
        imageInputs
      );
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-12 lg:p-16 max-w-5xl mx-auto animate-fade-in-up">
      <div className="mb-16">
        <Link
          href="/admin/products"
          className="group inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-12 transition-all duration-500"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2 duration-500" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Return to Inventory</span>
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-1 px-3 py-1 bg-primary" />
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-primary uppercase">CURATE PIECE</h1>
        </div>
        <p className="text-sm font-medium text-muted-foreground tracking-wide max-w-xl">
          Complete the manifest below to introduce a new distinctive piece to your luxury collection.
        </p>
      </div>

      <div className="border border-border/40 p-8 md:p-12 lg:p-16 bg-white shadow-soft">
        <AdminProductForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
