'use server';

import { cookies } from 'next/headers';

export async function deleteProductAction(id: string) {
  try {
    // Verify admin session cookie on the server
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('broly_admin_session')?.value;

    if (adminSession !== 'active') {
      const error = new Error('Admin auth session missing. Please login again.') as Error & {
        code?: string;
      };
      error.code = 'admin-auth-missing';
      throw error;
    }

    // Import Firestore client - works from server context
    const { db } = await import('@/lib/firebase');
    const { deleteDoc, doc } = await import('firebase/firestore');

    // Delete the product
    await deleteDoc(doc(db, 'products', id));
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

