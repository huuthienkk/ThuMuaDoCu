import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header style={styles.header}>
      <h2 style={styles.logo}>🛒 Trao Đổi Đồ Cũ</h2>
      <nav>
        <Link to="/" style={styles.link}>Trang chủ</Link>
        {user ? (
          <>
            <Link to="/add" style={styles.link}>Đăng sản phẩm</Link>
            <Link to="/my-products" style={styles.link}>Sản phẩm của tôi</Link>

            <span style={{ marginLeft: '20px' }}>👋 {user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Đăng nhập</Link>
            <Link to="/register" style={styles.link}>Đăng ký</Link>
          </>
        )}
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#1e88e5',
    color: '#fff'
  },
  logo: { margin: 0 },
  link: { color: '#fff', marginLeft: '20px', textDecoration: 'none' },
  logoutBtn: {
    marginLeft: '20px',
    background: 'transparent',
    border: '1px solid white',
    color: 'white',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer'
  }
};

export default Header;
