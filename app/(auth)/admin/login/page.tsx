'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';
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
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError('Invalid admin email or password.');
        return;
      }

      const redirectTarget = new URLSearchParams(window.location.search).get('redirect') || '/admin';
      router.replace(redirectTarget);
      router.refresh();
    } catch (err: any) {
      setError('Unable to sign in right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4 py-20 font-sans">
      {/* Studio Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full studio-ambient opacity-50" />
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-muted/30 blur-[120px] rounded-none animate-float-slow" />
        <div className="absolute bottom-[5%] left-[5%] w-[30%] h-[30%] bg-muted/20 blur-[100px] rounded-none" />
      </div>

      <div className="relative w-full max-w-md bg-white border border-border shadow-soft-lg animate-fade-up">
        {/* Top Accent Line */}
        <div className="h-1.5 w-full bg-primary" />
        
        <div className="p-12">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 border border-border bg-muted">
                <Image src="/logo.PNG" alt="Stitch" width={48} height={48}  />
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase mb-1">Authenticated</span>
                <div className="flex items-center gap-2 justify-end">
                  <div className="h-1.5 w-1.5 bg-primary" />
                  <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Console v1.0</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-serif tracking-tight text-primary uppercase mb-2">Admin Login</h1>
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Enter credentials to access the Broly management suite.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-destructive/5 border border-destructive/20 text-[11px] font-bold tracking-wider text-destructive uppercase">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4" />
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase ml-1">
                Identity
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-muted/50 border border-border px-5 py-4 text-sm font-medium outline-none focus:border-primary focus:bg-white transition-all duration-500 rounded-none placeholder:text-muted-foreground/30"
                  placeholder="name@brolycaps.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase ml-1">
                Access Key
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-muted/50 border border-border px-5 py-4 text-sm font-medium outline-none focus:border-primary focus:bg-white transition-all duration-500 rounded-none placeholder:text-muted-foreground/30"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white px-8 py-5 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-neutral-800 transition-all duration-500 disabled:opacity-50 relative group overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="h-3 w-3 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                      Authorizing...
                    </>
                  ) : (
                    <>
                      Unlock Management <Sparkles className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          
        </div>
      </div>
    </div>
  );
}
