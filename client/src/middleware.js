// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const authCookie = request.cookies.get('auth');
  const isLoggedIn = !!authCookie?.value;
  
  // Paths that don't require authentication
  const publicPaths = ['/login', '/api/login', '/register', '/api/test','/api/register'];
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // Redirect logic
  if (!isLoggedIn && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  if (isLoggedIn && request.nextUrl.pathname === '/login') {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }
  
  return NextResponse.next();
}

// Specify which paths this middleware will run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};