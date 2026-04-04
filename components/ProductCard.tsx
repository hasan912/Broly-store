'use client';

import { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1, product.price);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div 
        className="group relative h-full cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
        style={{ backgroundColor: '#ffffff', border: '2px solid #e7e5e4' }}
      >
        {/* Image Container */}
        <div className="relative w-full h-72 overflow-hidden" style={{ background: 'linear-gradient(135deg, #f5f5f4 0%, #fafaf9 100%)' }}>
          {product.image.startsWith('data:') ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          )}

          {/* Stock Badge */}
          {product.stock > 0 && (
            <div 
              className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
              style={{ backgroundColor: '#10b981', color: '#ffffff' }}
            >
              In Stock
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
          >
            <Heart
              className="w-5 h-5 transition-all duration-300"
              style={{ 
                fill: isFavorite ? '#ef4444' : 'transparent',
                color: isFavorite ? '#ef4444' : '#a8a29e'
              }}
            />
          </button>
        </div>

        {/* Content Container */}
        <div className="p-5 flex flex-col">
          {/* Category */}
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#78716c' }}>
            {product.description}
          </p>

          {/* Title */}
          <h3 className="font-bold text-lg mb-3 line-clamp-2 transition-colors" style={{ color: '#1c1917' }}>
            {product.name}
          </h3>

          {/* Price & Button Row */}
          <div className="flex items-center justify-between mt-auto">
            {/* Price */}
            <span className="text-2xl font-bold" style={{ color: '#4f46e5' }}>
              ${product.price.toFixed(2)}
            </span>

            {/* Add to Cart Button */}
            {product.stock > 0 && (
              <button
                onClick={handleAddToCart}
                className="p-2.5 rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#ffffff' }}
                title="Add to cart"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            )}

            {product.stock === 0 && (
              <span className="text-xs font-semibold uppercase" style={{ color: '#ef4444' }}>Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
