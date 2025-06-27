const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require('./db');

const app = express();

// Tes koneksi MySQL
db.query('SELECT 1')
  .then(() => console.log('Koneksi ke MySQL berhasil'))
  .catch((err) => console.error('Koneksi ke MySQL gagal:', err));

// Import routers
const authRoutes = require('./routers/authRoute');
const produkRoutes = require('./routers/produk');
const transaksiRoutes = require('./routers/transaksi');
const summaryRoutes = require('./routers/summary');
const chartDataRoutes = require('./routers/chartData');
const purchaseRoutes = require('./routers/purchases');
const categoriesRoute = require('./routers/categoriesRoute');
const suppliersRoute = require('./routers/suppliersRoute');
const customersRoute = require('./routers/customersRoute');
const rolesRoute = require('./routers/rolesRoute');
const salesRoute = require('./routers/salesRoute');
const usersRoute = require('./routers/usersRoute');
const transactionRoute = require('./routers/transactionsRoute');

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/produk', produkRoutes); 
app.use('/api/transaksi', transaksiRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/chart-data', chartDataRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/categories', categoriesRoute); 
app.use('/api/suppliers', suppliersRoute);
app.use('/api/customers', customersRoute);
app.use('/api/roles', rolesRoute);
app.use('/api/sales', salesRoute);
app.use('/api/users', usersRoute);
app.use('/api/transactions', transactionRoute);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route tidak ditemukan" });
});

// 500 Handler
app.use((err, req, res, next) => {
  console.error('Terjadi error:', err.stack);
  res.status(500).json({ error: "Terjadi kesalahan server" });
});

// Jalankan server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
