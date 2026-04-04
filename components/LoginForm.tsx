'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser } from '@/lib/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormData } from '@/lib/validation';
import Link from 'next/link';
import { Card3D } from '@/components/ui/card-3d';
import { LogIn } from 'lucide-react';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    try {
      await loginUser(data.email, data.password);
      router.push(redirectUrl);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('Email not found. Please check your email or create an account.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError('Failed to log in. Please try again.');
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary text-white py-3.5 rounded-xl hover:shadow-elevated transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed depth-interactive flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Don&apos;t have an account?{' '}
            <Link href={`/register?redirect=${encodeURIComponent(redirectUrl)}`} className="text-primary font-semibold hover:underline transition-colors">
              Create one
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
