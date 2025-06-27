const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/suppliers - Ambil semua supplier
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM suppliers ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/suppliers - Tambahkan supplier baru
router.post('/', async (req, res) => {
  try {
    const { name, contact } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Supplier name is required" });
    }

    const sql = 'INSERT INTO suppliers (name, contact) VALUES (?, ?)';
    await db.execute(sql, [name, contact]);
    res.status(201).json({ message: 'Supplier Successfully Added' });
  } catch (error) {
    console.error('Error adding supplier:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/suppliers/:id - Update supplier berdasarkan ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact } = req.body;

    const sql = 'UPDATE suppliers SET name = ?, contact = ? WHERE id = ?';
    const [result] = await db.execute(sql, [name, contact, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ message: 'Supplier Successfully Updated' });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE /api/suppliers/:id - Hapus supplier berdasarkan ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sql = 'DELETE FROM suppliers WHERE id = ?';
    const [result] = await db.execute(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ message: 'Supplier Successfully Deleted' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;