import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";

export default function Produk() {
  const [produk, setProduk] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: "",
    name: "",
    sku: "",
    category_id: "",
    unit: "",
    price: "",
    cost_price: "",
    stock: "",
  });

  useEffect(() => {
    fetchProduk();
    fetchCategories();
  }, []);

  const fetchProduk = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/produk");
      setProduk(res.data);
    } catch (err) {
      console.error("Gagal ambil produk:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Gagal ambil kategori:", err);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleAdd = () => {
    setCurrentProduct({
      id: "",
      name: "",
      sku: "",
      category_id: "",
      unit: "",
      price: "",
      cost_price: "",
      stock: "",
    });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = (produk) => {
    setCurrentProduct({
      ...produk,
      category_id: produk.category_id.toString(),
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/produk/${id}`);
      fetchProduk();
      Swal.fire("Deleted!", "Produk berhasil dihapus!", "success");
    } catch (err) {
      console.error("Gagal hapus produk:", err);
      Swal.fire("Error!", "Gagal hapus produk!", "error");
    }
  };

  const handleSave = async () => {
    if (!currentProduct.name || !currentProduct.sku || !currentProduct.category_id) {
      Swal.fire("Error!", "Nama, SKU, dan Kategori wajib diisi!", "error");
      return;
    }

    const productToSave = {
      ...currentProduct,
      category_id: parseInt(currentProduct.category_id),
      price: parseFloat(currentProduct.price) || 0,
      cost_price: parseFloat(currentProduct.cost_price) || 0,
      stock: parseInt(currentProduct.stock) || 0,
    };

    try {
      if (isEdit) {
        await axios.put(`http://localhost:4000/api/produk/${currentProduct.id}`, productToSave);
        Swal.fire("Success!", "Produk berhasil diupdate!", "success");
      } else {
        await axios.post("http://localhost:4000/api/produk", productToSave);
        Swal.fire("Success!", "Produk berhasil ditambahkan!", "success");
      }
      fetchProduk();
      handleCloseModal();
    } catch (err) {
      console.error("Gagal simpan:", err.response?.data || err);
      Swal.fire("Error!", err.response?.data?.error || "Gagal simpan produk!", "error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">📦 Daftar Produk</h3>
        <Button variant="primary" onClick={handleAdd}>
          + Tambah Produk
        </Button>
      </div>

      <div className="table-responsive">
        <Table bordered hover className="align-middle text-center">
          <thead style={{ backgroundColor: "#007bff", color: "#fff" }}>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>SKU</th>
              <th>Kategori</th>
              <th>Unit</th>
              <th>Harga Jual</th>
              <th>Harga Beli</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {produk.sort((a, b) => a.id - b.id).map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.category_id}</td>
                <td>{p.unit}</td>
                <td>Rp {parseFloat(p.price).toLocaleString("id-ID")}</td>
                <td>Rp {parseFloat(p.cost_price).toLocaleString("id-ID")}</td>
                <td>{p.stock}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(p)}>
                    Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(p.id)}>
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal Tambah/Edit Produk */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#007bff", color: "#fff" }}>
          <Modal.Title>{isEdit ? "Edit Produk" : "Tambah Produk"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Label>Nama Produk</Form.Label>
                <Form.Control
                  type="text"
                  value={currentProduct.name}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, name: e.target.value })
                  }
                  placeholder="Masukkan nama produk"
                />
              </Col>
              <Col>
                <Form.Label>SKU</Form.Label>
                <Form.Control
                  type="text"
                  value={currentProduct.sku}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, sku: e.target.value })
                  }
                  placeholder="Masukkan SKU"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Kategori</Form.Label>
                <Form.Select
                  value={currentProduct.category_id}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, category_id: e.target.value })
                  }
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Form.Label>Unit</Form.Label>
                <Form.Control
                  type="text"
                  value={currentProduct.unit}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, unit: e.target.value })
                  }
                  placeholder="cth: pcs, box"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Harga Jual</Form.Label>
                <Form.Control
                  type="number"
                  value={currentProduct.price}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, price: e.target.value })
                  }
                  placeholder="0"
                />
              </Col>
              <Col>
                <Form.Label>Harga Beli</Form.Label>
                <Form.Control
                  type="number"
                  value={currentProduct.cost_price}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, cost_price: e.target.value })
                  }
                  placeholder="0"
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Stok</Form.Label>
              <Form.Control
                type="number"
                value={currentProduct.stock}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, stock: e.target.value })
                }
                placeholder="0"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
