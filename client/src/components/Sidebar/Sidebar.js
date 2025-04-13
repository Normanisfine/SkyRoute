'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlaneTakeoff, ClipboardList, User, Shield } from 'lucide-react';

export default function Sidebar() {
  const [activeIcon, setActiveIcon] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is admin on component mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/user/role');
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.role === 'admin');
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
          >
            <PlaneTakeoff/>
          </div>
        </Link>
        
        <Link href="/bookings">
          <div 
            className={`p-4 rounded-md cursor-pointer hover:bg-gray-200 ${activeIcon === 'bookings' ? 'bg-white' : ''}`}
            onClick={() => setActiveIcon('bookings')}
          >
            <ClipboardList/>
          </div>
        </Link>
        
        <Link href="/profile">
          <div 
            className={`p-4 rounded-md cursor-pointer hover:bg-gray-200 ${activeIcon === 'profile' ? 'bg-white' : ''}`}
            onClick={() => setActiveIcon('profile')}
          >
            <User/>
          </div>
        </Link>
        
        {/* Only show Admin link if user is admin */}
        {isAdmin && (
          <Link href="/admin">
            <div 
              className={`p-4 rounded-md cursor-pointer hover:bg-gray-200 ${activeIcon === 'admin' ? 'bg-white' : ''}`}
              onClick={() => setActiveIcon('admin')}
            >
              <Shield/>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}