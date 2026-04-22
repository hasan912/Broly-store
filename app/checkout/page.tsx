'use client';

import { useEffect, useState } from 'react';
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
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

const STEPS = [
  { id: 1, name: 'Shipping', icon: MapPin },
  { id: 2, name: 'Confirm', icon: Check },
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [authReady, setAuthReady] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      setShowAuthPrompt(!currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authReady && !user) {
      setShowAuthPrompt(true);
    }
  }, [authReady, user]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-[#000000] mb-4 tracking-wide">Cart Empty</h1>
          <Link href="/products" className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground hover:text-primary border-b border-transparent hover:border-primary pb-1 transition-all">
            Return to Archives
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
        setShowAuthPrompt(true);
        setLoading(false);
        return;
      }

      const orderUserId = user.uid;

      const ordersCollection = collection(db, 'orders');
      const orderDoc = await addDoc(ordersCollection, {
        userId: orderUserId,
        items,
        total,
        shippingAddress: data,
        paymentMethod: 'cash_on_delivery',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Store order data in sessionStorage for immediate display
      const orderDataForConfirmation = {
        id: orderDoc.id,
        userId: orderUserId,
        items,
        total,
        shippingAddress: data,
        paymentMethod: 'cash_on_delivery',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      sessionStorage.setItem(`order_${orderDoc.id}`, JSON.stringify(orderDataForConfirmation));

      clearCart();
      router.push(`/order-confirmation/${orderDoc.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      const message = err instanceof Error ? err.message : '';
      if (message.toLowerCase().includes('permission-denied')) {
        setError('Order save blocked by Firestore rules. Please log in again and retry.');
      } else if (message.toLowerCase().includes('auth/operation-not-allowed')) {
        setError('Checkout requires an authenticated account. Please log in or register.');
      } else {
        setError('System rejected transaction. Please attempt again.');
      }
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
    <div className="min-h-screen bg-background text-foreground">
      {showAuthPrompt && authReady && !user && (
        <div className="fixed inset-0 z-80 bg-black/55 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white border border-[#e8e8e8] shadow-2xl p-8 md:p-10">
            <div className="mb-6">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground mb-3">Checkout Gate</p>
              <h2 className="text-2xl font-serif text-[#000000] mb-3">Log in to finalize checkout</h2>
              <p className="text-sm text-[#474747] leading-relaxed">
                Please sign in or create an account first. Once you finish, you will return directly to this checkout page.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/login?redirect=/checkout"
                className="w-full inline-flex items-center justify-center px-6 py-4 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-widest hover:bg-muted-foreground transition-colors"
              >
                Login and continue
              </Link>
              <Link
                href="/register?redirect=/checkout"
                className="w-full inline-flex items-center justify-center px-6 py-4 border border-[#e8e8e8] text-[#1a1c1c] text-[10px] font-mono uppercase tracking-widest hover:border-[#000000] hover:text-[#000000] transition-colors"
              >
                Register and continue
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        {/* Back Button */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-muted-foreground hover:text-primary mb-12 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Selection
        </Link>

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-[#000000] mb-4">Secure Checkout</h1>
          <p className="text-sm font-sans text-[#474747]">Process your acquisition safely over encrypted lines.</p>
        </div>

        {/* Auth Alert */}
        <div className="mb-8 p-4 bg-[#f3f3f3] border border-[#e8e8e8] text-[#1a1c1c] text-xs font-mono uppercase tracking-widest">
          Login is required to place the order. You will return here after signing in or registering.
        </div>

        {error && (
          <div className="mb-8 p-4 bg-destructive/5 border border-destructive/20 text-destructive text-xs font-mono uppercase tracking-widest">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="mb-16">
              <div className="flex items-center justify-between px-4 sm:px-12">
                {STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = currentStep > step.id;
                  const isActive = currentStep === step.id;

                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      {/* Step Circle */}
                      <div
                        className={`w-10 h-10 rounded-none flex items-center justify-center transition-all duration-500 border ${
                          isActive || isCompleted
                            ? 'bg-[#000000] text-[#ffffff] border-[#000000]'
                            : 'bg-[#ffffff] text-[#c6c6c6] border-[#e8e8e8]'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>

                      {/* Step Label */}
                      <div className="ml-4">
                        <p className={`text-[10px] font-mono tracking-widest uppercase ${isActive ? 'text-[#000000]' : isCompleted ? 'text-[#000000]' : 'text-[#c6c6c6]'}`}>
                          {step.name}
                        </p>
                      </div>

                      {/* Connector Line */}
                      {index < STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-px mx-6 transition-all duration-500 ${
                            isCompleted ? 'bg-[#000000]' : 'bg-[#e8e8e8]'
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
                <div>
                  <div className="bg-[#ffffff] border border-[#e8e8e8] shadow-sm p-8 md:p-12">
                    <h2 className="text-xl font-serif text-[#000000] mb-8 pb-4 border-b border-[#e8e8e8]">Logistics Target</h2>

                    <div className="space-y-8">
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest uppercase text-[#474747] mb-2">Primary Designator *</label>
                        <input
                          {...register('fullName')}
                          type="text"
                          className="w-full px-0 py-3 bg-transparent border-b border-[#e8e8e8] focus:outline-none focus:border-[#000000] transition-colors text-[#000000] placeholder:text-[#ababab] font-sans text-sm rounded-none"
                          placeholder="John Doe"
                        />
                        {errors.fullName && <p className="text-destructive text-[10px] uppercase font-mono mt-2 tracking-widest">{errors.fullName.message}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-[10px] font-mono tracking-widest uppercase text-[#474747] mb-2">Comms Channel (Email) *</label>
                          <input
                            {...register('email')}
                            type="email"
                            className="w-full px-0 py-3 bg-transparent border-b border-[#e8e8e8] focus:outline-none focus:border-[#000000] transition-colors text-[#000000] placeholder:text-[#ababab] font-sans text-sm rounded-none"
                            placeholder="entity@domain.com"
                          />
                          {errors.email && <p className="text-destructive text-[10px] uppercase font-mono mt-2 tracking-widest">{errors.email.message}</p>}
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono tracking-widest uppercase text-[#474747] mb-2">Freq Dial (Phone) *</label>
                          <input
                            {...register('phone')}
                            type="tel"
                            className="w-full px-0 py-3 bg-transparent border-b border-[#e8e8e8] focus:outline-none focus:border-[#000000] transition-colors text-[#000000] placeholder:text-[#ababab] font-sans text-sm rounded-none"
                            placeholder="+92 300 1234567"
                          />
                          {errors.phone && <p className="text-destructive text-[10px] uppercase font-mono mt-2 tracking-widest">{errors.phone.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono tracking-widest uppercase text-[#474747] mb-2">Sector Address *</label>
                        <input
                          {...register('street')}
                          type="text"
                          className="w-full px-0 py-3 bg-transparent border-b border-[#e8e8e8] focus:outline-none focus:border-[#000000] transition-colors text-[#000000] placeholder:text-[#ababab] font-sans text-sm rounded-none"
                          placeholder="123 Main St, Level 4"
                        />
                        {errors.street && <p className="text-destructive text-[10px] uppercase font-mono mt-2 tracking-widest">{errors.street.message}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-[10px] font-mono tracking-widest uppercase text-[#474747] mb-2">City Hub *</label>
                          <input
                            {...register('city')}
                            type="text"
                            className="w-full px-0 py-3 bg-transparent border-b border-[#e8e8e8] focus:outline-none focus:border-[#000000] transition-colors text-[#000000] placeholder:text-[#ababab] font-sans text-sm rounded-none"
                            placeholder="City"
                          />
                          {errors.city && <p className="text-destructive text-[10px] uppercase font-mono mt-2 tracking-widest">{errors.city.message}</p>}
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono tracking-widest uppercase text-[#474747] mb-2">Province / State *</label>
                          <input
                            {...register('state')}
                            type="text"
                            className="w-full px-0 py-3 bg-transparent border-b border-[#e8e8e8] focus:outline-none focus:border-[#000000] transition-colors text-[#000000] placeholder:text-[#ababab] font-sans text-sm rounded-none"
                            placeholder="Sindh"
                          />
                          {errors.state && <p className="text-destructive text-[10px] uppercase font-mono mt-2 tracking-widest">{errors.state.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-[10px] font-mono tracking-widest uppercase text-[#474747] mb-2">Zone Code *</label>
                          <input
                            {...register('zipCode')}
                            type="text"
                            className="w-full px-0 py-3 bg-transparent border-b border-[#e8e8e8] focus:outline-none focus:border-[#000000] transition-colors text-[#000000] placeholder:text-[#ababab] font-sans text-sm rounded-none"
                            placeholder="10001"
                          />
                          {errors.zipCode && <p className="text-destructive text-[10px] uppercase font-mono mt-2 tracking-widest">{errors.zipCode.message}</p>}
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono tracking-widest uppercase text-[#474747] mb-2">Region *</label>
                          <input
                            {...register('country')}
                            type="text"
                            className="w-full px-0 py-3 bg-transparent border-b border-[#e8e8e8] focus:outline-none focus:border-[#000000] transition-colors text-[#000000] placeholder:text-[#ababab] font-sans text-sm rounded-none"
                            placeholder="Pakistan"
                          />
                          {errors.country && <p className="text-destructive text-[10px] uppercase font-mono mt-2 tracking-widest">{errors.country.message}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Confirmation */}
              {currentStep === 2 && (
                <div>
                  <div className="bg-[#ffffff] border border-[#e8e8e8] shadow-sm p-8 md:p-12">
                    <h2 className="text-xl font-serif text-[#000000] mb-8 pb-4 border-b border-[#e8e8e8]">Confirm Logistics Payload</h2>
                    
                    <div className="p-6 bg-[#f3f3f3] border border-[#e8e8e8] mb-6">
                      <p className="text-[#1a1c1c] text-sm font-semibold font-sans mb-1">Transaction Protocol: Exchange On Delivery (EOD)</p>
                      <p className="text-xs text-muted-foreground font-sans">Payment will be processed upon physical handover.</p>
                    </div>

                    <div className="p-6 bg-[#d9f9d7]/30 border border-[#40a02b]/30 mb-8">
                      <p className="text-[#40a02b] text-sm font-semibold flex items-center gap-3 font-sans">
                        <Check className="w-4 h-4" />
                        Target variables verified and accurate.
                      </p>
                    </div>
                    
                    <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest text-center mt-8">Provide signature to conclude operation.</p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-8 py-4 border border-border text-muted-foreground text-[10px] font-mono tracking-widest uppercase hover:bg-muted hover:text-foreground transition-colors rounded-none"
                  >
                    Reverse Process
                  </button>
                )}

                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="ml-auto px-8 py-4 bg-primary text-primary-foreground text-[10px] font-mono tracking-widest uppercase shadow-sm transition-all duration-300 hover:bg-muted-foreground rounded-none"
                  >
                    Confirm Target
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-auto px-8 py-4 bg-primary text-primary-foreground text-[10px] font-mono tracking-widest uppercase shadow-sm transition-all duration-300 hover:bg-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
                  >
                    {loading ? 'Processing...' : 'Authorize Operation'}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CartSummary showCheckoutButton={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
