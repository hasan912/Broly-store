import { NextResponse, NextRequest } from 'next/server';
import { validateAdminCredentials } from '@/lib/admin-auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const action = searchParams.get('action');

    // Handle product delete
    if (action === 'delete-product') {
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

      // Session is valid, client can proceed with delete
      return NextResponse.json({ 
        success: true,
        message: 'Session validated. Proceeding with delete...' 
      });
    }

    // Handle admin login with Firebase auth attempt
    if (action === 'firebase-auth-test') {
      const body = await req.json();
      const email = typeof body?.email === 'string' ? body.email : '';
      
      // This endpoint is just for testing/debugging
      // Check if the credentials are valid on server side
      if (validateAdminCredentials(email, body?.password)) {
        return NextResponse.json({ 
          valid: true,
          message: 'Admin credentials are correct. Firebase user may need to be created.'
        });
      }
      
      return NextResponse.json(
        { valid: false, message: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Handle admin login
    const body = await req.json();
    const email = typeof body?.email === 'string' ? body.email : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!validateAdminCredentials(email, password)) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('broly_admin_session', 'active', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

