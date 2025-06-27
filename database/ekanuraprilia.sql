-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 25 Jun 2025 pada 09.46
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ekanuraprilia`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(12, 'Pakaian'),
(13, 'Makanan & Minuman'),
(14, 'Peralatan Rumah'),
(15, 'ATK'),
(16, 'Elektronik');

-- --------------------------------------------------------

--
-- Struktur dari tabel `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `contact` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `customers`
--

INSERT INTO `customers` (`id`, `name`, `contact`) VALUES
(2, 'Customer Testing', ''),
(3, 'Toko Sumber Rezeki', 'Hendra Saputra'),
(4, 'UD Makmur Bersama', 'Sari Dewi');

-- --------------------------------------------------------

--
-- Struktur dari tabel `inventory_transactions`
--

CREATE TABLE `inventory_transactions` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `type` enum('purchase','sale','adjustment') NOT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `reference_table` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `inventory_transactions`
--

INSERT INTO `inventory_transactions` (`id`, `product_id`, `quantity`, `type`, `reference_id`, `reference_table`, `created_at`, `created_by`) VALUES
(20, 3, 1, 'sale', 21, 'sales', '2025-06-25 11:18:54', 2),
(22, 8, 1, 'sale', 23, 'sales', '2025-06-25 11:27:35', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `sku` varchar(50) NOT NULL,
  `category_id` int(11) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `cost_price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `stock` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `products`
--

INSERT INTO `products` (`id`, `name`, `sku`, `category_id`, `unit`, `price`, `cost_price`, `stock`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Smartphone Android X1', '', 16, '', 3500000.00, 0.00, 0, '2025-06-25 08:29:26', '2025-06-25 08:29:26', NULL),
(2, 'Laptop ProBook 14\"', '', 16, '', 7500000.00, 0.00, 1, '2025-06-25 08:29:26', '2025-06-25 08:29:26', NULL),
(3, 'Kaos Polos Lengan Pendek', '', 12, '', 50000.00, 0.00, 0, '2025-06-25 08:29:26', '2025-06-25 08:29:26', NULL),
(4, 'Celana Jeans Slim Fit', '', 12, '', 150000.00, 0.00, 2, '2025-06-25 08:29:26', '2025-06-25 08:29:26', NULL),
(5, 'Keripik Singkong Pedas', '', 13, '', 10000.00, 0.00, 2, '2025-06-25 08:29:26', '2025-06-25 08:29:26', NULL),
(6, 'Air Mineral 600ml', '', 13, '', 4000.00, 0.00, 1, '2025-06-25 08:29:26', '2025-06-25 08:29:26', NULL),
(7, 'Blender 3in1', '', 14, '', 450000.00, 0.00, 1, '2025-06-25 08:29:26', '2025-06-25 08:29:26', NULL),
(8, 'Kompor Gas 2 Tungku', '', 14, '', 650000.00, 0.00, 0, '2025-06-25 08:29:26', '2025-06-25 08:29:26', NULL),
(9, 'Pulpen Gel Hitam', '', 15, '', 5000.00, 0.00, 2, '2025-06-25 08:29:26', '2025-06-25 08:29:26', NULL),
(10, 'Buku Tulis 40 Lembar', '', 15, '', 4000.00, 0.00, 1, '2025-06-25 08:29:26', '2025-06-25 08:29:26', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `purchases`
--

CREATE TABLE `purchases` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `total` decimal(15,2) DEFAULT 0.00,
  `status` enum('draft','received','cancelled') DEFAULT 'draft',
  `created_at` datetime DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `purchases`
--

INSERT INTO `purchases` (`id`, `supplier_id`, `total`, `status`, `created_at`, `created_by`) VALUES
(3, 1, 650000.00, 'received', '2025-06-22 14:55:06', 1),
(4, 2, 150000.00, 'draft', '2025-06-22 15:31:45', 2),
(5, 3, 4000.00, 'received', '2025-06-24 18:07:56', 1),
(6, 2, 50000.00, 'received', '2025-06-24 18:08:15', 4),
(7, 1, 650000.00, 'received', '2025-06-24 19:19:34', 3),
(18, 2, 0.00, 'cancelled', '2025-06-25 08:49:13', 2),
(19, 2, 0.00, 'received', '2025-06-25 09:11:23', 2);

-- --------------------------------------------------------

--
-- Struktur dari tabel `purchase_items`
--

CREATE TABLE `purchase_items` (
  `id` int(11) NOT NULL,
  `purchase_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `purchase_items`
--

INSERT INTO `purchase_items` (`id`, `purchase_id`, `product_id`, `quantity`, `unit_price`) VALUES
(15, 18, 9, 1, 5000.00),
(16, 19, 3, 1, 50000.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'Sales'),
(3, 'Purchasing'),
(4, 'Inventory'),
(5, 'Cashier');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `total` decimal(15,2) DEFAULT 0.00,
  `status` enum('draft','received','cancelled') NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `sales`
--

INSERT INTO `sales` (`id`, `customer_id`, `total`, `status`, `created_at`, `deleted_at`, `created_by`) VALUES
(21, 3, 0.00, 'received', '2025-06-25 11:18:43', NULL, 2),
(23, 4, 0.00, 'received', '2025-06-25 11:27:35', NULL, 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `sale_items`
--

CREATE TABLE `sale_items` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `sale_items`
--

INSERT INTO `sale_items` (`id`, `sale_id`, `product_id`, `quantity`, `unit_price`) VALUES
(31, 21, 3, 1, 50000.00),
(34, 23, 8, 1, 650000.00);

--
-- Trigger `sale_items`
--
DELIMITER $$
CREATE TRIGGER `trg_after_delete_sale_item` AFTER DELETE ON `sale_items` FOR EACH ROW BEGIN
  -- Tambah stok kembali karena penjualan dibatalkan
  UPDATE products
  SET stock = stock + OLD.quantity
  WHERE id = OLD.product_id;

  -- Hapus dari inventory_transactions
  DELETE FROM inventory_transactions
  WHERE product_id = OLD.product_id
    AND reference_id = OLD.sale_id
    AND reference_table = 'sales'
    AND type = 'sale';
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_after_insert_sale_item` AFTER INSERT ON `sale_items` FOR EACH ROW BEGIN
  -- Cek apakah stok cukup (opsional, jika ingin safety)
  IF (SELECT stock FROM products WHERE id = NEW.product_id) >= NEW.quantity THEN

    -- Kurangi stok produk
    UPDATE products
    SET stock = stock - NEW.quantity
    WHERE id = NEW.product_id;

    -- Catat transaksi inventory
    INSERT INTO inventory_transactions (
      product_id, quantity, type, reference_id, reference_table, created_by
    ) VALUES (
      NEW.product_id, NEW.quantity, 'sale', NEW.sale_id, 'sales',
  (SELECT created_by FROM sales WHERE id = NEW.sale_id)
    );

  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_after_update_sale_item` AFTER UPDATE ON `sale_items` FOR EACH ROW BEGIN
  -- Hitung selisih perubahan jumlah
  DECLARE qty_diff INT;
  SET qty_diff = NEW.quantity - OLD.quantity;

  -- Update stok produk
  UPDATE products
  SET stock = stock - qty_diff
  WHERE id = NEW.product_id;

  -- Update inventory_transactions (jika hanya 1 transaksi per item)
  UPDATE inventory_transactions
  SET quantity = quantity + qty_diff
  WHERE product_id = NEW.product_id
    AND reference_id = NEW.sale_id
    AND reference_table = 'sales'
    AND type = 'sale';
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktur dari tabel `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `contact` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `suppliers`
--

INSERT INTO `suppliers` (`id`, `name`, `contact`) VALUES
(1, 'PT Sumber Elektronik', 'sumber.elektronik@email.com'),
(2, 'Toko Pakaian Makmur', '0812-3456-7890'),
(3, 'CV Makanan Sehat', 'makanan.sehat@gmail.com'),
(4, 'UD Alat Rumah Tangga', '0856-9876-5432'),
(5, 'ATK', 'atkcenter@outlook.com');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `role_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'admin_user', '$2b$10$2N3xPc2EyGH869xrceL2guX6Xo3vWpET5g7hfetM1fc4rM5Dt0DJe', NULL, '2025-06-12 00:49:22', '2025-06-12 00:49:22', NULL),
(2, 'sales_john', '$2b$10$2N3xPc2EyGH869xrceL2guX6Xo3vWpET5g7hfetM1fc4rM5Dt0DJe', NULL, '2025-06-12 00:49:22', '2025-06-12 00:49:22', NULL),
(3, 'purch_anna', '$2b$10$2N3xPc2EyGH869xrceL2guX6Xo3vWpET5g7hfetM1fc4rM5Dt0DJe', NULL, '2025-06-12 00:49:22', '2025-06-12 00:49:22', NULL),
(4, 'inv_mike', '$2b$10$2N3xPc2EyGH869xrceL2guX6Xo3vWpET5g7hfetM1fc4rM5Dt0DJe', NULL, '2025-06-12 00:49:22', '2025-06-12 00:49:22', NULL),
(5, 'cashier_sue', '$2b$10$2N3xPc2EyGH869xrceL2guX6Xo3vWpET5g7hfetM1fc4rM5Dt0DJe', NULL, '2025-06-12 00:49:22', '2025-06-12 00:49:22', NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indeks untuk tabel `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indeks untuk tabel `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_id` (`purchase_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indeks untuk tabel `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indeks untuk tabel `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_id` (`sale_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indeks untuk tabel `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT untuk tabel `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT untuk tabel `purchase_items`
--
ALTER TABLE `purchase_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT untuk tabel `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT untuk tabel `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT untuk tabel `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT untuk tabel `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `inventory_transactions`
--
ALTER TABLE `inventory_transactions`
  ADD CONSTRAINT `inventory_transactions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `inventory_transactions_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Ketidakleluasaan untuk tabel `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  ADD CONSTRAINT `purchases_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD CONSTRAINT `purchase_items_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`),
  ADD CONSTRAINT `purchase_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Ketidakleluasaan untuk tabel `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`),
  ADD CONSTRAINT `sale_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Ketidakleluasaan untuk tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_roles_new` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
