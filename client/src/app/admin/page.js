'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('flights'); // 'flights', 'airports', 'airlines', 'seats', 'prices', 'aircraft'
  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [flights, setFlights] = useState([]);
  const [seats, setSeats] = useState([]);
  const [prices, setPrices] = useState([]);

  // Flight form data
  const [flightFormData, setFlightFormData] = useState({
    flightNumber: '',
    departureAirportId: '',
    arrivalAirportId: '',
    departureTime: '',
    arrivalTime: '',
    aircraftId: '',
    airlineId: '',
    basicPrice: '',
    status: 'On-Time',
  });

  // Airport form data
  const [airportFormData, setAirportFormData] = useState({
    airportName: '',
    city: '',
    country: '',
    iataCode: '',
    icaoCode: '',
  });

  // Airline form data
  const [airlineFormData, setAirlineFormData] = useState({
    airlineName: '',
    country: '',
  });

  // Seat form data
  const [seatFormData, setSeatFormData] = useState({
    aircraftId: '',
    seatNumber: '',
    classType: 'Economy', // Default value
  });

  // Price form data
  const [priceFormData, setPriceFormData] = useState({
    flightId: '',
    seatId: '',
    premiumPrice: '',
    status: 'Available'
  });

  // Add this state for available seats
  const [availableSeats, setAvailableSeats] = useState([]);

  // New state variables for view management
  const [flightView, setFlightView] = useState('add');
  const [airportView, setAirportView] = useState('add');
  const [airlineView, setAirlineView] = useState('add');
  const [seatView, setSeatView] = useState('add');
  const [priceView, setPriceView] = useState('add');
  const [editingItem, setEditingItem] = useState(null);

  // Aircraft form data
  const [aircraftFormData, setAircraftFormData] = useState({
    model: '',
    totalSeats: '',
    airlineId: '',
  });

  // Aircraft view state
  const [aircraftView, setAircraftView] = useState('add');

  // Add new state for flight statuses
  const [flightStatuses, setFlightStatuses] = useState({});

  // Add this after your state declarations
  useEffect(() => {
    console.log('Current flights:', flights);
    console.log('Current flight statuses:', flightStatuses);
  }, [flights, flightStatuses]);

  // Add this function at the top of your component
  const removeDuplicateFlights = (flights) => {
    if (!Array.isArray(flights)) {
      console.error('Expected flights to be an array, got:', typeof flights);
      return [];
    }
    
    const seen = new Set();
    return flights.filter(flight => {
      if (!flight || typeof flight !== 'object' || !('flight_id' in flight)) {
        return false; // Skip invalid flight objects
      }
      const duplicate = seen.has(flight.flight_id);
      seen.add(flight.flight_id);
      return !duplicate;
    });
  };

  // Modify your useEffect to handle potential non-array responses for all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [airportsRes, airlinesRes, aircraftRes, flightsRes, seatsRes, pricesRes, flightStatusRes] = await Promise.all([
          fetch('/api/admin/airports'),
          fetch('/api/admin/airlines'),
          fetch('/api/admin/aircraft'),
          fetch('/api/admin/flights'),
          fetch('/api/admin/seats'),
          fetch('/api/admin/prices'),
          fetch('/api/admin/flight-status')
        ]);

        // Safely parse and ensure each response is an array
        const airportsData = airportsRes.ok ? await airportsRes.json() : [];
        const airlinesData = airlinesRes.ok ? await airlinesRes.json() : [];
        const aircraftData = aircraftRes.ok ? await aircraftRes.json() : [];
        const flightsData = flightsRes.ok ? await flightsRes.json() : [];
        const seatsData = seatsRes.ok ? await seatsRes.json() : [];
        const pricesData = pricesRes.ok ? await pricesRes.json() : [];
        const flightStatusData = flightStatusRes.ok ? await flightStatusRes.json() : [];

        // Ensure all data arrays are actually arrays
        setAirports(Array.isArray(airportsData) ? airportsData : []);
        setAirlines(Array.isArray(airlinesData) ? airlinesData : []);
        setAircraft(Array.isArray(aircraftData) ? aircraftData : []);
        
        // Remove duplicates from flights if it's an array
        const flightsArray = Array.isArray(flightsData) ? flightsData : [];
        const uniqueFlights = removeDuplicateFlights(flightsArray);
        setFlights(uniqueFlights);
        
        // Ensure seats is an array
        setSeats(Array.isArray(seatsData) ? seatsData : []);
        
        // Ensure prices is an array
        setPrices(Array.isArray(pricesData) ? pricesData : []);

        // Convert flight status array to object for easier lookup
        const statusObj = {};
        if (Array.isArray(flightStatusData)) {
          flightStatusData.forEach(status => {
            statusObj[status.flight_id] = status;
          });
        }
        setFlightStatuses(statusObj);
        
        console.log('Data loaded successfully:', {
          airports: Array.isArray(airportsData),
          airlines: Array.isArray(airlinesData),
          aircraft: Array.isArray(aircraftData),
          flights: Array.isArray(flightsData),
          seats: Array.isArray(seatsData),
          prices: Array.isArray(pricesData),
          flightStatus: Array.isArray(flightStatusData)
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set defaults for state variables in case of error
        setAirports([]);
        setAirlines([]);
        setAircraft([]);
        setFlights([]);
        setSeats([]);
        setPrices([]);
        setFlightStatuses({});
      }
    };

    fetchData();
  }, []);

  // Add admin check on client side too
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Try to access admin API as a quick check
        const response = await fetch('/api/admin/check-role');
        if (!response.ok) {
          // If response is not OK, redirect to home
          router.replace('/?error=unauthorized');
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.replace('/?error=unauthorized');
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [router]);
  
  // If still loading or not admin, show loading or empty
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return null; // This will never render as we redirect, but good practice
  }

  const handleFlightSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await handleUpdateFlight(e);
    } else {
      try {
        const flightResponse = await fetch('/api/admin/flights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            flightNumber: flightFormData.flightNumber,
            departureAirportId: flightFormData.departureAirportId,
            arrivalAirportId: flightFormData.arrivalAirportId,
            departureTime: flightFormData.departureTime,
            arrivalTime: flightFormData.arrivalTime,
            aircraftId: flightFormData.aircraftId,
            airlineId: flightFormData.airlineId,
            basicPrice: flightFormData.basicPrice,
            status: flightFormData.status, // Pass the status to be handled in a single transaction
          }),
        });

        if (!flightResponse.ok) {
          throw new Error('Failed to add flight');
        }

        alert('Flight added successfully!');
        setFlightFormData({
          flightNumber: '',
          departureAirportId: '',
          arrivalAirportId: '',
          departureTime: '',
          arrivalTime: '',
          aircraftId: '',
          airlineId: '',
          basicPrice: '',
          status: 'On-Time',
        });

        // Refresh the flights data
        const refreshResponse = await fetch('/api/admin/flights');
        const refreshedFlights = await refreshResponse.json();
        setFlights(refreshedFlights);
      } catch (error) {
        console.error('Error adding flight:', error);
        alert('Failed to add flight');
      }
    }
  };

  const handleChange = (e) => {
    setFlightFormData({
      ...flightFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleAirportSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem && editingItem.airport_id) {
        // EDIT mode: send PUT
        const response = await fetch(`/api/admin/airports/${editingItem.airport_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(airportFormData),
        });

        if (!response.ok) throw new Error('Failed to update airport');
        alert('Airport updated successfully!');
        setEditingItem(null);
      } else {
        // ADD mode: send POST
        const response = await fetch('/api/admin/airports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(airportFormData),
        });

        if (!response.ok) throw new Error('Failed to add airport');
        alert('Airport added successfully!');
      }

      setAirportFormData({
        airportName: '',
        city: '',
        country: '',
        iataCode: '',
        icaoCode: '',
      });

      // Refresh airports data
      const airportsRes = await fetch('/api/admin/airports');
      const airportsData = await airportsRes.json();
      setAirports(Array.isArray(airportsData) ? airportsData : []);
      setAirportView('manage');
    } catch (error) {
      console.error('Error saving airport:', error);
      alert(error.message || 'Failed to save airport');
    }
  };

  const handleAirlineSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem && editingItem.airline_id) {
        // EDIT mode: send PUT
        const response = await fetch(`/api/admin/airlines/${editingItem.airline_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(airlineFormData),
        });

        if (!response.ok) throw new Error('Failed to update airline');
        alert('Airline updated successfully!');
        setEditingItem(null);
      } else {
        // ADD mode: send POST
        const response = await fetch('/api/admin/airlines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(airlineFormData),
        });

        if (!response.ok) throw new Error('Failed to add airline');
        alert('Airline added successfully!');
      }

      setAirlineFormData({
        airlineName: '',
        country: '',
      });

      // Refresh airlines data
      const airlinesRes = await fetch('/api/admin/airlines');
      const airlinesData = await airlinesRes.json();
      setAirlines(Array.isArray(airlinesData) ? airlinesData : []);
      setAirlineView('manage');
    } catch (error) {
      console.error('Error saving airline:', error);
      alert(error.message || 'Failed to save airline');
    }
  };

  const handleSeatSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem && editingItem.seat_id) {
        // EDIT mode: send PUT
        const response = await fetch(`/api/admin/seats/${editingItem.seat_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(seatFormData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update seat');
        }
        alert('Seat updated successfully!');
        setEditingItem(null);
      } else {
        // ADD mode: send POST
        const response = await fetch('/api/admin/seats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(seatFormData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to add seat');
        }
        alert('Seat added successfully!');
      }

      setSeatFormData({
        aircraftId: '',
        seatNumber: '',
        classType: 'Economy',
      });

      // Refresh seats data
      const seatsRes = await fetch('/api/admin/seats');
      const seatsData = await seatsRes.json();
      setSeats(Array.isArray(seatsData) ? seatsData : []);
      setSeatView('manage');
    } catch (error) {
      console.error('Error saving seat:', error);
      alert(error.message || 'Failed to save seat');
    }
  };

  const handleFlightSelect = async (flightId) => {
    if (!flightId) {
      setAvailableSeats([]);
      return;
    }

    try {
      const response = await fetch(`/api/admin/seats/flight/${flightId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch seats');
      }
      const data = await response.json();
      setAvailableSeats(data);
    } catch (error) {
      console.error('Error fetching seats:', error);
      alert('Failed to fetch seats for this flight');
      setAvailableSeats([]);
    }
  };

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem && editingItem.price_id) {
        // EDIT mode: send PUT
        const response = await fetch(`/api/admin/prices/${editingItem.price_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(priceFormData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update price');
        }
        alert('Price updated successfully!');
        setEditingItem(null);
      } else {
        // ADD mode: send POST
        const response = await fetch('/api/admin/prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(priceFormData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to add price');
        }
        alert('Price added successfully!');
      }

      setPriceFormData({
        flightId: '',
        seatId: '',
        premiumPrice: '',
        status: 'Available'
      });

      // Refresh prices data
      const pricesRes = await fetch('/api/admin/prices');
      const pricesData = await pricesRes.json();
      setPrices(Array.isArray(pricesData) ? pricesData : []);
      setPriceView('manage');
    } catch (error) {
      console.error('Error saving price:', error);
      alert(error.message || 'Failed to save price');
    }
  };

  const handleEditFlight = (flight) => {
    console.log('Editing flight:', flight);
    console.log('Current flight statuses:', flightStatuses);
    
    setEditingItem(flight);
    setFlightFormData({
      flightNumber: flight.flight_number || '',
      departureAirportId: flight.departure_airport_id ? flight.departure_airport_id.toString() : '',
      arrivalAirportId: flight.arrival_airport_id ? flight.arrival_airport_id.toString() : '',
      departureTime: flight.departure_time ? new Date(flight.departure_time).toISOString().slice(0, 16) : '',
      arrivalTime: flight.arrival_time ? new Date(flight.arrival_time).toISOString().slice(0, 16) : '',
      aircraftId: flight.aircraft_id ? flight.aircraft_id.toString() : '',
      airlineId: flight.airline_id ? flight.airline_id.toString() : '',
      basicPrice: flight.basic_price || '',
      // Try both sources for status
      status: flight.status || flightStatuses[flight.flight_id]?.status || 'On-Time',
    });
    setFlightView('add');
  };

  const handleDeleteFlight = async (flightId) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      try {
        const response = await fetch(`/api/admin/flights/${flightId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete flight');

        // Update local state
        const updatedFlights = flights.filter(f => f.flight_id !== flightId);
        setFlights(updatedFlights);
        
        const updatedStatuses = { ...flightStatuses };
        delete updatedStatuses[flightId];
        setFlightStatuses(updatedStatuses);

        alert('Flight deleted successfully');
      } catch (error) {
        console.error('Error deleting flight:', error);
        alert('Failed to delete flight');
      }
    }
  };

  const handleUpdateFlight = async (e) => {
    e.preventDefault();
    try {
      // Update flight details
      const flightResponse = await fetch(`/api/admin/flights/${editingItem.flight_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightNumber: flightFormData.flightNumber,
          departureAirportId: flightFormData.departureAirportId,
          arrivalAirportId: flightFormData.arrivalAirportId,
          departureTime: flightFormData.departureTime,
          arrivalTime: flightFormData.arrivalTime,
          aircraftId: flightFormData.aircraftId,
          airlineId: flightFormData.airlineId,
          basicPrice: flightFormData.basicPrice,
          status: flightFormData.status,
        }),
      });

      if (!flightResponse.ok) {
        throw new Error('Failed to update flight');
      }

      alert('Flight updated successfully!');
      setEditingItem(null);
      setFlightFormData({
        flightNumber: '',
        departureAirportId: '',
        arrivalAirportId: '',
        departureTime: '',
        arrivalTime: '',
        aircraftId: '',
        airlineId: '',
        basicPrice: '',
        status: 'On-Time',
      });

      // Refresh flights data
      const [flightsRes, statusRes] = await Promise.all([
        fetch('/api/admin/flights'),
        fetch('/api/admin/flight-status')
      ]);
      
      const flightsData = await flightsRes.json();
      const statusData = await statusRes.json();
      
      setFlights(flightsData);
      const statusObj = {};
      statusData.forEach(status => {
        statusObj[status.flight_id] = status;
      });
      setFlightStatuses(statusObj);

      setFlightView('manage');
    } catch (error) {
      console.error('Error updating flight:', error);
      alert(error.message || 'Failed to update flight');
    }
  };

  const handleEditAirport = (airport) => {
    setEditingItem(airport);
    setAirportFormData({
      airportName: airport.airport_name,
      city: airport.city,
      country: airport.country,
      iataCode: airport.iata_code,
      icaoCode: airport.icao_code,
    });
    setAirportView('add');
  };

  const handleDeleteAirport = async (airportId) => {
    if (window.confirm('Are you sure you want to delete this airport?')) {
      try {
        const response = await fetch(`/api/admin/airports/${airportId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete airport');
        }
        setAirports(airports.filter(a => a.airport_id !== airportId));
        alert('Airport deleted successfully');
      } catch (error) {
        console.error('Error deleting airport:', error);
        alert(error.message || 'Failed to delete airport');
      }
    }
  };

  const handleEditSeat = (seat) => {
    setEditingItem(seat);
    setSeatFormData({
      aircraftId: seat.aircraft_id,
      seatNumber: seat.seat_number,
      classType: seat.class_type,
    });
    setSeatView('add');
  };

  const handleDeleteSeat = async (seatId) => {
    if (window.confirm('Are you sure you want to delete this seat?')) {
      try {
        const response = await fetch(`/api/admin/seats/${seatId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete seat');
        setSeats(seats.filter(s => s.seat_id !== seatId));
      } catch (error) {
        console.error('Error deleting seat:', error);
        alert('Failed to delete seat');
      }
    }
  };

  const handleEditPrice = (price) => {
    setEditingItem(price);
    setPriceFormData({
      flightId: price.flight_id,
      seatId: price.seat_id,
      premiumPrice: price.premium_price,
      status: price.status,
    });
    setPriceView('add');
  };

  const handleDeletePrice = async (priceId) => {
    if (window.confirm('Are you sure you want to delete this price?')) {
      try {
        const response = await fetch(`/api/admin/prices/${priceId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete price');
        }
        setPrices(prices.filter(p => p.price_id !== priceId));
        alert('Price deleted successfully');
      } catch (error) {
        console.error('Error deleting price:', error);
        alert(error.message || 'Failed to delete price');
      }
    }
  };

  const handleAircraftSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      // If we have an editingItem, we're updating
      await handleUpdateAircraft(e);
    } else {
      // Add new aircraft
      try {
        const response = await fetch('/api/admin/aircraft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(aircraftFormData),
        });

        if (!response.ok) {
          throw new Error('Failed to add aircraft');
        }

        alert('Aircraft added successfully!');
        setAircraftFormData({
          model: '',
          totalSeats: '',
          airlineId: '',
        });

        // Refresh aircraft data
        const aircraftRes = await fetch('/api/admin/aircraft');
        const aircraftData = await aircraftRes.json();
        setAircraft(aircraftData);
      } catch (error) {
        console.error('Error adding aircraft:', error);
        alert('Failed to add aircraft');
      }
    }
  };

  const handleEditAircraft = (aircraft) => {
    setEditingItem(aircraft);
    setAircraftFormData({
      model: aircraft.model,
      totalSeats: aircraft.total_seats.toString(),
      airlineId: aircraft.airline_id.toString(),
    });
    setAircraftView('add');
  };

  const handleDeleteAircraft = async (aircraftId) => {
    if (window.confirm('Are you sure you want to delete this aircraft?')) {
      try {
        const response = await fetch(`/api/admin/aircraft/${aircraftId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete aircraft');
        setAircraft(aircraft.filter(a => a.aircraft_id !== aircraftId));
      } catch (error) {
        console.error('Error deleting aircraft:', error);
        alert('Failed to delete aircraft');
      }
    }
  };

  const handleUpdateAircraft = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/aircraft/${editingItem.aircraft_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aircraftFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to update aircraft');
      }

      alert('Aircraft updated successfully!');

      // Reset form and editing state
      setEditingItem(null);
      setAircraftFormData({
        model: '',
        totalSeats: '',
        airlineId: '',
      });

      // Refresh aircraft data
      const aircraftRes = await fetch('/api/admin/aircraft');
      const aircraftData = await aircraftRes.json();
      setAircraft(aircraftData);

      // Switch back to manage view
      setAircraftView('manage');
    } catch (error) {
      console.error('Error updating aircraft:', error);
      alert('Failed to update aircraft');
    }
  };

  const handleEditAirline = (airline) => {
    setEditingItem(airline);
    setAirlineFormData({
      airlineName: airline.airline_name,
      country: airline.country,
    });
    setAirlineView('add');
  };

  const handleDeleteAirline = async (airlineId) => {
    if (window.confirm('Are you sure you want to delete this airline?')) {
      try {
        const response = await fetch(`/api/admin/airlines/${airlineId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete airline');
        }
        setAirlines(airlines.filter(a => a.airline_id !== airlineId));
        alert('Airline deleted successfully');
      } catch (error) {
        console.error('Error deleting airline:', error);
        alert(error.message || 'Failed to delete airline');
      }
    }
  };

  const tabStyle = (isActive) => ({
    padding: '12px 24px',
    backgroundColor: isActive ? '#0056b3' : '#f0f0f0',
    color: isActive ? 'white' : '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginRight: '10px',
  });

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    fontSize: '16px',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#444'
  };

  // Add this function at the top of your component, after your state declarations
  const exportData = (data, filename) => {
    try {
      // Convert data to JSON string
      const jsonString = JSON.stringify(data, null, 2);
      
      // Create a blob with the data
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      
      // Append the link to the body
      document.body.appendChild(a);
      
      // Click the link to trigger the download
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert(`Successfully exported ${filename}`);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    }
  };

  // Add this function to export data as CSV
  const exportCSV = (data, filename) => {
    try {
      // Get headers from the first object
      if (!data || data.length === 0) {
        alert('No data to export');
        return;
      }
      
      const headers = Object.keys(data[0]);
      
      // Create CSV string with headers
      let csvContent = headers.join(',') + '\n';
      
      // Add data rows
      data.forEach(item => {
        const row = headers.map(header => {
          // Handle null or undefined values
          const value = item[header] === null || item[header] === undefined ? '' : item[header];
          
          // Handle values that might contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        });
        
        csvContent += row.join(',') + '\n';
      });
      
      // Create a blob with the CSV data
      const blob = new Blob([csvContent], { type: 'text/csv' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      
      // Append the link to the body
      document.body.appendChild(a);
      
      // Click the link to trigger the download
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert(`Successfully exported ${filename}`);
    } catch (error) {
      console.error('Error exporting CSV data:', error);
      alert('Failed to export CSV data');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>Admin Dashboard</h1>

      <div style={{ marginBottom: '30px' }}>
        <button onClick={() => setActiveTab('flights')} style={tabStyle(activeTab === 'flights')}>
          Flights
        </button>
        <button onClick={() => setActiveTab('airports')} style={tabStyle(activeTab === 'airports')}>
          Airports
        </button>
        <button onClick={() => setActiveTab('airlines')} style={tabStyle(activeTab === 'airlines')}>
          Airlines
        </button>
        <button onClick={() => setActiveTab('aircraft')} style={tabStyle(activeTab === 'aircraft')}>
          Aircraft
        </button>
        <button onClick={() => setActiveTab('seats')} style={tabStyle(activeTab === 'seats')}>
          Seats
        </button>
        <button onClick={() => setActiveTab('prices')} style={tabStyle(activeTab === 'prices')}>
          Prices
        </button>
      </div>

      {activeTab === 'flights' && (
        <div>
          <div style={{ marginBottom: '30px', display: 'flex', gap: '20px' }}>
            <button
              onClick={() => setFlightView('add')}
              style={tabStyle(flightView === 'add')}
            >
              Add New Flight
            </button>
            <button
              onClick={() => setFlightView('manage')}
              style={tabStyle(flightView === 'manage')}
            >
              Manage Flights
            </button>
          </div>

          {flightView === 'add' ? (
            <form onSubmit={handleFlightSubmit} style={{
              maxWidth: '600px',
              backgroundColor: '#f5f5f5',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Add New Flight</h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Flight Number:</label>
                <input
                  type="text"
                  name="flightNumber"
                  value={flightFormData.flightNumber}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Departure Airport:</label>
                <select
                  name="departureAirportId"
                  value={flightFormData.departureAirportId}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Departure Airport</option>
                  {airports.map(airport => (
                    <option key={airport.airport_id} value={airport.airport_id}>
                      {airport.airport_name} ({airport.iata_code})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Arrival Airport:</label>
                <select
                  name="arrivalAirportId"
                  value={flightFormData.arrivalAirportId}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Arrival Airport</option>
                  {airports.map(airport => (
                    <option key={airport.airport_id} value={airport.airport_id}>
                      {airport.airport_name} ({airport.iata_code})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Departure Time:</label>
                <input
                  type="datetime-local"
                  name="departureTime"
                  value={flightFormData.departureTime}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Arrival Time:</label>
                <input
                  type="datetime-local"
                  name="arrivalTime"
                  value={flightFormData.arrivalTime}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Airline:</label>
                <select
                  name="airlineId"
                  value={flightFormData.airlineId}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Airline</option>
                  {airlines.map(airline => (
                    <option key={airline.airline_id} value={airline.airline_id}>
                      {airline.airline_name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Aircraft:</label>
                <select
                  name="aircraftId"
                  value={flightFormData.aircraftId}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Aircraft</option>
                  {aircraft.map(a => (
                    <option key={a.aircraft_id} value={a.aircraft_id}>
                      {a.model} (Seats: {a.total_seats})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Basic Price:</label>
                <input
                  type="number"
                  name="basicPrice"
                  value={flightFormData.basicPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Flight Status:</label>
                <select
                  name="status"
                  value={flightFormData.status}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="On-Time">On-Time</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button type="submit" style={{
                padding: '12px 24px',
                backgroundColor: '#0056b3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '100%'
              }}>
                {editingItem ? 'Update Flight' : 'Add Flight'}
              </button>

              {editingItem && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setFlightFormData({
                      flightNumber: '',
                      departureAirportId: '',
                      arrivalAirportId: '',
                      departureTime: '',
                      arrivalTime: '',
                      aircraftId: '',
                      airlineId: '',
                      basicPrice: '',
                      status: 'On-Time',
                    });
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    width: '100%',
                    marginTop: '10px'
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          ) : (
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Manage Flights</h2>

              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Flight Management</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportData(flights, 'flights_export')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={() => exportCSV(flights, 'flights_export')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Export as CSV
                  </button>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Flight Number</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Departure Airport</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Arrival Airport</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Departure Time</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Arrival Time</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Price</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map(flight => (
                    <tr key={flight.flight_id}>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        {flight.flight_number}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        {flight.departure_airport}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        {flight.arrival_airport}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        {new Date(flight.departure_time).toLocaleString()}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        {new Date(flight.arrival_time).toLocaleString()}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        ${flight.basic_price}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        {flight.status || flightStatuses[flight.flight_id]?.status || 'On-Time'}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <button
                          onClick={() => handleEditFlight(flight)}
                          style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFlight(flight.flight_id)}
                          style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'airports' && (
        <div>
          <div style={{ marginBottom: '30px', display: 'flex', gap: '20px' }}>
            <button
              onClick={() => setAirportView('add')}
              style={tabStyle(airportView === 'add')}
            >
              Add New Airport
            </button>
            <button
              onClick={() => setAirportView('manage')}
              style={tabStyle(airportView === 'manage')}
            >
              Manage Airports
            </button>
          </div>

          {airportView === 'add' ? (
            <form onSubmit={handleAirportSubmit} style={{
              maxWidth: '600px',
              backgroundColor: '#f5f5f5',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Add New Airport</h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Airport Name:</label>
                <input
                  type="text"
                  value={airportFormData.airportName}
                  onChange={(e) => setAirportFormData({ ...airportFormData, airportName: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>City:</label>
                <input
                  type="text"
                  value={airportFormData.city}
                  onChange={(e) => setAirportFormData({ ...airportFormData, city: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Country:</label>
                <input
                  type="text"
                  value={airportFormData.country}
                  onChange={(e) => setAirportFormData({ ...airportFormData, country: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>IATA Code:</label>
                <input
                  type="text"
                  value={airportFormData.iataCode}
                  onChange={(e) => setAirportFormData({ ...airportFormData, iataCode: e.target.value })}
                  required
                  maxLength="3"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>ICAO Code:</label>
                <input
                  type="text"
                  value={airportFormData.icaoCode}
                  onChange={(e) => setAirportFormData({ ...airportFormData, icaoCode: e.target.value })}
                  required
                  maxLength="4"
                  style={inputStyle}
                />
              </div>

              <button type="submit" style={{
                padding: '12px 24px',
                backgroundColor: '#0056b3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '100%'
              }}>
                Add Airport
              </button>

              {editingItem && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setAirportFormData({
                      airportName: '',
                      city: '',
                      country: '',
                      iataCode: '',
                      icaoCode: '',
                    });
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    width: '100%',
                    marginTop: '10px'
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          ) : (
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Manage Airports</h2>

              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Airport Management</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportData(airports, 'airports_export')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={() => exportCSV(airports, 'airports_export')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Export as CSV
                  </button>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Airport Name</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>City</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Country</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>IATA Code</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ICAO Code</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {airports.map(airport => (
                    <tr key={airport.airport_id}>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{airport.airport_name}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{airport.city}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{airport.country}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{airport.iata_code}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{airport.icao_code}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <button
                          onClick={() => handleEditAirport(airport)}
                          style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAirport(airport.airport_id)}
                          style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'airlines' && (
        <div>
          <div style={{ marginBottom: '30px', display: 'flex', gap: '20px' }}>
            <button
              onClick={() => setAirlineView('add')}
              style={tabStyle(airlineView === 'add')}
            >
              Add New Airline
            </button>
            <button
              onClick={() => setAirlineView('manage')}
              style={tabStyle(airlineView === 'manage')}
            >
              Manage Airlines
            </button>
          </div>

          {airlineView === 'add' ? (
            <form onSubmit={handleAirlineSubmit} style={{
              maxWidth: '600px',
              backgroundColor: '#f5f5f5',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>
                {editingItem ? 'Edit Airline' : 'Add New Airline'}
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Airline Name:</label>
                <input
                  type="text"
                  value={airlineFormData.airlineName}
                  onChange={(e) => setAirlineFormData({ ...airlineFormData, airlineName: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Country:</label>
                <input
                  type="text"
                  value={airlineFormData.country}
                  onChange={(e) => setAirlineFormData({ ...airlineFormData, country: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>

              <button type="submit" style={{
                padding: '12px 24px',
                backgroundColor: '#0056b3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '100%'
              }}>
                {editingItem ? 'Update Airline' : 'Add Airline'}
              </button>

              {editingItem && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setAirlineFormData({
                      airlineName: '',
                      country: '',
                    });
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    width: '100%',
                    marginTop: '10px'
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          ) : (
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Manage Airlines</h2>

              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Airline Management</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportData(airlines, 'airlines_export')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={() => exportCSV(airlines, 'airlines_export')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Export as CSV
                  </button>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Airline Name</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Country</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {airlines.map(airline => (
                    <tr key={airline.airline_id}>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{airline.airline_name}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{airline.country}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <button
                          onClick={() => handleEditAirline(airline)}
                          style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAirline(airline.airline_id)}
                          style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'aircraft' && (
        <div>
          <div style={{ marginBottom: '30px', display: 'flex', gap: '20px' }}>
            <button
              onClick={() => setAircraftView('add')}
              style={tabStyle(aircraftView === 'add')}
            >
              Add New Aircraft
            </button>
            <button
              onClick={() => setAircraftView('manage')}
              style={tabStyle(aircraftView === 'manage')}
            >
              Manage Aircraft
            </button>
          </div>

          {aircraftView === 'add' ? (
            <form onSubmit={handleAircraftSubmit} style={{
              maxWidth: '600px',
              backgroundColor: '#f5f5f5',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>
                {editingItem ? 'Edit Aircraft' : 'Add New Aircraft'}
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Model:</label>
                <input
                  type="text"
                  value={aircraftFormData.model}
                  onChange={(e) => setAircraftFormData({ ...aircraftFormData, model: e.target.value })}
                  required
                  style={inputStyle}
                  placeholder="e.g., Boeing 737-800"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Total Seats:</label>
                <input
                  type="number"
                  value={aircraftFormData.totalSeats}
                  onChange={(e) => setAircraftFormData({ ...aircraftFormData, totalSeats: e.target.value })}
                  required
                  min="1"
                  style={inputStyle}
                  placeholder="e.g., 180"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Airline:</label>
                <select
                  value={aircraftFormData.airlineId}
                  onChange={(e) => setAircraftFormData({ ...aircraftFormData, airlineId: e.target.value })}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Airline</option>
                  {airlines.map(airline => (
                    <option key={airline.airline_id} value={airline.airline_id}>
                      {airline.airline_name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" style={{
                padding: '12px 24px',
                backgroundColor: '#0056b3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '100%'
              }}>
                {editingItem ? 'Update Aircraft' : 'Add Aircraft'}
              </button>

              {editingItem && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setAircraftFormData({
                      model: '',
                      totalSeats: '',
                      airlineId: '',
                    });
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    width: '100%',
                    marginTop: '10px'
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          ) : (
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Manage Aircraft</h2>

              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Aircraft Management</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportData(aircraft, 'aircraft_export')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={() => exportCSV(aircraft, 'aircraft_export')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Export as CSV
                  </button>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Model</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Total Seats</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Airline</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {aircraft.map(aircraftItem => (
                    <tr key={aircraftItem.aircraft_id}>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{aircraftItem.model}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{aircraftItem.total_seats}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        {airlines.find(a => a.airline_id === aircraftItem.airline_id)?.airline_name || 'Unknown'}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <button
                          onClick={() => handleEditAircraft(aircraftItem)}
                          style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAircraft(aircraftItem.aircraft_id)}
                          style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'seats' && (
        <div>
          <div style={{ marginBottom: '30px', display: 'flex', gap: '20px' }}>
            <button
              onClick={() => setSeatView('add')}
              style={tabStyle(seatView === 'add')}
            >
              Add New Seat
            </button>
            <button
              onClick={() => setSeatView('manage')}
              style={tabStyle(seatView === 'manage')}
            >
              Manage Seats
            </button>
          </div>

          {seatView === 'add' ? (
            <form onSubmit={handleSeatSubmit} style={{
              maxWidth: '600px',
              backgroundColor: '#f5f5f5',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>
                {editingItem ? 'Edit Seat' : 'Add New Seat'}
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Aircraft:</label>
                <select
                  value={seatFormData.aircraftId}
                  onChange={(e) => setSeatFormData({ ...seatFormData, aircraftId: e.target.value })}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Aircraft</option>
                  {aircraft.map(a => (
                    <option key={a.aircraft_id} value={a.aircraft_id}>
                      {a.model} (Seats: {a.total_seats})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Seat Number:</label>
                <input
                  type="text"
                  value={seatFormData.seatNumber}
                  onChange={(e) => setSeatFormData({ ...seatFormData, seatNumber: e.target.value })}
                  required
                  placeholder="e.g., 12A"
                  maxLength="4"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Class Type:</label>
                <select
                  value={seatFormData.classType}
                  onChange={(e) => setSeatFormData({ ...seatFormData, classType: e.target.value })}
                  required
                  style={inputStyle}
                >
                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                  <option value="First">First</option>
                </select>
              </div>

              <button type="submit" style={{
                padding: '12px 24px',
                backgroundColor: '#0056b3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '100%'
              }}>
                {editingItem ? 'Update Seat' : 'Add Seat'}
              </button>

              {editingItem && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setSeatFormData({
                      aircraftId: '',
                      seatNumber: '',
                      classType: 'Economy',
                    });
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    width: '100%',
                    marginTop: '10px'
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          ) : (
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Manage Seats</h2>

              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Seat Management</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportData(seats, 'seats_export')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={() => exportCSV(seats, 'seats_export')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Export as CSV
                  </button>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Aircraft</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Seat Number</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Class Type</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {seats?.map(seat => (
                    <tr key={seat.seat_id}>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        {aircraft.find(a => a.aircraft_id === seat.aircraft_id)?.model}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{seat.seat_number}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{seat.class_type}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <button
                          onClick={() => handleEditSeat(seat)}
                          style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSeat(seat.seat_id)}
                          style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'prices' && (
        <div>
          <div style={{ marginBottom: '30px', display: 'flex', gap: '20px' }}>
            <button
              onClick={() => setPriceView('add')}
              style={tabStyle(priceView === 'add')}
            >
              Add New Price
            </button>
            <button
              onClick={() => setPriceView('manage')}
              style={tabStyle(priceView === 'manage')}
            >
              Manage Prices
            </button>
          </div>

          {priceView === 'add' ? (
            <form onSubmit={handlePriceSubmit} style={{
              maxWidth: '600px',
              backgroundColor: '#f5f5f5',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>
                {editingItem ? 'Edit Price' : 'Add New Price'}
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Flight:</label>
                <select
                  value={priceFormData.flightId}
                  onChange={(e) => {
                    console.log('Selected flight:', e.target.value); // Debug log
                    setPriceFormData({
                      ...priceFormData,
                      flightId: e.target.value,
                      seatId: ''
                    });
                    handleFlightSelect(e.target.value);
                  }}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Flight</option>
                  {flights && flights.length > 0 ? (
                    flights.map(flight => (
                      <option key={flight.flight_id} value={flight.flight_id}>
                        {flight.flight_number} ({new Date(flight.departure_time).toLocaleString()} - {new Date(flight.arrival_time).toLocaleString()})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No flights available</option>
                  )}
                </select>
              </div>

              {!editingItem ? (
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Seat:</label>
                  <select
                    value={priceFormData.seatId}
                    onChange={(e) => setPriceFormData({ ...priceFormData, seatId: e.target.value })}
                    required
                    style={inputStyle}
                    disabled={!priceFormData.flightId}
                  >
                    <option value="">Select Seat</option>
                    {availableSeats.map(seat => (
                      <option key={seat.seat_id} value={seat.seat_id}>
                        {seat.seat_number} - {seat.class_type}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Seat:</label>
                  <input
                    type="text"
                    value={
                      seats.find(s => s.seat_id === priceFormData.seatId)?.seat_number ||
                      priceFormData.seatId
                    }
                    disabled
                    style={inputStyle}
                  />
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Premium Price:</label>
                <input
                  type="number"
                  value={priceFormData.premiumPrice}
                  onChange={(e) => setPriceFormData({ ...priceFormData, premiumPrice: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Status:</label>
                <select
                  value={priceFormData.status}
                  onChange={(e) => setPriceFormData({ ...priceFormData, status: e.target.value })}
                  required
                  style={inputStyle}
                >
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                </select>
              </div>

              <button type="submit" style={{
                padding: '12px 24px',
                backgroundColor: '#0056b3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '100%'
              }}>
                {editingItem ? 'Update Price' : 'Add Price'}
              </button>

              {editingItem && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setPriceFormData({
                      flightId: '',
                      seatId: '',
                      premiumPrice: '',
                      status: 'Available'
                    });
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    width: '100%',
                    marginTop: '10px'
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          ) : (
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Manage Prices</h2>

              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Price Management</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportData(prices, 'prices_export')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={() => exportCSV(prices, 'prices_export')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Export as CSV
                  </button>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Flight Number</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Seat Number</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Premium Price</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(prices) ? prices.map(price => (
                    <tr key={price.price_id}>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        {Array.isArray(flights) && price && price.flight_id 
                          ? flights.find(f => f && f.flight_id === price.flight_id)?.flight_number || 'Unknown'
                          : 'Unknown'
                        }
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        {Array.isArray(seats) && price && price.seat_id
                          ? seats.find(s => s && s.seat_id === price.seat_id)?.seat_number || 'Unknown'
                          : 'Unknown'
                        }
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>${price.premium_price}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{price.status}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <button
                          onClick={() => handleEditPrice(price)}
                          style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePrice(price.price_id)}
                          style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="6">No price data available</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/export" className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <div className="flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <h3 className="font-medium text-center">Export Data</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
