// client/src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventForm from '../components/EventForm';
import EditModal from '../components/EditModal';

function Home() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    fetch('http://localhost:3001/api/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Erro ao buscar eventos:', error));
  }, []);

  const handleEventCreated = (newEvent) => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify(newEvent),
    })
    .then(response => {
      if (!response.ok) throw new Error('Falha ao criar o evento.');
      return response.json();
    })
    .then(data => {
      setEvents(currentEvents => [...currentEvents, data]);
    })
    .catch(error => alert(error.message));
  };

  const handleDelete = (eventIdToDelete) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Tem certeza que deseja deletar este evento?')) return;

    fetch(`http://localhost:3001/api/events/${eventIdToDelete}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token },
    })
    .then(response => {
      if (response.ok) {
        setEvents(currentEvents => currentEvents.filter(event => event._id !== eventIdToDelete));
      } else {
        throw new Error('Falha ao deletar o evento.');
      }
    })
    .catch(error => alert(error.message));
  };

  const handleUpdateEvent = (updatedEvent) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3001/api/events/${updatedEvent._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify(updatedEvent),
    })
    .then(response => {
      if (!response.ok) throw new Error('Falha ao atualizar o evento.');
      return response.json();
    })
    .then(savedEvent => {
      setEvents(currentEvents =>
        currentEvents.map(event => (event._id === savedEvent._id ? savedEvent : event))
      );
      handleCloseModal();
    })
    .catch(error => alert(error.message));
  };

  const handleOpenModal = (event) => {
    setCurrentEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEvent(null);
  };

  return (
    <main>
      {isLoggedIn && (
        <>
          <EventForm onEventCreated={handleEventCreated} />
          <hr />
        </>
      )}

      <h2>Próximos Eventos</h2>
      <div className="events-list">
        {events.length === 0 ? (
          <p>Nenhum evento encontrado.</p>
        ) : (
          events.map(event => (
            <Link to={`/events/${event._id}`} key={event._id} className="event-card-link">
              <div className="event-card">
                <h3>{event.title}</h3>
                <p><strong>Data:</strong> {event.date ? new Date(event.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Data inválida'}</p>
                <p><strong>Local:</strong> {event.location}</p>
                <p><strong>Categoria:</strong> {event.category}</p>
                
                {isLoggedIn && (
                  <div className="card-actions">
                    {/* BOTÃO ADICIONADO ABAIXO */}
                    <Link to={`/events/${event._id}/registrations`} className="view-registrations-button">
                      Ver Inscrições
                    </Link>
                    <button onClick={(e) => { e.preventDefault(); handleOpenModal(event); }} className="edit-button">Editar</button>
                    <button onClick={(e) => { e.preventDefault(); handleDelete(event._id); }} className="delete-button">Deletar</button>
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      {isModalOpen && (
        <EditModal
          event={currentEvent}
          onSave={handleUpdateEvent}
          onCancel={handleCloseModal}
        />
      )}
    </main>
  );
}

export default Home;