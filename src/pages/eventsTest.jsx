import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const EventsTest = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('events/')
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        setError(err.response ? err.response.data : 'Erreur réseau');
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Liste des Événements</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {events.map((event) => (
          <li key={event.id}>{event.name} — {event.date}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventsTest;
