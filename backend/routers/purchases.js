const express = require("express");
const router = express.Router();
const db = require("../db");

// POST /api/purchases - Menambahkan pembelian baru
router.post("/", async (req, res) => {
  const { supplier_id, status, created_by, items } = req.body;

  if (!supplier_id || !status || !created_by || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Data pembelian tidak lengkap." });
  }

  if (items.some(item => !item.product_id || !item.quantity || !item.unit_price)) {
    return res.status(400).json({ error: "Data item pembelian tidak lengkap atau salah." });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [purchaseResult] = await conn.query(
      `INSERT INTO purchases (supplier_id, status, created_by, created_at) VALUES (?, ?, ?, NOW())`,
      [supplier_id, status, created_by]
    );

    const purchaseId = purchaseResult.insertId;

    const insertItems = items.map(item => [
      purchaseId,
      item.product_id,
      item.quantity,
      item.unit_price
    ]);

    await conn.query(
      `INSERT INTO purchase_items (purchase_id, product_id, quantity, unit_price) VALUES ?`,
      [insertItems]
    );

    await conn.commit();
    res.status(201).json({
      message: "Pembelian berhasil disimpan.",
      purchase_id: purchaseId
    });
  } catch (error) {
    await conn.rollback();
    console.error("Error saat menyimpan pembelian:", error);
    res.status(500).json({ error: error.message || "Gagal menyimpan pembelian." });
  } finally {
    conn.release();
  }
});


// GET /api/purchases - Mengambil daftar pembelian
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id, 
        s.name AS supplier_name,         
        p.status, 
        u.username AS created_by_username, 
        p.created_at,
        (
          SELECT COALESCE(SUM(pi.quantity * pi.unit_price), 0)
          FROM purchase_items pi
          WHERE pi.purchase_id = p.id
        ) AS total_amount
      FROM purchases p
      JOIN suppliers s ON p.supplier_id = s.id
      JOIN users u ON p.created_by = u.id
      ORDER BY p.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error saat mengambil daftar pembelian:", error);
    res.status(500).json({ error: "Gagal mengambil data pembelian." });
  }
});

// GET /api/purchases/:id - Mengambil detail pembelian termasuk items (UNTUK EDIT)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [[purchase]] = await db.query(
      `SELECT 
        p.id,
        p.supplier_id,
        p.status,
        p.created_by,
        p.created_at
      FROM purchases p
      WHERE p.id = ?`,
      [id]
    );

    if (!purchase) {
      return res.status(404).json({ error: "Purchase tidak ditemukan." });
    }

    const [items] = await db.query(
      `SELECT 
        pi.id,
        pi.product_id,
        pi.quantity,
        pi.unit_price,
        pr.name AS product_name
      FROM purchase_items pi
      JOIN products pr ON pi.product_id = pr.id
      WHERE pi.purchase_id = ?`,
      [id]
    );

    res.json({ ...purchase, items });
  } catch (error) {
    console.error("Gagal mengambil detail purchase:", error);
    res.status(500).json({ error: "Gagal mengambil detail purchase." });
  }
});

// PUT /api/purchases/:id - Mengedit pembelian
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { supplier_id, status, created_by, items } = req.body;

  if (!supplier_id || !status || !created_by || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Data pembelian tidak lengkap." });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE purchases SET supplier_id = ?, status = ?, created_by = ? WHERE id = ?`,
      [supplier_id, status, created_by, id]
    );

    await conn.query(`DELETE FROM purchase_items WHERE purchase_id = ?`, [id]);

    const insertItems = items.map(item => [
  id,
  item.product_id,     // ✅ Cocok dengan payload dari frontend
  item.quantity,
  item.unit_price
]);

    await conn.query(
      `INSERT INTO purchase_items (purchase_id, product_id, quantity, unit_price) VALUES ?`,
      [insertItems]
    );

    await conn.commit();
    res.json({ message: "Pembelian berhasil diupdate." });
  } catch (error) {
    await conn.rollback();
    console.error("Gagal update pembelian:", error);
    res.status(500).json({ error: "Gagal update pembelian." });
  } finally {
    conn.release();
  }
});

// DELETE /api/purchases/:id - Menghapus pembelian
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(`DELETE FROM purchase_items WHERE purchase_id = ?`, [id]);

    const [result] = await conn.query(`DELETE FROM purchases WHERE id = ?`, [id]);

    await conn.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Purchase tidak ditemukan." });
    }

    res.json({ message: "Purchase berhasil dihapus." });
  } catch (error) {
    await conn.rollback();
    console.error("Gagal menghapus purchase:", error);
    res.status(500).json({ error: "Gagal menghapus purchase." });
  } finally {
    conn.release();
  }
});

module.exports = router;
