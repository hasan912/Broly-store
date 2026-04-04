'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema, ProductFormData } from '@/lib/validation';
import { Product } from '@/lib/types';
import { Upload } from 'lucide-react';

interface AdminProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData, imageFile?: File) => Promise<void>;
  loading?: boolean;
}

export default function AdminProductForm({
  product,
  onSubmit,
  loading = false,
}: AdminProductFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.image || '');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      category: product?.category || '',
      stock: product?.stock || 0,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    setError('');
    try {
      await onSubmit(data, imageFile || undefined);
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Product Image (Base64 Encoded)
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Images are stored as base64 in the database. No Firebase Storage needed!
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
          {imagePreview && (
            <div className="mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          <label className="cursor-pointer">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Upload className="w-5 h-5" />
              <span>Click to upload or drag and drop</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Product Name
        </label>
        <input
          {...register('name')}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Enter product name"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Enter product description"
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Price and Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Price ($)
          </label>
          <input
            {...register('price', { valueAsNumber: true })}
            type="number"
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Stock Quantity
          </label>
          <input
            {...register('stock', { valueAsNumber: true })}
            type="number"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="0"
          />
          {errors.stock && (
            <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Category
        </label>
        <input
          {...register('category')}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Enter category"
        />
        {errors.category && (
          <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading
          ? 'Saving...'
          : product
          ? 'Update Product'
          : 'Create Product'}
      </button>
    </form>
  );
}
