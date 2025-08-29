// client/src/components/EditModal.jsx
import React, { useState, useEffect } from 'react';

function EditModal({ event, onSave, onCancel }) {
  const [formData, setFormData] = useState({ ...event, sponsors: event.sponsors.join(', ') });

  useEffect(() => {
    // Garante que o formulário seja atualizado se um novo evento for selecionado
    setFormData({ ...event, sponsors: event.sponsors ? event.sponsors.join(', ') : '' });
  }, [event]);
      
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      ...formData,
      sponsors: formData.sponsors.split(',').map(s => s.trim()).filter(s => s),
    };
    onSave(eventData);
  };

  const formattedDate = new Date(formData.date).toISOString().split('T')[0];

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Editar Evento</h2>
        <form onSubmit={handleSubmit}>
          {/* Campos existentes e novos */}
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
          <input type="date" name="date" value={formattedDate} onChange={handleChange} />
          <input type="text" name="location" value={formData.location} onChange={handleChange} />
          <input type="text" name="category" value={formData.category} onChange={handleChange} />
          <textarea name="description" placeholder="Descrição" value={formData.description} onChange={handleChange}></textarea>
          <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
            <option value="Iniciante">Iniciante</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select>
          <input type="number" name="price" placeholder="Preço" value={formData.price} onChange={handleChange} />
          <input type="url" name="imageUrl" placeholder="URL da Imagem" value={formData.imageUrl} onChange={handleChange} />
          <input type="text" name="sponsors" placeholder="Patrocinadores" value={formData.sponsors} onChange={handleChange} />
          <textarea name="kitDetails" placeholder="Detalhes do Kit" value={formData.kitDetails} onChange={handleChange}></textarea>
          
          <div className="modal-actions">
            <button type="submit" className="save-button">Salvar Alterações</button>
            <button type="button" onClick={onCancel} className="cancel-button">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;