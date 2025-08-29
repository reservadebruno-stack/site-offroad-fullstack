// No topo do arquivo server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Resend } = require('resend'); // Importa o Resend
const Event = require('./models/Event');
const User = require('./models/User');
const authMiddleware = require('./middleware/auth');
const Registration = require('./models/Registration');

const app = express();
const PORT = 3001;

// Inicializa o Resend com a chave do arquivo .env
const resend = new Resend(process.env.RESEND_API_KEY);

// Middlewares
app.use(cors());
app.use(express.json());

// --- Rotas de Autenticação ---
app.use('/api/auth', require('./routes/auth'));

// --- Conexão com o Banco de Dados ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch(err => console.error("Falha na conexão com MongoDB:", err));

// --- Rotas da API ---

// ROTA GET: Buscar um único evento pelo ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar evento", error });
  }
});

// ROTA GET: Listar todos os eventos do banco de dados
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar eventos", error });
  }
});

// ROTA POST: Criar um novo evento no banco de dados
app.post('/api/events', authMiddleware, async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar evento", error });
  }
});

// ROTA DELETE: Deletar um evento pelo ID
app.delete('/api/events/:id', authMiddleware, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }
    res.json({ message: "Evento deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar evento", error });
  }
});

// ROTA PUT: Atualizar um evento pelo ID
app.put('/api/events/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: "Evento não encontrado para atualização" });
    }
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar evento", error });
  }
});

// ROTA POST: Inscrever um participante em um evento (COM ENVIO DE E-MAIL)
app.post('/api/events/:eventId/register', async (req, res) => {
  try {
    const { eventId } = req.params;
    const registrationData = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado.' });
    }

    const newRegistration = new Registration({
      ...registrationData,
      event: eventId,
    });

    await newRegistration.save();

    // Lógica de envio de e-mail
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: registrationData.email,
        subject: `Confirmação de Inscrição: ${event.title}`,
        html: `
          <h1>Inscrição Confirmada!</h1>
          <p>Olá, ${registrationData.name},</p>
          <p>Sua inscrição para o evento <strong>${event.title}</strong> foi realizada com sucesso.</p>
          <p><strong>Data do Evento:</strong> ${new Date(event.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
          <p><strong>Local:</strong> ${event.location}</p>
          <p>Obrigado por participar!</p>
        `,
      });
      console.log(`E-mail de confirmação enviado para ${registrationData.email}`);
    } catch (emailError) {
      console.error("Erro ao enviar e-mail de confirmação:", emailError);
    }

    res.status(201).json({ message: 'Inscrição realizada com sucesso!', registration: newRegistration });

  } catch (error) {
    res.status(400).json({ message: 'Erro ao realizar inscrição.', error: error.message });
  }
});

// ROTA GET: Listar todas as inscrições de um evento específico (PROTEGIDA)
app.get('/api/events/:eventId/registrations', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const registrations = await Registration.find({ event: eventId }).sort({ registeredAt: 1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar inscrições.", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});