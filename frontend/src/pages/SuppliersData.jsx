import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AddSupplierModal from "../components/modals/AddSupplierModal";
import {
  getSuppliers,
  saveSupplier,
  updateSupplier,
  deleteSupplier,
} from "../services/supplierService";
import { Table, Button, Container } from "react-bootstrap";

export default function SuppliersData() {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const { data } = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      Swal.fire("Gagal!", "Gagal memuat data supplier.", "error");
    }
  };

  const handleSave = async (supplier) => {
    try {
      if (supplier.id) {
        await updateSupplier(supplier.id, supplier);
        Swal.fire("Berhasil!", "Supplier berhasil diupdate.", "success");
      } else {
        await saveSupplier(supplier);
        Swal.fire("Berhasil!", "Supplier berhasil ditambahkan.", "success");
      }
      setShowModal(false);
      setEditData(null);
      loadSuppliers();
    } catch (error) {
      console.error("Error saving supplier:", error);
      Swal.fire("Gagal!", "Gagal menyimpan data supplier.", "error");
    }
  };

  const handleEdit = (supplier) => {
    setEditData(supplier);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus supplier?",
      text: "Data supplier akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!"
    });

    if (confirm.isConfirmed) {
      try {
        await deleteSupplier(id);
        Swal.fire("Berhasil!", "Supplier berhasil dihapus.", "success");
        loadSuppliers();
      } catch (error) {
        console.error("Error deleting supplier:", error);
        Swal.fire("Gagal!", "Gagal menghapus supplier.", "error");
      }
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">📇 Daftar Supplier</h3>
        <Button
          variant="primary"
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
        >
          + Tambah Supplier
        </Button>
      </div>

      <div className="table-responsive">
        <Table bordered hover className="align-middle text-center">
          <thead style={{ backgroundColor: "#007bff", color: "#fff" }}>
            <tr>
              <th>ID</th>
              <th>Nama Supplier</th>
              <th>Kontak</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((sup) => (
                <tr key={sup.id}>
                  <td>{sup.id}</td>
                  <td>{sup.name}</td>
                  <td>{sup.contact}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(sup)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(sup.id)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-muted text-center">
                  Tidak ada data supplier.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {showModal && (
        <AddSupplierModal
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
