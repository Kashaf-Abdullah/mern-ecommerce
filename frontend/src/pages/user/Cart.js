import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { cart, updateItem, removeItem, subtotal, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const shippingPrice = subtotal >= 500 ? 0 : 50;
  const taxPrice = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shippingPrice + taxPrice;

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ paddingTop: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <h2 style={{ marginBottom: 10 }}>Please login to view your cart</h2>
        <Link to="/login" className="btn btn-primary btn-lg" style={{ marginTop: 16 }}>Login Now</Link>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="container" style={{ paddingTop: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 80, marginBottom: 20 }}>🛒</div>
        <h2 style={{ marginBottom: 10 }}>Your cart is empty</h2>
        <p style={{ color: 'var(--gray)', marginBottom: 24 }}>Add some products to get started!</p>
        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28 }}>
        Shopping Cart <span style={{ color: 'var(--gray)', fontWeight: 400, fontSize: 18 }}>({cart.items.length} items)</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28 }}>
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cart.items.map(item => {
            const product = item.product;
            if (!product) return null;
            return (
              <div key={item._id} className="card" style={{ padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'center' }}>
                <Link to={`/products/${product._id}`}>
                  <img src={product.images?.[0]?.url} alt={product.name}
                    style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10, border: '1px solid #f0f0f0' }} />
                </Link>
                <div style={{ flex: 1 }}>
                  <Link to={`/products/${product._id}`}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: 'var(--dark)' }}>{product.name}</h3>
                  </Link>
                  <div style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 10 }}>{product.brand}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    {/* Qty control */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
                      <button onClick={() => updateItem(item._id, item.quantity - 1)}
                        style={{ width: 34, height: 34, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <FiMinus size={14} />
                      </button>
                      <span style={{ width: 44, textAlign: 'center', fontWeight: 700, fontSize: 15 }}>{item.quantity}</span>
                      <button onClick={() => updateItem(item._id, item.quantity + 1)}
                        disabled={item.quantity >= product.stock}
                        style={{ width: 34, height: 34, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(product._id)}
                      style={{ color: '#dc3545', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, background: 'none', cursor: 'pointer' }}>
                      <FiTrash2 size={15} /> Remove
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray)' }}>₹{item.price} each</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div>
          <div className="card" style={{ padding: '24px', position: 'sticky', top: 80 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>

            {[
              { label: 'Subtotal', value: `₹${subtotal.toLocaleString()}` },
              { label: 'Shipping', value: shippingPrice === 0 ? 'FREE 🎉' : `₹${shippingPrice}`, color: shippingPrice === 0 ? 'var(--success)' : undefined },
              { label: 'Tax (18% GST)', value: `₹${taxPrice.toFixed(2)}` },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                <span style={{ color: '#666' }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: row.color }}>{row.value}</span>
              </div>
            ))}

            {subtotal < 500 && (
              <div style={{ background: '#fff8e1', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, color: '#856404', border: '1px solid #ffd54f' }}>
                Add ₹{(500 - subtotal).toFixed(0)} more for free shipping!
              </div>
            )}

            <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: 14, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-full btn-lg" style={{ borderRadius: 10, justifyContent: 'center' }}>
              Proceed to Checkout <FiArrowRight size={18} />
            </button>

            <Link to="/products" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, fontSize: 14, color: 'var(--gray)' }}>
              <FiShoppingBag size={16} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
