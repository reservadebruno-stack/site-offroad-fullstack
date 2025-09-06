// client/src/pages/Registrations.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [eventName, setEventName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { eventId } = useParams(); // Pega o ID do evento da URL

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Função para buscar o nome do evento
    const fetchEventName = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${eventId}`);
        const data = await res.json();
        if (res.ok) {
          setEventName(data.title);
        }
      } catch (error) {
        console.error("Erro ao buscar nome do evento:", error);
      }
    };

    // Função para buscar as inscrições
    const fetchRegistrations = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${eventIdToRegistrations}`, {
          headers: {
            'x-auth-token': token, // Envia o token para a rota protegida
          },
        });
        const data = await res.json();
        if (res.ok) {
          setRegistrations(data);
        } else {
          // Se o token for inválido ou o usuário não estiver logado, o backend retornará um erro
          console.error("Falha ao buscar inscrições:", data.message);
        }
      } catch (error) {
        console.error("Erro de rede ao buscar inscrições:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventName();
    fetchRegistrations();
  }, [eventId]);

  if (isLoading) {
    return <p>Carregando inscrições...</p>;
  }

  return (
    <div className="registrations-container">
      <Link to="/" className="back-link">← Voltar para todos os eventos</Link>
      <h2>Inscrições para o Evento: {eventName}</h2>

      {registrations.length === 0 ? (
        <p>Nenhuma inscrição foi encontrada para este evento.</p>
      ) : (
        <table className="registrations-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Camisa</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(reg => (
              <tr key={reg._id}>
                <td>{reg.name}</td>
                <td>{reg.cpf}</td>
                <td>{reg.email}</td>
                <td>{reg.phone}</td>
                <td>{reg.shirtSize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Registrations;