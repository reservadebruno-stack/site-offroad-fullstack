// server/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // --- Campos Antigos ---
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },

  // --- Novos Campos Detalhados ---
  description: {
    type: String,
    default: 'Nenhuma descrição fornecida.'
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Iniciante', 'Intermediário', 'Avançado'], // Apenas estes valores são permitidos
    default: 'Intermediário'
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  imageUrl: { // Para o banner do evento
    type: String,
    default: ''
  },
  sponsors: { // Uma lista de patrocinadores
    type: [String],
    default: []
  },
  kitDetails: { // Descrição do que vem no kit
    type: String,
    default: ''
  },

  // --- Campo de Controle ---
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;