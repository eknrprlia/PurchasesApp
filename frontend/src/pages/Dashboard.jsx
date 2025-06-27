import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import SalesChart from "../chart/SalesChart";
import RevenueChart from "../chart/RevenueChart";
import SummaryCards from "../components/SummaryCards";

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch("http://localhost:4000/api/summary");
        if (!res.ok) throw new Error("Failed to fetch summary data");
        const data = await res.json();
        setSummaryData(data);
      } catch (error) {
        console.error("Error fetching summary data:", error);
      }
    }
    fetchSummary();
  }, []);

  const handleCardHover = (e) => {
    e.currentTarget.style.transform = "translateY(-6px)";
    e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.15)";
  };

  const handleCardLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.08)";
  };

  return (
    <Container
      fluid
      className="py-4"
      style={{
        background: "linear-gradient(to bottom right, #f0f4f8, #ffffff)",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Header Section */}
      <Row className="mb-4">
  <Col>
    <div
      className="text-center p-5 rounded shadow-sm"
      style={{
        backgroundColor: "#ffffff",
        color: "#2d2e32",
        border: "1px solid #e0e0e0",
      }}
    >
      <h1
        className="mb-3"
        style={{ fontWeight: 700, fontSize: "2.2rem" }}
      >
        📊 Dashboard Overview
      </h1>
      <p className="lead mb-0 text-muted">
        Ringkasan aktivitas bulan ini dalam bentuk visual dan data real-time
      </p>
    </div>
  </Col>
</Row>

      {/* Summary Cards */}
      <Row className="mb-5">
        <Col>
          {summaryData ? (
            <SummaryCards data={summaryData} />
          ) : (
            <div className="text-center py-5">
              <div
                className="d-inline-flex align-items-center p-4 rounded shadow-sm"
                style={{ backgroundColor: "#fff" }}
              >
                <Spinner
                  animation="border"
                  variant="primary"
                  className="me-3"
                  style={{ width: "2rem", height: "2rem" }}
                />
                <span className="fs-5 text-muted">Loading summary data...</span>
              </div>
            </div>
          )}
        </Col>
      </Row>

      {/* Chart Section */}
      <Row className="g-4">
        {/* Purchase Chart */}
        <Col lg={6}>
          <div
            className="card h-100 border-0"
            style={{
              transition: "all 0.3s ease",
              cursor: "pointer",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
            }}
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div
              className="card-header border-0 text-white text-center py-3"
              style={{
                background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
            >
              <h4 className="card-title mb-0">
                📥 Purchase Chart
              </h4>
            </div>
            <div className="card-body p-4">
              <RevenueChart />
            </div>
          </div>
        </Col>

        {/* Sales Chart */}
        <Col lg={6}>
          <div
            className="card h-100 border-0"
            style={{
              transition: "all 0.3s ease",
              cursor: "pointer",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
            }}
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div
              className="card-header border-0 text-white text-center py-3"
              style={{
                background: "linear-gradient(135deg, #26de81, #20bf6b)",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
            >
              <h4 className="card-title mb-0">
                📈 Sales Chart
              </h4>
            </div>
            <div className="card-body p-4">
              <SalesChart />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
