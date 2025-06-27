const express = require("express");
const router = express.Router();
const db = require("../db");

// GET Semua sales
router.get("/", async (req, res) => {
  try {
    const [sales] = await db.query(`
      SELECT 
        s.id, s.customer_id, s.status, s.created_at, s.created_by,
        u.username AS created_by_username
      FROM sales s
      JOIN users u ON s.created_by = u.id
      ORDER BY s.created_at DESC
    `);

    for (const sale of sales) {
      const [items] = await db.query(`
        SELECT si.quantity, si.unit_price, p.name 
        FROM sale_items si
        JOIN products p ON si.product_id = p.id
        WHERE si.sale_id = ?
      `, [sale.id]);

      sale.items = items;
    }

    res.json(sales);
  } catch (error) {
    console.error("❌ Error GET /sales:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST Tambah sales
router.post("/", async (req, res) => {
  let { customer_id, status, created_by, items } = req.body;

  console.log("📥 Data diterima:", req.body);

  if (!customer_id || !status || !created_by || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Data tidak lengkap atau items kosong." });
  }

  // Normalisasi status
  status = status.trim().toLowerCase();

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO sales (customer_id, status, created_by, created_at)
       VALUES (?, ?, ?, NOW())`,
      [customer_id, status, created_by]
    );

    const sale_id = result.insertId;

    for (const [index, item] of items.entries()) {
      console.log(`🧾 Item ke-${index + 1}:`, item);

      if (!item.product_id || !item.quantity || !item.unit_price) {
        await conn.rollback();
        return res.status(400).json({ error: `Item ke-${index + 1} tidak lengkap.` });
      }

      await conn.query(
        `INSERT INTO sale_items (sale_id, product_id, quantity, unit_price)
         VALUES (?, ?, ?, ?)`,
        [sale_id, item.product_id, item.quantity, item.unit_price]
      );
    }

    await conn.commit();
    res.json({ message: "Penjualan berhasil disimpan" });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("❌ Gagal menyimpan penjualan:", err);
    res.status(500).json({ error: "Gagal menyimpan penjualan: " + err.message });
  } finally {
    if (conn) conn.release();
  }
});

// PUT Edit sales
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  let { customer_id, status, created_by, items } = req.body;

  if (!customer_id || !status || !created_by || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Data tidak lengkap atau items kosong." });
  }

  // Normalisasi status
  status = status.trim().toLowerCase();

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    await conn.query(
      `UPDATE sales SET customer_id = ?, status = ?, created_by = ? WHERE id = ?`,
      [customer_id, status, created_by, id]
    );

    await conn.query(`DELETE FROM sale_items WHERE sale_id = ?`, [id]);

    for (const [index, item] of items.entries()) {
      if (!item.product_id || !item.quantity || !item.unit_price) {
        await conn.rollback();
        return res.status(400).json({ error: `Item ke-${index + 1} tidak lengkap.` });
      }

      await conn.query(
        `INSERT INTO sale_items (sale_id, product_id, quantity, unit_price)
         VALUES (?, ?, ?, ?)`,
        [id, item.product_id, item.quantity, item.unit_price]
      );
    }

    await conn.commit();
    res.json({ message: "Penjualan berhasil diupdate" });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("❌ Gagal update penjualan:", err);
    res.status(500).json({ error: "Gagal update penjualan: " + err.message });
  } finally {
    if (conn) conn.release();
  }
});

// DELETE Sales
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  let conn;

  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    await conn.query(`DELETE FROM sale_items WHERE sale_id = ?`, [id]);
    await conn.query(`DELETE FROM sales WHERE id = ?`, [id]);

    await conn.commit();
    res.json({ message: "Penjualan berhasil dihapus" });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("❌ Gagal menghapus penjualan:", err);
    res.status(500).json({ error: "Gagal menghapus penjualan: " + err.message });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
