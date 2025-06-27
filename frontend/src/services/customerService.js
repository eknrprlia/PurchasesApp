import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

export const getCustomers = () => API.get("/customers");
export const saveCustomer = (customer) => API.post("/customers", customer);
export const updateCustomer = (id, customer) => API.put(`/customers/${id}`, customer);
export const deleteCustomer = (id) => API.delete(`/customers/${id}`);