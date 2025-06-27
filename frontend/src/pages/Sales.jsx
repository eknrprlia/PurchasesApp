import { useState, useRef } from "react";
import { Button, ButtonGroup, Container } from "react-bootstrap";
import SalesForm from "../purchase/SalesForm";
import SalesList from "../purchase/SalesList";

export default function Sales() {
  const [activeTab, setActiveTab] = useState("form");
  const [saleToEdit, setSaleToEdit] = useState(null);
  const listRef = useRef();

  const handleEdit = (sale) => {
    setSaleToEdit(sale);
    setActiveTab("form");
  };

  const handleSaleSaved = () => {
    setSaleToEdit(null);
    setActiveTab("list");
    listRef.current?.fetchSales();
  };

  return (
    <Container style={{ padding: "2rem" }}>
      <h3>Menu Penjualan</h3>
      <ButtonGroup className="mb-3">
        <Button
          variant={activeTab === "form" ? "primary" : "outline-primary"}
          onClick={() => {
            setActiveTab("form");
            setSaleToEdit(null);
          }}
        >
          Form Penjualan
        </Button>
        <Button
          variant={activeTab === "list" ? "primary" : "outline-primary"}
          onClick={() => setActiveTab("list")}
        >
          Laporan Penjualan
        </Button>
      </ButtonGroup>

      {activeTab === "form" && (
        <SalesForm onSaleSaved={handleSaleSaved} saleToEdit={saleToEdit} />
      )}
      {activeTab === "list" && (
        <SalesList ref={listRef} onEdit={handleEdit} />
      )}
    </Container>
  );
}
