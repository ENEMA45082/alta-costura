const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar con la base de datos SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS prendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero INTEGER,
    prenda TEXT,
    estado TEXT,
    cliente TEXT,
    precio REAL
)`);

// 🔹 Ruta para obtener todas las prendas (JSON)
app.get('/prendas', (req, res) => {
    db.all('SELECT * FROM prendas', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// 🔹 Ruta para agregar una prenda
app.post('/agregar-prenda', (req, res) => {
    const { numero, prenda, estado, cliente, precio } = req.body;
    db.run(
        `INSERT INTO prendas (numero, prenda, estado, cliente, precio) VALUES (?, ?, ?, ?, ?)`,
        [numero, prenda, estado, cliente, precio],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, numero, prenda, estado, cliente, precio });
        }
    );
});

// 🔹 Ruta para eliminar una prenda
app.delete('/eliminar-prenda/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM prendas WHERE id = ?`, id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Prenda eliminada' });
    });
});

// 🔹 Nueva ruta para ver la base de datos en una tabla HTML
app.get('/ver-prendas', (req, res) => {
    db.all('SELECT * FROM prendas', (err, rows) => {
        if (err) {
            res.status(500).send('Error al obtener datos');
            return;
        }
        let html = `
            <html>
            <head>
                <title>Listado de Prendas</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { padding: 20px; }
                    table { width: 100%; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2 class="mb-3">Listado de Prendas</h2>
                    <table class="table table-striped table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>Número</th>
                                <th>Prenda</th>
                                <th>Estado</th>
                                <th>Cliente</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>`;

        rows.forEach(row => {
            html += `
                <tr>
                    <td>${row.numero}</td>
                    <td>${row.prenda}</td>
                    <td>${row.estado}</td>
                    <td>${row.cliente}</td>
                    <td>$${row.precio}</td>
                </tr>`;
        });

        html += `</tbody></table></div></body></html>`;
        res.send(html);
    });
});

// 🔹 Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
