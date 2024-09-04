require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 5000;

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida.');
});

// Middleware
app.use(cors());
app.use(express.json());

// Endpoints para el CRUD

// Obtener todos los usuarios
app.get('/users', (_req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// Crear un nuevo usuario
app.post('/users', (req, res) => {
  const { full_name, email, phone_number } = req.body;
  const query = 'INSERT INTO users (full_name, email, phone_number) VALUES (?, ?, ?)';
  db.query(query, [full_name, email, phone_number], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ id: results.insertId, full_name, email, phone_number });
  });
});

// Actualizar un usuario
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone_number } = req.body;
  const query = 'UPDATE users SET full_name = ?, email = ?, phone_number = ? WHERE id = ?';
  db.query(query, [full_name, email, phone_number, id], (err) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ id, full_name, email, phone_number });
  });
});

// Eliminar un usuario
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: 'Usuario eliminado correctamente.' });
  });
});

app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
});
