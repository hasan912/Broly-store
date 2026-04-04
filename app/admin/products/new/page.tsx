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

  const handleSubmit = async (data: ProductFormData, imageFile?: File) => {
    setLoading(true);
    try {
      await createProduct(
        {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          stock: data.stock,
          image: '',
        },
        imageFile
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
    <div className="p-8">
      <Link
        href="/admin/products"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Products
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        <AdminProductForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
