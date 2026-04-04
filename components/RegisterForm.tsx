'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerUser } from '@/lib/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, RegisterFormData } from '@/lib/validation';
import Link from 'next/link';
import { Card3D } from '@/components/ui/card-3d';
import { UserPlus } from 'lucide-react';

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError('');

    try {
      await registerUser(data.email, data.password, data.name);
      router.push(redirectUrl);
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already registered. Please log in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card3D depth="lg" className="glass p-8 md:p-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-2">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-2">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-2">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confirm Password
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-2">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary text-white py-3.5 rounded-xl hover:shadow-elevated transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed depth-interactive flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <Link href={`/login?redirect=${encodeURIComponent(redirectUrl)}`} className="text-primary font-semibold hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Link
            href="/"
            className="block text-center text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            Continue as Guest
          </Link>
        </div>
      </Card3D>
    </div>
  );
}
