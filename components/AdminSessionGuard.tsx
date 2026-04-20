'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

export default function AdminSessionGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const isAdminAuthPage = pathname === '/admin/login' || pathname === '/admin/logout';

      if (isAdminAuthPage) {
        return;
      }

      if (!user) {
        try {
          await fetch('/api/admin/logout', { method: 'POST' });
        } catch (error) {
          console.error('Failed to clear admin cookie:', error);
        } finally {
          router.replace(`/admin/login?redirect=${encodeURIComponent(pathname || '/admin')}`);
          router.refresh();
        }
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  return null;
}
