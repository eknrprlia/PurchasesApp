const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.get('/', async (req, res) => {
  try {
    // Total Purchases
    const [totalPurchaseResult] = await db.query(`
      SELECT IFNULL(SUM(unit_price * quantity), 0) AS totalPurchases FROM purchase_items
    `);

    // Total Sales
    const [totalSalesResult] = await db.query(`
      SELECT IFNULL(SUM(unit_price * quantity), 0) AS totalSales FROM sale_items
    `);

    // Total Transactions = purchases + sales
    const [purchaseCountResult] = await db.query(`
      SELECT COUNT(*) AS purchaseCount FROM purchases
    `);

    const [salesCountResult] = await db.query(`
      SELECT COUNT(*) AS salesCount FROM sales
    `);

    // Total Products
    const [productCountResult] = await db.query(`
      SELECT COUNT(*) AS productCount FROM products
    `);

    res.json({
      totalPurchases: totalPurchaseResult[0].totalPurchases,
      totalSales: totalSalesResult[0].totalSales,
      totalTransactions: purchaseCountResult[0].purchaseCount + salesCountResult[0].salesCount,
      totalProducts: productCountResult[0].productCount
    });

  } catch (error) {
    console.error("Error fetching summary data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
