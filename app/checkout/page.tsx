'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckoutSchema, CheckoutFormData } from '@/lib/validation';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import CartSummary from '@/components/CartSummary';
import Link from 'next/link';
import { ChevronLeft, Check, MapPin } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Shipping', icon: MapPin },
  { id: 2, name: 'Confirm', icon: Check },
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const user = auth.currentUser;

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: user?.email || '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <Link href="/products" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Continue Shopping →
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setLoading(true);
    setError('');

    try {
      if (!user) {
        setError('Please log in to complete your purchase');
        return;
      }

      const ordersCollection = collection(db, 'orders');
      const orderDoc = await addDoc(ordersCollection, {
        userId: user.uid,
        items,
        total,
        shippingAddress: data,
        paymentMethod: 'cash_on_delivery',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      clearCart();
      router.push(`/order-confirmation/${orderDoc.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      const isValid = await trigger(['fullName', 'email', 'phone', 'street', 'city', 'state', 'zipCode', 'country']);
      if (isValid) {
        setCurrentStep(2);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Back Button */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Cart
        </Link>

        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Checkout</h1>
          <p className="text-lg text-foreground/70">Complete your purchase securely</p>
        </div>

        {/* Auth Alert */}
        {!user && (
          <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-700 text-sm font-medium">
            Please <Link href="/login" className="font-bold underline">log in</Link> to complete your purchase.
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = currentStep > step.id;
                  const isActive = currentStep === step.id;

                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      {/* Step Circle */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                          isActive || isCompleted
                            ? 'bg-linear-to-r from-indigo-600 to-indigo-700 text-white shadow-elevated'
                            : 'bg-slate-200 dark:bg-slate-700 text-foreground/50'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>

                      {/* Step Label */}
                      <div className="ml-3">
                        <p className={`font-semibold ${isActive ? 'text-indigo-600' : isCompleted ? 'text-foreground' : 'text-foreground/50'}`}>
                          {step.name}
                        </p>
                      </div>

                      {/* Connector Line */}
                      {index < STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                            isCompleted ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="rounded-2xl glass shadow-soft p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-8">Shipping Address</h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Full Name *</label>
                        <input
                          {...register('fullName')}
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:border-indigo-500 focus:outline-none transition-colors"
                          placeholder="John Doe"
                        />
                        {errors.fullName && <p className="text-red-600 text-sm mt-2">{errors.fullName.message}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Email *</label>
                          <input
                            {...register('email')}
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:border-indigo-500 focus:outline-none transition-colors"
                            placeholder="john@example.com"
                          />
                          {errors.email && <p className="text-red-600 text-sm mt-2">{errors.email.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Phone *</label>
                          <input
                            {...register('phone')}
                            type="tel"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:border-indigo-500 focus:outline-none transition-colors"
                            placeholder="+1 (555) 123-4567"
                          />
                          {errors.phone && <p className="text-red-600 text-sm mt-2">{errors.phone.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Street Address *</label>
                        <input
                          {...register('street')}
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:border-indigo-500 focus:outline-none transition-colors"
                          placeholder="123 Main St"
                        />
                        {errors.street && <p className="text-red-600 text-sm mt-2">{errors.street.message}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">City *</label>
                          <input
                            {...register('city')}
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:border-indigo-500 focus:outline-none transition-colors"
                            placeholder="New York"
                          />
                          {errors.city && <p className="text-red-600 text-sm mt-2">{errors.city.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">State/Province *</label>
                          <input
                            {...register('state')}
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:border-indigo-500 focus:outline-none transition-colors"
                            placeholder="NY"
                          />
                          {errors.state && <p className="text-red-600 text-sm mt-2">{errors.state.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Zip/Postal Code *</label>
                          <input
                            {...register('zipCode')}
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:border-indigo-500 focus:outline-none transition-colors"
                            placeholder="10001"
                          />
                          {errors.zipCode && <p className="text-red-600 text-sm mt-2">{errors.zipCode.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">Country *</label>
                          <input
                            {...register('country')}
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:border-indigo-500 focus:outline-none transition-colors"
                            placeholder="United States"
                          />
                          {errors.country && <p className="text-red-600 text-sm mt-2">{errors.country.message}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Confirmation */}
              {currentStep === 2 && (
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="rounded-2xl glass shadow-soft p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-8">Review Your Order</h2>
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-4">
                      <p className="text-amber-700 font-semibold">Payment Method: Cash on Delivery (COD)</p>
                      <p className="text-sm text-amber-700/80 mt-1">Aap delivery ke waqt cash pay karenge.</p>
                    </div>
                    <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl mb-8">
                      <p className="text-green-700 font-semibold flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        All information entered correctly
                      </p>
                    </div>
                    <p className="text-foreground/70">Click "Complete Purchase" to confirm your order.</p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 justify-between">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-8 py-4 rounded-xl border-2 border-foreground/20 text-foreground font-semibold hover:bg-foreground/5 transition-colors depth-1"
                  >
                    Previous
                  </button>
                )}

                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="ml-auto px-8 py-4 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-700 text-white font-semibold shadow-elevated transition-all duration-300 hover:scale-105 active:scale-98"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !user}
                    className="ml-auto px-8 py-4 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-700 text-white font-semibold shadow-elevated transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CartSummary showCheckoutButton={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
