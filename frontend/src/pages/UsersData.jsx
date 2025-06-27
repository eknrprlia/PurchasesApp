import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AddUserModal from "../components/modals/AddUserModal";
import { getUsers, saveUser, updateUser, deleteUser } from "../services/usersService";
import { Table, Button, Container, Spinner } from "react-bootstrap";

export default function UsersData() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getUsers();
      setUsers(data);
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: error.response?.data?.message || "Gagal memuat data user.",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (user) => {
    setProcessing(true);
    try {
      if (user.id) {
        await updateUser(user.id, user);
        await Swal.fire("Berhasil!", "User berhasil diperbarui.", "success");
      } else {
        await saveUser(user);
        await Swal.fire("Berhasil!", "User berhasil ditambahkan.", "success");
      }
      setShowModal(false);
      setEditData(null);
      await loadUsers();
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: error.response?.data?.message || "Gagal menyimpan user.",
        icon: "error"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleEdit = (user) => {
    if (!user) return;
    setEditData(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus User?",
      text: "User ini akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
    });

    if (confirm.isConfirmed) {
      setProcessing(true);
      try {
        await deleteUser(id);
        await Swal.fire("Berhasil!", "User berhasil dihapus.", "success");
        await loadUsers();
      } catch (error) {
        Swal.fire({
          title: "Gagal!",
          text: error.response?.data?.message || "Gagal menghapus user.",
          icon: "error"
        });
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">👥 Daftar User</h3>
        <Button
          variant="primary"
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
          disabled={processing}
        >
          {processing ? <Spinner size="sm" /> : "+ Tambah User"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p>Memuat data...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <Table bordered hover className="align-middle text-center">
            <thead className="bg-primary text-white">
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Password</th>
                <th>Role</th>
                <th>Dibuat</th>
                <th>Diperbarui</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>********</td>
                    <td>{user.role_id || "-"}</td>
                    <td>{new Date(user.created_at).toLocaleString() || "-"}</td>
                    <td>{user.updated_at ? new Date(user.updated_at).toLocaleString() : "-"}</td>
                    <td>{user.deleted_at ? "Nonaktif" : "Aktif"}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(user)}
                        disabled={processing}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        disabled={processing}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-muted text-center py-4">
                    Tidak ada data user.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      <AddUserModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditData(null);
        }}
        onSave={handleSave}
        initialData={editData}
        processing={processing}
      />
    </Container>
  );
}