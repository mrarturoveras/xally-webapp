import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const SUPABASE_SESSION_COOKIES = ['sb-access-token', 'sb-refresh-token'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = pathname.startsWith('/student') || pathname.startsWith('/teacher');

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const hasSessionCookie = SUPABASE_SESSION_COOKIES.some((cookieName) =>
    request.cookies.has(cookieName),
  );

  if (!hasSessionCookie) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/teacher/:path*'],
};
