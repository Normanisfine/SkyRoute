'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlaneTakeoff, ClipboardList, User } from 'lucide-react';

export default function Sidebar() {
  const [activeIcon, setActiveIcon] = useState('home');
  
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
      </div>
    </div>
  );
}