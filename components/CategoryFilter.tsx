'use client';

import { useEffect, useState } from 'react';
import { getCategories } from '@/lib/products';

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
  selectedCategory?: string;
}

export default function CategoryFilter({
  onCategoryChange,
  selectedCategory,
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-2">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
      <div className="space-y-2">
        <button
          onClick={() => onCategoryChange('')}
          className={`w-full text-left px-3 py-2 rounded transition ${
            !selectedCategory
              ? 'bg-blue-100 text-blue-600 font-semibold'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`w-full text-left px-3 py-2 rounded transition ${
              selectedCategory === category
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
