'use client';

import { useState } from 'react';
import { format } from 'date-fns';

const SearchPage = () => {
  const [showResults, setShowResults] = useState(false);
  const [from, setFrom] = useState('New York');
  const [to, setTo] = useState('LA');
  const [departure, setDeparture] = useState('2024-03-11');
  const [returning, setReturning] = useState('2024-05-11');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchFlights = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&departure=${encodeURIComponent(departure)}&return=${encodeURIComponent(returning)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch flights');
      }

      const data = await response.json();
      setFlights(data.flights);
      setShowResults(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    searchFlights();
  };

  const handleNewSearchClick = () => {
    searchFlights();
  };

  if (showResults) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Search Flights</h1>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
          <div>From <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} style={{ fontWeight: 'bold', border: 'none', background: 'transparent' }} /></div>
          <div>To <input type="text" value={to} onChange={(e) => setTo(e.target.value)} style={{ fontWeight: 'bold', border: 'none', background: 'transparent' }} /></div>
          <div>Departure <input type="date" value={departure} onChange={(e) => setDeparture(e.target.value)} style={{ fontWeight: 'bold', border: 'none', background: 'transparent' }} /></div>
          <div>Returning <input type="date" value={returning} onChange={(e) => setReturning(e.target.value)} style={{ fontWeight: 'bold', border: 'none', background: 'transparent' }} /></div>
          <button onClick={handleNewSearchClick} style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#607d8b', color: '#fff', border: 'none' }}>Search</button>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        
        {!loading && !error && flights.map((flight, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '5px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <div><strong>Time</strong>: {format(new Date(flight.departure_time), 'h:mm a')} - {format(new Date(flight.arrival_time), 'h:mm a')}</div>
              <div><strong>Duration</strong>: {flight.duration} | {flight.flight_status || 'On Time'}</div>
              <div><strong>Flight</strong>: {flight.flight_number}</div>
              <div><strong>Price</strong>: ${flight.basic_price}</div>
            </div>
            <div><strong>{flight.airline_name}</strong></div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <div style={{ backgroundColor: '#e0e0e0', padding: '20px', borderRadius: '10px', flex: 1 }}>
            <h2>Filter</h2>
            <div>
              <input type="checkbox" /> Non-stop
              <input type="checkbox" /> 1-stop
              <input type="checkbox" /> 2-stops
            </div>
            <input type="text" placeholder="Airline" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', marginTop: '10px' }} />
            <input type="text" placeholder="Baggage" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', marginTop: '10px' }} />
            <a href="#" style={{ display: 'block', marginTop: '10px' }}>Show more</a>
          </div>
          <div style={{ backgroundColor: '#e0e0e0', padding: '20px', borderRadius: '10px', flex: 1 }}>
            <h2>Sorted By</h2>
            <input type="text" placeholder="Price (high to low)" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Search Flights</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>Round-trip</button>
        <button style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>One-way</button>
      </div>
      <div style={{ backgroundColor: '#e0e0e0', padding: '20px', borderRadius: '10px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <input type="text" placeholder="Departure" value={from} onChange={(e) => setFrom(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }} />
          <input type="text" placeholder="Destination" value={to} onChange={(e) => setTo(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }} />
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <input type="date" value={departure} onChange={(e) => setDeparture(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }} />
          <input type="text" placeholder="Choose passenger" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }} />
        </div>
        <button onClick={handleSearchClick} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#607d8b', color: '#fff', border: 'none' }}>Search</button>
      </div>
      <h2>Your Saved Trips</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[{
          destination: 'PVG ⇌ JFK',
          date: '05/01/2025',
          price: '2,315'
        }, {
          destination: 'PVG ⇌ JFK',
          date: '06/01/2025',
          price: '2,736'
        }].map((trip, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            <div style={{ flex: 1 }}>
              <div><strong>Destination</strong>: {trip.destination}</div>
              <div><strong>Date</strong>: {trip.date}</div>
              <div><strong>Price</strong>: {trip.price}</div>
            </div>
            <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;