'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProductById } from '@/lib/products';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ShoppingCart, Heart, Star, Check, Truck, Shield, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card3D } from '@/components/ui/card-3d';
import { motion } from 'framer-motion';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      if (!productId) {
        setError('Invalid product URL.');
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const data = await getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
        setError('Product load nahi ho pa raha. Thodi der baad dobara try karein.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card3D className="text-center p-16">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error ?? "The product you're looking for doesn't exist."}
          </p>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-lg shadow-soft hover:shadow-elevated transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </Card3D>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id, quantity, product.price);
  };

  const features = [
    { icon: Truck, text: 'Free shipping on orders over $100' },
    { icon: Shield, text: '30-day money back guarantee' },
    { icon: Check, text: 'Secure checkout' },
    { icon: Star, text: '24/7 customer support' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card3D className="overflow-hidden p-0 group" depth="lg">
              <div className="relative aspect-square bg-linear-to-br from-muted to-secondary">
                {product.image.startsWith('data:') ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                
                {/* Favorite Badge */}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 p-3 rounded-lg bg-card/95 backdrop-blur-sm border border-border/30 hover:bg-card transition-all duration-300 shadow-soft"
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground'
                    }`}
                  />
                </button>
              </div>
            </Card3D>
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 w-fit">
              {product.category}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(128 reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-border">
              <div className="text-4xl font-bold text-gradient-primary mb-3">
                ${product.price.toFixed(2)}
              </div>
              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-2 text-accent font-medium">
                    <Check className="w-4 h-4" />
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-destructive font-medium">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Actions */}
            {product.stock > 0 && (
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg bg-card">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-foreground hover:bg-secondary transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      className="w-16 text-center border-0 bg-transparent focus:outline-none font-medium"
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-3 text-foreground hover:bg-secondary transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-primary text-white py-4 rounded-lg shadow-soft hover:shadow-elevated transition-all duration-300 font-semibold depth-interactive"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>

                <button className="w-full border-2 border-border text-foreground py-4 rounded-lg hover:bg-secondary transition-all duration-300 font-semibold">
                  Buy Now
                </button>
              </div>
            )}

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-border">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-muted-foreground">{feature.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <Card3D className="mb-12">
          <div className="flex gap-6 border-b border-border mb-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 px-2 font-medium transition-colors relative ${
                activeTab === 'description' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Details
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 px-2 font-medium transition-colors relative ${
                activeTab === 'reviews' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Reviews
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary" />
              )}
            </button>
          </div>

          <div className="prose prose-sm max-w-none">
            {activeTab === 'description' ? (
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>{product.description}</p>
                <p>Our premium caps are designed with comfort and style in mind. Each piece is crafted using high-quality materials to ensure durability and long-lasting wear.</p>
                <ul className="space-y-2">
                  <li>Premium fabric construction</li>
                  <li>Adjustable sizing for perfect fit</li>
                  <li>Breathable and comfortable</li>
                  <li>Modern, versatile design</li>
                </ul>
              </div>
            ) : (
              <div className="text-muted-foreground">
                <p className="mb-4">Customer reviews coming soon. Be the first to share your experience!</p>
                <button className="px-6 py-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </Card3D>
      </div>
    </div>
  );
}
