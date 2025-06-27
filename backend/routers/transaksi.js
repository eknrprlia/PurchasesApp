const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/transaksi', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM transaksi INNER JOIN produk ON produk.id_produk = transaksi.id_produk');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;