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
  const [bookingForm, setBookingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    passportNumber: '',
    dob: '',
    gender: '',
    nationality: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // 从URL获取航班ID
  const flightId = searchParams.get('flightId');

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        setLoading(true);
        // 这里会是一个真实的API调用
        // const response = await fetch(`/api/flights/${flightId}`);
        // const data = await response.json();
        // setFlightData(data);

        // 模拟数据
        setTimeout(() => {
          // 假设这是从API获取的航班数据
          const mockFlightData = {
            id: flightId || 1,
            flightNumber: 'CA980',
            airline: 'China Eastern',
            origin: 'PVG',
            destination: 'JFK',
            departureTime: '12:59 pm',
            arrivalTime: '3:37 pm',
            duration: '2 h 38 m',
            price: 580,
            date: '2024-10-15',
            stops: 0,
            availableSeats: ['12A', '12B', '14C', '15D', '18F'],
            departureAirport: 'Shanghai Pudong International Airport',
            arrivalAirport: 'John F. Kennedy International Airport'
          };
          setFlightData(mockFlightData);
          setLoading(false);
        }, 1000);

      } catch (error) {
        console.error('Error fetching flight details:', error);
        setLoading(false);
        setError('Failed to load flight details. Please try again.');
      }
    };

    if (flightId) {
      fetchFlightDetails();
    } else {
      // 如果没有航班ID，重定向到搜索页面
      router.push('/flights');
    }
  }, [flightId, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('Please agree to the terms and conditions to continue.');
      return;
    }

    try {
      setSubmitLoading(true);
      setError(null);
      
      // 在这里调用API创建订单
      // const response = await fetch('/api/bookings', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     flightId,
      //     passenger: bookingForm,
      //     paymentMethod
      //   }),
      // });
      
      // if (!response.ok) throw new Error('Failed to book flight');
      // const data = await response.json();

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 预订成功，转到订单页面
      router.push('/bookings');
    } catch (error) {
      console.error('Error booking flight:', error);
      setError('Failed to book flight. Please try again.');
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
                  <span className="text-xl font-bold text-blue-600">${flightData.price}</span>
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
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Passenger Information</h2>
                
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

                  <div className="mb-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={bookingForm.dob}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        value={bookingForm.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                      <select
                        id="nationality"
                        name="nationality"
                        value={bookingForm.nationality}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Nationality</option>
                        <option value="US">United States</option>
                        <option value="CN">China</option>
                        <option value="GB">United Kingdom</option>
                        <option value="JP">Japan</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                        <option value="FR">France</option>
                        <option value="DE">Germany</option>
                      </select>
                    </div>
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

                  {/* 条款和条件 */}
                  <div className="mb-6">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        checked={agreeTerms}
                        onChange={() => setAgreeTerms(!agreeTerms)}
                        className="mt-1 mr-2"
                        required
                      />
                      <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                        I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                      </label>
                    </div>
                  </div>

                  {/* 提交按钮 */}
                  <div className="flex justify-between items-center mt-8">
                    <div className="text-xl font-bold text-gray-800">
                      Total: <span className="text-blue-600">${flightData.price}</span>
                    </div>
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${submitLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {submitLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : 'Confirm Booking'}
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