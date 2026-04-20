import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    
    // Check if this is a product delete request
    if (url.pathname.includes('delete-product')) {
      // Verify admin session cookie
      const cookieStore = await cookies();
      const adminSession = cookieStore.get('broly_admin_session')?.value;

      if (adminSession !== 'active') {
        return NextResponse.json(
          { error: 'Admin auth session missing. Please login again.', code: 'admin-auth-missing' },
          { status: 401 }
        );
      }

      const body = await req.json();
      const productId = typeof body?.id === 'string' ? body.id : '';

      if (!productId) {
        return NextResponse.json(
          { error: 'Product ID is required' },
          { status: 400 }
        );
      }

      // Dynamic import of admin Firebase
      try {
        const { adminDb } = await import('@/lib/admin-firebase');
        await adminDb.collection('products').doc(productId).delete();
        return NextResponse.json({ success: true });
      } catch (adminError: any) {
        console.warn('Admin SDK not available:', adminError?.message);
        
        return NextResponse.json(
          { 
            error: 'Product deletion requires admin SDK configuration',
            code: 'admin-sdk-unavailable'
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: error?.message || 'Operation failed' },
      { status: 500 }
    );
  }
}
