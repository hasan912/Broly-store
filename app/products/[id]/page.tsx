'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProductById } from '@/lib/products';
import { Product, Review } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ShoppingCart, Heart, Star, Check, Truck, Shield, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card3D } from '@/components/ui/card-3d';
import { motion } from 'framer-motion';
import { getProductReviews, submitReview } from '@/lib/reviews';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewForm, setReviewForm] = useState({
    name: '',
    rating: 5,
    text: '',
  });
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

  useEffect(() => {
    async function loadReviews() {
      if (!productId) {
        setLoadingReviews(false);
        return;
      }

      try {
        const data = await getProductReviews(productId);
        setReviews(data);
      } catch (reviewLoadError) {
        console.error('Error loading reviews:', reviewLoadError);
      } finally {
        setLoadingReviews(false);
      }
    }

    loadReviews();
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
    if (product?.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size before adding to cart');
      return;
    }
    addToCart(product.id, quantity, product.price, selectedSize);
  };

  const productImages = (
    product.images && product.images.length > 0 ? product.images : [product.image]
  ).filter((image): image is string => Boolean(image));

  const currentImage = productImages[selectedImageIndex] || product.image;

  const goToPrevImage = () => {
    if (productImages.length <= 1) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    if (productImages.length <= 1) return;
    setSelectedImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const roundedRating = Math.round(averageRating);

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    const name = reviewForm.name.trim();
    const text = reviewForm.text.trim();

    if (!name || !text) {
      setReviewError('Please fill your name and review text.');
      return;
    }

    try {
      setSubmittingReview(true);
      await submitReview({
        productId: product.id,
        productName: product.name,
        name,
        rating: reviewForm.rating,
        text,
      });

      const updatedReviews = await getProductReviews(product.id);
      setReviews(updatedReviews);
      setReviewForm({ name: '', rating: 5, text: '' });
      setReviewSuccess('Thanks! Your review has been submitted.');
    } catch (submitError: unknown) {
      const message = submitError instanceof Error ? submitError.message : 'Failed to submit review';
      setReviewError(message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const features = [
    { icon: Truck, text: 'Free shipping on orders' },
    { icon: Shield, text: '30-day money back guarantee' },
    { icon: Check, text: 'Secure checkout' },
    { icon: Star, text: '24/7 customer support' },
  ];

  const sizeGuideRows =
    product.sizeGuide && product.sizeGuide.length > 0
      ? product.sizeGuide
      : [
          { size: 'Small', chest: '20 in', length: '28 in' },
          { size: 'Medium', chest: '22 in', length: '29 in' },
          { size: 'Large', chest: '24 in', length: '30 in' },
        ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-start mb-16">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:max-w-155"
          >
            <Card3D className="overflow-hidden p-0 group shadow-[0_24px_80px_rgba(0,0,0,0.08)]" depth="lg">
              <div className="relative aspect-4/5 sm:aspect-5/6 bg-linear-to-br from-[#fafafa] via-white to-[#f2f2f2]">
                {currentImage.startsWith('data:') ? (
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 sm:p-6 group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <Image
                    src={currentImage}
                    alt={product.name}
                    fill
                    className="object-contain p-4 sm:p-6 group-hover:scale-[1.02] transition-transform duration-500"
                  />
                )}

                {productImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goToPrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-card/90 border border-border/30 hover:bg-card transition"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4 text-foreground" />
                    </button>
                    <button
                      type="button"
                      onClick={goToNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-card/90 border border-border/30 hover:bg-card transition"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4 text-foreground" />
                    </button>
                  </>
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

            {productImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-3 mt-4 max-w-130">
                {productImages.slice(0, 4).map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square overflow-hidden rounded-[1rem] border bg-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition ${
                      selectedImageIndex === index ? 'border-primary shadow-soft' : 'border-border hover:border-primary/50'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    {image.startsWith('data:') ? (
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-contain p-1" />
                    ) : (
                      <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-contain p-1" />
                    )}
                  </button>
                ))}
              </div>
            )}
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
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < roundedRating ? 'fill-accent text-accent' : 'text-muted-foreground/40'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {reviews.length > 0 ? `${averageRating.toFixed(1)} (${reviews.length} reviews)` : 'No reviews yet'}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-border">
              <div className="text-4xl font-bold text-gradient-primary mb-3">
                PKR {product.price.toFixed(2)}
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

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8 pb-8 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Select Size</h2>
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 text-sm font-bold border-2 rounded-lg transition-all duration-300 uppercase ${
                        selectedSize === size
                          ? 'bg-primary text-white border-primary'
                          : 'bg-background text-foreground border-border hover:border-primary hover:bg-secondary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8 border border-border/60 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-secondary/40 border-b border-border/60">
                <h3 className="text-sm font-semibold text-foreground">Size Guide (Inches)</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-background/40">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Size</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Chest</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeGuideRows.map((row) => (
                    <tr key={row.size} className="border-t border-border/60">
                      <td className="px-4 py-3 text-foreground">{row.size}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.chest}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                  className="w-full border-2 flex items-center justify-center gap-2 border-border text-foreground py-4 rounded-lg hover:bg-secondary transition-all duration-300 font-semibold"
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
                <p>Our premium designed with comfort and style in mind. Each piece is crafted using high-quality materials to ensure durability.</p>
                <ul className="space-y-2">
                  <li>Premium fabric construction</li>
                  <li>Breathable and comfortable</li>
                  <li>Modern, versatile design</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-8">
                <form onSubmit={handleReviewSubmit} className="space-y-4 rounded-xl border border-border bg-card/50 p-5">
                  <h3 className="text-foreground font-semibold">Write a Review</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>

                  <textarea
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, text: e.target.value }))}
                    placeholder="Share your experience..."
                    rows={4}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />

                  {reviewError && <p className="text-sm text-destructive">{reviewError}</p>}
                  {reviewSuccess && <p className="text-sm text-accent">{reviewSuccess}</p>}

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>

                <div className="space-y-4">
                  <h3 className="text-foreground font-semibold">Customer Reviews</h3>

                  {loadingReviews ? (
                    <p className="text-sm text-muted-foreground">Loading reviews...</p>
                  ) : reviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review this product.</p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="rounded-xl border border-border bg-card/40 p-4">
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <div>
                              <p className="font-medium text-foreground">{review.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {review.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, index) => (
                                <Star
                                  key={index}
                                  className={`w-4 h-4 ${index < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground/40'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card3D>
      </div>
    </div>
  );
}
