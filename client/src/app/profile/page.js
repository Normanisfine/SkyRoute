'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

const ProfilePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 用户数据状态
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [savedFlights, setSavedFlights] = useState([]);
  const [passengers, setPassengers] = useState([]);
  
  // 个人信息编辑状态
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    passport_number: ''
  });

  // 新乘客信息状态
  const [newPassenger, setNewPassenger] = useState({
    name: '',
    passport_number: '',
    dob: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // 在实际应用中，你会发起实际的API请求，使用AirlineUser表
        // 例如: const response = await fetch('/api/profile');
        // 这里使用模拟数据
        setTimeout(() => {
          // 模拟用户数据
          const mockUser = {
            id: 1,
            name: 'John Doe',
            email: 'johndoe@example.com',
            phone: '555-0100',
            passport_number: 'A1234567'
          };
          
          // 模拟预订数据
          const mockBookings = [
            {
              id: 278,
              flightNumber: 'CA981',
              origin: 'PEK',
              destination: 'JFK',
              date: '2025-04-02',
              price: 580,
              status: 'Confirmed',
              departureTime: '10:20 am',
              airline: 'Air China'
            },
            {
              id: 279,
              flightNumber: 'MU502',
              origin: 'PVG',
              destination: 'LAX',
              date: '2025-05-15',
              price: 610,
              status: 'Confirmed',
              departureTime: '2:30 pm',
              airline: 'China Eastern'
            }
          ];
          
          // 模拟保存的航班数据
          const mockSavedFlights = [
            {
              id: 1,
              flightNumber: 'FL104',
              origin: 'FRA',
              destination: 'NRT',
              date: '2023-03-15',
              price: 750,
              departureTime: '6:00 am',
              airline: 'Lufthansa'
            },
            {
              id: 2,
              flightNumber: 'FL105',
              origin: 'NRT',
              destination: 'PEK',
              date: '2023-03-16',
              price: 320,
              departureTime: '12:00 pm',
              airline: 'Air France'
            }
          ];
          
          // 模拟乘客数据
          const mockPassengers = [
            {
              id: 1,
              name: 'John Doe Jr.',
              passport_number: 'B1234567',
              dob: '2000-01-01'
            },
            {
              id: 2,
              name: 'Emily Doe',
              passport_number: 'B1234568',
              dob: '2002-02-02'
            }
          ];
          
          setUser(mockUser);
          setBookings(mockBookings);
          setSavedFlights(mockSavedFlights);
          setPassengers(mockPassengers);
          setEditForm({
            name: mockUser.name,
            email: mockUser.email,
            phone: mockUser.phone,
            passport_number: mockUser.passport_number
          });
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // 在实际应用中，这里会发送API请求更新用户信息
    // 这里简单模拟更新
    setUser({
      ...user,
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      passport_number: editForm.passport_number
    });
    setIsEditing(false);
  };

  const handleAddPassenger = (e) => {
    e.preventDefault();
    // 在实际应用中，这里会发送API请求添加乘客
    // 这里简单模拟添加
    const newId = passengers.length > 0 ? Math.max(...passengers.map(p => p.id)) + 1 : 1;
    setPassengers([
      ...passengers,
      {
        id: newId,
        ...newPassenger
      }
    ]);
    // 重置表单
    setNewPassenger({
      name: '',
      passport_number: '',
      dob: ''
    });
  };

  const handleInputChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemoveSavedFlight = (id) => {
    // 在实际应用中，这里会发送API请求删除保存的航班
    // 这里简单模拟删除
    setSavedFlights(savedFlights.filter(flight => flight.id !== id));
  };

  // Add logout handler
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redirect to login page after successful logout
        router.push('/login');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
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
            <Link href="/profile" className="text-blue-600">
              <UserIcon />
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Account</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 侧边栏 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
                <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                    <UserIcon />
                  </div>
                  <h3 className="text-lg font-semibold">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      Profile Information
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('bookings')}
                      className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      My Bookings
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('savedFlights')}
                      className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'savedFlights' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      Saved Flights
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('passengers')}
                      className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'passengers' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      Passengers
                    </button>
                  </li>
                  <li className="pt-4 mt-4 border-t border-gray-100">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* 主内容区 */}
            <div className="lg:col-span-3">
              {/* 个人信息 */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <form onSubmit={handleEditSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={(e) => handleInputChange(e, setEditForm)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={editForm.email}
                            onChange={(e) => handleInputChange(e, setEditForm)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={editForm.phone}
                            onChange={(e) => handleInputChange(e, setEditForm)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                          <input
                            type="text"
                            name="passport_number"
                            value={editForm.passport_number}
                            onChange={(e) => handleInputChange(e, setEditForm)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex space-x-3">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Full Name</p>
                        <p className="font-medium">{user?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                        <p className="font-medium">{user?.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Passport Number</p>
                        <p className="font-medium">{user?.passport_number}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* 订单信息 */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">My Bookings</h2>
                  
                  {bookings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                      <h3 className="text-lg font-medium text-gray-600">No bookings found</h3>
                      <p className="text-gray-500 mt-2">Book your first flight to see it here</p>
                      <button
                        onClick={() => router.push('/flights')}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Book a Flight
                      </button>
                    </div>
                  ) : (
                    bookings.map(booking => (
                      <div key={booking.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="flex items-center mr-4">
                                <PlaneIcon />
                                <span className="ml-2 font-medium">{booking.airline}</span>
                              </div>
                              <span className="text-sm text-gray-500">{booking.flightNumber}</span>
                            </div>
                            <div className="text-xl font-bold text-blue-600">${booking.price}</div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="flex items-center mb-2 sm:mb-0">
                              <div className="text-center mr-3">
                                <div className="text-xl font-bold">{booking.departureTime}</div>
                                <div className="text-sm text-gray-500">{booking.origin}</div>
                              </div>
                              <div className="flex flex-col items-center mx-2 px-2">
                                <div className="w-16 sm:w-24 h-0.5 bg-gray-300 my-1 relative">
                                  <div className="absolute top-1/2 left-0 w-2 h-2 bg-blue-600 rounded-full transform -translate-y-1/2"></div>
                                  <div className="absolute top-1/2 right-0 w-2 h-2 bg-blue-600 rounded-full transform -translate-y-1/2"></div>
                                </div>
                              </div>
                              <div className="text-center ml-3">
                                <div className="text-sm text-gray-500">{booking.destination}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="text-sm text-gray-500">
                                {new Date(booking.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                              <span className={`ml-3 px-2 py-0.5 ${
                                booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              } text-xs font-medium rounded`}>
                                {booking.status}
                              </span>
                            </div>
                            
                            <Link 
                              href={`/bookings/${booking.id}`}
                              className="px-4 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {/* 保存的航班 */}
              {activeTab === 'savedFlights' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Saved Flights</h2>
                  
                  {savedFlights.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                      <h3 className="text-lg font-medium text-gray-600">No saved flights</h3>
                      <p className="text-gray-500 mt-2">Save flights you're interested in to compare later</p>
                      <button
                        onClick={() => router.push('/flights')}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Search Flights
                      </button>
                    </div>
                  ) : (
                    savedFlights.map(flight => (
                      <div key={flight.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                                <div className="w-16 sm:w-24 h-0.5 bg-gray-300 my-1 relative">
                                  <div className="absolute top-1/2 left-0 w-2 h-2 bg-blue-600 rounded-full transform -translate-y-1/2"></div>
                                  <div className="absolute top-1/2 right-0 w-2 h-2 bg-blue-600 rounded-full transform -translate-y-1/2"></div>
                                </div>
                              </div>
                              <div className="text-center ml-3">
                                <div className="text-sm text-gray-500">{flight.destination}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              {new Date(flight.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleRemoveSavedFlight(flight.id)}
                                className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                              >
                                Remove
                              </button>
                              <Link 
                                href={`/bookings/new?flightId=${flight.id}`}
                                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                Book Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {/* 乘客信息 */}
              {activeTab === 'passengers' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Saved Passengers</h2>
                  
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-medium mb-4">Add New Passenger</h3>
                    <form onSubmit={handleAddPassenger}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={newPassenger.name}
                            onChange={(e) => handleInputChange(e, setNewPassenger)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                          <input
                            type="text"
                            name="passport_number"
                            value={newPassenger.passport_number}
                            onChange={(e) => handleInputChange(e, setNewPassenger)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                          <input
                            type="date"
                            name="dob"
                            value={newPassenger.dob}
                            onChange={(e) => handleInputChange(e, setNewPassenger)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add Passenger
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-medium mb-4">Passenger List</h3>
                    
                    {passengers.length === 0 ? (
                      <p className="text-gray-500">No passengers added yet.</p>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {passengers.map(passenger => (
                          <div key={passenger.id} className="py-3 first:pt-0 last:pb-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{passenger.name}</h4>
                                <div className="mt-1 text-sm text-gray-500">
                                  <p>Passport: {passenger.passport_number}</p>
                                  <p>DOB: {new Date(passenger.dob).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                                  Edit
                                </button>
                                <button className="px-3 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors">
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 