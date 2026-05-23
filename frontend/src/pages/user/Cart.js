import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { cart, updateItem, removeItem, subtotal, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shippingPrice = Number(subtotal) >= 500 ? 0 : 50;
  const taxPrice = Math.round(Number(subtotal) * 0.18 * 100) / 100;
  const total = Number(subtotal) + shippingPrice + taxPrice;

  if (!isAuthenticated && !cart?.items?.length) {
    return (
      <div className="container" style={{ paddingTop: 60, textAlign: 'center' }}>
        <div style={{ fontSize: isMobile ? 48 : 64, marginBottom: 16 }}>🛒</div>
        <h2 style={{ marginBottom: 10, fontSize: isMobile ? 20 : 24 }}>Please login to view your cart</h2>
        <Link to="/login" className="btn btn-primary btn-lg" style={{ marginTop: 16 }}>Login Now</Link>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="container" style={{ paddingTop: 60, textAlign: 'center' }}>
        <div style={{ fontSize: isMobile ? 60 : 80, marginBottom: 20 }}>🛒</div>
        <h2 style={{ marginBottom: 10, fontSize: isMobile ? 20 : 24 }}>Your cart is empty</h2>
        <p style={{ color: 'var(--gray)', marginBottom: 24, fontSize: isMobile ? 14 : 15 }}>Add some products to get started!</p>
        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: isMobile ? 20 : 30, paddingBottom: 60 }}>
      { !isAuthenticated && (
        <div style={{ marginBottom: isMobile ? 16 : 24, padding: '14px 18px', background: '#fff8e1', border: '1px solid #ffe8a1', borderRadius: 12, color: '#856404', fontSize: isMobile ? 13 : 14 }}>
          Your cart is stored locally. Login before checkout to save it to your account.
        </div>
      ) }
      <h1 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 800, marginBottom: isMobile ? 20 : 28 }}>
        Shopping Cart <span style={{ color: 'var(--gray)', fontWeight: 400, fontSize: isMobile ? 14 : 18 }}>({cart.items.length} items)</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: isMobile ? 18 : 28 }}>
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 16 }}>
          {cart.items.map(item => {
            const product = item.product;
            if (!product) return null;
            return (
              <div key={item._id} className="card" style={{ padding: isMobile ? '14px 16px' : '20px 24px', display: 'flex', gap: isMobile ? 14 : 20, alignItems: 'flex-start' }}>
                <Link to={`/products/${product._id}`}>
                  <img src={product.images?.[0]?.url} alt={product.name}
                    style={{ width: isMobile ? 70 : 90, height: isMobile ? 70 : 90, objectFit: 'cover', borderRadius: 10, border: '1px solid #f0f0f0', flexShrink: 0 }} />
                </Link>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: isMobile ? 14 : 15, fontWeight: 600, marginBottom: 4, color: 'var(--dark)', wordBreak: 'break-word' }}>{product.name}</h3>
                  </Link>
                  <div style={{ fontSize: isMobile ? 12 : 13, color: 'var(--gray)', marginBottom: 10 }}>{product.brand}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 20, flexWrap: 'wrap' }}>
                    {/* Qty control */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #e0e0e0', borderRadius: 6, overflow: 'hidden' }}>
                      <button onClick={() => updateItem(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{ width: isMobile ? 30 : 34, height: isMobile ? 30 : 34, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', border: 'none', opacity: item.quantity <= 1 ? 0.6 : 1 }}>
                        <FiMinus size={isMobile ? 12 : 14} />
                      </button>
                      <span style={{ width: isMobile ? 40 : 44, textAlign: 'center', fontWeight: 700, fontSize: isMobile ? 13 : 15 }}>{item.quantity}</span>
                      <button onClick={() => updateItem(item._id, item.quantity + 1)}
                        disabled={item.quantity >= product.stock}
                        style={{ width: isMobile ? 30 : 34, height: isMobile ? 30 : 34, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}>
                        <FiPlus size={isMobile ? 12 : 14} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(product._id)}
                      style={{ color: '#dc3545', display: 'flex', alignItems: 'center', gap: 4, fontSize: isMobile ? 12 : 13, fontWeight: 500, background: 'none', cursor: 'pointer', border: 'none' }}>
                      <FiTrash2 size={isMobile ? 13 : 15} /> Remove
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: isMobile ? 15 : 18, fontWeight: 800 }}>Rs.{(item.price * item.quantity).toLocaleString()}</div>
                  <div style={{ fontSize: isMobile ? 12 : 13, color: 'var(--gray)' }}>Rs.{item.price} each</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div>
          <div className="card" style={{ padding: isMobile ? 18 : '24px', position: isMobile ? 'static' : 'sticky', top: 80 }}>
            <h3 style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700, marginBottom: isMobile ? 16 : 20 }}>Order Summary</h3>

            {[
              { label: 'Subtotal', value: `Rs.${subtotal.toLocaleString()}` },
              { label: 'Shipping', value: (subtotal >= 500 ? 0 : 50) === 0 ? 'FREE 🎉' : `Rs.${subtotal >= 500 ? 0 : 50}`, color: (subtotal >= 500 ? 0 : 50) === 0 ? 'var(--success)' : undefined },
              { label: 'Tax (18% GST)', value: `Rs.${Math.round(subtotal * 0.18 * 100) / 100}` },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: isMobile ? 13 : 14 }}>
                <span style={{ color: '#666' }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: row.color }}>{row.value}</span>
              </div>
            ))}

            {subtotal < 500 && (
              <div style={{ background: '#fff8e1', padding: '10px 14px', borderRadius: 8, fontSize: isMobile ? 12 : 13, marginBottom: 14, color: '#856404', border: '1px solid #ffd54f' }}>
                Add Rs.{(500 - subtotal).toFixed(0)} more for free shipping!
              </div>
            )}

            <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: 12, marginBottom: isMobile ? 16 : 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? 16 : 18, fontWeight: 800 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>Rs.{total.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={() => {
                if (!isAuthenticated) {
                  toast.error('Please login to checkout');
                  return navigate('/login');
                }
                navigate('/checkout');
              }}
              className="btn btn-primary btn-full btn-lg" style={{ borderRadius: 10, justifyContent: 'center', width: '100%' }}>
              Proceed to Checkout <FiArrowRight size={isMobile ? 16 : 18} />
            </button>

            <Link to="/products" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: isMobile ? 10 : 14, fontSize: isMobile ? 13 : 14, color: 'var(--gray)' }}>
              <FiShoppingBag size={isMobile ? 14 : 16} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
