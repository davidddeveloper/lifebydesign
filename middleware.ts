import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // Subdomain routing: audit.startupbodyshop.com → /constraint-audit
  if (host.startsWith('audit.')) {
    // If already on constraint-audit path or its assets, continue
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone();
      url.pathname = '/constraint-audit';
      return NextResponse.rewrite(url);
    }
    // For other paths on audit subdomain, rewrite to constraint-audit subpaths if needed
    if (!pathname.startsWith('/constraint-audit') && !pathname.startsWith('/_next') && !pathname.startsWith('/api') && !pathname.startsWith('/images')) {
      const url = request.nextUrl.clone();
      url.pathname = `/constraint-audit${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Only protect /admin routes (except the login page and auth API)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/api/admin/auth')) {
    const authCookie = request.cookies.get('admin-auth');

    if (!authCookie || authCookie.value !== (process.env.ADMIN_AUTH_SECRET || 'startup-admin-2026')) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
