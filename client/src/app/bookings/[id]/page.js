'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// Icons
const PlaneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-45">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LuggageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 20h12M8 7V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M3 7h18v13H3z"></path>
  </svg>
);

const TicketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
    <path d="M13 5v2"></path>
    <path d="M13 17v2"></path>
    <path d="M13 11v2"></path>
  </svg>
);

const BookingDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/bookings/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }

        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError('Failed to load booking details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBookingDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-lg w-full">
          <h3 className="text-2xl font-medium text-gray-600 mb-4">{error || 'Booking not found'}</h3>
          <p className="text-gray-500 mb-6">We couldn't find the booking you're looking for.</p>
          <Link 
            href="/bookings" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
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
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.back()} 
            className="mr-4 text-gray-600 hover:text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Booking Details</h1>
        </div>

        {/* Booking Status Banner */}
        <div className={`rounded-xl p-4 mb-6 ${
          booking.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
          booking.status === 'Paid' ? 'bg-green-50 text-green-700' :
          'bg-yellow-50 text-yellow-700'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Booking #{booking.id}</h2>
              <p>Status: {booking.status}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">Booked on: {new Date(booking.bookingTime).toLocaleDateString()}</p>
              <p>Payment: {booking.paymentStatus} ({booking.paymentMethod})</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flight Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Flight Information</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  booking.flight.status.toLowerCase() === 'on-time' ? 'bg-green-100 text-green-800' :
                  booking.flight.status.toLowerCase() === 'delayed' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.flight.status}
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <PlaneIcon />
                  <span className="ml-2 font-medium">{booking.flight.airline}</span>
                </div>
                <span className="text-sm text-gray-500">{booking.flight.flightNumber}</span>
                <span className="text-sm text-gray-500">Aircraft: {booking.flight.aircraftModel}</span>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="text-center mr-3">
                    <div className="text-xl font-bold">{booking.flight.departure.formattedTime}</div>
                    <div className="text-sm text-gray-500">{booking.flight.departure.code}</div>
                    <div className="text-xs text-gray-400">{booking.flight.departure.city}</div>
                  </div>
                  <div className="flex flex-col items-center mx-2 px-4">
                    <div className="text-xs text-gray-500">{booking.flight.duration}</div>
                    <div className="w-16 sm:w-32 h-0.5 bg-gray-300 my-1 relative">
                      <div className="absolute top-1/2 left-0 w-2 h-2 bg-blue-600 rounded-full transform -translate-y-1/2"></div>
                      <div className="absolute top-1/2 right-0 w-2 h-2 bg-blue-600 rounded-full transform -translate-y-1/2"></div>
                    </div>
                    <div className="text-xs text-gray-500">Direct</div>
                  </div>
                  <div className="text-center ml-3">
                    <div className="text-xl font-bold">{booking.flight.arrival.formattedTime}</div>
                    <div className="text-sm text-gray-500">{booking.flight.arrival.code}</div>
                    <div className="text-xs text-gray-400">{booking.flight.arrival.city}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Departure</h3>
                  <p className="font-medium">{booking.flight.departure.airport}</p>
                  <p className="text-sm">{booking.flight.departure.city}, {booking.flight.departure.country}</p>
                  <p className="text-sm">{booking.flight.departure.formattedDate}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Arrival</h3>
                  <p className="font-medium">{booking.flight.arrival.airport}</p>
                  <p className="text-sm">{booking.flight.arrival.city}, {booking.flight.arrival.country}</p>
                  <p className="text-sm">{booking.flight.arrival.formattedDate}</p>
                </div>
              </div>

              {/* Seat Information */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-medium mb-3">Seat Information</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg font-bold">
                    {booking.seat.number}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{booking.seat.classType} Class</p>
                    <p className="text-sm text-gray-500">
                      {booking.seat.classType === 'First' 
                        ? 'Priority boarding, Premium meals, Extra legroom' 
                        : booking.seat.classType === 'Business' 
                        ? 'Priority boarding, Business meals, Extra comfort' 
                        : 'Standard service'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Passenger Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Full Name</h3>
                  <p className="font-medium">{booking.passenger.name}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Passport Number</h3>
                  <p className="font-medium">{booking.passenger.passportNumber}</p>
                </div>
                {booking.passenger.dateOfBirth && (
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Date of Birth</h3>
                    <p className="font-medium">{new Date(booking.passenger.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Luggage Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Luggage Information</h2>
              
              {booking.luggage.length === 0 ? (
                <div className="text-gray-500">No luggage registered for this booking.</div>
              ) : (
                <div className="space-y-4">
                  {booking.luggage.map(item => (
                    <div key={item.id} className="flex items-start">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-4">
                        <LuggageIcon />
                      </div>
                      <div>
                        <p className="font-medium">Luggage #{item.id}</p>
                        <p className="text-sm text-gray-500">Weight: {item.weight} kg</p>
                        <p className="text-sm text-gray-500">Dimensions: {item.dimensions}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4">
                <button 
                  className="text-blue-600 font-medium hover:text-blue-800"
                  onClick={() => alert('Luggage management functionality would go here')}
                >
                  + Add luggage
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Price Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Fare</span>
                  <span>${booking.price.base.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seat Premium</span>
                  <span>${booking.price.premium.toFixed(2)}</span>
                </div>
                {booking.luggage.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Luggage Fee</span>
                    <span>$25.00</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-100 pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>${(booking.price.total + (booking.luggage.length > 0 ? 25 : 0)).toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Actions</h2>
              
              <div className="space-y-3">
                <button 
                  className={`w-full py-2 px-4 rounded-lg flex items-center justify-center font-medium ${
                    booking.checkedIn ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={booking.checkedIn}
                  onClick={() => router.push(`/checkin/${booking.id}`)}
                >
                  <TicketIcon />
                  <span className="ml-2">
                    {booking.checkedIn ? 'Already Checked-in' : 'Check-in'}
                  </span>
                </button>
                
                <button 
                  className="w-full py-2 px-4 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 flex items-center justify-center"
                  onClick={() => alert('Boarding pass would be downloaded here')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span className="ml-2">Download Boarding Pass</span>
                </button>
                
                {booking.status !== 'Cancelled' && (
                  <button 
                    className="w-full py-2 px-4 bg-white border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 flex items-center justify-center"
                    onClick={() => alert('Cancel booking functionality would go here')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span className="ml-2">Cancel Booking</span>
                  </button>
                )}
              </div>
            </div>

            {/* Support Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Need Help?</h2>
              <p className="text-gray-600 mb-4">If you have any questions or need assistance with your booking, our customer support team is ready to help.</p>
              <div className="space-y-2">
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>1-800-SKY-FLYZ</span>
                </p>
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  </svg>
                  <span>support@skyroute.com</span>
                </p>
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Available 24/7</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Flight Timeline</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-0 left-[15px] bottom-0 w-[2px] bg-gray-200"></div>
            
            {/* Timeline events */}
            <div className="space-y-8 relative">
              {/* Check-in */}
              <div className="flex">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 mr-4 ${booking.checkedIn ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Check-in</h3>
                  <p className="text-sm text-gray-500">
                    {booking.checkedIn 
                      ? `Completed on ${new Date(booking.checkinTime).toLocaleString()}` 
                      : 'Available 24 hours before departure'}
                  </p>
                </div>
              </div>
              
              {/* Security */}
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center z-10 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Security Check</h3>
                  <p className="text-sm text-gray-500">Arrive at least 2 hours before departure</p>
                </div>
              </div>
              
              {/* Boarding */}
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center z-10 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 6v12l10-6z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Boarding</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(new Date(booking.flight.departure.time).getTime() - 30 * 60000).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })} at Gate TBD
                  </p>
                </div>
              </div>
              
              {/* Departure */}
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center z-10 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
                    <polygon points="12 15 17 21 7 21 12 15"></polygon>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Departure</h3>
                  <p className="text-sm text-gray-500">
                    {booking.flight.departure.formattedTime} from {booking.flight.departure.airport} ({booking.flight.departure.code})
                  </p>
                </div>
              </div>
              
              {/* Arrival */}
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center z-10 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
                    <polygon points="12 15 17 21 7 21 12 15"></polygon>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Arrival</h3>
                  <p className="text-sm text-gray-500">
                    {booking.flight.arrival.formattedTime} at {booking.flight.arrival.airport} ({booking.flight.arrival.code})
                  </p>
                </div>
              </div>
              
              {/* Baggage Claim */}
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center z-10 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.31 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5.31"></path>
                    <circle cx="12" cy="17" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Baggage Claim</h3>
                  <p className="text-sm text-gray-500">Baggage claim information will be available upon arrival</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Policy */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Travel Policy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">Cancellation Policy</h3>
              <p className="text-sm text-gray-600">Free cancellation up to 24 hours before departure. After that, a cancellation fee of 50% applies.</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Baggage Allowance</h3>
              <p className="text-sm text-gray-600">
                {booking.seat.classType === 'First' 
                  ? 'Cabin: 2 pieces (up to 10kg each). Checked: 3 pieces (up to 32kg each).' 
                  : booking.seat.classType === 'Business' 
                  ? 'Cabin: 2 pieces (up to 8kg each). Checked: 2 pieces (up to 32kg each).' 
                  : 'Cabin: 1 piece (up to 7kg). Checked: 1 piece (up to 23kg).'}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Check-in Requirements</h3>
              <p className="text-sm text-gray-600">Online check-in opens 24 hours and closes 1 hour before departure. Airport check-in closes 45 minutes before departure.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;