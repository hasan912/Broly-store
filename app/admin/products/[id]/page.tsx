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

  const handleSubmit = async (data: ProductFormData, imageFile?: File) => {
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
          image: product?.image || '',
        },
        imageFile
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
      <div className="p-8 flex items-center justify-center h-full">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link
        href="/admin/products"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Products
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Product</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        <AdminProductForm
          product={product}
          onSubmit={handleSubmit}
          loading={saving}
        />
      </div>
    </div>
  );
}
