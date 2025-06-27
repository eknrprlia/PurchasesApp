const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all roles
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM roles');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// POST create role
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  try {
    const [result] = await db.execute(
      'INSERT INTO roles (name) VALUES (?)',
      [name]
    );
    res.json({ id: result.insertId, name });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add role' });
  }
});

// PUT update role
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  try {
    await db.execute(
      'UPDATE roles SET name=? WHERE id=?',
      [name, id]
    );
    res.json({ id, name });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// DELETE role
// DELETE role
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Periksa user
    const [users] = await db.execute('SELECT COUNT(*) AS count FROM users WHERE role_id = ?', [id]);
    if (users[0].count > 0) {
      return res.status(400).json({
        message: 'Role masih digunakan oleh user.',
      });
    }

    // Periksa tabel lain kalau ada relasi tambahan, misal `purchases`
    const [purchases] = await db.execute('SELECT COUNT(*) AS count FROM purchases WHERE created_by IN (SELECT id FROM users WHERE role_id = ?)', [id]);
    if (purchases[0].count > 0) {
      return res.status(400).json({
        message: 'Role masih digunakan dalam data pembelian.',
      });
    }

    // Hapus role
    const [result] = await db.execute('DELETE FROM roles WHERE id=?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Role tidak ditemukan.' });
    }

    res.json({ message: 'Role berhasil dihapus' });
  } catch (error) {
    console.error("Gagal hapus role:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});


module.exports = router;
