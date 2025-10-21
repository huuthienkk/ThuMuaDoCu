import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/product/${product._id}`)} // ✅ Khi click vào card sẽ chuyển trang
    >
      <img
        src={`http://localhost:5000/uploads/${product.image}`}
        alt={product.title}
        style={styles.image}
      />
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p><b>Giá:</b> {product.price.toLocaleString()} VNĐ</p>
      <p><b>Danh mục:</b> {product.category}</p>
      <p style={styles.seller}>Người bán: {product.seller?.name || 'Ẩn danh'}</p>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '10px',
    textAlign: 'center',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: '0.3s',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  seller: { fontSize: '0.9em', color: '#555' }
};

export default ProductCard;
