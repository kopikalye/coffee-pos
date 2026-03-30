'use strict';

const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./sales.db', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    }
});

// Endpoint to get daily sales
app.get('/sales/daily', (req, res) => {
    const date = req.query.date;
    db.all('SELECT * FROM sales WHERE date = ?', [date], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Endpoint to record a new sale
app.post('/sales', (req, res) => {
    const { date, amount } = req.body;
    db.run('INSERT INTO sales (date, amount) VALUES (?, ?)', [date, amount], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});