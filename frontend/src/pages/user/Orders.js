import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronRight } from 'react-icons/fi';
import { orderAPI } from '../../utils/api';

const statusColors = {
  pending: '#d97706', confirmed: '#0891b2', processing: '#2563eb',
  shipped: '#7c3aed', delivered: '#16a34a', cancelled: '#dc2626', refunded: '#6b7280'
};
const FILTERS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');

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

  const shown = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 60, maxWidth: 900 }}>
      <div className="section-head">
        <div>
          <h1 style={{ fontSize: 28 }}>My Orders</h1>
          <p>{orders.length} order{orders.length === 1 ? '' : 's'} placed</p>
        </div>
      </div>

      {orders.length > 0 && (
        <div className="chip-row">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`chip${filter === f ? ' active' : ''}`}>{f}</button>
          ))}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <FiPackage size={56} color="var(--border)" style={{ marginBottom: 16 }} />
          <h3 style={{ marginBottom: 10 }}>No orders yet</h3>
          <p style={{ color: 'var(--gray)', marginBottom: 24 }}>Start shopping to see your orders here</p>
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
        </div>
      ) : shown.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--gray)' }}>No {filter} orders.</div>
      ) : (
        <>
          {shown.map(order => {
            const color = statusColors[order.orderStatus] || '#6b7280';
            return (
              <Link to={`/orders/${order._id}`} key={order._id} className="order-card" style={{ '--stripe': color }}>
                <div className="order-top">
                  <div>
                    <div className="order-id">{order.orderId}</div>
                    <div className="order-meta">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' · '}{order.items?.length} item{order.items?.length === 1 ? '' : 's'}
                    </div>
                  </div>
                  <span className="order-status" style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}>{order.orderStatus}</span>
                </div>
                <div className="order-bottom">
                  <div className="order-thumbs">
                    {order.items?.slice(0, 4).map((item, i) => (
                      <img key={i} src={item.image} alt={item.name} />
                    ))}
                    {order.items?.length > 4 && <div className="order-more">+{order.items.length - 4}</div>}
                  </div>
                  <div className="order-total">
                    <div style={{ fontSize: 12, color: 'var(--gray)' }}>Total</div>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>Rs.{order.totalPrice?.toFixed(2)}</div>
                  </div>
                  <FiChevronRight size={20} className="order-arrow" />
                </div>
              </Link>
            );
          })}

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
