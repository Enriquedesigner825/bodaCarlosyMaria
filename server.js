const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'assets')));

// Página principal
app.get('/', (req, res) => {
  res.sendFile('libro.html', { root: path.join(__dirname, 'assets') });
});

// Conexión a la base de datos
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

// 🚨 👉 Aquí agregamos el endpoint de prueba:
app.get('/test-db', (req, res) => {
  db.query('SELECT 1', (err, result) => {
    if (err) {
      console.error('Error al conectar con la base de datos:', err);
      return res.status(500).send('Error al conectar con la base de datos.');
    }
    res.send('✅ Conexión exitosa con la base de datos');
  });
});

// Ruta para guardar mensaje
app.post('/nuevo-mensaje', (req, res) => {
  const { nombre, mensaje } = req.body;
  const sql = 'INSERT INTO libro_boda (nombre, mensaje, fecha) VALUES (?, ?, NOW())';
  
  db.query(sql, [nombre, mensaje], (err, result) => {
    if (err) {
      console.error('Error MySQL al guardar:', err);
      return res.status(500).send('Error al guardar el mensaje.');
    }
    res.status(200).send('Mensaje guardado.');
  });
});

// Ruta para mostrar mensajes
app.get('/mensajes', (req, res) => {
  db.query('SELECT * FROM libro_boda ORDER BY fecha DESC', (err, results) => {
    if (err) {
      console.error('Error MySQL al obtener mensajes:', err);
      return res.status(500).send('Error al obtener los mensajes.');
    }
    res.json(results);
  });
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

