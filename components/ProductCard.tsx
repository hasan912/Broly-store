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
        className="group relative h-full cursor-pointer flex flex-col bg-[#ffffff]"
      >
        {/* Image Container */}
        <div className="relative w-full aspect-4/5 overflow-hidden bg-[#f4f4f4] mb-4">
          {product.image.startsWith('data:') ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1]"
            />
          ) : (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1]"
            />
          )}

          {/* Quick Actions Overlay (Appears on Hover) */}
          <div className="absolute inset-0 bg-[#000000]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-between p-4">
            <div className="flex justify-between items-start">
              {/* Stock Badge */}
              {product.stock > 0 ? (
                <span className="text-[10px] font-mono tracking-widest text-[#000000] uppercase bg-[#ffffff] px-2 py-1">
                  In Stock
                </span>
              ) : (
                <span className="text-[10px] font-mono tracking-widest text-[#ffffff] uppercase bg-[#000000] px-2 py-1">
                  Sold Out
                </span>
              )}

              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsFavorite(!isFavorite);
                }}
                className="w-8 h-8 flex items-center justify-center bg-[#ffffff] rounded-full hover:scale-110 transition-transform duration-300"
              >
                <Heart
                  className="w-3.5 h-3.5"
                  style={{ 
                    fill: isFavorite ? '#000000' : 'transparent',
                    color: '#000000'
                  }}
                  strokeWidth={isFavorite ? 0 : 1.5}
                />
              </button>
            </div>

            {/* Quick Add Button */}
            {product.stock > 0 && (
              <button
                onClick={handleAddToCart}
                className="w-full translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-[#000000] text-[#ffffff] py-3 text-[10px] font-mono tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#222222]"
              >
                <ShoppingCart className="w-3.5 h-3.5" strokeWidth={1.5} />
                Acquire
              </button>
            )}
          </div>
        </div>

        {/* Content Container */}
        <div className="flex flex-col grow px-1">
          <div className="flex flex-col mb-1">
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8e8e8e] mb-1.5 line-clamp-1">
              {product.description || 'Apparel'}
            </p>
            <h3 className="font-serif text-lg leading-snug text-[#000000] group-hover:text-muted-foreground transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>
          </div>

          <div className="mt-auto pt-2">
            <span className="text-sm font-sans font-medium text-[#000000]">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
