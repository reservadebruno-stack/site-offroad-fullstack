// client/src/components/EventForm.jsx
import React, { useState } from 'react';

function EventForm({ onEventCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    category: '',
    description: '',
    difficulty: 'Intermediário', // Valor padrão
    price: 0,
    imageUrl: '',
    sponsors: '', // Vamos tratar como texto separado por vírgula
    kitDetails: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepara os dados para enviar, convertendo patrocinadores em um array
    const eventData = {
      ...formData,
      sponsors: formData.sponsors.split(',').map(s => s.trim()).filter(s => s),
    };
    onEventCreated(eventData);

    // Limpa o formulário
    setFormData({
      title: '', date: '', location: '', category: '', description: '',
      difficulty: 'Intermediário', price: 0, imageUrl: '', sponsors: '', kitDetails: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <h3>Cadastrar Novo Evento</h3>
      {/* Campos antigos */}
      <input type="text" name="title" placeholder="Título do Evento" value={formData.title} onChange={handleChange} required />
      <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      <input type="text" name="location" placeholder="Localização" value={formData.location} onChange={handleChange} required />
      <input type="text" name="category" placeholder="Categoria (ex: 4x4, MTB)" value={formData.category} onChange={handleChange} required />
      
      {/* Novos campos */}
      <textarea name="description" placeholder="Descrição completa do evento" value={formData.description} onChange={handleChange}></textarea>
      <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
        <option value="Iniciante">Iniciante</option>
        <option value="Intermediário">Intermediário</option>
        <option value="Avançado">Avançado</option>
      </select>
      <input type="number" name="price" placeholder="Preço da Inscrição (ex: 50.00)" value={formData.price} onChange={handleChange} required />
      <input type="url" name="imageUrl" placeholder="URL da Imagem do Banner" value={formData.imageUrl} onChange={handleChange} />
      <input type="text" name="sponsors" placeholder="Patrocinadores (separados por vírgula)" value={formData.sponsors} onChange={handleChange} />
      <textarea name="kitDetails" placeholder="Detalhes do Kit do Inscrito" value={formData.kitDetails} onChange={handleChange}></textarea>
      
      <button type="submit">Adicionar Evento</button>
    </form>
  );
}

export default EventForm;