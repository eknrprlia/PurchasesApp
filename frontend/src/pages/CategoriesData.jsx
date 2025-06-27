import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AddCategoryModal from "../components/modals/AddCategoryModal";
import { getCategories, saveCategory, updateCategory, deleteCategory } from "../services/categoriesService";
import { Table, Button, Container } from "react-bootstrap";

export default function CategoriesData() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Swal.fire("Gagal", "Tidak dapat memuat data kategori", "error");
    }
  };

  const handleSave = async (category) => {
    try {
      if (editCategory) {
        await updateCategory(editCategory.id, category);
        setEditCategory(null);
      } else {
        await saveCategory(category);
      }
      setShowModal(false);
      loadCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      Swal.fire("Gagal", "Kategori gagal disimpan", "error");
    }
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus kategori?",
      text: "Data kategori akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!"
    });

    if (confirm.isConfirmed) {
      try {
        await deleteCategory(id);
        await loadCategories();
        Swal.fire("Berhasil!", "Kategori berhasil dihapus.", "success");
      } catch (error) {
        if (error.response && error.response.status === 400) {
          Swal.fire("Gagal!", error.response.data.message, "error");
        } else {
          console.error("Error deleting category:", error);
          Swal.fire("Error", "Terjadi kesalahan saat menghapus kategori", "error");
        }
      }
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">📂 Daftar Kategori</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Tambah Kategori
        </Button>
      </div>

      <div className="table-responsive">
        <Table bordered hover className="align-middle text-center">
          <thead style={{ backgroundColor: "#007bff", color: "#fff" }}>
            <tr>
              <th>ID</th>
              <th>Nama Kategori</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>{cat.name}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(cat)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(cat.id)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  Tidak ada data kategori.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {showModal && (
        <AddCategoryModal
          onClose={() => {
            setShowModal(false);
            setEditCategory(null);
          }}
          onSave={handleSave}
          editData={editCategory}
        />
      )}
    </Container>
  );
}
