// server/models/Registration.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegistrationSchema = new Schema({
  // Link para o evento ao qual esta inscrição pertence
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event', // Referencia o nosso modelo 'Event'
    required: true,
  },
  // Dados do participante
  name: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  // Opções do evento
  shirtSize: {
    type: String,
    required: true,
    enum: ['P', 'M', 'G', 'GG', 'XG'], // Garante que o valor seja um destes
  },
  termsAccepted: {
    type: Boolean,
    required: true,
    // Garante que o valor seja 'true' para salvar
    validate: {
      validator: (value) => value === true,
      message: 'Os termos devem ser aceitos.'
    }
  },
  // Data da inscrição
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

const Registration = mongoose.model('Registration', RegistrationSchema);

module.exports = Registration;