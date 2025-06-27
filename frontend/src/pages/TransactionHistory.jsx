import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/transactionService';
import Table from '../components/Table';
import { FaHistory, FaBoxes, FaCalendarAlt } from 'react-icons/fa';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat riwayat transaksi:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const renderColumnsWithPage = (currentPage, perPage) => [
    {
      name: "#",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "60px",
      cell: (row, index) => (
        <div 
          className="d-flex align-items-center justify-content-center"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '12px'
          }}
        >
          {(currentPage - 1) * perPage + index + 1}
        </div>
      )
    },
    {
      name: "Produk",
      selector: (row) => row.product_name,
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <div 
            className="d-flex align-items-center justify-content-center"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef'
            }}
          >
            <FaBoxes size={12} color="#6c757d" />
          </div>
          <span style={{ fontWeight: '500', color: '#2c3e50' }}>
            {row.product_name}
          </span>
        </div>
      )
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      sortable: true,
      cell: (row) => (
        <span 
          className="px-2 py-1"
          style={{
            backgroundColor: row.quantity > 0 ? '#d4edda' : '#f8d7da',
            color: row.quantity > 0 ? '#155724' : '#721c24',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600'
          }}
        >
          {row.quantity > 0 ? '+' : ''}{row.quantity}
        </span>
      )
    },
    {
      name: "Tipe",
      selector: (row) => row.type,
      sortable: true,
      cell: (row) => {
        const getTypeStyle = (type) => {
          switch(type?.toLowerCase()) {
            case 'in':
            case 'masuk':
              return { bg: '#e3f2fd', color: '#1976d2', icon: '' };
            case 'out':
            case 'keluar':
              return { bg: '#fce4ec', color: '#c2185b', icon: '' };
            default:
              return { bg: '#f5f5f5', color: '#666', icon: '' };
          }
        };
        const style = getTypeStyle(row.type);
        return (
          <span 
            className="px-3 py-1 d-flex align-items-center gap-1"
            style={{
              backgroundColor: style.bg,
              color: style.color,
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'capitalize'
            }}
          >
            {style.icon}
            {row.type}
          </span>
        );
      }
    },
    {
      name: "Tanggal",
      selector: (row) => new Date(row.created_at).toLocaleString(),
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <FaCalendarAlt size={12} color="#6c757d" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#2c3e50' }}>
              {new Date(row.created_at).toLocaleDateString('id-ID')}
            </div>
            <div style={{ fontSize: '11px', color: '#6c757d' }}>
              {new Date(row.created_at).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      )
    },
  ];

  if (loading) {
    return (
      <div className="container-fluid p-4" style={{ minHeight: '80vh' }}>
        <div 
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ 
            height: '60vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: '20px',
            border: '1px solid #e9ecef'
          }}
        >
          <div 
            className="spinner-border mb-4"
            style={{ 
              width: '3rem', 
              height: '3rem',
              color: '#4facfe',
              borderWidth: '4px'
            }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 style={{ color: '#2c3e50', fontWeight: '600' }}>
            Memuat Riwayat Transaksi...
          </h5>
          <p style={{ color: '#6c757d', fontSize: '14px', marginTop: '8px' }}>
            Harap tunggu sebentar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header Section */}
      <div 
        className="row mb-4 p-4"
        style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          borderRadius: '20px',
          color: 'white',
          marginLeft: '0',
          marginRight: '0'
        }}
      >
        <div className="col-md-8">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div 
              className="d-flex align-items-center justify-content-center"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '15px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <FaHistory size={24} color="white" />
            </div>
            <div>
              <h2 className="mb-1" style={{ fontWeight: '700', fontSize: '28px' }}>
                Riwayat Transaksi
              </h2>
              <p className="mb-0" style={{ opacity: 0.9, fontSize: '16px' }}>
                Monitor semua aktivitas inventory Anda
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div 
        className="card border-0 shadow-sm"
        style={{
          borderRadius: '20px',
          overflow: 'hidden'
        }}
      >
        <div 
          className="card-header border-0 py-4"
          style={{
            background: 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)',
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white'
              }}
            >
              <FaBoxes size={16} />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: '600', color: '#2c3e50' }}>
                Detail Transaksi
              </h5>
              <small style={{ color: '#6c757d' }}>
                Daftar lengkap aktivitas inventory
              </small>
            </div>
          </div>
        </div>
        
        <div className="card-body p-0">
          <Table
            data={transactions}
            renderColumnsWithPage={renderColumnsWithPage}
            showAddButton={false}
          />
        </div>
      </div>

      {/* Empty State */}
      {!loading && transactions.length === 0 && (
        <div 
          className="text-center py-5 mt-4"
          style={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: '20px',
            border: '1px solid #e9ecef'
          }}
        >
          <div 
            className="d-flex align-items-center justify-content-center mb-3"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              margin: '0 auto'
            }}
          >
            <FaHistory size={32} />
          </div>
          <h5 style={{ color: '#2c3e50', fontWeight: '600' }}>
            Belum Ada Transaksi
          </h5>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>
            Transaksi inventory akan muncul di sini setelah ada aktivitas
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
