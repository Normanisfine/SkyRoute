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

const BookingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [flightData, setFlightData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [savedPassengers, setSavedPassengers] = useState([]);
  const [selectedPassenger, setSelectedPassenger] = useState('self');
  const [bookingForm, setBookingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    passportNumber: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loadingPassengers, setLoadingPassengers] = useState(true);
  const [seats, setSeats] = useState({});
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [premiumPrice, setPremiumPrice] = useState(0);

  // 从URL获取航班ID
  const flightId = searchParams.get('flightId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingPassengers(true);
        setLoadingSeats(true);
        
        // Fetch real flight data from API
        const flightResponse = await fetch(`/api/flights/${flightId}`);
        if (!flightResponse.ok) {
          throw new Error('Failed to fetch flight details');
        }
        const flightDbData = await flightResponse.json();
        
        // Process flight data for display
        const processedFlightData = {
          id: flightDbData.flight_id,
          flightNumber: flightDbData.flight_number,
          airline: flightDbData.airline,
          origin: flightDbData.origin,
          destination: flightDbData.destination,
          departureTime: formatTime(flightDbData.departure_time),
          arrivalTime: formatTime(flightDbData.arrival_time),
          duration: calculateDuration(flightDbData.departure_time, flightDbData.arrival_time),
          price: flightDbData.basic_price,
          date: formatDate(flightDbData.departure_time),
          stops: 0, // Assuming direct flights for now
          departureAirport: flightDbData.departure_airport,
          arrivalAirport: flightDbData.arrival_airport
        };
        
        setFlightData(processedFlightData);
        setBasePrice(parseFloat(flightDbData.basic_price));
        setTotalPrice(parseFloat(flightDbData.basic_price));
        
        // Fetch user profile
        const profileResponse = await fetch('/api/profile');
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const profile = await profileResponse.json();
        setUserData(profile);
        
        // Split name into first and last name
        const nameParts = profile.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        // Pre-fill form with user data
        setBookingForm({
          firstName,
          lastName,
          email: profile.email || '',
          phone: profile.phone || '',
          passportNumber: profile.passport_number || '',
        });
        
        // Fetch saved passengers
        try {
          const passengersResponse = await fetch('/api/passengers');
          if (passengersResponse.ok) {
            const passengers = await passengersResponse.json();
            setSavedPassengers(passengers);
          }
        } catch (err) {
          console.error('Error fetching passengers:', err);
        }
        
        // Fetch available seats
        try {
          const seatsResponse = await fetch(`/api/flights/${flightId}/seats`);
          if (seatsResponse.ok) {
            const seatsData = await seatsResponse.json();
            setSeats(seatsData);
          } else {
            console.error('Error fetching seats:', await seatsResponse.text());
          }
        } catch (err) {
          console.error('Error fetching seats:', err);
        }
        
        setLoadingPassengers(false);
        setLoadingSeats(false);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        setLoadingPassengers(false);
        setLoadingSeats(false);
        setError('Failed to load data. Please try again.');
      }
    };

    if (flightId) {
      fetchData();
    } else {
      // Redirect to search page if no flight ID
      router.push('/flights');
    }
  }, [flightId, router]);

  // Helper functions for formatting data
  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
  };
  
  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    const date = new Date(dateTimeString);
    return date.toISOString().split('T')[0];
  };
  
  const calculateDuration = (departureTime, arrivalTime) => {
    if (!departureTime || !arrivalTime) return '';
    
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const durationMs = arrival - departure;
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePassengerChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedPassenger(selectedValue);
    
    if (selectedValue === 'self') {
      // Fill form with user's own information
      if (userData) {
        const nameParts = userData.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        setBookingForm({
          firstName,
          lastName,
          email: userData.email || '',
          phone: userData.phone || '',
          passportNumber: userData.passport_number || '',
        });
      }
    } else {
      // Fill form with selected passenger's information
      const passenger = savedPassengers.find(p => p.id.toString() === selectedValue);
      if (passenger) {
        const nameParts = passenger.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        setBookingForm({
          firstName,
          lastName,
          email: userData?.email || '', // Use user's email
          phone: userData?.phone || '',
          passportNumber: passenger.passport_number || '',
        });
      }
    }
  };

  const handleSeatSelection = (seatId, seatInfo) => {
    if (seatInfo.isBooked) {
      return; // Don't allow selecting booked seats
    }
    
    // Store the full seat info
    setSelectedSeat(seatInfo);
    
    // Calculate the total price as the sum of base price and premium
    const newTotalPrice = parseFloat(basePrice) + parseFloat(seatInfo.premium);
    
    // Update state with the new values
    setTotalPrice(newTotalPrice);
    setPremiumPrice(parseFloat(seatInfo.premium));
    
    console.log('Selected seat:', seatInfo);
    console.log('New total price:', newTotalPrice);
    console.log('Base price:', basePrice);
    console.log('Premium:', seatInfo.premium);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('Please agree to the terms and conditions to continue.');
      return;
    }
    
    if (!selectedSeat) {
      setError('Please select a seat to continue.');
      return;
    }

    try {
      setSubmitLoading(true);
      setError(null);
      
      // Prepare booking data
      const bookingData = {
        flightId: flightData.id,
        passenger: bookingForm,
        passengerId: selectedPassenger !== 'self' ? selectedPassenger : 'self',
        paymentMethod,
        priceId: selectedSeat.priceId  // Include the price ID from the selected seat
      };
      
      // Call API to create booking
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to book flight');
      }
      
      // On success, redirect to bookings page
      router.push('/bookings');
    } catch (error) {
      console.error('Error booking flight:', error);
      setError(error.message || 'Failed to book flight. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
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
            <Link href="/flights" className="text-gray-600 hover:text-blue-600 font-medium">Flights</Link>
            <Link href="/bookings" className="text-gray-600 hover:text-blue-600 font-medium">My Orders</Link>
            <Link href="/profile" className="text-gray-600 hover:text-blue-600">
              <UserIcon />
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Book Your Flight</h1>

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          ) : (
            <>
              {/* 航班信息卡片 */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Flight Details</h2>
                  <div className="text-right">
                    <span className="text-xl font-bold text-blue-600">${(basePrice + premiumPrice).toFixed(2)}</span>
                    {premiumPrice > 0 && (
                      <div className="text-sm text-gray-500">
                        Base: ${basePrice.toFixed(2)} + Premium: ${premiumPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="mr-2">
                      <PlaneIcon />
                    </div>
                    <div>
                      <div className="font-medium">{flightData.airline}</div>
                      <div className="text-sm text-gray-500">{flightData.flightNumber}</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {new Date(flightData.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="text-center mr-3">
                    <div className="text-xl font-bold">{flightData.departureTime}</div>
                    <div className="text-sm text-gray-500">{flightData.origin}</div>
                  </div>
                  <div className="flex flex-col items-center mx-2 px-2">
                    <div className="text-xs text-gray-500">{flightData.duration}</div>
                    <div className="w-16 sm:w-24 h-0.5 bg-gray-300 my-1 relative">
                      <div className="absolute top-1/2 left-0 w-2 h-2 bg-blue-600 rounded-full transform -translate-y-1/2"></div>
                      <div className="absolute top-1/2 right-0 w-2 h-2 bg-blue-600 rounded-full transform -translate-y-1/2"></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {flightData.stops === 0 ? 'Nonstop' : `${flightData.stops} stop${flightData.stops > 1 ? 's' : ''}`}
                    </div>
                  </div>
                  <div className="text-center ml-3">
                    <div className="text-xl font-bold">{flightData.arrivalTime}</div>
                    <div className="text-sm text-gray-500">{flightData.destination}</div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <div><span className="font-medium">From:</span> {flightData.departureAirport}</div>
                  <div><span className="font-medium">To:</span> {flightData.arrivalAirport}</div>
                </div>
              </div>

              {/* 乘客信息表单 */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Your Seat</h2>
                
                {loadingSeats ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : Object.keys(seats).length === 0 ? (
                  <div className="text-center py-6 text-gray-500">No seats available for this flight.</div>
                ) : (
                  <div>
                    {/* Seat Legend */}
                    <div className="flex justify-center gap-6 mb-6">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-white border border-gray-300 rounded mr-2"></div>
                        <span className="text-sm">Available</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-blue-100 border border-blue-500 rounded mr-2"></div>
                        <span className="text-sm">Selected</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-200 border border-gray-400 rounded mr-2"></div>
                        <span className="text-sm">Booked</span>
                      </div>
                    </div>
                    
                    {/* Seat Selection by Class */}
                    {Object.entries(seats).map(([classType, seatsList]) => (
                      <div key={classType} className="mb-8">
                        <h3 className="font-medium text-lg mb-3">{classType} Class</h3>
                        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                          {seatsList.map(seat => (
                            <button
                              key={seat.id}
                              type="button"
                              className={`
                                p-2 rounded text-center text-sm
                                ${seat.isBooked ? 
                                  'bg-gray-200 text-gray-500 cursor-not-allowed' : 
                                  selectedSeat === seat ?
                                  'bg-blue-100 border border-blue-500' :
                                  'bg-white border border-gray-300 hover:border-blue-500'
                                }
                              `}
                              disabled={seat.isBooked}
                              onClick={() => handleSeatSelection(seat.id, seat)}
                            >
                              <div>{seat.number}</div>
                              <div className="text-xs font-medium">
                                ${seat.totalPrice.toFixed(2)}
                              </div>
                              {seat.premium > 0 && (
                                <div className="text-xs text-gray-500">
                                  +${seat.premium.toFixed(2)}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {selectedSeat ? (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                          You've selected a seat with a base price of ${basePrice.toFixed(2)} 
                          {premiumPrice > 0 ? ` and a premium of $${premiumPrice.toFixed(2)}` : ''}.
                          Total: <span className="font-semibold">${(basePrice + premiumPrice).toFixed(2)}</span>
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-700">
                          Please select a seat to continue with your booking.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Passenger Information</h2>
                
                {/* Passenger selection dropdown */}
                <div className="mb-6">
                  <label htmlFor="passengerSelect" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Passenger
                  </label>
                  {loadingPassengers ? (
                    <div className="py-2 text-gray-500">Loading passengers...</div>
                  ) : (
                    <>
                      <select
                        id="passengerSelect"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedPassenger}
                        onChange={handlePassengerChange}
                      >
                        <option value="self">Myself</option>
                        {savedPassengers.map(passenger => (
                          <option key={passenger.id} value={passenger.id.toString()}>
                            {passenger.name} ({passenger.passport_number})
                          </option>
                        ))}
                      </select>
                      <div className="mt-2 text-sm text-gray-500">
                        <Link href="/profile" className="text-blue-600 hover:text-blue-800">
                          Manage saved passengers
                        </Link>
                      </div>
                    </>
                  )}
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={bookingForm.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={bookingForm.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={bookingForm.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={bookingForm.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                    <input
                      type="text"
                      id="passportNumber"
                      name="passportNumber"
                      value={bookingForm.passportNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* 支付方式 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Payment Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'credit' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                        onClick={() => setPaymentMethod('credit')}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="credit"
                            name="paymentMethod"
                            checked={paymentMethod === 'credit'}
                            onChange={() => setPaymentMethod('credit')}
                            className="mr-2"
                          />
                          <label htmlFor="credit" className="cursor-pointer">Credit Card</label>
                        </div>
                      </div>
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                        onClick={() => setPaymentMethod('paypal')}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="paypal"
                            name="paymentMethod"
                            checked={paymentMethod === 'paypal'}
                            onChange={() => setPaymentMethod('paypal')}
                            className="mr-2"
                          />
                          <label htmlFor="paypal" className="cursor-pointer">PayPal</label>
                        </div>
                      </div>
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'alipay' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                        onClick={() => setPaymentMethod('alipay')}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="alipay"
                            name="paymentMethod"
                            checked={paymentMethod === 'alipay'}
                            onChange={() => setPaymentMethod('alipay')}
                            className="mr-2"
                          />
                          <label htmlFor="alipay" className="cursor-pointer">Alipay</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700">
                        I agree to the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      disabled={submitLoading}
                    >
                      {submitLoading ? 'Processing...' : 'Confirm and Pay'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 