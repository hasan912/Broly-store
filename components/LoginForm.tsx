'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser } from '@/lib/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormData } from '@/lib/validation';
import Link from 'next/link';
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
        setError('Credentials invalid. Please re-authenticate or register.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect security key. Please try again.');
      } else {
        setError('System failure during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#ffffff] border border-[#e8e8e8] p-8 shadow-sm rounded-none">
        {error && (
          <div className="mb-6 p-4 bg-[#ffdad6]/20 border border-[#ba1a1a]/20 text-[#ba1a1a] text-[10px] font-mono tracking-widest uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#474747] mb-2">
              Email Address / ID
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-3 bg-[#f9f9f9] border-b border-[#e8e8e8] focus:outline-none focus:border-[#000000] transition-colors text-[#000000] placeholder:text-[#ababab] font-mono text-xs rounded-none"
              placeholder="CLIENT@ARCHIVE.COM"
            />
            {errors.email && (
              <p className="text-[#ba1a1a] text-[10px] font-mono tracking-widest uppercase mt-2">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#474747] mb-2">
              Security Key
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-3 bg-[#f9f9f9] border-b border-[#e8e8e8] focus:outline-none focus:border-[#000000] transition-colors text-[#000000] placeholder:text-[#ababab] font-mono text-xs rounded-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-[#ba1a1a] text-[10px] font-mono tracking-widest uppercase mt-2">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#000000] text-[#ffffff] py-4 hover:bg-[#5e5e5e] transition-all duration-300 text-[10px] uppercase font-mono tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-none"
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border border-[#ffffff]/30 border-t-[#ffffff] animate-spin rounded-none" />
                AUTHENTICATING...
              </>
            ) : (
              <>
                <LogIn className="w-3 h-3" />
                AUTHORIZE SESSION
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#e8e8e8] pt-6">
          <p className="text-[#5e5e5e] text-[10px] font-mono uppercase tracking-widest">
            Unregistered entity?{' '}
            <Link href={`/register?redirect=${encodeURIComponent(redirectUrl)}`} className="text-[#000000] font-semibold hover:border-b hover:border-[#000000] transition-all">
              Initialize Profile
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-[#e8e8e8]">
          <Link
            href="/"
            className="block text-center text-[#5e5e5e] hover:text-[#000000] transition-colors text-[10px] font-mono uppercase tracking-widest"
          >
            Bypass Authentication
          </Link>
        </div>
      </div>
    </div>
  );
}
