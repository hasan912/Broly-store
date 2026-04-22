'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductById } from '@/lib/products';
import { updateProduct } from '@/lib/admin-products';
import AdminProductForm from '@/components/AdminProductForm';
import { ProductFormData } from '@/lib/validation';
import { Product } from '@/lib/types';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  const handleSubmit = async (data: ProductFormData, imageInputs?: Array<File | string>) => {
    setSaving(true);
    try {
      await updateProduct(
        productId,
        {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          stock: data.stock,
          sizes: data.sizes,
          sizeGuide: data.sizeGuide,
          images: product?.images,
          image: product?.image || '',
        },
        imageInputs
      );
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 md:p-16 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-px bg-primary/20 relative overflow-hidden">
             <div className="absolute inset-0 bg-primary animate-slide-right" />
          </div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">Accessing Repository</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 md:p-16 text-center">
        <p className="text-sm font-bold tracking-widest text-destructive uppercase mb-8">Product reference not found.</p>
        <Link href="/admin/products" className="text-xs font-bold text-primary underline underline-offset-8 uppercase">RETURN TO CATALOG</Link>
      </div>
    );
  }

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
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-primary uppercase">REFINE PIECE</h1>
        </div>
        <p className="text-sm font-medium text-muted-foreground tracking-wide max-w-xl">
          Modify the specifications and visual presence of the selected item in your luxury collection.
        </p>
      </div>

      <div className="border border-border/40 p-8 md:p-12 lg:p-16 bg-white shadow-soft">
        <AdminProductForm
          product={product}
          onSubmit={handleSubmit}
          loading={saving}
        />
      </div>
    </div>
  );
}
