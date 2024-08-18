import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CalendarComponent from './components/CalendarComponent';
import EventForm from './components/EventForm';
import './index.css';

function App() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get('http://localhost:8000/events/');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    fetchEvents();
  }, []);

  const handleAddEvent = async (newEvent) => {
    try {
      const response = await axios.post('http://localhost:8000/events/', newEvent);
      const eventWithId = { ...newEvent, _id: response.data.id };
      setEvents((prevEvents) => [...prevEvents, eventWithId]);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div className="App">
      <h1>Dynamic Calendar Application</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{ padding: '10px 20px', fontSize: '16px', marginBottom: '20px' }}
      >
        Add Event
      </button>
      <EventForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddEvent={handleAddEvent} />
      <CalendarComponent events={events} onAddEvent={handleAddEvent} />
    </div>
  );
}

export default App;
