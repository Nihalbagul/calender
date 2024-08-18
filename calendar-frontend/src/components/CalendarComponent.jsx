import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarComponent.css'; // Import the CSS for additional styling

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'en-US': enUS,
  },
});

// Function to determine event color based on type
const getEventColor = (eventType) => {
  switch (eventType) {
    case 'meeting':
      return '#28a745'; // Green for meetings
    case 'calling':
      return '#007bff'; // Blue for calling
    case 'task':
      return '#dc3545'; // Red for tasks
    default:
      return '#6c757d'; // Gray for default or unknown types
  }
};

const CalendarComponent = ({ events, onAddEvent }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('task');

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start); // Set the selected date for the event
  };

  const handleClose = () => {
    setSelectedDate(null); // Reset the selected date
    setEventTitle(''); // Clear the title field
    setEventDescription('task'); // Reset event type to default
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!selectedDate) return; // Prevent submission if no date is selected

    // Create a new event object
    const newEvent = {
      title: eventTitle || 'No Title',
      start_time: selectedDate.toISOString(),
      end_time: new Date(selectedDate.getTime() + 60 * 60 * 1000).toISOString(), // Default duration of 1 hour
      description: eventDescription,
    };

    onAddEvent(newEvent); // Trigger the onAddEvent callback to add the event
    handleClose(); // Close the form after submitting
  };

  const convertedEvents = events.map((event) => ({
    title: event.title || 'No Title',
    start: new Date(event.start_time),
    end: new Date(event.end_time),
    bgcolor: getEventColor(event.description), // Assign color based on event description (type)
  }));

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={convertedEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={(event) => {
          const backgroundColor = event.bgcolor || '#6c757d'; // Default color
          return {
            style: {
              backgroundColor,
              color: 'white',
              borderRadius: '5px',
              border: `1px solid ${backgroundColor}`,
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              fontWeight: 'bold',
            },
          };
        }}
        selectable
        onSelectSlot={handleSelectSlot} // Capture slot selection
        onSelectEvent={(event) => alert(event.title)} // Optional: Display event title on click
      />

      {/* Display event form if a date is selected */}
      {selectedDate && (
        <div className="event-form-overlay">
          <div className="event-form-card">
            <h3>Schedule Event</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Event Type:
                  <select
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                  >
                    <option value="task">Task</option>
                    <option value="meeting">Meeting</option>
                    <option value="calling">Calling</option>
                  </select>
                </label>
              </div>
              <div className="form-group">
                <label>
                  Title (Optional):
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Event Title"
                  />
                </label>
              </div>
              <div className="form-actions">
                <button type="submit">Add Event</button>
                <button type="button" onClick={handleClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Prop types validation
CalendarComponent.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      start_time: PropTypes.string.isRequired,
      end_time: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  onAddEvent: PropTypes.func.isRequired, // Function to handle adding new events
};

export default CalendarComponent;
