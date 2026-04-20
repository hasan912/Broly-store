'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema, ProductFormData } from '@/lib/validation';
import { Product } from '@/lib/types';
import { getCategories, createCategory, deleteCategory } from '@/lib/admin-products';
import { Upload, Plus, Trash2, X } from 'lucide-react';

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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-12">
      {error && (
        <div className="p-4 bg-destructive/5 border border-destructive/20 text-destructive text-xs font-bold tracking-widest uppercase">
          ERROR: {error}
        </div>
      )}

      {/* Image Upload Section */}
      <div>
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">VISUAL ASSETS</h3>
           <span className="text-[10px] text-muted-foreground">01 / 04 MAX</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-[3/4] relative group overflow-hidden border border-border/40 bg-muted/30">
              {imagePreviews[index] ? (
                <div className="w-full h-full relative">
                  <img
                    src={imagePreviews[index]}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-3">
                     <label className="cursor-pointer bg-white text-primary px-4 py-2 text-[8px] font-bold tracking-widest hover:bg-black hover:text-white transition-colors duration-300 uppercase">
                        REPLACE
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
                        className="bg-destructive text-white px-4 py-2 text-[8px] font-bold tracking-widest hover:bg-white hover:text-destructive transition-colors duration-300 uppercase"
                      >
                        REMOVE
                      </button>
                  </div>
                </div>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-all duration-500">
                  <Upload className="w-5 h-5 text-muted-foreground mb-3 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                  <span className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase group-hover:text-primary transition-colors">UPLOAD {index === 0 ? 'COVER' : 'ASSET'}</span>
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

      <div className="h-px bg-border/40 w-full" />

      {/* Basic Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-10">
           <h3 className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">CORE INFORMATION</h3>
           
           {/* Product Name */}
          <div className="space-y-4">
            <label className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Product Identifier
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full bg-transparent border-b border-border/60 py-4 text-lg font-serif tracking-tight text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30"
              placeholder="COLLECTION ITEM NAME..."
            />
            {errors.name && (
              <p className="text-destructive text-[10px] font-bold tracking-widest uppercase">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-4">
            <label className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Curatorial Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full bg-transparent border border-border/40 p-6 text-sm leading-relaxed text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30 resize-none"
              placeholder="ELABORATE ON THE CRAFTSMANSHIP AND MATERIALITY..."
            />
            {errors.description && (
              <p className="text-destructive text-[10px] font-bold tracking-widest uppercase">{errors.description.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-10">
           <h3 className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">FINANCIALS & LOGISTICS</h3>

           {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Valuation (PKR)
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className="w-full bg-transparent border-b border-border/60 py-4 text-2xl font-serif tracking-tighter text-primary focus:outline-none focus:border-primary transition-colors"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-destructive text-[10px] font-bold tracking-widest uppercase">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Inventory Volume
              </label>
              <input
                {...register('stock', { valueAsNumber: true })}
                type="number"
                min="0"
                className="w-full bg-transparent border-b border-border/60 py-4 text-2xl font-serif tracking-tighter text-primary focus:outline-none focus:border-primary transition-colors"
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-destructive text-[10px] font-bold tracking-widest uppercase">{errors.stock.message}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-6 pt-4">
            <label className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Classification
            </label>

            <input type="hidden" {...register('category')} />
            
            <div className="space-y-6">
              {loadingCategories ? (
                <div className="text-[10px] text-muted-foreground animate-pulse uppercase tracking-widest">Initialising Classifications...</div>
              ) : (
                <div className="flex flex-wrap gap-3">
                   {categories.map((category) => (
                     <button
                        key={category}
                        type="button"
                        onClick={() => applySelectedCategory(category)}
                        className={`px-4 py-2 text-[10px] font-bold tracking-widest border transition-all duration-500 uppercase ${
                          selectedCategory === category
                            ? 'bg-primary text-white border-primary'
                            : 'bg-transparent text-muted-foreground border-border/60 hover:border-primary hover:text-primary'
                        }`}
                     >
                       {category}
                     </button>
                   ))}
                   <button
                      type="button"
                      onClick={() => setIsCreatingNew(!isCreatingNew)}
                      className={`px-4 py-2 text-[10px] font-bold tracking-widest border border-dashed transition-all duration-500 uppercase flex items-center gap-2 ${
                        isCreatingNew
                          ? 'bg-primary text-white border-primary'
                          : 'bg-transparent text-muted-foreground border-border/60 hover:border-primary hover:text-primary'
                      }`}
                   >
                     {isCreatingNew ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                     {isCreatingNew ? 'CANCEL' : 'NEW CLASSIFICATION'}
                   </button>
                </div>
              )}

              {/* New Category Input */}
              {isCreatingNew && (
                <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => {
                      setNewCategoryName(e.target.value);
                      setValue('category', e.target.value, { shouldValidate: true });
                    }}
                    placeholder="NEW CATEGORY NAME..."
                    className="flex-1 bg-transparent border-b border-primary/20 py-3 text-xs font-bold tracking-widest text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={categoryActionLoading}
                    className="px-6 py-3 bg-primary text-white text-[9px] font-bold tracking-widest uppercase hover:bg-muted-foreground transition-colors disabled:opacity-50"
                  >
                    SAVE
                  </button>
                </div>
              )}

              {/* Delete Category Button (Subtle) */}
              {!isCreatingNew && selectedCategory && (
                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={handleDeleteCategory}
                    disabled={categoryActionLoading}
                    className="inline-flex items-center gap-2 text-[8px] font-bold tracking-[0.2em] text-destructive opacity-40 hover:opacity-100 transition-opacity uppercase"
                  >
                    <Trash2 className="w-3 h-3" />
                    DECOMMISSION CATEGORY
                  </button>
                </div>
              )}
            </div>

            {errors.category && (
              <p className="text-destructive text-[10px] font-bold tracking-widest uppercase">{errors.category.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="h-px bg-border/40 w-full" />

      {/* Submit Button */}
      <div className="flex justify-end pt-8">
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full md:w-80 bg-primary text-white py-6 overflow-hidden transition-all duration-700 hover:bg-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="relative z-10 flex items-center justify-center gap-4">
             <span className="text-xs font-bold tracking-[0.3em] uppercase">
              {loading
                ? 'SYNCHRONISING...'
                : product
                ? 'UPDATE REPOSITORY'
                : 'COMMENCE PUBLICATION'}
            </span>
            <Plus className={`w-4 h-4 transition-transform duration-700 ${loading ? 'animate-spin' : 'group-hover:rotate-90'}`} />
          </div>
        </button>
      </div>
    </form>
  );
}
