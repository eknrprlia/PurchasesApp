import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

export const getRoles = () => API.get("/roles");
export const saveRole = (role) => API.post("/roles", role);
export const updateRole = (id, role) => API.put(`/roles/${id}`, role);
export const deleteRole = (id) => API.delete(`/roles/${id}`);