import React, { useState, useEffect } from "react";
import axios from "axios";

// Dummy data
const productsList = [
  { id: 1, name: "Smartphone Android X1", price: 3500000 },
  { id: 2, name: 'Laptop ProBook 14"', price: 7500000 },
  { id: 3, name: "Kaos Polos Lengan Pendek", price: 50000 },
  { id: 4, name: "Celana Jeans Slim Fit", price: 150000 },
  { id: 5, name: "Keripik Singkong Pedas", price: 10000 },
  { id: 6, name: "Air Mineral 600ml", price: 4000 },
  { id: 7, name: "Blender 3in1", price: 450000 },
  { id: 8, name: "Kompor Gas 2 Tungku", price: 650000 },
  { id: 9, name: "Pulpen Gel Hitam", price: 5000 },
  { id: 10, name: "Buku Tulis 40 Lembar", price: 4000 },
];

const suppliers = [
  { id: 1, name: "PT Sumber Elektronik" },
  { id: 2, name: "Toko Pakaian Makmur" },
  { id: 3, name: "CV Makanan Sehat" },
  { id: 4, name: "UD Alat Rumah Tangga" },
  { id: 5, name: "ATK Stationery Center" },
];

const users = [
  { id: 1, username: "admin_user" },
  { id: 2, username: "sales_john" },
  { id: 3, username: "purch_anna" },
  { id: 4, username: "inv_mike" },
  { id: 5, username: "cashier_sue" },
];

const statuses = ["draft", "received", "cancelled"];

const formatRupiah = (number) => {
  const safeNumber = Number(number);
  return isNaN(safeNumber)
    ? "Rp0"
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(safeNumber);
};

export default function PurchaseForm({ onPurchaseSaved, editData }) {
  const [supplierId, setSupplierId] = useState("");
  const [status, setStatus] = useState("received");
  const [createdBy, setCreatedBy] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: 1, unitPrice: 0 }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (editData) {
    setSupplierId(editData.supplier_id?.toString() || "");
    setStatus(editData.status || "received");
    setCreatedBy(editData.created_by?.toString() || "");

    if (Array.isArray(editData.items)) {
      setItems(
        editData.items.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
          unitPrice: item.unit_price,
        }))
      );
    } else {
      setItems([{ productId: "", quantity: 1, unitPrice: 0 }]);
    }
  } else {
    // Reset form jika bukan edit mode
    setSupplierId("");
    setStatus("received");
    setCreatedBy("");
    setItems([{ productId: "", quantity: 1, unitPrice: 0 }]);
  }
}, [editData]);


  const calculateItemTotal = (item) => (item.quantity ?? 0) * (item.unitPrice ?? 0);
  const totalAmount = items.reduce((acc, item) => acc + calculateItemTotal(item), 0);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    if (field === "productId") {
      const product = productsList.find((p) => p.id === Number(value));
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

    if (!supplierId) return alert("Pilih supplier!");
    if (!createdBy) return alert("Pilih user pembuat!");
    if (items.some((item) => !item.productId)) return alert("Semua produk harus dipilih!");

    const payload = {
      supplier_id: Number(supplierId),
      status,
      created_by: Number(createdBy),
      items: items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      })),
    };

    try {
      setLoading(true);
      if (editData) {
        await axios.put(`http://localhost:4000/api/purchases/${editData.id}`, payload);
        alert("Data pembelian berhasil diperbarui!");
      } else {
        await axios.post("http://localhost:4000/api/purchases", payload);
        alert("Data pembelian berhasil disimpan!");
      }

      if (onPurchaseSaved) onPurchaseSaved();
    } catch (error) {
      console.error("Gagal menyimpan pembelian:", error);
      const msg = error.response?.data?.error || "Terjadi kesalahan.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card p-4 shadow-sm rounded-4">
        <h3 className="mb-4 text-primary">
          <i className="bi bi-cart4 me-2"></i>{editData ? "Edit Pembelian" : "Form Pembelian"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label">Supplier</label>
              <select className="form-select" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required>
                <option value="">Pilih Supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
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
                      <select className="form-select" value={item.productId ?? ""} onChange={(e) => handleItemChange(idx, "productId", e.target.value)} required>
                        <option value="">Pilih Produk</option>
                        {productsList.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input type="number" className="form-control" min={1} value={item.quantity ?? 1} onChange={(e) => handleItemChange(idx, "quantity", e.target.value)} required />
                    </td>
                    <td><input type="number" className="form-control" value={item.unitPrice ?? 0} readOnly /></td>
                    <td><input type="text" className="form-control" value={formatRupiah((item.quantity ?? 0) * (item.unitPrice ?? 0))} readOnly /></td>
                    <td className="text-center">
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(idx)}><i className="bi bi-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="3" className="text-end">Total Pembelian:</th>
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
            {loading ? "Menyimpan..." : (<><i className="bi bi-save me-2"></i>{editData ? "Update Pembelian" : "Simpan Pembelian"}</>)}
          </button>
        </form>
      </div>
    </div>
  );
}
