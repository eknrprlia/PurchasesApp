const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT it.*, p.name AS product_name
      FROM inventory_transactions it
      JOIN products p ON it.product_id = p.id
      ORDER BY it.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
