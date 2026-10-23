require('dotenv').config();
const express = require('express');
const mariadb = require('mariadb');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

app.post('/api/rsvp', async (req, res) => {
    let conn;
    try {
        const { nama, hadir, jumlah, ucapan } = req.body;
        
        conn = await pool.getConnection();
        const query = "INSERT INTO rsvp (nama, hadir, jumlah, ucapan) VALUES (?, ?, ?, ?)";
        await conn.query(query, [nama, hadir, jumlah, ucapan]);
        
        res.status(200).json({ message: "Konfirmasi kehadiran berhasil disimpan!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Terjadi kesalahan pada server saat menyimpan data." });
    } finally {
        if (conn) conn.release();
    }
});

app.listen(port, () => {
    console.log(`Server berada port ${port}`);
});