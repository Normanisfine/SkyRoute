// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const authCookie = request.cookies.get('auth');
  const isLoggedIn = !!authCookie?.value;
  
  // Try to parse the auth cookie to get user data
  let userData = null;
  if (isLoggedIn) {
    try {
      userData = JSON.parse(authCookie.value);
    } catch (error) {
      console.error('Failed to parse auth cookie:', error);
    }
  }
  
  // Check if user is admin 
  const isAdmin = userData?.role === 'admin';
  
  // Paths that don't require authentication
  const publicPaths = ['/login', '/api/login', '/register', '/api/test', '/api/register'];
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
  
  // Admin-only paths
  const adminPaths = ['/admin', '/api/admin'];
  const isAdminPath = adminPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // Redirect logic for authentication
  if (!isLoggedIn && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect logic for admin authorization
  if (isLoggedIn && isAdminPath && !isAdmin) {
    // User is logged in but not an admin, trying to access admin paths
    const homeUrl = new URL('/', request.url);
    // You could add a query parameter to show an error message
    homeUrl.searchParams.set('error', 'unauthorized');
    return NextResponse.redirect(homeUrl);
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