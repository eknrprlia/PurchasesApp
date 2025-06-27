import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import Table from "../components/Table";
import Swal from "sweetalert2";

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}

const PurchaseList = forwardRef(({ onEdit }, ref) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  axios.defaults.baseURL = "http://localhost:4000";

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/purchases");
      const data = res.data;
      setPurchases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat data pembelian:", error);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchPurchases,
  }));

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleEdit = (row) => {
    if (onEdit) onEdit(row);
  };

  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: "Yakin ingin hapus pembelian ini?",
      text: `Supplier: ${row.supplier_name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/purchases/${row.id}`);
        Swal.fire("Terhapus!", "Data pembelian berhasil dihapus.", "success");
        fetchPurchases();
      } catch (err) {
        Swal.fire("Gagal!", "Gagal menghapus data pembelian.", "error");
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
      name: "Supplier",
      selector: (row) => row.supplier_name,
      sortable: true,
      width: "200px",
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`badge bg-${
            row.status === "received"
              ? "success"
              : row.status === "draft"
              ? "secondary"
              : "danger"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
      width: "120px",
    },
    {
      name: "Pembuat",
      selector: (row) => row.created_by_username,
      sortable: true,
      width: "150px",
    },
    {
      name: "Tanggal",
      selector: (row) => new Date(row.created_at).toLocaleString(),
      sortable: true,
      width: "200px",
    },
    {
      name: "Total (Rp)",
      selector: (row) => formatRupiah(row.total_amount || 0),
      sortable: true,
      width: "180px",
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="btn btn-sm btn-warning text-white"
            style={{ width: "70px" }}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="btn btn-sm btn-danger"
            style={{ width: "70px" }}
          >
            Hapus
          </button>
        </div>
      ),
      ignoreRowClick: true,
      width: "180px",
    },
  ];

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Memuat data pembelian...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Table
        title="Daftar Pesanan Pembelian"
        data={purchases}
        renderColumnsWithPage={renderColumnsWithPage}
        showAddButton={false}
      />
    </div>
  );
});

export default PurchaseList;
