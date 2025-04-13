import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import db from './db';

// Check if user is authenticated and has admin role
export async function isAdmin(request) {
  try {
    // Get auth cookie
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return false;
    }
    
    // Parse user data
    const userData = JSON.parse(authCookie.value);
    const userId = userData.id;
    
    // Check in database if user has admin role
    const [users] = await db.query(
      'SELECT role FROM AirlineUser WHERE user_id = ?',
      [userId]
    );
    
    if (users.length === 0 || users[0].role !== 'admin') {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Admin authentication error:', error);
    return false;
  }
}

// Middleware for admin API routes
export async function adminAuthMiddleware(request) {
  const isAdminUser = await isAdmin(request);
  
  if (!isAdminUser) {
    return NextResponse.json(
      { 
        error: 'Unauthorized access',
        message: 'You do not have permission to access this resource. Admin rights required.' 
      },
      { status: 403 }
    );
  }
  
  return null; // Continue with the request if authorized
} 