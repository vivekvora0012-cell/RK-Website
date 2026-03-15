import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect all /admin routes, but allow access to /admin/login
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const isAuth = request.cookies.has('admin_auth');

    if (!isAuth) {
      // Redirect to the login page if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Redirect authenticated users away from the login page
  if (path.startsWith('/admin/login')) {
     const isAuth = request.cookies.has('admin_auth');
     if (isAuth) {
         return NextResponse.redirect(new URL('/admin', request.url));
     }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
