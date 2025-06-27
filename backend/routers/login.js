const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Hash dari 'password123'
const defaultPasswordHash = '$2b$10$Tq9GoogzZxlMp3C1ZAWZzePXQkTDfFlrfazZyaPYRGEnXLpAoGM8y';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, defaultPasswordHash); // hanya cocokkan dengan password123

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role_id: user.role_id },
      'rahasia_super',
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login berhasil', token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
