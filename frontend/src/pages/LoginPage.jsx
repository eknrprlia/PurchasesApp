import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        username,
        password,
      });

      const data = response.data;

      setMessage('Login berhasil!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login gagal:', error.response?.data || error.message);
      setMessage(error.response?.data?.error || 'Login gagal');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Masuk ke Akun</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <div style={styles.options}>
            <label>
              <input type="checkbox" style={{ marginRight: 6 }} />
              Simpan login
            </label>
            <a href="#" style={styles.link}>Lupa password?</a>
          </div>
          <button type="submit" style={styles.loginBtn}>Masuk</button>
        </form>

        {message && <p style={styles.alert}>{message}</p>}

        <p style={styles.register}>
          Belum punya akun? <a href="#" style={styles.link}>Daftar sekarang</a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Helvetica Neue, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px 32px',
    borderRadius: '20px',
    boxShadow: '0 0 30px rgba(0,0,0,0.06)',
    width: '100%',
    maxWidth: '420px',
    boxSizing: 'border-box',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outlineColor: '#007bff',
  },
  options: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#555',
  },
  loginBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
  },
  alert: {
    marginTop: '16px',
    fontSize: '14px',
    color: '#d93025',
    textAlign: 'center',
  },
  register: {
    marginTop: '20px',
    fontSize: '13px',
    color: '#777',
    textAlign: 'center',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: '500',
  },
};

export default LoginPage;
