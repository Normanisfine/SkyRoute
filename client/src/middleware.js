// src/middleware.js
import { NextResponse } from 'next/server';
import db from './utils/db';
import { cookies } from 'next/headers';

export async function middleware(request) {
  const authCookie = request.cookies.get('auth');
  const isLoggedIn = !!authCookie?.value;
  
  // Paths that don't require authentication
  const publicPaths = ['/login', '/api/login', '/register', '/api/test', '/api/register'];
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // Admin paths that require admin role
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

  // Redirect to login if not logged in and not a public path
  if (!isLoggedIn && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect logged-in user from login page to home
  if (isLoggedIn && request.nextUrl.pathname === '/login') {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  // Check admin access for admin paths
  if (isLoggedIn && isAdminPath) {
    try {
      // Parse auth cookie to get user ID
      const userData = JSON.parse(authCookie.value);
      const userId = userData.id;
      
      // Connect to database and check user role
      const [users] = await db.query(
        'SELECT role FROM AirlineUser WHERE user_id = ?',
        [userId]
      );
      
      // If user not found or not admin, redirect to home with error message
      if (users.length === 0 || users[0].role !== 'admin') {
        const homeUrl = new URL('/', request.url);
        homeUrl.searchParams.set('error', 'no_right_to_access');
        return NextResponse.redirect(homeUrl);
      }
    } catch (error) {
      console.error('Admin access check error:', error);
      // If any error occurs, redirect to home for safety with error message
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('error', 'no_right_to_access');
      return NextResponse.redirect(homeUrl);
    }
  }
  
  return NextResponse.next();
}

// Specify which paths this middleware will run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};