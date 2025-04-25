'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// Icons
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

const TicketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
    <path d="M13 5v2"></path>
    <path d="M13 17v2"></path>
    <path d="M13 11v2"></path>
  </svg>
);

const CheckmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"></path>
  </svg>
);

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
);

const CheckInPage = () => {
  const router = useRouter();
  const params = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingCheckIn, setProcessingCheckIn] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

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

  const handleCheckIn = async () => {
    if (!acceptTerms) {
      setError('Please accept the terms and conditions to proceed with check-in.');
      return;
    }

    try {
      setProcessingCheckIn(true);
      setError(null);
      
      const response = await fetch(`/api/bookings/${params.id}/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check in');
      }
      
      setCheckInSuccess(true);
      
      // Update booking state to reflect check-in status
      setBooking(prev => ({
        ...prev,
        checkedIn: true,
        checkinTime: data.timestamp
      }));
      
    } catch (error) {
      console.error('Error during check-in:', error);
      setError(error.message || 'Failed to check in. Please try again.');
    } finally {
      setProcessingCheckIn(false);
    }
  };
  
  const handleDownloadBoardingPass = () => {
    // In a real app, this would generate and download a PDF boarding pass
    alert('Boarding pass download functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-lg w-full">
          <h3 className="text-2xl font-medium text-gray-600 mb-4">{error}</h3>
          <p className="text-gray-500 mb-6">We couldn't process your check-in at this time.</p>
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

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-lg w-full">
          <h3 className="text-2xl font-medium text-gray-600 mb-4">Booking not found</h3>
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
          <h1 className="text-3xl font-bold text-gray-800">Online Check-in</h1>
        </div>

        {/* Check-in container */}
        <div className="max-w-3xl mx-auto">
          {/* Success message */}
          {checkInSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckmarkIcon />
              </div>
              <h2 className="text-xl font-semibold text-green-800 mb-2">Check-in Successful!</h2>
              <p className="text-green-700 mb-4">
                You have successfully checked in for your flight. Your boarding pass is ready.
              </p>
              <button
                onClick={handleDownloadBoardingPass}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Download Boarding Pass
              </button>
            </div>
          )}

          {/* Flight Information Card */}
          {!checkInSuccess && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Flight Information</h2>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <PlaneIcon />
                  <span className="ml-2 font-medium">{booking.flight.airline}</span>
                </div>
                <span className="text-sm text-gray-500">{booking.flight.flightNumber}</span>
                <span className="text-sm text-gray-500">Aircraft: {booking.flight.aircraftModel}</span>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
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

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Date</h3>
                  <p className="font-medium">{booking.flight.departure.formattedDate}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Status</h3>
                  <p className={`font-medium ${
                    booking.flight.status === 'On-Time' ? 'text-green-600' : 
                    booking.flight.status === 'Delayed' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {booking.flight.status}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Passenger & Seat Information */}
          {!checkInSuccess && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Passenger & Seat Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Passenger Name</h3>
                  <p className="font-medium">{booking.passenger.name}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Passport Number</h3>
                  <p className="font-medium">{booking.passenger.passportNumber}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Seat</h3>
                  <p className="font-medium">{booking.seat.number}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Class</h3>
                  <p className="font-medium">{booking.seat.classType}</p>
                </div>
              </div>
            </div>
          )}

          {/* Luggage Information */}
          {!checkInSuccess && booking.luggage && booking.luggage.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Luggage Information</h2>
              
              <div className="space-y-4">
                {booking.luggage.map((item, index) => (
                  <div key={item.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Luggage #{index + 1}</h3>
                      <p className="text-sm text-gray-500">Weight: {item.weight} kg</p>
                      <p className="text-sm text-gray-500">Dimensions: {item.dimensions}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms and Check-in Button */}
          {!checkInSuccess && !booking.checkedIn && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Complete Check-in</h2>
              
              {error && (
                <div className="bg-red-50 text-red-700 p-4 mb-4 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="mb-6">
                <div className="flex items-start mb-4">
                  <input
                    id="terms"
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I confirm that I have read and agree to the airline's terms and conditions, including baggage restrictions and check-in requirements. I also confirm that all passenger information is accurate and matches the travel document that will be presented at the airport.
                  </label>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-500 mb-4">
                    Please note that you must arrive at the airport at least 2 hours before the scheduled departure time. Don't forget to bring your valid ID or passport that matches the details provided during booking.
                  </p>
                  
                  <button
                    onClick={handleCheckIn}
                    disabled={processingCheckIn || !acceptTerms}
                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center
                      ${(processingCheckIn || !acceptTerms) 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {processingCheckIn ? (
                      <>
                        <LoadingSpinner />
                        <span className="ml-2">Processing...</span>
                      </>
                    ) : (
                      <>
                        <TicketIcon />
                        <span className="ml-2">Complete Check-in</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Already Checked In Message */}
          {!checkInSuccess && booking.checkedIn && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-green-800 mb-2">Already Checked In</h2>
              <p className="text-green-700 mb-4">
                You have already completed check-in for this flight on {new Date(booking.checkinTime).toLocaleString()}.
              </p>
              <button
                onClick={handleDownloadBoardingPass}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Download Boarding Pass
              </button>
            </div>
          )}
          
          {/* Back to Booking Button */}
          <div className="text-center mt-6">
            <Link 
              href={`/bookings/${booking.id}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Back to Booking Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;
