import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminArea = pathname.startsWith('/admin');
  const isAdminAuthPage = pathname === '/admin/login' || pathname === '/admin/logout';

  if (!isAdminArea || isAdminAuthPage) {
    return NextResponse.next();
  }

  const adminSession = request.cookies.get('broly_admin_session')?.value;

  if (adminSession === 'active') {
    return NextResponse.next();
  }

  const loginUrl = new URL('/admin/login', request.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*'],
};
