'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// 图标组件
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const PlaneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-45">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
  </svg>
);

// Add new status badge component
const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'on-time':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status || 'Unknown'}
    </span>
  );
};

const SearchResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [filters, setFilters] = useState({
    airline: '',
    minPrice: '',
    maxPrice: '',
    departureTime: '',
    status: '' // Add status filter
  });
  const [error, setError] = useState(null);

  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const departDate = searchParams.get('departDate');

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);

        // Format the date to match MySQL date format
        const formattedDate = new Date(departDate).toISOString().split('T')[0];
        
        const response = await fetch(
          `/api/flights/search?` + new URLSearchParams({
            origin: origin,
            destination: destination,
            departDate: formattedDate
          })
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Transform the data to match the component's expected format
        const formattedFlights = data.map(flight => ({
          id: flight.id,
          airline: flight.airline,
          flightNumber: flight.flightNumber,
          origin: flight.origin,
          originCity: flight.originCity,
          destination: flight.destination,
          destinationCity: flight.destinationCity,
          departureTime: new Date(flight.departureDateTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          arrivalTime: new Date(flight.arrivalDateTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          price: flight.lowestPrice,
          duration: calculateDuration(flight.departureDateTime, flight.arrivalDateTime),
          stops: 0,
          status: flight.status,
          availableSeats: flight.availableSeats,
          seatClass: flight.seatClass
        }));

        setFlights(formattedFlights);
        setFilteredFlights(formattedFlights);
      } catch (error) {
        console.error('Error searching flights:', error);
        setError('Failed to load flights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (origin && destination && departDate) {
      fetchFlights();
    } else {
      router.push('/flights');
    }
  }, [origin, destination, departDate, router]);

  // Helper function to calculate flight duration
  const calculateDuration = (departure, arrival) => {
    const start = new Date(departure);
    const end = new Date(arrival);
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let result = [...flights];

    // 航空公司筛选
    if (filters.airline) {
      result = result.filter(flight =>
        flight.airline.toLowerCase().includes(filters.airline.toLowerCase())
      );
    }

    // 价格筛选 - 最低价
    if (filters.minPrice) {
      result = result.filter(flight => flight.price >= parseInt(filters.minPrice));
    }

    // 价格筛选 - 最高价
    if (filters.maxPrice) {
      result = result.filter(flight => flight.price <= parseInt(filters.maxPrice));
    }

    // 出发时间筛选
    if (filters.departureTime) {
      switch (filters.departureTime) {
        case 'morning':
          result = result.filter(flight => {
            const hour = parseInt(flight.departureTime.split(':')[0]);
            return hour >= 5 && hour < 12;
          });
          break;
        case 'afternoon':
          result = result.filter(flight => {
            const hour = parseInt(flight.departureTime.split(':')[0]);
            return hour >= 12 && hour < 18;
          });
          break;
        case 'evening':
          result = result.filter(flight => {
            const hour = parseInt(flight.departureTime.split(':')[0]);
            return hour >= 18 || hour < 5;
          });
          break;
        default:
          break;
      }
    }

    // Add status filter
    if (filters.status) {
      result = result.filter(flight => 
        flight.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    setFilteredFlights(result);
  }, [filters, flights]);

  const handleBookFlight = (flightId) => {
    router.push(`/bookings/new?flightId=${flightId}`);
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

      <div className="container mx-auto px-4 py-8">
        {/* 搜索摘要 */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
          <div>
            <div className="text-xl font-bold flex items-center">
              {origin} <span className="mx-2 text-gray-400">→</span> {destination}
            </div>
            <div className="text-gray-500">
              {new Date(departDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              {filteredFlights.length > 0 && ` · ${filteredFlights.length} flights found`}
            </div>
          </div>
          <button
            onClick={() => router.push('/flights')}
            className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Modify Search
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 筛选侧边栏 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
                <input
                  type="text"
                  name="airline"
                  value={filters.airline}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Airline name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Flight Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="on-time">On Time</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Min"
                    min="0"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Max"
                    min="0"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                <select
                  name="departureTime"
                  value={filters.departureTime}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Time</option>
                  <option value="morning">Morning (5am - 12pm)</option>
                  <option value="afternoon">Afternoon (12pm - 6pm)</option>
                  <option value="evening">Evening (6pm - 5am)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 航班列表 */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <h3 className="text-2xl font-medium text-gray-600">{error}</h3>
                <button
                  onClick={() => router.push('/flights')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  New Search
                </button>
              </div>
            ) : filteredFlights.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <h3 className="text-2xl font-medium text-gray-600">No flights found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria</p>
                <button
                  onClick={() => router.push('/flights')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  New Search
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFlights.map((flight) => (
                  <div key={flight.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <PlaneIcon />
                            <span className="ml-2 font-medium">{flight.airline}</span>
                          </div>
                          <span className="text-sm text-gray-500">{flight.flightNumber}</span>
                          <StatusBadge status={flight.status} />
                        </div>
                        <div className="text-xl font-bold text-blue-600">${flight.price}</div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="flex items-center mb-2 sm:mb-0">
                          <div className="text-center mr-3">
                            <div className="text-xl font-bold">{flight.departureTime}</div>
                            <div className="text-sm text-gray-500">{flight.origin}</div>
                            <div className="text-xs text-gray-400">{flight.originCity}</div>
                          </div>
                          <div className="flex flex-col items-center mx-2 px-2">
                            <div className="text-xs text-gray-500">{flight.duration}</div>
                            <div className="w-16 sm:w-24 h-0.5 bg-gray-300 my-1 relative">
                              <div className="absolute top-1/2 left-0 w-2 h-2 bg-blue-600 rounded-full transform -translate-y-1/2"></div>
                              <div className="absolute top-1/2 right-0 w-2 h-2 bg-blue-600 rounded-full transform -translate-y-1/2"></div>
                            </div>
                            <div className="text-xs text-gray-500">Direct</div>
                          </div>
                          <div className="text-center ml-3">
                            <div className="text-xl font-bold">{flight.arrivalTime}</div>
                            <div className="text-sm text-gray-500">{flight.destination}</div>
                            <div className="text-xs text-gray-400">{flight.destinationCity}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleBookFlight(flight.id)}
                          disabled={flight.status?.toLowerCase() === 'cancelled'}
                          className={`mt-3 sm:mt-0 w-full sm:w-auto px-6 py-2 font-medium rounded-lg transition-colors
                            ${flight.status?.toLowerCase() === 'cancelled' 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                          {flight.status?.toLowerCase() === 'cancelled' ? 'Unavailable' : 'Book Now'}
                        </button>
                      </div>

                      {/* Show delay warning if applicable */}
                      {flight.status?.toLowerCase() === 'delayed' && (
                        <div className="mt-3 p-2 bg-yellow-50 text-yellow-700 text-sm rounded">
                          ⚠️ This flight is currently experiencing delays. Please check back for updates.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;