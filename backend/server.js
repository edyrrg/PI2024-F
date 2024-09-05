const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 5000;

// Configuración de la conexión a la base de datos usando un pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(cors());
app.use(express.json());

// Endpoints para el CRUD

// Obtener todos los usuarios
app.get('/users', async (_req, res) => {
  const query = 'SELECT * FROM users';

  try {
    const [results] = await pool.query(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los usuarios', details: err });
  }
});

// Crear un nuevo usuario
app.post('/users', async (req, res) => {
  const { full_name, email, phone_number } = req.body;

  // Validación básica de los datos de entrada
  if (!full_name || !email || !phone_number) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = 'INSERT INTO users (full_name, email, phone_number) VALUES (?, ?, ?)';

  try {
    const [results] = await pool.query(query, [full_name, email, phone_number]);
    res.json({ id: results.insertId, full_name, email, phone_number });
  } catch (err) {
    res.status(500).json({ error: 'Error al insertar el usuario', details: err });
  }
});

// Actualizar un usuario
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone_number } = req.body;

  // Validación básica de los datos de entrada
  if (!full_name || !email || !phone_number) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = 'UPDATE users SET full_name = ?, email = ?, phone_number = ? WHERE id = ?';

  try {
    const [results] = await pool.query(query, [full_name, email, phone_number, id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ id, full_name, email, phone_number });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el usuario', details: err });
  }
});

// Eliminar un usuario
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  // Validación básica del ID
  if (!id) {
    return res.status(400).json({ error: 'ID de usuario es obligatorio' });
  }

  const query = 'DELETE FROM users WHERE id = ?';

  try {
    const [results] = await pool.query(query, [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el usuario', details: err });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
});