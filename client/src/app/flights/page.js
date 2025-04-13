'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 图标组件
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const SearchPage = () => {
  const router = useRouter();
  const [searchForm, setSearchForm] = useState({
    origin: '',
    destination: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    class: 'Economy'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 在实际应用中，这里会导航到搜索结果页面
    router.push(`/search?origin=${searchForm.origin}&destination=${searchForm.destination}&departDate=${searchForm.departDate}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center">
            <span className="font-black">Sk.</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/flights" className="text-blue-600 font-medium">Flights</Link>
            <Link href="/bookings" className="text-gray-600 hover:text-blue-600 font-medium">My Orders</Link>
            <Link href="/profile" className="text-gray-600 hover:text-blue-600">
              <UserIcon />
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Find your perfect flight</h1>
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    value={searchForm.origin}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City or airport"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={searchForm.destination}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City or airport"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="departDate" className="block text-sm font-medium text-gray-700 mb-1">Depart Date</label>
                  <input
                    type="date"
                    id="departDate"
                    name="departDate"
                    value={searchForm.departDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">Return Date (Optional)</label>
                  <input
                    type="date"
                    id="returnDate"
                    name="returnDate"
                    value={searchForm.returnDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                  <select
                    id="passengers"
                    name="passengers"
                    value={searchForm.passengers}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    id="class"
                    name="class"
                    value={searchForm.class}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First Class</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search Flights
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Popular destinations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { city: 'Shanghai', code: 'PVG', image: 'https://images.unsplash.com/photo-1576456486082-119267db98e0?q=80&w=300&h=200&crop=entropy' },
                { city: 'New York', code: 'JFK', image: 'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?q=80&w=300&h=200&crop=entropy' },
                { city: 'Tokyo', code: 'HND', image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?q=80&w=300&h=200&crop=entropy' },
                { city: 'London', code: 'LHR', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=300&h=200&crop=entropy' },
                { city: 'Paris', code: 'CDG', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=300&h=200&crop=entropy' },
                { city: 'Singapore', code: 'SIN', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=300&h=200&crop=entropy' },
              ].map((destination) => (
                <div
                  key={destination.code}
                  className="bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSearchForm(prev => ({ ...prev, destination: destination.code }));
                  }}
                >
                  <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${destination.image})` }}></div>
                  <div className="p-3">
                    <h3 className="font-medium">{destination.city}</h3>
                    <p className="text-sm text-gray-500">{destination.code}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 