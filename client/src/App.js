import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail'; 
import Header from './components/Header';
import MyProducts from './pages/MyProducts';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductExchange from './pages/ProductExchange';
import Footer from './components/footer';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/exchange" element={<ProductExchange />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
