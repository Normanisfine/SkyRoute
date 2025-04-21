'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 图标组件
const PlaneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-45 mr-1">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const BookingPage = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    airline: '',
    destination: '',
    passenger: '',
    departure: ''
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/bookings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredBookings = bookings.filter(booking => {
    return (
      (filters.airline === '' || booking.airline.toLowerCase().includes(filters.airline.toLowerCase())) &&
      (filters.destination === '' || booking.destination.toLowerCase().includes(filters.destination.toLowerCase())) &&
      (filters.passenger === '' || booking.passenger.toLowerCase().includes(filters.passenger.toLowerCase())) &&
      (filters.departure === '' || booking.date.includes(filters.departure))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">No bookings found</h2>
        <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
        <Link 
          href="/flights" 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Book a Flight
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center">
            <span className="font-black">Sk.</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/flights" className="text-gray-600 hover:text-blue-600 font-medium">Flights</Link>
            <Link href="/bookings" className="text-blue-600 font-medium">My Orders</Link>
            <Link href="/profile" className="text-gray-600 hover:text-blue-600">
              <UserIcon />
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Your orders</h1>

        {/* 过滤区域 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="airline" className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
              <input
                type="text"
                id="airline"
                name="airline"
                value={filters.airline}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Airline"
              />
            </div>
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={filters.destination}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Destination"
              />
            </div>
            <div>
              <label htmlFor="passenger" className="block text-sm font-medium text-gray-700 mb-1">Passenger</label>
              <input
                type="text"
                id="passenger"
                name="passenger"
                value={filters.passenger}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Passenger"
              />
            </div>
            <div>
              <label htmlFor="departure" className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
              <input
                type="date"
                id="departure"
                name="departure"
                value={filters.departure}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 订单列表 */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <h3 className="text-2xl font-medium text-gray-600">No bookings found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or book a new flight</p>
              <button
                onClick={() => router.push('/flights')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book a Flight
              </button>
            </div>
          ) : (
            filteredBookings.map((booking) => {
              // Ensure prices are numbers
              const price = typeof booking.price === 'number' ? booking.price : parseFloat(booking.price || 0);
              const basePrice = typeof booking.basePrice === 'number' ? booking.basePrice : parseFloat(booking.basePrice || 0);
              const premiumPrice = typeof booking.premiumPrice === 'number' ? booking.premiumPrice : parseFloat(booking.premiumPrice || 0);

              return (
                <div key={booking.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between">
                      {/* 出发和到达信息 */}
                      <div className="flex-1 mb-4 md:mb-0">
                        <div className="text-sm text-gray-500 mb-1">Destination</div>
                        <div className="flex items-center">
                          <span className="text-lg font-bold">{booking.origin}</span>
                          <div className="mx-2 text-gray-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14"></path>
                              <path d="m12 5 7 7-7 7"></path>
                            </svg>
                          </div>
                          <span className="text-lg font-bold">{booking.destination}</span>
                        </div>
                      </div>

                      {/* 时间信息 */}
                      <div className="flex-1 mb-4 md:mb-0">
                        <div className="text-sm text-gray-500 mb-1">Time</div>
                        <div className="text-lg font-bold">{booking.departureTime} - {booking.arrivalTime}</div>
                      </div>

                      {/* 行程时长 */}
                      <div className="flex-1 mb-4 md:mb-0">
                        <div className="text-sm text-gray-500 mb-1">Duration</div>
                        <div className="text-lg font-bold flex items-center">
                          {booking.duration}
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">Nonstop</span>
                        </div>
                      </div>

                      {/* 座位信息 */}
                      <div className="flex-1 mb-4 md:mb-0">
                        <div className="text-sm text-gray-500 mb-1">Seat</div>
                        <div className="text-lg font-bold">{booking.seat}</div>
                      </div>

                      {/* 旅客信息 */}
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">Passenger</div>
                        <div className="text-lg font-bold">{booking.passenger}</div>
                      </div>
                    </div>

                    {/* 底部详细信息和操作按钮 */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center">
                      <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-0">
                        <div className="flex items-center mr-4 mb-2 sm:mb-0">
                          <PlaneIcon />
                          <span className="text-sm font-medium">{booking.flightNumber}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        {booking.isRoundTrip && (
                          <span className="ml-3 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">Round trip</span>
                        )}
                        <span className={`ml-3 px-2 py-0.5 ${booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                          } text-xs font-medium rounded`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          onClick={() => router.push(`/bookings/${booking.id}`)}
                        >
                          View details
                        </button>
                        <button
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                          onClick={() => router.push(`/checkin/${booking.id}`)}
                        >
                          Check-in
                        </button>
                      </div>
                    </div>

                    {/* Price breakdown */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="text-xl font-bold text-blue-600">
                        ${price.toFixed(2)}
                        {booking.basePrice && booking.premiumPrice && (
                          <div className="text-xs text-gray-500">
                            Base: ${basePrice.toFixed(2)} + Premium: ${premiumPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
