// server/middleware/auth.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // 1. Pega o token do header da requisição
  const token = req.header('x-auth-token');

  // 2. Verifica se o token não existe
  if (!token) {
    return res.status(401).json({ message: 'Nenhum token, autorização negada.' });
  }

  try {
    // 3. Se o token existe, verifica se é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Se for válido, anexa as informações do usuário na requisição
    req.user = decoded.user;
    next(); // Passa para a próxima etapa (a lógica da rota)
  } catch (error) {
    res.status(401).json({ message: 'Token inválido.' });
  }
}

module.exports = authMiddleware;