import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useWishlist } from '../../context/CartContext';
import { useCart } from '../../context/CartContext';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const products = wishlist?.products?.filter(p => p && p._id) || [];

  if (!products.length) {
    return (
      <div className="container" style={{ paddingTop: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>❤️</div>
        <h2 style={{ marginBottom: 10 }}>Your wishlist is empty</h2>
        <p style={{ color: 'var(--gray)', marginBottom: 24 }}>Save items you love for later</p>
        <Link to="/products" className="btn btn-primary btn-lg">Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28 }}>My Wishlist ({products.length})</h1>
      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to={`/products/${product._id}`}>
              <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#f8f8f8' }}>
                <img src={product.images?.[0]?.url} alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
              </div>
            </Link>
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to={`/products/${product._id}`}>
                <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{product.name}</h3>
              </Link>
              <div style={{ fontSize: 17, fontWeight: 800 }}>
                Rs.{(product.discountPrice > 0 ? product.discountPrice : product.price).toLocaleString()}
                {product.discountPrice > 0 && (
                  <span style={{ fontSize: 13, color: '#aaa', textDecoration: 'line-through', marginLeft: 8 }}>Rs.{product.price}</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                <button onClick={() => addToCart(product._id)}
                  disabled={product.stock === 0}
                  className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  <FiShoppingCart size={14} /> Add to Cart
                </button>
                <button onClick={() => toggleWishlist(product._id)}
                  style={{ width: 34, height: 34, borderRadius: 8, border: '2px solid #ffcdd2', background: '#fff5f5', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
