'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/auth';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleLogout() {
      try {
        await logoutUser();
        router.push('/');
      } catch (error) {
        console.error('Logout error:', error);
        router.push('/');
      }
    }

    handleLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Logging out...</p>
    </div>
  );
}
