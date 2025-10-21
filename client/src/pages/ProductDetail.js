import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error(error);
        alert('Không thể tải sản phẩm!');
        navigate('/');
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (!product) return <p style={{ textAlign: 'center' }}>Đang tải...</p>;

  const imgURL = `http://localhost:5000/uploads/${product.image}`;

  return (
    <div style={styles.container}>
      <div style={styles.imageBox}>
        <img src={imgURL} alt={product.title} style={styles.image} />
      </div>
      <div style={styles.info}>
        <h2>{product.title}</h2>
        <p style={styles.price}>{product.price.toLocaleString()} ₫</p>
        <p style={styles.desc}>{product.description}</p>
        <hr />
        <p><strong>Người bán:</strong> {product.seller?.name}</p>
        <p><strong>Email:</strong> {product.seller?.email}</p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', gap: '30px', padding: '30px', flexWrap: 'wrap' },
  imageBox: { flex: 1, minWidth: '300px' },
  image: { width: '100%', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
  info: { flex: 1, minWidth: '300px' },
  price: { color: '#e53935', fontSize: '24px', fontWeight: 'bold' },
  desc: { marginTop: '15px' }
};

export default ProductDetail;
