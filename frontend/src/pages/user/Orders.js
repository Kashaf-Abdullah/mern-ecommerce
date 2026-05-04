import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiEye } from 'react-icons/fi';
import { orderAPI } from '../../utils/api';

const statusColors = {
  pending: '#ffc107', confirmed: '#17a2b8', processing: '#007bff',
  shipped: '#6f42c1', delivered: '#28a745', cancelled: '#dc3545', refunded: '#6c757d'
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await orderAPI.getMyOrders({ page });
        setOrders(data.orders);
        setTotalPages(data.pages);
      } finally { setLoading(false); }
    };
    fetchOrders();
  }, [page]);

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28 }}>My Orders</h1>

      {orders.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <FiPackage size={60} color="#ddd" style={{ marginBottom: 16 }} />
          <h3 style={{ marginBottom: 10 }}>No orders yet</h3>
          <p style={{ color: 'var(--gray)', marginBottom: 24 }}>Start shopping to see your orders here</p>
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
        </div>
      ) : (
        <>
          {orders.map(order => (
            <div key={order._id} className="card" style={{ padding: '20px 24px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{order.orderId}</div>
                  <div style={{ color: 'var(--gray)', fontSize: 13, marginTop: 4 }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {' · '}{order.items?.length} item(s)
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    background: statusColors[order.orderStatus] + '22',
                    color: statusColors[order.orderStatus],
                    padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, textTransform: 'capitalize'
                  }}>{order.orderStatus}</span>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>₹{order.totalPrice?.toFixed(2)}</div>
                  <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">
                    <FiEye size={14} /> View
                  </Link>
                </div>
              </div>

              {/* Item thumbnails */}
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                {order.items?.slice(0, 5).map((item, i) => (
                  <img key={i} src={item.image} alt={item.name}
                    style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #f0f0f0' }} />
                ))}
                {order.items?.length > 5 && (
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#888' }}>
                    +{order.items.length - 5}
                  </div>
                )}
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`page-btn${page === p ? ' active' : ''}`}>{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
