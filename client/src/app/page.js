'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [errorMessage, setErrorMessage] = useState(null);
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check for error parameter
    const error = searchParams.get('error');
    if (error === 'no_right_to_access') {
      setErrorMessage('You do not have permission to access the admin area.');
      
      // Clear the error from URL after displaying it
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url);
      
      // Auto-dismiss error after 5 seconds
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {errorMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-96 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <p>{errorMessage}</p>
        </div>
      )}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">Welcome to SkyRoute</h1>
        <p className="text-xl text-gray-600 mt-4">Your one-stop solution for booking flights worldwide</p>
        <div className="mt-12">
          <button className="bg-gray-900 text-white py-3 px-12 rounded-md text-lg font-medium">
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
