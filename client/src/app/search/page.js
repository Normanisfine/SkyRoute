'use client';

import { useState, useEffect, Suspense } from 'react';
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

const BookmarkIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
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

const SearchResults = () => {
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
  const [savedFlights, setSavedFlights] = useState(new Set());
  const [savingFlightId, setSavingFlightId] = useState(null);

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
          price: flight.price,
          duration: calculateDuration(flight.departureDateTime, flight.arrivalDateTime),
          stops: 0,
          status: flight.status,
          availableSeats: flight.availableSeats,
          seatClass: flight.seatClass,
          departureDateTime: flight.departureDateTime,
          arrivalDateTime: flight.arrivalDateTime
        }));

        setFlights(formattedFlights);
        setFilteredFlights(formattedFlights);
        
        // Fetch saved flights for the current user
        fetchSavedFlights();
      } catch (error) {
        console.error('Error searching flights:', error);
        setError('Failed to load flights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    const fetchSavedFlights = async () => {
      try {
        const response = await fetch('/api/flights/saved');
        if (response.ok) {
          const data = await response.json();
          // Create a Set of saved flight IDs for easy lookup
          setSavedFlights(new Set(data.map(flight => flight.flight_id)));
        }
      } catch (error) {
        console.error('Error fetching saved flights:', error);
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

    // Airline filter
    if (filters.airline) {
      result = result.filter(flight =>
        flight.airline.toLowerCase().includes(filters.airline.toLowerCase())
      );
    }

    // Price filter - min price
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      result = result.filter(flight => flight.price >= minPrice);
    }

    // Price filter - max price
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      result = result.filter(flight => flight.price <= maxPrice);
    }

    // Departure time filter
    if (filters.departureTime) {
      switch (filters.departureTime) {
        case 'morning':
          result = result.filter(flight => {
            const hour = new Date(flight.departureDateTime).getHours();
            return hour >= 5 && hour < 12;
          });
          break;
        case 'afternoon':
          result = result.filter(flight => {
            const hour = new Date(flight.departureDateTime).getHours();
            return hour >= 12 && hour < 18;
          });
          break;
        case 'evening':
          result = result.filter(flight => {
            const hour = new Date(flight.departureDateTime).getHours();
            return hour >= 18 || hour < 5;
          });
          break;
        default:
          break;
      }
    }

    // Status filter
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
  
  const handleSaveFlight = async (flightId) => {
    try {
      // Set this flight as currently saving
      setSavingFlightId(flightId);
      
      const response = await fetch('/api/flights/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flightId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save flight');
      }
      
      // Update the saved flights set
      setSavedFlights(prev => new Set([...prev, flightId]));
      
      // Optional: Show toast/feedback
    } catch (error) {
      console.error('Error saving flight:', error);
      // Optional: Show error toast/feedback
    } finally {
      // Remove the saving state
      setSavingFlightId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search summary */}
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
          {/* Filter sidebar and flight list */}
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

              <div className="mb-6">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Min ($)</label>
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Min"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Max ($)</label>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Max"
                      min="0"
                    />
                  </div>
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

          {/* Flight list */}
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

                        <div className="flex mt-3 sm:mt-0 w-full sm:w-auto gap-2">
                          {/* Save Flight Button */}
                          <button
                            onClick={() => handleSaveFlight(flight.id)}
                            disabled={savedFlights.has(flight.id) || savingFlightId === flight.id}
                            className={`
                              px-3 py-2 rounded-lg flex items-center justify-center
                              ${savedFlights.has(flight.id) 
                                ? 'bg-gray-100 text-gray-700' 
                                : 'bg-white border border-blue-500 text-blue-600 hover:bg-blue-50'
                              }
                            `}
                          >
                            <BookmarkIcon filled={savedFlights.has(flight.id)} />
                            <span className="ml-1">
                              {savingFlightId === flight.id ? 'Saving...' : 
                               savedFlights.has(flight.id) ? 'Saved' : 'Save'}
                            </span>
                          </button>
                          
                          {/* Book Now Button */}
                          <button
                            onClick={() => handleBookFlight(flight.id)}
                            disabled={flight.status?.toLowerCase() === 'cancelled'}
                            className={`
                              flex-grow px-6 py-2 font-medium rounded-lg transition-colors
                              ${flight.status?.toLowerCase() === 'cancelled' 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                              }
                            `}
                          >
                            {flight.status?.toLowerCase() === 'cancelled' ? 'Unavailable' : 'Book Now'}
                          </button>
                        </div>
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

// Main component with Suspense boundary
const SearchResultPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
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

      <Suspense fallback={
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
        <SearchResults />
      </Suspense>
    </div>
  );
};

export default SearchResultPage;