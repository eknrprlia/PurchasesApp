import React, { useState, useEffect } from "react";

export default function AddRoleModal({ onClose, onSave, initialData }) {
  const [role, setRole] = useState({
    name: ""
  });

  useEffect(() => {
    if (initialData) {
      setRole(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setRole({ ...role, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(role);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{initialData ? "Edit Role" : "Add Role"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              name="name"
              placeholder="Role Name"
              value={role.name}
              onChange={handleChange}
              className="form-control mb-2"
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
