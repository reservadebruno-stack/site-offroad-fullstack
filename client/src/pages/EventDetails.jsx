// client/src/pages/EventDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EventDetails() {
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '', cpf: '', email: '', phone: '', shirtSize: 'M', termsAccepted: false,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/events/${id}`)
      .then(response => response.json())
      .then(data => setEvent(data))
      .catch(error => console.error('Erro ao buscar detalhes do evento:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/events/${id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Falha ao realizar inscrição.');
      alert('Inscrição realizada com sucesso!');
      navigate('/');
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  if (!event) return <p>Carregando evento...</p>;

  return (
    <div className="event-details-container">
      <div className="event-info">
        {/* Banner do evento */}
        {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="event-banner" />}
        
        <h2>{event.title}</h2>
        <p><strong>Data:</strong> {new Date(event.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
        <p><strong>Local:</strong> {event.location}</p>
        <p><strong>Categoria:</strong> {event.category}</p>
        <p><strong>Nível:</strong> {event.difficulty}</p>
        <p><strong>Preço da Inscrição:</strong> R$ {Number(event.price).toFixed(2)}</p>
        
        <div className="event-section">
          <h3>Descrição</h3>
          <p>{event.description}</p>
        </div>

        {event.kitDetails && (
          <div className="event-section">
            <h3>Kit do Inscrito</h3>
            <p>{event.kitDetails}</p>
          </div>
        )}

        {event.sponsors && event.sponsors.length > 0 && (
          <div className="event-section">
            <h3>Patrocinadores</h3>
            <ul className="sponsors-list">
              {event.sponsors.map((sponsor, index) => <li key={index}>{sponsor}</li>)}
            </ul>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="registration-form">
        {/* O formulário de inscrição permanece igual */}
        <h3>Formulário de Inscrição</h3>
        <input type="text" name="name" placeholder="Nome Completo" onChange={handleChange} required />
        <input type="text" name="cpf" placeholder="CPF" onChange={handleChange} required />
        <input type="email" name="email" placeholder="E-mail" onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Telefone / WhatsApp" onChange={handleChange} required />
        <label>Tamanho da Camisa:</label>
        <select name="shirtSize" value={formData.shirtSize} onChange={handleChange}>
          <option value="P">P</option>
          <option value="M">M</option>
          <option value="G">G</option>
          <option value="GG">GG</option>
          <option value="XG">XG</option>
        </select>
        <div className="terms">
          <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} required />
          <label>Li e aceito os termos de isenção de responsabilidade.</label>
        </div>
        <button type="submit">Inscrever-se por R$ {Number(event.price).toFixed(2)}</button>
      </form>
    </div>
  );
}

export default EventDetails;