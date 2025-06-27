import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";

export default function AddUserModal({ show, onClose, onSave, initialData, processing }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role_id, setRoleId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setUsername(initialData.username || "");
      setRoleId(initialData.role_id || "");
    } else {
      setUsername("");
      setPassword("");
      setRoleId("");
    }
    setError("");
  }, [initialData, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError("Username harus diisi");
      return;
    }

    if (!initialData && !password.trim()) {
      setError("Password harus diisi");
      return;
    }

    const roleId = parseInt(role_id);
    if (isNaN(roleId)) {  // <-- PERBAIKAN DI SINI (tambahkan tanda kurung penutup)
      setError("Role ID harus berupa angka");
      return;
    }

    onSave({
      id: initialData?.id,
      username: username.trim(),
      password: password.trim(),
      role_id: roleId,
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Edit User" : "Tambah User Baru"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder={initialData ? "Kosongkan jika tidak diubah" : "Masukkan password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role ID</Form.Label>
            <Form.Control
              type="number"
              placeholder="Masukkan Role ID"
              value={role_id}
              onChange={(e) => setRoleId(e.target.value)}
              min="1"
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onClose} disabled={processing}>
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={processing}>
              {processing ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}