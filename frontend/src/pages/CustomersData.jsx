import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AddCustomerModal from "../components/modals/AddCustomerModal";
import {
  getCustomers,
  saveCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/customerService";
import { Table, Button, Container } from "react-bootstrap";

export default function CustomersData() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const { data } = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Gagal mengambil data pelanggan:", error);
      Swal.fire("Gagal!", "Gagal memuat data pelanggan.", "error");
    }
  };

  const handleSave = async (customer) => {
    try {
      if (customer.id) {
        await updateCustomer(customer.id, customer);
        Swal.fire("Berhasil!", "Pelanggan berhasil diupdate.", "success");
      } else {
        await saveCustomer(customer);
        Swal.fire("Berhasil!", "Pelanggan berhasil ditambahkan.", "success");
      }
      setShowModal(false);
      setEditData(null);
      loadCustomers();
    } catch (error) {
      console.error("Gagal menyimpan pelanggan:", error);
      Swal.fire("Gagal!", "Gagal menyimpan pelanggan.", "error");
    }
  };

  const handleEdit = (customer) => {
    setEditData(customer);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus pelanggan?",
      text: "Data pelanggan akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteCustomer(id);
        Swal.fire("Berhasil!", "Pelanggan berhasil dihapus.", "success");
        loadCustomers();
      } catch (error) {
        console.error("Gagal menghapus pelanggan:", error);
        Swal.fire("Gagal!", "Gagal menghapus pelanggan.", "error");
      }
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">👤 Daftar Pelanggan</h3>
        <Button
          variant="primary"
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
        >
          + Tambah Pelanggan
        </Button>
      </div>

      <div className="table-responsive">
        <Table bordered hover className="align-middle text-center">
          <thead style={{ backgroundColor: "#007bff", color: "#fff" }}>
            <tr>
              <th>ID</th>
              <th>Nama Pelanggan</th>
              <th>Kontak</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((cust) => (
                <tr key={cust.id}>
                  <td>{cust.id}</td>
                  <td>{cust.name}</td>
                  <td>{cust.contact}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(cust)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(cust.id)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-muted text-center">
                  Tidak ada data pelanggan.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {showModal && (
        <AddCustomerModal
          onClose={() => {
            setShowModal(false);
            setEditData(null);
          }}
          onSave={handleSave}
          initialData={editData}
        />
      )}
    </Container>
  );
}
