// client/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Falha no registro');
      }
      alert('Registro bem-sucedido! Você será redirecionado para o login.');
      navigate('/login'); // Redireciona para a página de login
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Cadastro de Organizador</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input type="text" name="name" placeholder="Nome Completo" onChange={handleChange} required />
        <input type="email" name="email" placeholder="E-mail" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Senha" onChange={handleChange} required />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default Register;