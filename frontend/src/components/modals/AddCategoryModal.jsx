import React, { useState, useEffect } from "react";

export default function AddCategoryModal({ onClose, onSave, editData }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editData) setName(editData.name); 
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Category name cannot be empty!");
      return;
    }
    onSave({ name });
    setName("");
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{editData ? "Edit Category" : "Add New Category"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editData ? "Update" : "Save"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}