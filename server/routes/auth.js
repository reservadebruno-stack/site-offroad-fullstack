// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importa o modelo de usuário

const router = express.Router();

// ROTA POST: /api/auth/register (Cadastrar um novo usuário)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Verificar se o usuário já existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário com este e-mail já existe.' });
    }

    // 2. Se não existe, criar um novo usuário
    user = new User({ name, email, password });

    // 3. Criptografar a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Salvar o usuário no banco de dados
    await user.save();

    // 5. Retornar uma resposta de sucesso
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro no servidor');
  }
});

// ROTA POST: /api/auth/login (Autenticar um usuário)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Verificar se o usuário existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        // 2. Comparar a senha enviada com a senha criptografada no banco
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        // 3. Se as senhas batem, criar e retornar um token JWT
        const payload = {
            user: {
                id: user.id, // O ID do usuário será guardado no token
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Uma "chave secreta" para assinar o token
            { expiresIn: '5h' }, // O token expira em 5 horas
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Erro no servidor');
    }
});


module.exports = router;