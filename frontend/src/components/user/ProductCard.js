import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/CartContext';

const StarRating = ({ rating, size = 14 }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} style={{ color: s <= Math.round(rating) ? '#ffc107' : '#ddd', fontSize: size }}>★</span>
    ))}
  </div>
);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wished = isWishlisted(product._id);
  const isMobile = window.innerWidth <= 768;

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const savings = product.discountPrice > 0 ? product.price - product.discountPrice : 0;

  return (
    <div className="card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Badges */}
      <div style={{ position: 'absolute', top: isMobile ? 6 : 10, left: isMobile ? 6 : 10, zIndex: 2, display: 'flex', flexDirection: 'column', gap: isMobile ? 2 : 4 }}>
        {product.discountPercent > 0 && (
          <span style={{ background: 'var(--primary)', color: '#fff', padding: isMobile ? '2px 6px' : '3px 8px', borderRadius: 4, fontSize: isMobile ? 10 : 11, fontWeight: 700 }}>
            -{product.discountPercent}%
          </span>
        )}
        {product.trending && (
          <span style={{ background: 'var(--secondary)', color: '#fff', padding: isMobile ? '2px 6px' : '3px 8px', borderRadius: 4, fontSize: isMobile ? 10 : 11, fontWeight: 700 }}>
            🔥 Trending
          </span>
        )}
        {product.stock === 0 && (
          <span style={{ background: '#888', color: '#fff', padding: isMobile ? '2px 6px' : '3px 8px', borderRadius: 4, fontSize: isMobile ? 10 : 11, fontWeight: 700 }}>
            Out of Stock
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product._id)}
        style={{
          position: 'absolute', top: isMobile ? 6 : 10, right: isMobile ? 6 : 10, zIndex: 2,
          width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius: '50%', background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: wished ? 'var(--primary)' : '#888', transition: 'all 0.2s', cursor: 'pointer', border: 'none',
          padding: 0
        }}
      >
        <FiHeart size={isMobile ? 14 : 16} fill={wished ? 'currentColor' : 'none'} />
      </button>

      {/* Image */}
      <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
        <div style={{ overflow: 'hidden', aspectRatio: '1', background: '#f8f8f8', position: 'relative' }}>
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/400?text=No+Image'}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: isMobile ? '10px 12px 12px' : '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: isMobile ? 4 : 6 }}>
        <div style={{ fontSize: isMobile ? 10 : 11, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
          {product.brand}
        </div>

        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontSize: isMobile ? 13 : 14, fontWeight: 600, lineHeight: 1.3, color: 'var(--dark)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 4 : 6, flexWrap: 'wrap' }}>
          <StarRating rating={product.ratings} size={isMobile ? 12 : 14} />
          <span style={{ fontSize: isMobile ? 11 : 12, color: 'var(--gray)' }}>({product.numReviews})</span>
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? 6 : 8, marginTop: 2, flexWrap: 'wrap' }}>
          <span style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: 'var(--dark)' }}>Rs.{effectivePrice.toLocaleString()}</span>
          {savings > 0 && (
            <>
              <span style={{ fontSize: isMobile ? 11 : 13, color: 'var(--gray)', textDecoration: 'line-through' }}>Rs.{product.price.toLocaleString()}</span>
              <span style={{ fontSize: isMobile ? 11 : 12, color: 'var(--success)', fontWeight: 600 }}>Save Rs.{savings}</span>
            </>
          )}
        </div>

        {/* Stock Status */}
        {product.stock > 0 && product.stock <= 5 && (
          <div style={{ fontSize: isMobile ? 11 : 12, color: '#ff6b35', fontWeight: 600 }}>
            Only {product.stock} left in stock!
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: isMobile ? 6 : 8, marginTop: 'auto', paddingTop: isMobile ? 8 : 10 }}>
          <button
            onClick={() => addToCart(product._id)}
            disabled={product.stock === 0}
            style={{
              flex: 1, padding: isMobile ? '8px 0' : '9px 0', borderRadius: 'var(--radius-sm)', fontSize: isMobile ? 12 : 13, fontWeight: 600,
              background: product.stock === 0 ? '#e0e0e0' : 'var(--dark)',
              color: product.stock === 0 ? '#999' : '#fff',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              transition: 'all 0.2s',
              border: 'none',
              minHeight: isMobile ? '36px' : '40px'
            }}
          >
            <FiShoppingCart size={isMobile ? 12 : 14} />
            {product.stock === 0 ? 'Out of Stock' : 'Add Cart'}
          </button>
          <Link to={`/products/${product._id}`}
            style={{
              width: isMobile ? 36 : 38, height: isMobile ? 36 : 38, borderRadius: 'var(--radius-sm)', border: '2px solid #e0e0e0',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666',
              transition: 'all 0.2s', minHeight: isMobile ? '36px' : '40px', flexShrink: 0
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = '#666'; }}
          >
            <FiEye size={isMobile ? 14 : 15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
