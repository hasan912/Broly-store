# User Redirect After Login/Register Guide

## Overview
Your website now automatically redirects users to the right place after they log in or create an account:
- **Home page** if no specific page was requested
- **Back to the page they came from** if they were navigating to a protected/auth-required page

## How It Works

### 1. **Redirect Flow**

When a user tries to access a protected page (like `/checkout` or `/admin`):
1. They get redirected to `/login?redirect=%2Fcheckout`
2. After successful login, they are redirected to `/checkout`
3. Same applies to register page

### 2. **Implementation Details**

#### New Components Created:
- **`components/LoginForm.tsx`** - Handles login with redirect logic
- **`components/RegisterForm.tsx`** - Handles registration with redirect logic

#### Updated Pages:
- **`app/login/page.tsx`** - Now uses Suspense + LoginForm
- **`app/register/page.tsx`** - Now uses Suspense + RegisterForm

#### Key Features:
✅ Extracts `redirect` parameter from URL using `useSearchParams()`  
✅ Redirects to that page after successful login/registration  
✅ Falls back to home page (`/`) if no redirect parameter  
✅ Preserves redirect URL when switching between login and register pages

## Usage Examples

### Example 1: User tries to checkout without login
```
1. User clicks "Checkout" (not logged in)
2. Redirected to: /login?redirect=%2Fcheckout
3. User logs in
4. Automatically redirected to: /checkout
```

### Example 2: New user registration
```
1. User wants to create account
2. Clicks "Create Account"
3. Fills form and submits
4. Automatically redirected to home page (/)
   OR to specific page if they came from one
```

### Example 3: Switch between login/register
```
1. On login page: /login?redirect=%2Fproducts
2. Click "Create one" link
3. Goes to: /register?redirect=%2Fproducts
4. After registration → automatically redirects to /products
```

## Code Integration

### How to add redirect to protected pages:

**Step 1**: Create a middleware (optional, for automatic protection):
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPages = ['/checkout', '/admin', '/account'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if page is protected
  if (protectedPages.some(page => pathname.startsWith(page))) {
    const isLoggedIn = request.cookies.get('auth')?.value;
    
    if (!isLoggedIn) {
      const redirectUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/login?redirect=${redirectUrl}`, request.url)
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|public).*)'],
};
```

**Step 2**: Or manually redirect in your component:
```typescript
// In any protected component
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedPage() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = /** get from auth context or Firebase */;
    
    if (!user) {
      const currentPage = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPage)}`);
    } else {
      setIsAuthed(true);
    }
  }, [router]);

  if (!isAuthed) return <LoadingSpinner />;

  return <YourContent />;
}
```

## Files Modified

| File | Change |
|------|--------|
| `components/LoginForm.tsx` | New - Form component with redirect logic |
| `components/RegisterForm.tsx` | New - Form component with redirect logic |
| `app/login/page.tsx` | Simplified to use Suspense + LoginForm |
| `app/register/page.tsx` | Simplified to use Suspense + RegisterForm |

## Testing the Redirect

### Test 1: Login Redirect
1. Go to: `http://localhost:3000/login?redirect=%2Fproducts`
2. Log in with valid credentials
3. Should redirect to `/products`

### Test 2: Register Redirect
1. Go to: `http://localhost:3000/register?redirect=%2Fcart`
2. Create a new account
3. Should redirect to `/cart`

### Test 3: No Redirect Parameter
1. Go to: `http://localhost:3000/login`
2. Log in
3. Should redirect to home page `/`

## Current User Flow

**Without Middleware (Current - Manual):**
- User must add redirect params manually in links
- Works for explicit page transitions
- Good for cart/checkout flow

**With Middleware (Optional - Automatic):**
- Automatically protects pages
- No need to add redirect params
- Better for admin pages and user accounts

## Next Steps

1. ✅ Redirect system is ready
2. Add middleware if you want automatic page protection
3. Test the flow with your actual login/registration
4. Update links in Navbar to include `?redirect=` when needed

## Example: Add redirect to Navbar "Login" button

```typescript
// In components/Navbar.tsx
const currentPage = typeof window !== 'undefined' ? window.location.pathname : '/';

<Link href={`/login?redirect=${encodeURIComponent(currentPage)}`}>
  Login
</Link>
```

This way, clicking login from any page remembers where they came from!
