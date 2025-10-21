import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail'; // ✅ thêm dòng này
import Header from './components/Header';
import MyProducts from './pages/MyProducts';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} /> {/* ✅ đây dùng được rồi */}
        <Route path="/my-products" element={<MyProducts />} />

      </Routes>
    </Router>
  );
}

export default App;
