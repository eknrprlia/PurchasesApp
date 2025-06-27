import { Row, Col } from "react-bootstrap";
import { FaMoneyBillWave, FaBox, FaReceipt } from "react-icons/fa";

export default function SummaryCards({ data }) {
  if (!data) {
    return <p className="text-center text-muted">Loading summary data...</p>;
  }

  const cards = [
    {
      title: "Total Purchases",
      value: `Rp ${Number(data.totalPurchases || 0).toLocaleString("id-ID")}`,
      icon: <FaMoneyBillWave size={28} color="#059669" />, // deep green
      bg: "#d1fae5", // green bg
      border: "1px solid #10b981", // green border
    },
    {
      title: "Total Sales",
      value: `Rp ${Number(data.totalSales || 0).toLocaleString("id-ID")}`,
      icon: <FaMoneyBillWave size={28} color="#2563eb" />, // blue
      bg: "#dbeafe", // blue bg
      border: "1px solid #3b82f6", // blue border
    },
    {
      title: "Total Transactions",
      value: data.totalTransactions ?? 0,
      icon: <FaReceipt size={28} color="#ca8a04" />, // gold
      bg: "#fef9c3", // yellow bg
      border: "1px solid #facc15", // yellow border
    },
    {
      title: "Total Products",
      value: data.totalProducts ?? 0,
      icon: <FaBox size={28} color="#db2777" />, // pink
      bg: "#fce7f3", // pink bg
      border: "1px solid #f472b6", // pink border
    },
  ];

  return (
    <Row className="mb-4">
      {cards.map((card, idx) => (
        <Col xl={3} md={6} key={idx}>
          <div
            style={{
              background: card.bg,
              color: "#1f2937",
              borderRadius: "16px",
              border: card.border,
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              padding: "1.5rem 1.2rem",
              marginBottom: "1rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)";
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                    color: "#6b7280",
                  }}
                >
                  {card.title}
                </p>
                <h4
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: "700",
                    margin: 0,
                  }}
                >
                  {card.value}
                </h4>
              </div>
              <div>{card.icon}</div>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
}
