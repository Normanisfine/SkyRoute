'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ExportPage = () => {
  const router = useRouter();
  const [exportType, setExportType] = useState('bookings');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('json');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('type', exportType);
      params.append('format', format);
      
      if (startDate) {
        params.append('startDate', startDate);
      }
      
      if (endDate) {
        params.append('endDate', endDate);
      }
      
      // For CSV format, we need to handle it differently to trigger download
      if (format === 'csv') {
        // This will trigger the browser's download behavior
        window.location.href = `/api/admin/export?${params.toString()}`;
        setSuccess(`Exporting ${exportType} as CSV...`);
        setLoading(false);
      } else {
        // For JSON, we'll fetch and then download
        const response = await fetch(`/api/admin/export?${params.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to export data');
        }
        
        const data = await response.json();
        
        // Create a JSON file and download it
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setSuccess(`Successfully exported ${data.count} ${exportType} records.`);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      setError(error.message || 'Failed to export data. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header/Navigation would go here */}
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/admin" className="mr-4 text-gray-600 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Export Data</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Export Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Export Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
              >
                <option value="bookings">Bookings</option>
                <option value="flights">Flights</option>
                <option value="passengers">Passengers</option>
                <option value="revenue">Revenue Report</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Optional)</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
              {success}
            </div>
          )}
          
          <div className="mt-6">
            <button
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              onClick={handleExport}
              disabled={loading}
            >
              {loading ? 'Exporting...' : 'Export Data'}
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Export Descriptions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Bookings Export</h3>
              <p className="text-sm text-gray-600">
                Exports all booking records including user information, flight details, seat information, and payment status.
                Useful for tracking reservations and customer service.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Flights Export</h3>
              <p className="text-sm text-gray-600">
                Exports flight information including schedule, aircraft, airline, and booking count.
                Useful for analyzing flight performance and planning.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Passengers Export</h3>
              <p className="text-sm text-gray-600">
                Exports passenger data including associated user accounts and booking count.
                Useful for customer profiling and service improvements.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Revenue Report</h3>
              <p className="text-sm text-gray-600">
                Exports revenue data aggregated by date, class type, and route.
                Includes base fare, premium charges, and total revenue.
                Useful for financial analysis and pricing strategy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPage; 