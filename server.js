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

// Página principal (asegúrate de que este sea tu archivo correcto)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'libro.html'));  // 👈 Cambia a tu archivo real si no es 'libro.html'
});

// Conexión a la base de datos MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificamos la conexión al arrancar
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
  } else {
    console.log('✅ Conexión a MySQL establecida');
    connection.release();
  }
});

// Ruta para guardar mensaje
app.post('/nuevo-mensaje', (req, res) => {
  const { nombre, mensaje } = req.body;

  // Validamos que haya contenido
  if (!nombre || !mensaje) {
    return res.status(400).send('Nombre y mensaje son obligatorios.');
  }

  const sql = 'INSERT INTO libro_boda (nombre, mensaje, fecha) VALUES (?, ?, NOW())';

  pool.query(sql, [nombre, mensaje], (err, results) => {
    if (err) {
      console.error('❌ Error al guardar el mensaje:', err);
      return res.status(500).send('Error al guardar el mensaje.');
    }
    res.status(200).send('Mensaje guardado.');
  });
});

// Ruta para mostrar mensajes
app.get('/mensajes', (req, res) => {
  const sql = 'SELECT * FROM libro_boda ORDER BY fecha DESC';

  pool.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener los mensajes:', err);
      return res.status(500).send('Error al obtener los mensajes.');
    }
    res.json(results);
  });
});

// Arrancamos el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

