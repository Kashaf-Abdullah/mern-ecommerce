import React, { useState, useEffect } from 'react';
import { FiEye, FiChevronDown, FiX } from 'react-icons/fi';
import { orderAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const statusColors = {
  pending: '#ffc107', confirmed: '#17a2b8', processing: '#007bff',
  shipped: '#6f42c1', delivered: '#28a745', cancelled: '#dc3545', refunded: '#6c757d',
};

const STATUS_FLOW = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
  refunded: [],
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', description: '', trackingNumber: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15, ...(statusFilter && { status: statusFilter }) };
      const { data } = await orderAPI.getAll(params);
      setOrders(data.orders);
      setTotalPages(data.pages);
    } finally { setLoading(false); }
  };

  const openUpdateModal = (order) => {
    setSelectedOrder(order);
    setStatusForm({ status: '', description: '', trackingNumber: order.trackingNumber || '' });
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!statusForm.status) { toast.error('Select a status'); return; }
    setUpdating(true);
    try {
      const { data } = await orderAPI.updateStatus(selectedOrder._id, statusForm);
      const updatedOrder = { ...selectedOrder, ...data.order, user: selectedOrder.user || data.order.user };
      setOrders(prev => prev.map(o => o._id === selectedOrder._id ? updatedOrder : o));
      setSelectedOrder(updatedOrder);
      toast.success(`Order updated to "${statusForm.status}"`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally { setUpdating(false); }
  };

  const nextStatuses = selectedOrder ? STATUS_FLOW[selectedOrder.orderStatus] || [] : [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Orders</h1>
          <p style={{ color: 'var(--gray)', fontSize: 14, marginTop: 4 }}>Manage all customer orders</p>
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="form-control" style={{ width: 180 }}>
          <option value="">All Statuses</option>
          {Object.keys(statusColors).map(s => (
            <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>No orders found</td></tr>
              ) : orders.map(order => (
                <tr key={order._id}>
                  <td style={{ fontWeight: 700, fontSize: 13, color: 'var(--primary)' }}>{order.orderId}</td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{order.user?.name}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{order.user?.email}</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{order.items?.length} item(s)</td>
                  <td style={{ fontWeight: 700 }}>Rs.{order.totalPrice?.toFixed(2)}</td>
                  <td>
                    <span style={{ fontSize: 12, background: '#f5f5f5', padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase', fontWeight: 600 }}>
                      {order.paymentMethod}
                    </span>
                    <div style={{ fontSize: 11, color: order.isPaid ? 'var(--success)' : '#ffc107', fontWeight: 600, marginTop: 3 }}>
                      {order.isPaid ? '✓ Paid' : 'Pending'}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      background: statusColors[order.orderStatus] + '22',
                      color: statusColors[order.orderStatus],
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'capitalize'
                    }}>{order.orderStatus}</span>
                  </td>
                  <td style={{ fontSize: 13, color: '#888' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => openUpdateModal(order)}
                      className="btn btn-outline btn-sm" style={{ gap: 6 }}>
                      <FiEye size={13} /> Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0' }}>
            <div className="pagination" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`page-btn${page === p ? ' active' : ''}`}>{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 860, minWidth: 540, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '22px 28px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: '#f5f5f5', border: 'none', width: 34, height: 34, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiX size={18} />
              </button>
            </div>

            <div style={{ padding: '22px 28px', overflowY: 'auto', flex: 1 }}>
              {/* Order Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20, padding: 16, background: '#f9f9f9', borderRadius: 10 }}>
                {[
                  { label: 'Order ID', value: selectedOrder.orderId },
                  { label: 'Customer', value: selectedOrder.user?.name },
                  { label: 'Phone', value: selectedOrder.shippingAddress?.phone },
                  { label: 'City', value: selectedOrder.shippingAddress?.city },
                  { label: 'State', value: selectedOrder.shippingAddress?.state },
                  { label: 'Pincode', value: selectedOrder.shippingAddress?.pincode },
                  { label: 'Address', value: `${selectedOrder.shippingAddress?.addressLine1 || ''}${selectedOrder.shippingAddress?.addressLine2 ? ', ' + selectedOrder.shippingAddress.addressLine2 : ''}` },
                  { label: 'Tracking Number', value: selectedOrder.trackingNumber || 'Not assigned' },
                  { label: 'Total', value: `Rs.${selectedOrder.totalPrice?.toFixed(2)}` },
                  { label: 'Payment', value: selectedOrder.paymentMethod?.toUpperCase() },
                  { label: 'Current Status', value: selectedOrder.orderStatus },
                  { label: 'Date', value: new Date(selectedOrder.createdAt).toLocaleDateString() },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, textTransform: item.label === 'Address' ? 'none' : 'capitalize' }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Items */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#888', marginBottom: 10, textTransform: 'uppercase' }}>Items</div>
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                    <img src={item.image} alt={item.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                    <div style={{ flex: 1, fontSize: 13 }}>
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                      <div style={{ color: '#888' }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Rs.{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              {/* Update Status */}
              {nextStatuses.length > 0 ? (
                <form onSubmit={handleStatusUpdate}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#888', marginBottom: 12, textTransform: 'uppercase' }}>Update Status</div>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                    {nextStatuses.map(s => (
                      <label key={s} style={{
                        flex: 1, padding: '10px 14px', border: `2px solid ${statusForm.status === s ? statusColors[s] : '#e0e0e0'}`,
                        borderRadius: 10, cursor: 'pointer', textAlign: 'center', fontSize: 14, fontWeight: 600,
                        background: statusForm.status === s ? statusColors[s] + '15' : '#fff',
                        color: statusForm.status === s ? statusColors[s] : '#666',
                        transition: 'all 0.2s', textTransform: 'capitalize'
                      }}>
                        <input type="radio" name="status" value={s}
                          checked={statusForm.status === s}
                          onChange={() => setStatusForm(f => ({ ...f, status: s }))}
                          style={{ display: 'none' }} />
                        {s}
                      </label>
                    ))}
                  </div>

                  {statusForm.status === 'shipped' && (
                    <div className="form-group">
                      <label>Tracking Number</label>
                      <input type="text" value={statusForm.trackingNumber}
                        onChange={e => setStatusForm(f => ({ ...f, trackingNumber: e.target.value }))}
                        className="form-control" placeholder="Enter tracking number" />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Note (optional)</label>
                    <input type="text" value={statusForm.description}
                      onChange={e => setStatusForm(f => ({ ...f, description: e.target.value }))}
                      className="form-control" placeholder="Internal note..." />
                  </div>

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setSelectedOrder(null)} className="btn btn-outline">Cancel</button>
                    <button type="submit" disabled={updating || !statusForm.status} className="btn btn-primary">
                      {updating ? 'Updating...' : 'Update Status'}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ padding: '14px 18px', background: '#f9f9f9', borderRadius: 10, fontSize: 14, color: '#888', textAlign: 'center' }}>
                  No further status updates available for this order.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
