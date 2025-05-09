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

// Conexión a la base de datos MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,  // Usamos la IP proporcionada en .env
  user: process.env.DB_USER,  // Tu usuario MySQL
  password: process.env.DB_PASS,  // Tu contraseña MySQL
  database: process.env.DB_NAME,  // Nombre de la base de datos
  port: process.env.DB_PORT || 3306,  // Puerto de MySQL (usualmente es 3306)
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
    return;
  }
  console.log('✅ Conexión a MySQL establecida');
  connection.release();  // Liberamos la conexión
});

// Ruta para guardar mensaje
app.post('/nuevo-mensaje', async (req, res) => {
  const { nombre, mensaje } = req.body;
  const sql = 'INSERT INTO libro_boda (nombre, mensaje) VALUES (?, ?)';

  try {
    pool.query(sql, [nombre, mensaje], (err, result) => {
      if (err) {
        console.error('❌ Error al guardar el mensaje:', err);
        return res.status(500).send('Error al guardar el mensaje.');
      }
      res.status(200).send('Mensaje guardado.');
    });
  } catch (err) {
    console.error('❌ Error al guardar el mensaje:', err);
    res.status(500).send('Error al guardar el mensaje.');
  }
});

// Ruta para mostrar mensajes
app.get('/mensajes', async (req, res) => {
  try {
    pool.query('SELECT * FROM libro_boda ORDER BY fecha DESC', (err, result) => {
      if (err) {
        console.error('❌ Error al obtener los mensajes:', err);
        return res.status(500).send('Error al obtener los mensajes.');
      }
      res.json(result);
    });
  } catch (err) {
    console.error('❌ Error al obtener los mensajes:', err);
    res.status(500).send('Error al obtener los mensajes.');
  }
});

// Escuchar en el puerto indicado
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
