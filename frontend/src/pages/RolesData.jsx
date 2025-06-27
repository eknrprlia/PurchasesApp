import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AddRoleModal from "../components/modals/AddRoleModal";
import {
  getRoles,
  saveRole,
  updateRole,
  deleteRole,
} from "../services/rolesService";
import { Table, Button, Container } from "react-bootstrap";

export default function RolesData() {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response.data);
    } catch (error) {
      console.error("Gagal mengambil data role:", error);
      Swal.fire("Gagal!", "Gagal memuat data role.", "error");
    }
  };

  const handleSave = async (role) => {
    try {
      if (role.id) {
        await updateRole(role.id, role);
        Swal.fire("Berhasil!", "Role berhasil diperbarui.", "success");
      } else {
        await saveRole(role);
        Swal.fire("Berhasil!", "Role berhasil ditambahkan.", "success");
      }
      setShowModal(false);
      setEditData(null);
      loadRoles();
    } catch (error) {
      console.error("Gagal menyimpan role:", error);
      Swal.fire("Gagal!", "Gagal menyimpan role.", "error");
    }
  };

  const handleEdit = (role) => {
    setEditData(role);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus role?",
      text: "Data role akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteRole(id);
        Swal.fire("Berhasil!", "Role berhasil dihapus.", "success");
        loadRoles();
      } catch (error) {
        console.error("Gagal menghapus role:", error);
        Swal.fire("Gagal!", "Gagal menghapus role.", "error");
      }
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">🧑‍💼 Daftar Role</h3>
        <Button
          variant="primary"
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
        >
          + Tambah Role
        </Button>
      </div>

      <div className="table-responsive">
        <Table bordered hover className="align-middle text-center">
          <thead style={{ backgroundColor: "#007bff", color: "#fff" }}>
            <tr>
              <th>ID</th>
              <th>Nama Role</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td>{role.name}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(role)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(role.id)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-muted text-center">
                  Tidak ada data role.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {showModal && (
        <AddRoleModal
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
