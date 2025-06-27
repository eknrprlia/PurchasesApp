const express = require('express');
const router = express.Router();
const db = require('../db');

// GET ALL CATEGORIES
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM categories ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// CREATE CATEGORY
router.post('/', async (req, res) => {
  console.log("BODY YANG DITERIMA:", req.body); // <---- Tambahkan ini
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: "Category name is required" });

  try {
    const sql = 'INSERT INTO categories (name) VALUES (?)';
    await db.execute(sql, [name]);
    res.status(201).json({ message: 'Category Successfully Added' });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// UPDATE CATEGORY
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const sql = 'UPDATE categories SET name = ? WHERE id = ?';
    const [result] = await db.execute(sql, [name, id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category Successfully Updated' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE CATEGORY
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Ambil semua product_id dari kategori ini
    const [products] = await db.execute('SELECT id FROM products WHERE category_id = ?', [id]);
    const productIds = products.map(p => p.id);

    if (productIds.length > 0) {
      const idList = productIds.join(',');

      // 2. Hapus semua relasi transaksi yang menggunakan produk
      await db.execute(`DELETE FROM inventory_transactions WHERE product_id IN (${idList})`);
      await db.execute(`DELETE FROM purchase_items WHERE product_id IN (${idList})`);
      await db.execute(`DELETE FROM sale_items WHERE product_id IN (${idList})`);

      // 3. Hapus produknya
      await db.execute(`DELETE FROM products WHERE id IN (${idList})`);
    }

    // 4. Hapus kategori-nya
    const [result] = await db.execute('DELETE FROM categories WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }

    res.json({ message: 'Kategori dan data terkait berhasil dihapus.' });
  } catch (error) {
    console.error('❌ Gagal hapus kategori:', error);
    res.status(500).json({ message: 'Server Error saat menghapus kategori.' });
  }
});



module.exports = router;
