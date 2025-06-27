import { useState } from "react";
import { Button, ButtonGroup, Container } from "react-bootstrap";
import PurchaseForm from "../purchase/PurchaseForm";
import PurchaseList from "../purchase/PurchaseList";

export default function Purchases() {
  const [activeTab, setActiveTab] = useState("form");
  const [editData, setEditData] = useState(null); // untuk data yg mau di-edit

  const handleEdit = (purchase) => {
    setEditData(purchase); // isi state editData
    setActiveTab("form"); // pindah ke form
  };

  return (
    <Container style={{ padding: "2rem" }}>
      <h3>Menu Pembelian</h3>
      <ButtonGroup className="mb-3">
        <Button
          variant={activeTab === "form" ? "primary" : "outline-primary"}
          onClick={() => {
            setEditData(null); 
            setActiveTab("form");
          }}
        >
          Form Pembelian
        </Button>
        <Button
          variant={activeTab === "list" ? "primary" : "outline-primary"}
          onClick={() => setActiveTab("list")}
        >
          Laporan Pembelian
        </Button>
      </ButtonGroup>

      {activeTab === "form" && <PurchaseForm editData={editData} />}
      {activeTab === "list" && <PurchaseList onEdit={handleEdit} />}
    </Container>
  );
}
