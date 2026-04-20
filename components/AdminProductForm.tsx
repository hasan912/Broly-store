'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema, ProductFormData } from '@/lib/validation';
import { Product } from '@/lib/types';
import { getCategories, createCategory, deleteCategory } from '@/lib/admin-products';
import { Upload, Plus, Trash2 } from 'lucide-react';

interface AdminProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData, imageInputs?: Array<File | string>) => Promise<void>;
  loading?: boolean;
}

function buildInitialImageSlots(product?: Product): Array<File | string | null> {
  const existingImages =
    product?.images && product.images.length > 0
      ? product.images.slice(0, 4)
      : product?.image
      ? [product.image]
      : [];

  const slots: Array<File | string | null> = [null, null, null, null];
  existingImages.forEach((image, index) => {
    slots[index] = image;
  });

  return slots;
}

export default function AdminProductForm({
  product,
  onSubmit,
  loading = false,
}: AdminProductFormProps) {
  const [imageSlots, setImageSlots] = useState<Array<File | string | null>>(() =>
    buildInitialImageSlots(product)
  );
  const [imagePreviews, setImagePreviews] = useState<string[]>(() =>
    buildInitialImageSlots(product).map((image) => (typeof image === 'string' ? image : ''))
  );
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(product?.category || '');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryActionLoading, setCategoryActionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);

        if (product?.category) {
          const match = fetchedCategories.find(
            (category) => category.toLowerCase() === product.category.toLowerCase()
          );
          const initialCategory = match || product.category;
          setSelectedCategory(initialCategory);
          setValue('category', initialCategory, { shouldValidate: true });
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [product?.category, setValue]);

  const applySelectedCategory = (category: string) => {
    setSelectedCategory(category);
    setIsCreatingNew(false);
    setNewCategoryName('');
    setValue('category', category, { shouldValidate: true });
  };

  const handleCreateCategory = async () => {
    const normalized = newCategoryName.trim();
    if (!normalized) {
      setError('Please enter a category name');
      return;
    }

    setError('');
    setCategoryActionLoading(true);

    try {
      const createdCategory = await createCategory(normalized);
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
      applySelectedCategory(createdCategory);
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
    } finally {
      setCategoryActionLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      setError('Please select a category to delete');
      return;
    }

    const confirmed = window.confirm(
      `Delete category "${selectedCategory}"? This only works if no product uses it.`
    );
    if (!confirmed) return;

    setError('');
    setCategoryActionLoading(true);

    try {
      await deleteCategory(selectedCategory);
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
      setSelectedCategory('');
      setValue('category', '', { shouldValidate: true });
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    } finally {
      setCategoryActionLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slotIndex = Number(e.target.dataset.slot);
    const file = e.target.files?.[0];
    if (!file || Number.isNaN(slotIndex) || slotIndex < 0 || slotIndex > 3) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSlots((prev) => {
        const next = [...prev];
        next[slotIndex] = file;
        return next;
      });

      setImagePreviews((prev) => {
        const next = [...prev];
        next[slotIndex] = reader.result as string;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (slotIndex: number) => {
    setImageSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
    setImagePreviews((prev) => {
      const next = [...prev];
      next[slotIndex] = '';
      return next;
    });
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    setError('');
    try {
      // If creating new category, use the new category name
      if (isCreatingNew) {
        if (!newCategoryName.trim()) {
          setError('Please enter a category name');
          return;
        }
        data.category = newCategoryName.trim();
      } else {
        if (!selectedCategory) {
          setError('Please select or create a category');
          return;
        }
        data.category = selectedCategory;
      }

      setValue('category', data.category, { shouldValidate: true });

      const selectedImages = imageSlots.filter(
        (image): image is File | string => Boolean(image)
      );

      if (selectedImages.length === 0) {
        setError('Please upload at least one product image');
        return;
      }

      await onSubmit(data, selectedImages);
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
          Product Images (Up to 4)
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Upload up to 4 images. First image will be used as primary thumbnail.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50">
              <p className="text-xs font-medium text-gray-600 mb-2">
                Image {index + 1} {index === 0 ? '(Primary)' : ''}
              </p>

              {imagePreviews[index] ? (
                <div className="space-y-2">
                  <img
                    src={imagePreviews[index]}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 px-3 py-2 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition">
                      <Upload className="w-4 h-4" />
                      Replace
                      <input
                        type="file"
                        accept="image/*"
                        data-slot={index}
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="px-3 py-2 text-xs border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="h-32 border border-gray-300 rounded-md bg-white flex items-center justify-center cursor-pointer hover:bg-gray-100 transition">
                  <div className="flex items-center gap-2 text-gray-600 text-xs font-medium">
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    data-slot={index}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          ))}
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
            Price (PKR)
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

        <input type="hidden" {...register('category')} />
        
        <div className="space-y-3">
          {loadingCategories ? (
            <div className="px-4 py-2 text-gray-500">Loading categories...</div>
          ) : (
            <select
              value={isCreatingNew ? 'CREATE_NEW' : selectedCategory}
              onChange={(e) => {
                if (e.target.value === 'CREATE_NEW') {
                  setIsCreatingNew(true);
                  setSelectedCategory('');
                  setNewCategoryName('');
                  setValue('category', '', { shouldValidate: true });
                } else {
                  applySelectedCategory(e.target.value);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="">-- Select a Category --</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="CREATE_NEW">+ Create New Category</option>
            </select>
          )}

          {/* New Category Input */}
          {isCreatingNew && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                  setValue('category', e.target.value, { shouldValidate: true });
                }}
                placeholder="Enter new category name"
                className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-blue-50"
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={categoryActionLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Save Category
              </button>
            </div>
          )}

          {!isCreatingNew && selectedCategory && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleDeleteCategory}
                disabled={categoryActionLoading}
                className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Delete Category
              </button>
            </div>
          )}
        </div>

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
