'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlaneTakeoff, ClipboardList, User, Settings } from 'lucide-react';

export default function Sidebar() {
  const [activeIcon, setActiveIcon] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if the user has admin role
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/auth/check-role');
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  return (
    <div className="h-screen bg-gray-300 w-32 flex flex-col items-center pt-10">
      <Link href="/">
      <div className="mb-12">
        <h1 className="text-3xl font-bold">Sk.</h1>
      </div>
      </Link>
      
      <div className="flex flex-col gap-8">
        <Link href="/search">
          <div 
            className={`p-4 rounded-md cursor-pointer hover:bg-gray-200 ${activeIcon === 'home' ? 'bg-white' : ''}`}
            onClick={() => setActiveIcon('home')}
            title="Search Flights"
          >
            <PlaneTakeoff/>
          </div>
        </Link>
        
        <Link href="/bookings">
          <div 
            className={`p-4 rounded-md cursor-pointer hover:bg-gray-200 ${activeIcon === 'bookings' ? 'bg-white' : ''}`}
            onClick={() => setActiveIcon('bookings')}
            title="My Bookings"
          >
            <ClipboardList/>
          </div>
        </Link>
        
        <Link href="/profile">
          <div 
            className={`p-4 rounded-md cursor-pointer hover:bg-gray-200 ${activeIcon === 'profile' ? 'bg-white' : ''}`}
            onClick={() => setActiveIcon('profile')}
            title="My Profile"
          >
            <User/>
          </div>
        </Link>
        
        {/* Admin button - only visible for admin users */}
        {isAdmin && (
          <Link href="/admin">
            <div 
              className={`p-4 rounded-md cursor-pointer hover:bg-gray-200 ${activeIcon === 'admin' ? 'bg-white' : 'bg-gray-300'}`}
              onClick={() => setActiveIcon('admin')}
              title="Admin Dashboard"
            >
              <Settings className="mx-auto"/>
              <span className="text-xs block mt-1 text-center">Admin</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}