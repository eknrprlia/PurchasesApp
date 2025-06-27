import React from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/Navbar";

export default function Layout({ children }) {
  return (
    <>
      <TopNavbar />
      <div
        className="layout-wrapper"
        style={{
          display: "flex",
          minHeight: "100vh",
          overflow: "hidden",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
  className="sidebar-container"
  style={{
    width: "340px",
    minWidth: "340px",
    backgroundColor: "#f8f9fa",
    borderRight: "1px solid #dee2e6",
  }}
>
  <Sidebar />
        </div>

        <main
          className="main-content"
          style={{
            flexGrow: 1,
            padding: "2rem",
            backgroundColor: "#ffffff",
            overflowX: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
}
