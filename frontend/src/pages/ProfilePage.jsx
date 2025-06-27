import { Card, Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaUserCircle, FaEdit, FaKey, FaShieldAlt } from "react-icons/fa";
import { useState } from "react";

export default function Profile() {
  const username = localStorage.getItem("username") || "Pengguna";
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tambahkan logika ubah password di sini
    console.log('Ubah password dikirim');
  };

  return (
    <Container fluid className="p-4 bg-white" style={{ minHeight: "100vh" }}>
      <Row className="mb-4">
        <Col>
          <h3 className="fw-bold text-primary mb-1">Pengaturan Profil</h3>
          <p className="text-muted mb-0">Kelola informasi akun dan keamanan Anda</p>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Info Profil */}
        <Col lg={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center p-4">
              <div className="mb-3">
                <div className="bg-secondary bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                  <FaUserCircle size={40} className="text-secondary" />
                </div>
              </div>
              <h5 className="fw-bold mb-2">{username}</h5>
              <Button variant="outline-secondary" size="sm" className="rounded-pill mt-2">
                <FaEdit className="me-2" />
                Edit Profil
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Info Akun dan Form Password */}
        <Col lg={8}>
          <Row className="g-3 mb-4">
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="text-center p-4">
                  <div className="text-primary mb-2">
                    <FaShieldAlt size={24} />
                  </div>
                  <small className="text-muted d-block mb-1">Nomor Akun</small>
                  <h6 className="fw-bold mb-0">7460132304</h6>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="text-center p-4">
                  <div className="text-success mb-2">
                    <FaUserCircle size={24} />
                  </div>
                  <small className="text-muted d-block mb-1">Status Akun</small>
                  <h6 className="fw-bold text-success mb-0">Aktif</h6>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <div className="d-flex align-items-center gap-2">
                <FaKey className="text-primary" />
                <h5 className="mb-0 fw-bold">Ubah Password</h5>
              </div>
              <p className="text-muted mb-0 mt-1">Perbarui password secara berkala demi keamanan akun Anda.</p>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Password Saat Ini</Form.Label>
                      <Form.Control 
                        type="password" 
                        name="current"
                        placeholder="Masukkan password lama"
                        value={passwords.current}
                        onChange={handlePasswordChange}
                        className="rounded"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Password Baru</Form.Label>
                      <Form.Control 
                        type="password" 
                        name="new"
                        placeholder="Masukkan password baru"
                        value={passwords.new}
                        onChange={handlePasswordChange}
                        className="rounded"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Konfirmasi Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        name="confirm"
                        placeholder="Ulangi password baru"
                        value={passwords.confirm}
                        onChange={handlePasswordChange}
                        className="rounded"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mt-4 d-flex gap-2">
                  <Button variant="primary" type="submit" className="rounded px-4">
                    <FaKey className="me-2" />
                    Simpan Perubahan
                  </Button>
                  <Button variant="outline-secondary" type="button" className="rounded px-4">
                    Batal
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
