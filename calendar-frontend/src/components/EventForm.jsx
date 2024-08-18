import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import './EventForm.css'; // Import the updated CSS for styling

const EventForm = ({ isOpen, onClose }) => {
  const [date, setDate] = useState('');
  const [eventType, setEventType] = useState('meeting'); // Default to 'meeting'
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/events/', {
        title: description, // Use description as title in the API
        description: eventType, // Using eventType as description
        start_time: date,
        end_time: date, // Use the same date for both start and end time
      });
      console.log('Event created:', response.data);
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="event-form-container">
        <h2 className="modal-title">Add New Event</h2>
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="eventType">Event Type:</label>
            <select
              id="eventType"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="meeting" style={{ color: 'green' }}>Meeting</option>
              <option value="task" style={{ color: 'red' }}>Task</option>
              <option value="calling" style={{ color: 'blue' }}>Calling</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="submit-btn"
          >
            Create Event
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default EventForm;
