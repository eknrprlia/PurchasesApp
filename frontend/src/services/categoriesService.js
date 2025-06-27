// categoriesService.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",  
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export const getCategories = () => API.get("/categories");
export const saveCategory = (category) => API.post("/categories", category);
export const updateCategory = (id, category) => API.put(`/categories/${id}`, category); 
export const deleteCategory = (id) => API.delete(`/categories/${id}`);
