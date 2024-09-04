import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/users';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ full_name: '', email: '', phone_number: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, form);
      fetchUsers();
      setForm({ full_name: '', email: '', phone_number: '' });
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleUpdate = async (user) => {
    const newFullName = prompt("Nuevo nombre completo:", user.full_name);
    const newEmail = prompt("Nuevo correo:", user.email);
    const newPhoneNumber = prompt("Nuevo número de teléfono:", user.phone_number);

    if (newFullName && newEmail && newPhoneNumber) {
      try {
        await axios.put(`${API_URL}/${user.id}`, {
          full_name: newFullName,
          email: newEmail,
          phone_number: newPhoneNumber
        });
        fetchUsers();
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
      }
    }
  };

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <form onSubmit={handleSubmit}>
        <input name="full_name" placeholder="Nombre Completo" value={form.full_name} onChange={handleInputChange} required />
        <input name="email" placeholder="Correo" value={form.email} onChange={handleInputChange} required />
        <input name="phone_number" placeholder="Número de Teléfono" value={form.phone_number} onChange={handleInputChange} />
        <button type="submit">Crear Usuario</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Correo</th>
            <th>Número de Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.phone_number}</td>
              <td>
                <button onClick={() => handleUpdate(user)}>Editar</button>
                <button onClick={() => handleDelete(user.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

