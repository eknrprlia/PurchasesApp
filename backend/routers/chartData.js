const express = require('express');
const router = express.Router();
const db = require('../db');

// Endpoint for Sales Data (Total Transactions per Date)
router.get('/sales-data', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT DATE_FORMAT(created_at, '%d %b %Y') AS tanggal, COUNT(id) AS total_jumlah
            FROM purchases
            GROUP BY tanggal
            ORDER BY tanggal
        `);

        const labels = rows.map(row => row.tanggal);
        const data = rows.map(row => parseInt(row.total_jumlah) || 0);

        res.json({ labels, data });
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint for Revenue Data (Total Revenue per Date)
router.get('/revenue-data', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT DATE_FORMAT(created_at, '%d %b %Y') AS tanggal, SUM(total) AS total_pendapatan
FROM purchases
GROUP BY tanggal
ORDER BY tanggal;

        `);

        const labels = rows.map(row => row.tanggal);
        const data = rows.map(row => parseFloat(row.total_pendapatan) || 0);

        res.json({ labels, data });
    } catch (error) {
        console.error('Error fetching revenue data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
