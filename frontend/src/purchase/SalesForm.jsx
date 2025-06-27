import React, { useState, useEffect } from "react";
import axios from "axios";

const statuses = ["draft", "received", "cancelled"];

const formatRupiah = (number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

export default function SalesForm({ onSaleSaved, saleToEdit }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [status, setStatus] = useState("received");
  const [createdBy, setCreatedBy] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: 1, unitPrice: 0 }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [custRes, prodRes, userRes] = await Promise.all([
          axios.get("http://localhost:4000/api/customers"),
          axios.get("http://localhost:4000/api/produk"),
          axios.get("http://localhost:4000/api/users"),
        ]);
        setCustomers(custRes.data);
        setProducts(prodRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error("Gagal memuat data:", err);
        alert("Gagal memuat data pilihan, pastikan server backend aktif.");
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (saleToEdit) {
      setCustomerId(saleToEdit.customer_id || "");
      setStatus(saleToEdit.status || "received");
      setCreatedBy(saleToEdit.created_by || "");
      if (saleToEdit.items) {
        setItems(
          saleToEdit.items.map((item) => ({
            productId: item.product_id,
            quantity: item.quantity,
            unitPrice: item.unit_price,
          }))
        );
      }
    } else {
      setCustomerId("");
      setStatus("received");
      setCreatedBy("");
      setItems([{ productId: "", quantity: 1, unitPrice: 0 }]);
    }
  }, [saleToEdit]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    if (field === "productId") {
      const product = products.find((p) => p.id === Number(value));
      updatedItems[index] = {
        ...updatedItems[index],
        productId: Number(value),
        unitPrice: product ? product.price : 0,
        quantity: updatedItems[index].quantity || 1,
      };
    } else if (field === "quantity") {
      updatedItems[index].quantity = Math.max(1, Number(value));
    }
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems.length ? updatedItems : [{ productId: "", quantity: 1, unitPrice: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId) return alert("Pilih customer!");
    if (!createdBy) return alert("Pilih user pembuat!");
    if (items.some((item) => !item.productId)) return alert("Semua produk harus dipilih!");

    const payload = {
      customer_id: Number(customerId),
      status,
      created_by: Number(createdBy),
      items: items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      })),
    };

    console.log("📤 Payload yang dikirim:", payload); // Tambahan debug

    try {
      setLoading(true);
      if (saleToEdit) {
        await axios.put(`http://localhost:4000/api/sales/${saleToEdit.id}`, payload);
        alert("Penjualan berhasil diupdate!");
      } else {
        await axios.post("http://localhost:4000/api/sales", payload);
        alert("Penjualan berhasil disimpan!");
      }
      if (onSaleSaved) onSaleSaved();
    } catch (error) {
      console.error("Gagal menyimpan penjualan:", error);
      const errorMsg = error.response?.data?.error || "Terjadi kesalahan saat menyimpan penjualan.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

  return (
    <div className="container py-4">
      <div className="card p-4 shadow-sm rounded-4">
        <h3 className="mb-4 text-primary">
          <i className="bi bi-cart4 me-2"></i>{saleToEdit ? "Edit Penjualan" : "Form Penjualan"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label">Customer</label>
              <select className="form-select" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
                <option value="">Pilih Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)} required>
                {statuses.map((st) => (
                  <option key={st} value={st}>{st.charAt(0).toUpperCase() + st.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Created By</label>
              <select className="form-select" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} required>
                <option value="">Pilih User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-responsive mb-3">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Produk</th>
                  <th>Jumlah</th>
                  <th>Harga Satuan (Rp)</th>
                  <th>Total Harga (Rp)</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <select className="form-select" value={item.productId} onChange={(e) => handleItemChange(idx, "productId", e.target.value)} required>
                        <option value="">Pilih Produk</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input type="number" className="form-control" min={1} value={item.quantity} onChange={(e) => handleItemChange(idx, "quantity", e.target.value)} required />
                    </td>
                    <td><input type="number" className="form-control" value={item.unitPrice} readOnly /></td>
                    <td><input type="text" className="form-control" value={formatRupiah(item.unitPrice * item.quantity)} readOnly /></td>
                    <td className="text-center">
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(idx)}><i className="bi bi-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="3" className="text-end">Total Penjualan:</th>
                  <th><input type="text" className="form-control fw-bold text-danger" value={formatRupiah(totalAmount)} readOnly /></th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mb-4">
            <button type="button" className="btn btn-success" onClick={addItem}><i className="bi bi-plus-lg me-2"></i>Tambah Item</button>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Menyimpan..." : (<><i className="bi bi-save me-2"></i>Simpan Penjualan</>)}
          </button>
        </form>
      </div>
    </div>
  );
}
