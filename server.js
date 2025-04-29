const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando correctamente!');
});


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('assets'));

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // tu contraseña si la tienes
  database: 'libro_boda',
  port: 5500 // ¡el puerto que tú usaste en Workbench!
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión a MySQL establecida');
});

// Ruta para recibir mensajes
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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



