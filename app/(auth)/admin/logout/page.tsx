'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/auth';

export default function AdminLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logoutAdmin() {
      try {
        await logoutUser();
        await fetch('/api/admin/logout', { method: 'POST' });
      } finally {
        router.replace('/');
        router.refresh();
      }
    }

    logoutAdmin();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-foreground/70">Signing out from admin panel...</p>
    </div>
  );
}
