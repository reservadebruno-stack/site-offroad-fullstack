// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import EventDetails from './pages/EventDetails';
import Registrations from './pages/Registrations';
import './App.css';

// Componente de Navegação para organizar a lógica do header
function Navigation() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token
    navigate('/login'); // Redireciona para a página de login
    window.location.reload(); // Recarrega para garantir que o estado seja limpo
  };

  return (
    <header className="App-header">
      <h1><Link to="/" className="header-link">Portal Off-Road Events</Link></h1>
      <nav>
        {token ? (
          // Se existe um token (usuário logado), mostra o botão de Logout
          <button onClick={handleLogout} className="logout-button">Logout</button>
        ) : (
          // Se não existe token, mostra os links de Cadastro e Login
          <>
            <Link to="/register">Cadastrar</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        {/* O Bloco <Routes> define todas as páginas possíveis da aplicação */}
        <Routes>
          {/* A linha abaixo é a que estava faltando ou com erro. */}
          {/* Ela diz: "Quando a URL for '/', renderize o componente Home." */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/events/:eventId/registrations" element={<Registrations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;