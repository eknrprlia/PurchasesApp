const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db'); // koneksi pool mysql2/promise

// GET all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error("GET Error:", error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST create user
router.post('/', async (req, res) => {
  const { username, password, role_id } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password harus diisi' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const roleValue = role_id === undefined || role_id === '' ? null : role_id;

    const [result] = await db.execute(
      'INSERT INTO users (username, password_hash, role_id) VALUES (?, ?, ?)',
      [username, hashedPassword, roleValue]
    );

    res.status(201).json({ id: result.insertId, username, role_id: roleValue });
  } catch (error) {
    console.error("POST Error:", error); // ← ini penting!
    res.status(500).json({ error: 'Failed to add user' });
  }
});


// PUT update user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password, role_id } = req.body;

  if (!username || role_id === undefined || role_id === null) {
    return res.status(400).json({ error: 'Username dan role_id wajib diisi' });
  }

  try {
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.execute(
        'UPDATE users SET username = ?, password_hash = ?, role_id = ? WHERE id = ?',
        [username, hashedPassword, role_id, id]
      );
    } else {
      await db.execute(
        'UPDATE users SET username = ?, role_id = ? WHERE id = ?',
        [username, role_id, id]
      );
    }

    res.json({ id, username, role_id });
  } catch (error) {
    console.error("PUT Error:", error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error("DELETE Error:", error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
