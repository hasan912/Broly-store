'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { loginUser, logoutUser } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Ensure Firestore writes run under an authenticated Firebase session.
      await loginUser(email, password);

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Roll back Firebase session if env-based admin check fails.
        await logoutUser();
        setError('Invalid admin email or password.');
        return;
      }

      router.replace('/admin');
      router.refresh();
    } catch (err: any) {
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') {
        setError('Admin Firebase account not found. Create this email in Firebase Authentication first.');
      } else if (err?.code === 'auth/wrong-password') {
        setError('Incorrect admin password.');
      } else {
        setError('Unable to sign in right now. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md rounded-3xl glass p-8 shadow-elevated-lg border border-amber-300/30">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Broly Admin Access</h1>
          <p className="text-foreground/70 mt-2 text-sm">
            Restricted dashboard. Only authorized credentials can enter.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-foreground">Admin Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none ring-0 focus:border-amber-500"
              placeholder="admin@brolycaps.com"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-foreground">Admin Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none ring-0 focus:border-amber-500"
              placeholder="Enter secure password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-elevated transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? 'Authorizing...' : 'Unlock Admin Panel'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-foreground/60">
          <span className="inline-flex items-center gap-1">
            <Lock className="h-3.5 w-3.5" />
            Secured session cookie
          </span>
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            Broly Caps
          </span>
        </div>
      </div>
    </div>
  );
}
