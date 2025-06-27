const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all customers
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM customers');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// POST create customer
router.post('/', async (req, res) => {
  const { name, contact } = req.body; 
  try {
    const [result] = await db.execute(
      'INSERT INTO customers (name,contact) VALUES (?, ?)',
      [name, contact]
    );
    res.json({ id: result.insertId, name, contact });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

// PUT update customer
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, contact } = req.body;
  try {
    await db.execute(
      'UPDATE customers SET name=?, contact=? WHERE id=?',
      [name, contact, id]
    );
    res.json({ id, name,contact });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Hapus semua sales yang terkait dengan customer ini
    await db.execute('DELETE FROM sales WHERE customer_id = ?', [id]);

    // 2. Hapus customer-nya
    const [result] = await db.execute('DELETE FROM customers WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer tidak ditemukan' });
    }

    res.json({ message: 'Customer dan data terkait berhasil dihapus.' });
  } catch (error) {
    console.error('❌ Gagal menghapus customer:', error);
    res.status(500).json({ error: 'Gagal menghapus customer' });
  }
});


module.exports = router;