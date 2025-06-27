const bcrypt = require('bcrypt');
const db = require('./db'); // pastikan path ini sesuai dengan lokasi file db.js kamu

(async () => {
  try {
    const password = 'password123';
    const hash = await bcrypt.hash(password, 10);

    // Update semua user di tabel users
    await db.execute('UPDATE users SET password_hash = ?', [hash]);

    console.log('✅ Semua password berhasil diubah ke "password123".');
    process.exit();
  } catch (err) {
    console.error('❌ Gagal update password:', err);
    process.exit(1);
  }
})();
