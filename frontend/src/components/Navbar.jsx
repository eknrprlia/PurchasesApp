import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Dropdown, Form, FormControl, Button, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaMoon, FaSun, FaSearch } from 'react-icons/fa';

export default function TopNavbar() {
  const [unreadNotif, setUnreadNotif] = useState(3);
  const [username, setUsername] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || 'User');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.style.backgroundColor = darkMode ? '#fff' : '#1e1e2f';
    document.body.style.color = darkMode ? '#000' : '#fff';
  };

  return (
    <Navbar expand="lg" className="bg-white shadow-sm border-bottom px-4 py-3">
      <Navbar.Brand className="fw-bold text-primary">
        SalesApp
      </Navbar.Brand>

      <Navbar.Toggle />

      <Navbar.Collapse>
        {/* Search Bar with Icon */}
        <Form className="d-flex ms-auto me-4" style={{ width: '250px' }}>
          <InputGroup size="sm">
            <InputGroup.Text className="bg-light border-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <FormControl
              type="search"
              placeholder="Search..."
              className="border-0 bg-light"
            />
          </InputGroup>
        </Form>

        <Nav className="d-flex align-items-center gap-3">
          {/* Dark Mode Toggle */}
          <Button
            variant="outline-secondary"
            size="sm"
            className="rounded-pill border-0"
            onClick={toggleDarkMode}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </Button>

          {/* Notification Bell */}
          <div className="position-relative" style={{ cursor: 'pointer' }}>
            <FaBell size={18} className="text-muted" />
            {unreadNotif > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                {unreadNotif}
              </span>
            )}
          </div>

          {/* Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              className="d-flex align-items-center gap-2 text-decoration-none border-0 shadow-none"
              style={{ color: '#495057' }}
            >
              <FaUserCircle size={20} />
              <span>{username}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow-sm border-0 mt-2">
              <Dropdown.Item as={Link} to="/profile" className="py-2">
                View Profile
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="py-2">
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
