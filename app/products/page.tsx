'use client';

import { useEffect, useMemo, useState } from 'react';
import { getProducts } from '@/lib/products';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { Search, Package, SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setError(null);
        const data = await getProducts();
        setAllProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
        setError('Products load nahi ho pa rahe. Thodi der baad dobara try karein.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = debouncedSearchTerm.toLowerCase();

    return allProducts.filter((product) => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [allProducts, selectedCategory, debouncedSearchTerm]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] selection:bg-[#000000] selection:text-white pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-8 bg-[#000000]" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#000000]">
              Full Archive
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#000000] mb-6">
            The <span className="italic font-light text-[#5e5e5e]">Collection.</span>
          </h1>
          <p className="text-sm md:text-base font-sans text-[#474747] leading-[1.8] max-w-2xl">
            Examine the complete Broly Store collection. Filter by material class or specification.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e5e5e]" />
            <input
              type="text"
              placeholder="SEARCH ARCHIVES..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-14 pr-4 rounded-none border-b border-[#c6c6c6] bg-transparent text-[#000000] text-xs font-mono tracking-widest transition-all duration-500 focus:outline-none focus:border-[#000000] placeholder:text-[#ababab]"
            />
          </div>
        </div>

        {error && (
          <div className="mb-10 ghost-border bg-[#ffdad6]/20 px-6 py-4 text-sm font-mono tracking-wide text-[#ba1a1a]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Sidebar Filters */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="p-8 bg-[#ffffff] shadow-sm sticky top-32 group border border-transparent hover:border-[#c6c6c6] transition-colors duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-1.5 bg-[#000000] rounded-none" />
                <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#1a1c1c]">Filters</h2>
              </div>
              <CategoryFilter
                onCategoryChange={setSelectedCategory}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-4">
            <div className="mb-8 flex items-center justify-between border-b border-[#e8e8e8] pb-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#5e5e5e]">
                {filteredProducts.length > 0 && (
                  <>Displaying <span className="text-[#000000] ml-1">{filteredProducts.length}</span> Unit{filteredProducts.length !== 1 ? 's' : ''}</>
                )}
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-4 py-2 ghost-border text-xs font-mono uppercase tracking-widest text-[#5e5e5e] hover:text-[#000000] hover:border-[#000000] transition-colors flex items-center gap-2 rounded-none"
              >
                <SlidersHorizontal className="w-3 h-3" />
                {showFilters ? 'Hide' : 'Configure'}
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <EmptyState
                title="No Data Found"
                description="Our servers couldn't locate units matching those exact architectural parameters."
                actionLabel="Reset Parameters"
                actionHref="/products"
                icon={<Package className="w-10 h-10 text-[#c6c6c6]" />}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
