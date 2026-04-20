'use server';

import { cookies } from 'next/headers';

// This server action uses initializeApp dynamically to avoid import issues
export async function serverDeleteProduct(id: string) {
  try {
    // Verify admin session on server
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('broly_admin_session')?.value;

    if (adminSession !== 'active') {
      const error = new Error('Admin auth session missing. Please login again.') as Error & {
        code?: string;
      };
      error.code = 'admin-auth-missing';
      throw error;
    }

    // Use client-side Firestore from server context
    // This works because we're in a server action
    const { getFirestore, doc, deleteDoc } = await import('firebase/firestore');
    const { initializeApp, getApps, getApp } = await import('firebase/app');
    
    // Get the Firebase app instance
    let app;
    try {
      app = getApp();
    } catch {
      // If no app exists, we can't proceed
      throw new Error('Firebase not initialized');
    }

    const db = getFirestore(app);

    // Attempt delete
    await deleteDoc(doc(db, 'products', id));

    return { success: true };
  } catch (error: any) {
    console.error('[Server] Error deleting product:', error);
    
    // Pass through the error with code
    const err = new Error(error?.message || 'Failed to delete product') as Error & {
      code?: string;
    };
    err.code = error?.code || error?.message?.includes('permission') ? 'permission-denied' : 'unknown';
    throw err;
  }
}
