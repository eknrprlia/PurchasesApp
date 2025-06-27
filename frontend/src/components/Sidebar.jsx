import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaDatabase,
  FaShoppingCart,
  FaSignOutAlt,
  FaAngleDown,
  FaBox,
  FaTags,
  FaTruck,
  FaUsers,
  FaUserShield,
  FaUser,
  FaShoppingBag,
  FaFileInvoice,
  FaHistory,
  FaChartBar,
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();
  const [openMaster, setOpenMaster] = useState(true);
  const [openTransaction, setOpenTransaction] = useState(true);

  const handleSignOut = () => {
    navigate("/login");
  };

  const toggleMasterMenu = () => setOpenMaster(!openMaster);
  const toggleTransactionMenu = () => setOpenTransaction(!openTransaction);

  const linkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center mb-2 px-3 py-2 rounded text-decoration-none ${
      isActive ? "bg-primary text-white fw-bold" : "text-dark"
    }`;

  const submenuLinkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center mb-1 px-3 py-2 rounded text-decoration-none ${
      isActive ? "bg-light text-primary fw-semibold" : "text-muted"
    }`;

  return (
    <aside
      className="bg-white border-end"
      style={{
        width: "280px",
        minWidth: "280px",
        height: "100vh",
        padding: "1.5rem",
        overflowY: "auto",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded">
          <div className="bg-primary text-white rounded d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
            <FaChartBar size={18} />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Inventory</h5>
            <small className="text-muted">Management System</small>
          </div>
        </div>

        <div className="mb-3 px-3 py-2 bg-light rounded">
          <h6 className="text-muted mb-0 small text-uppercase fw-bold">
            Navigation Menu
          </h6>
        </div>

        {/* Dashboard */}
        <NavLink to="/dashboard" className={linkClass}>
          <FaHome className="me-3" size={16} />
          Dashboard
        </NavLink>

        {/* Master Data */}
        <div
          className="nav-link d-flex justify-content-between align-items-center mb-2 px-3 py-3 rounded border"
          style={{ cursor: "pointer" }}
          onClick={toggleMasterMenu}
        >
          <div className="d-flex align-items-center">
            <FaDatabase className="me-3" size={16} />
            Master Data
          </div>
          <FaAngleDown 
            size={12} 
            style={{ 
              transform: openMaster ? "rotate(0deg)" : "rotate(-90deg)",
              transition: "transform 0.2s"
            }} 
          />
        </div>

        {openMaster && (
          <div className="ps-3 mb-2">
            <NavLink to="/produk" className={submenuLinkClass}>
              <FaBox className="me-2" size={14} />
              Products
            </NavLink>
            <NavLink to="/categories" className={submenuLinkClass}>
              <FaTags className="me-2" size={14} />
              Categories
            </NavLink>
            <NavLink to="/suppliers" className={submenuLinkClass}>
              <FaTruck className="me-2" size={14} />
              Suppliers
            </NavLink>
            <NavLink to="/customers" className={submenuLinkClass}>
              <FaUsers className="me-2" size={14} />
              Customers
            </NavLink>
            <NavLink to="/roles" className={submenuLinkClass}>
              <FaUserShield className="me-2" size={14} />
              Roles
            </NavLink>
            <NavLink to="/users" className={submenuLinkClass}>
              <FaUser className="me-2" size={14} />
              Users
            </NavLink>
          </div>
        )}

        {/* Transactions */}
        <div
          className="nav-link d-flex justify-content-between align-items-center mb-2 px-3 py-3 rounded border"
          style={{ cursor: "pointer" }}
          onClick={toggleTransactionMenu}
        >
          <div className="d-flex align-items-center">
            <FaShoppingCart className="me-3" size={16} />
            Transactions
          </div>
          <FaAngleDown 
            size={12} 
            style={{ 
              transform: openTransaction ? "rotate(0deg)" : "rotate(-90deg)",
              transition: "transform 0.2s"
            }} 
          />
        </div>

        {openTransaction && (
          <div className="ps-3 mb-2">
            <NavLink to="/purchases" className={submenuLinkClass}>
              <FaShoppingBag className="me-2" size={14} />
              Purchase Form
            </NavLink>
            <NavLink to="/sales" className={submenuLinkClass}>
              <FaFileInvoice className="me-2" size={14} />
              Sales Form
            </NavLink>
            <NavLink to="/transaction-history" className={submenuLinkClass}>
              <FaHistory className="me-2" size={14} />
              Inventory Transaction
            </NavLink>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <div className="mb-3 p-2 bg-light rounded text-center">
          <small className="text-muted">© 2024 Inventory System</small>
        </div>
        
        <button
          className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={handleSignOut}
        >
          <FaSignOutAlt size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}