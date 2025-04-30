const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('assets'));

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'acelebrar.html'));
});

// Conexión a la base de datos (variables de entorno)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión a MySQL establecida');
});

// Ruta para guardar mensaje
app.post('/nuevo-mensaje', (req, res) => {
  const { nombre, mensaje } = req.body;
  const sql = 'INSERT INTO mensajes (nombre, mensaje) VALUES (?, ?)';
  db.query(sql, [nombre, mensaje], (err, result) => {
    if (err) return res.status(500).send('Error al guardar el mensaje.');
    res.status(200).send('Mensaje guardado.');
  });
});

// Ruta para mostrar mensajes
app.get('/mensajes', (req, res) => {
  db.query('SELECT * FROM mensajes ORDER BY fecha DESC', (err, results) => {
    if (err) return res.status(500).send('Error al obtener los mensajes.');
    res.json(results);
  });
});

// Solo un listen
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


