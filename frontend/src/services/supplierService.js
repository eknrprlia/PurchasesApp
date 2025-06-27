import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

export const getSuppliers = () => API.get("/suppliers");
export const saveSupplier = (supplier) => API.post("/suppliers", supplier);
export const updateSupplier = (id, supplier) => API.put(`/suppliers/${id}`, supplier);
export const deleteSupplier = (id) => API.delete(`/suppliers/${id}`);