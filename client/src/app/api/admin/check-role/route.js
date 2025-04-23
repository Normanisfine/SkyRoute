import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Helper function to check admin role
async function checkAdminRole() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('auth');
  
  if (!authCookie) {
    return false;
  }
  
  try {
    const userData = JSON.parse(authCookie.value);
    return userData.role === 'admin';
  } catch (error) {
    console.error('Failed to parse auth cookie:', error);
    return false;
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const userData = JSON.parse(authCookie.value);
    const isAdmin = userData.role === 'admin';
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ isAdmin: true });
  } catch (error) {
    console.error('Error checking admin role:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 