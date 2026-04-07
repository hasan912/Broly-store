'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerUser } from '@/lib/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, RegisterFormData } from '@/lib/validation';
import Link from 'next/link';
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
        setError('Designator already in use. Please authorize session instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Security key insufficient. Increase complexity constraints.');
      } else {
        setError('Initialization failed. System error.');
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
              Full Designation
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-4 py-3 bg-[#f9f9f9] border-b border-[#e8e8e8] focus:outline-none focus:border-[#000000] transition-colors text-[#000000] placeholder:text-[#ababab] font-mono text-xs rounded-none"
              placeholder="JOHN DOE"
            />
            {errors.name && (
              <p className="text-[#ba1a1a] text-[10px] font-mono tracking-widest uppercase mt-2">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#474747] mb-2">
              Comms Contact
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

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#474747] mb-2">
              Verify Security Key
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="w-full px-4 py-3 bg-[#f9f9f9] border-b border-[#e8e8e8] focus:outline-none focus:border-[#000000] transition-colors text-[#000000] placeholder:text-[#ababab] font-mono text-xs rounded-none"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-[#ba1a1a] text-[10px] font-mono tracking-widest uppercase mt-2">{errors.confirmPassword.message}</p>
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
                INITIALIZING...
              </>
            ) : (
              <>
                <UserPlus className="w-3 h-3" />
                CONFIRM PROFILE
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#e8e8e8] pt-6">
          <p className="text-[#5e5e5e] text-[10px] font-mono uppercase tracking-widest">
            Profile active?{' '}
            <Link href={`/login?redirect=${encodeURIComponent(redirectUrl)}`} className="text-[#000000] font-semibold hover:border-b hover:border-[#000000] transition-all">
              Initialize Session
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
