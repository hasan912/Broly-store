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
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 w-full bg-[rgba(255,255,255,0.05)] rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      <div className="space-y-3">
        <button
          onClick={() => onCategoryChange('')}
          className={`w-full text-left px-4 py-3 border text-xs font-mono uppercase tracking-widest transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            !selectedCategory
              ? 'bg-[#000000] text-[#ffffff] border-[#000000]'
              : 'text-[#474747] bg-[#f9f9f9] border-[#e8e8e8] hover:border-[#c6c6c6] hover:text-[#1a1c1c]'
          }`}
        >
          Complete Archives
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`w-full text-left px-4 py-3 border text-xs font-mono uppercase tracking-widest transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              selectedCategory === category
                ? 'bg-[#000000] text-[#ffffff] border-[#000000]'
                : 'text-[#474747] bg-[#f9f9f9] border-[#e8e8e8] hover:border-[#c6c6c6] hover:text-[#1a1c1c]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
