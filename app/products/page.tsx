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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Collection</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Products</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover our carefully curated collection of premium caps with exceptional quality.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-card border border-border hover:border-primary/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-soft"
            />
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-fade-in-up">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'} animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
            <div className="p-6 rounded-xl bg-card border border-border/50 shadow-soft sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Filters</h2>
              </div>
              <CategoryFilter
                onCategoryChange={setSelectedCategory}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-4">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                {filteredProducts.length > 0 && (
                  <>Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}</>
                )}
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-2 font-medium"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <EmptyState
                title="No Products Found"
                description="We couldn't find any products matching your search. Try adjusting your filters or search term."
                actionLabel="Reset Filters"
                actionHref="/products"
                icon={<Package className="w-16 h-16 text-muted-foreground/30" />}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
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
