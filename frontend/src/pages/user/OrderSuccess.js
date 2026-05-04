// ============ This file contains all remaining user pages ============
// Each page is its own default export — copy each section to its own file

// ============ OrderSuccess.js ============
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';
import { orderAPI } from '../../utils/api';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderAPI.getOne(orderId).then(({ data }) => setOrder(data.order)).catch(() => {});
  }, [orderId]);

  return (
    <div className="container" style={{ paddingTop: 60, paddingBottom: 60, maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
      <FiCheckCircle size={64} color="var(--success)" style={{ marginBottom: 16 }} />
      <h1 style={{ fontSize: 30, marginBottom: 10 }}>Order Placed Successfully!</h1>
      <p style={{ color: 'var(--gray)', fontSize: 16, marginBottom: 30 }}>
        Thank you for your purchase! You'll receive an email confirmation shortly.
      </p>

      {order && (
        <div className="card" style={{ padding: 24, textAlign: 'left', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>ORDER ID</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{order.orderId}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>TOTAL</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>₹{order.totalPrice?.toFixed(2)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ background: '#e8f5e9', color: 'var(--success)', padding: '4px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
              {order.orderStatus}
            </span>
            <span style={{ background: '#f5f5f5', color: '#666', padding: '4px 12px', borderRadius: 6, fontSize: 13 }}>
              {order.paymentMethod?.toUpperCase()}
            </span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
        <Link to="/orders" className="btn btn-outline btn-lg" style={{ borderRadius: 10 }}>
          <FiPackage size={18} /> View Orders
        </Link>
        <Link to="/products" className="btn btn-primary btn-lg" style={{ borderRadius: 10 }}>
          Continue Shopping <FiArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
