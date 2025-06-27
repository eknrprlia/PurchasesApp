const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: Ambil semua produk
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error saat mengambil produk:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

// POST: Tambah produk baru
router.post('/', async (req, res) => {
  const { name, sku, category_id, unit, price, cost_price, stock } = req.body;

  if (!name || !sku || !category_id || !unit || price == null || cost_price == null || stock == null) {
    return res.status(400).json({ error: 'Semua field wajib diisi!' });
  }

  try {
    const sql = `
      INSERT INTO products (name, sku, category_id, unit, price, cost_price, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db.execute(sql, [name, sku, category_id, unit, price, cost_price, stock]);
    res.status(201).json({ message: 'Produk berhasil ditambahkan.' });
  } catch (error) {
    console.error('Error saat menambah produk:', error);
    res.status(500).json({ error: 'Gagal menambah produk.' });
  }
});

// PUT: Update produk berdasarkan ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, sku, category_id, unit, price, cost_price, stock } = req.body;

  if (!name || !sku || !category_id || !unit || price == null || cost_price == null || stock == null) {
    return res.status(400).json({ error: 'Semua field wajib diisi!' });
  }

  try {
    const sql = `
      UPDATE products 
      SET name = ?, sku = ?, category_id = ?, unit = ?, price = ?, cost_price = ?, stock = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [name, sku, category_id, unit, price, cost_price, stock, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produk tidak ditemukan.' });
    }

    res.json({ message: 'Produk berhasil diperbarui.' });
  } catch (error) {
    console.error('Error saat mengupdate produk:', error);
    res.status(500).json({ error: 'Gagal memperbarui produk.' });
  }
});

// DELETE: Hapus produk berdasarkan ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const sql = 'DELETE FROM products WHERE id = ?';
    const [result] = await db.execute(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produk tidak ditemukan.' });
    }

    res.json({ message: 'Produk berhasil dihapus.' });
  } catch (error) {
    console.error('Error saat menghapus produk:', error);
    res.status(500).json({ error: 'Gagal menghapus produk.' });
  }
});

module.exports = router;
