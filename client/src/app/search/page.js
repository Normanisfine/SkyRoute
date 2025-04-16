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
    departureTime: ''
  });

  // 从URL获取搜索参数
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const departDate = searchParams.get('departDate');

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        // 这里会是一个真实的API调用
        // const response = await fetch(`/api/flights/search?origin=${origin}&destination=${destination}&date=${departDate}`);
        // const data = await response.json();
        // setFlights(data);

        // 模拟数据
        setTimeout(() => {
          const mockFlights = [
            {
              id: 1,
              flightNumber: 'CA980',
              airline: 'China Eastern',
              origin: origin || 'PVG',
              destination: destination || 'JFK',
              departureTime: '12:59 pm',
              arrivalTime: '3:37 pm',
              duration: '2 h 38 m',
              price: 580,
              date: departDate || '2024-10-15',
              stops: 0
            },
            {
              id: 2,
              flightNumber: 'CA981',
              airline: 'Air China',
              origin: origin || 'PVG',
              destination: destination || 'JFK',
              departureTime: '10:20 am',
              arrivalTime: '2:05 pm',
              duration: '3 h 45 m',
              price: 520,
              date: departDate || '2024-10-15',
              stops: 1
            },
            {
              id: 3,
              flightNumber: 'MU502',
              airline: 'China Eastern',
              origin: origin || 'PVG',
              destination: destination || 'JFK',
              departureTime: '2:30 pm',
              arrivalTime: '5:45 pm',
              duration: '3 h 15 m',
              price: 610,
              date: departDate || '2024-10-15',
              stops: 0
            },
            {
              id: 4,
              flightNumber: 'CZ306',
              airline: 'China Southern',
              origin: origin || 'PVG',
              destination: destination || 'JFK',
              departureTime: '8:15 am',
              arrivalTime: '11:50 am',
              duration: '3 h 35 m',
              price: 490,
              date: departDate || '2024-10-15',
              stops: 1
            }
          ];
          setFlights(mockFlights);
          setFilteredFlights(mockFlights);
          setLoading(false);
        }, 1000);

      } catch (error) {
        console.error('Error fetching flights:', error);
        setLoading(false);
      }
    };

    if (origin && destination && departDate) {
      fetchFlights();
    } else {
      // 如果缺少参数，重定向到搜索页面
      router.push('/flights');
    }
  }, [origin, destination, departDate, router]);

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

    setFilteredFlights(result);
  }, [filters, flights]);

  const handleBookFlight = (flightId) => {
    // 实际应用中，这里会导航到订票页面
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
              {origin || 'PVG'}
              <span className="mx-2 text-gray-400">→</span>
              {destination || 'JFK'}
            </div>
            <div className="text-gray-500">
              {departDate ? new Date(departDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'October 15, 2024'}
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
                        <div className="flex items-center">
                          <div className="flex items-center mr-4">
                            <PlaneIcon />
                            <span className="ml-2 font-medium">{flight.airline}</span>
                          </div>
                          <span className="text-sm text-gray-500">{flight.flightNumber}</span>
                        </div>
                        <div className="text-xl font-bold text-blue-600">${flight.price}</div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="flex items-center mb-2 sm:mb-0">
                          <div className="text-center mr-3">
                            <div className="text-xl font-bold">{flight.departureTime}</div>
                            <div className="text-sm text-gray-500">{flight.origin}</div>
                          </div>
                          <div className="flex flex-col items-center mx-2 px-2">
                            <div className="text-xs text-gray-500">{flight.duration}</div>
                            <div className="w-16 sm:w-24 h-0.5 bg-gray-300 my-1 relative">
                              <div className="absolute top-1/2 left-0 w-2 h-2 bg-blue-600 rounded-full transform -translate-y-1/2"></div>
                              <div className="absolute top-1/2 right-0 w-2 h-2 bg-blue-600 rounded-full transform -translate-y-1/2"></div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                            </div>
                          </div>
                          <div className="text-center ml-3">
                            <div className="text-xl font-bold">{flight.arrivalTime}</div>
                            <div className="text-sm text-gray-500">{flight.destination}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleBookFlight(flight.id)}
                          className="mt-3 sm:mt-0 w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Book Now
                        </button>
                      </div>
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