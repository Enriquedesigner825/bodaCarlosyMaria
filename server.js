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

// Conexión a la base de datos (reconexión automática)
let db;

function connectDB() {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  db.connect(err => {
    if (err) {
      console.error('❌ Error conectando a la base de datos:', err);
      setTimeout(connectDB, 5000); // Reintenta en 5 segundos
    } else {
      console.log('✅ Conexión a MySQL establecida');
    }
  });

  db.on('error', err => {
    console.error('❌ Error de conexión:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connectDB(); // Reconecta
    } else {
      throw err;
    }
  });
}

connectDB();

// Ruta para guardar mensaje
app.post('/nuevo-mensaje', (req, res) => {
  const { nombre, mensaje } = req.body;
  const sql = 'INSERT INTO libro_boda (nombre, mensaje) VALUES (?, ?)';
  db.query(sql, [nombre, mensaje], (err, result) => {
    if (err) {
      console.error('❌ Error al guardar el mensaje:', err);
      return res.status(500).send('Error al guardar el mensaje.');
    }
    res.status(200).send('Mensaje guardado.');
  });
});

// Ruta para mostrar mensajes
app.get('/mensajes', (req, res) => {
  db.query('SELECT * FROM libro_boda ORDER BY fecha DESC', (err, results) => {
    if (err) {
      console.error('❌ Error al obtener los mensajes:', err);
      return res.status(500).send('Error al obtener los mensajes.');
    }
    res.json(results);
  });
});

// Solo un listen
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

