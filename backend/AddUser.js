const bcrypt = require('bcrypt');
const db = require('./db'); // Perhatikan ini: '../db' => './db' karena file sejajar

async function insertUser() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10); 

    const [result] = await db.execute(
      'INSERT INTO users (username, password_hash, role_id) VALUES (?, ?, ?)',
      ['cashier_sue', hashedPassword, 5]
    );

    console.log('Insert Success. ID User:', result.insertId);
  } catch (err) {
    console.error('Failed Insert Data:', err.message);
  }
}

insertUser();