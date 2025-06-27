import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import Table from "../components/Table";
import Swal from "sweetalert2";

const SalesList = forwardRef((props, ref) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/sales");
      console.log("📦 Data sales dari backend:", res.data); // Debug: lihat apakah status null
      setSales(res.data);
    } catch (err) {
      console.error("Gagal mengambil data penjualan:", err);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({ fetchSales }));

  useEffect(() => {
    fetchSales();
  }, []);

  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: "Hapus penjualan?",
      text: `Pelanggan ID: ${row.customer_id}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:4000/api/sales/${row.id}`);
        Swal.fire("Berhasil!", "Penjualan berhasil dihapus.", "success");
        fetchSales();
      } catch (err) {
        Swal.fire("Error", "Gagal menghapus penjualan.", "error");
      }
    }
  };

  const renderColumnsWithPage = (currentPage, perPage) => [
    {
      name: "#",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "50px",
    },
    {
      name: "Pelanggan ID",
      selector: (row) => row.customer_id || "-",
      sortable: true,
    },
    {
  name: "Status",
  selector: (row) => {
    const status = (row.status || "").toLowerCase().trim();
    const statusLabel = {
      draft: { label: "Draft", className: "badge bg-secondary" },
      received: { label: "Received", className: "badge bg-success" },
      cancelled: { label: "Cancelled", className: "badge bg-danger" },
    }[status] || { label: "Tidak diketahui", className: "badge bg-dark" };

    return <span className={statusLabel.className}>{statusLabel.label}</span>;
  },
  sortable: true,
},
    {
      name: "Produk",
      selector: (row) =>
        row.items?.map((item) => `${item.name} (${item.quantity})`).join(", ") || "-",
      sortable: false,
    },
    {
      name: "Pembuat",
      selector: (row) => row.created_by_username || "-",
      sortable: true,
    },
    {
      name: "Tanggal",
      selector: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleString() : "-",
      sortable: true,
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="d-flex gap-1">
          <button
            onClick={() => props.onEdit(row)}
            className="btn btn-warning btn-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="btn btn-danger btn-sm"
          >
            Hapus
          </button>
        </div>
      ),
      ignoreRowClick: true,
      width: "160px",
    },
  ];

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Memuat data penjualan...</p>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <Table
        title="Daftar Penjualan"
        data={sales}
        renderColumnsWithPage={renderColumnsWithPage}
        showAddButton={false}
      />
    </div>
  );
});

export default SalesList;
