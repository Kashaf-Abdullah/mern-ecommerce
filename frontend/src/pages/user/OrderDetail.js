// OrderDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPackage, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { orderAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const statusColors = {
  pending: '#ffc107', confirmed: '#17a2b8', processing: '#007bff',
  shipped: '#6f42c1', delivered: '#28a745', cancelled: '#dc3545',
};

// Hook to detect screen size
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

export const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    orderAPI.getOne(id).then(({ data }) => setOrder(data.order)).catch(() => navigate('/orders')).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const { data } = await orderAPI.cancel(id, 'Cancelled by customer');
      setOrder(data.order);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel this order');
    } finally { setCancelling(false); }
  };

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (!order) return null;

  const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentStep = steps.indexOf(order.orderStatus);

  return (
    <div className="container" style={{ paddingTop: isMobile ? 16 : 30, paddingBottom: isMobile ? 40 : 60 }}>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: isMobile ? 18 : 28, gap: isMobile ? 12 : 0 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800 }}>Order #{order.orderId}</h1>
          <div style={{ color: 'var(--gray)', fontSize: isMobile ? 12 : 14, marginTop: 4 }}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, width: isMobile ? '100%' : 'auto' }}>
          {['pending', 'confirmed'].includes(order.orderStatus) && (
            <button onClick={handleCancel} disabled={cancelling}
              className="btn" style={{ background: '#fff5f5', color: 'var(--danger)', border: '2px solid #ffcdd2', width: isMobile ? '100%' : 'auto', padding: isMobile ? '10px 14px' : '10px 20px', fontSize: isMobile ? 13 : 14 }}>
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      {/* Status Tracker */}
      {!['cancelled', 'refunded'].includes(order.orderStatus) && (
        <div className="card" style={{ padding: isMobile ? 18 : 28, marginBottom: 24, overflowX: 'auto' }}>
          <h3 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, marginBottom: 24 }}>Order Status</h3>
          <div style={{ display: 'flex', alignItems: 'center', minWidth: isMobile ? 'max-content' : 'auto' }}>
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: isMobile ? 60 : 'auto' }}>
                  <div style={{
                    width: isMobile ? 30 : 36, height: isMobile ? 30 : 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i <= currentStep ? statusColors[s] : '#e0e0e0',
                    color: '#fff', fontWeight: 700, fontSize: isMobile ? 11 : 13
                  }}>
                    {i <= currentStep ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: isMobile ? 10 : 12, fontWeight: i === currentStep ? 700 : 400, color: i <= currentStep ? '#333' : '#aaa', textTransform: 'capitalize' }}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: 3, minWidth: isMobile ? 30 : 40, background: i < currentStep ? statusColors[steps[i + 1]] : '#e0e0e0', margin: isMobile ? '0 2px' : '0 4px', marginBottom: 22, borderRadius: 2 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: isMobile ? 16 : 24 }}>
        <div>
          {/* Items */}
          <div className="card" style={{ padding: isMobile ? 16 : 24, marginBottom: 16 }}>
            <h3 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiPackage color="var(--primary)" size={isMobile ? 18 : 20} /> Items Ordered
            </h3>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: isMobile ? 12 : 16, padding: isMobile ? '10px 0' : '14px 0', borderBottom: '1px solid #f5f5f5' }}>
                <img src={item.image} alt={item.name} style={{ width: isMobile ? 48 : 64, height: isMobile ? 48 : 64, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: isMobile ? 13 : 15, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                  <div style={{ fontSize: isMobile ? 11 : 13, color: '#888', marginTop: 4 }}>Qty: {item.quantity} × Rs.{item.price}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: isMobile ? 13 : 15, textAlign: 'right', flexShrink: 0 }}>Rs.{(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* Delivery Address */}
          <div className="card" style={{ padding: isMobile ? 16 : 24 }}>
            <h3 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiMapPin color="var(--primary)" size={isMobile ? 18 : 20} /> Delivery Address
            </h3>
            <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{order.shippingAddress?.fullName}</div>
            <div style={{ fontSize: isMobile ? 12 : 14, color: '#666', marginTop: 6, lineHeight: 1.7 }}>
              {order.shippingAddress?.addressLine1}<br />
              {order.shippingAddress?.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br />
              {order.shippingAddress?.phone}
              {order.trackingNumber && (
                <div style={{ marginTop: 8, fontSize: isMobile ? 13 : 14, color: '#111', fontWeight: 600 }}>
                  Tracking No: {order.trackingNumber}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div>
          <div className="card" style={{ padding: isMobile ? 16 : 24 }}>
            <h3 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiCreditCard color="var(--primary)" size={isMobile ? 18 : 20} /> Payment Info
            </h3>
            {[
              { label: 'Items Total', value: `Rs.${order.itemsPrice?.toFixed(2)}` },
              { label: 'Shipping', value: order.shippingPrice === 0 ? 'FREE' : `Rs.${order.shippingPrice}`, color: 'var(--success)' },
              { label: 'Tax (GST)', value: `Rs.${order.taxPrice?.toFixed(2)}` },
              ...(order.discountAmount > 0 ? [{ label: 'Discount', value: `-Rs.${order.discountAmount?.toFixed(2)}`, color: 'var(--success)' }] : []),
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: isMobile ? 12 : 14 }}>
                <span style={{ color: '#666' }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: row.color }}>{row.value}</span>
              </div>
            ))}
            <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: isMobile ? 15 : 17 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>Rs.{order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: isMobile ? '8px 12px' : '10px 14px', background: '#f5f5f5', borderRadius: 8, fontSize: isMobile ? 11 : 13 }}>
              <span style={{ fontWeight: 600 }}>Payment Method: </span>{order.paymentMethod?.toUpperCase()}
              <br />
              <span style={{ fontWeight: 600 }}>Status: </span>
              <span style={{ color: order.isPaid ? 'var(--success)' : '#ffc107', fontWeight: 600 }}>
                {order.isPaid ? '✓ Paid' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
