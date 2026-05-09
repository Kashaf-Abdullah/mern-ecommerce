import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiUsers, FiPackage, FiDollarSign, FiArrowUp } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { adminAPI } from '../../utils/api';

const statusColors = {
  pending: '#ffc107', confirmed: '#17a2b8', processing: '#007bff',
  shipped: '#6f42c1', delivered: '#28a745', cancelled: '#dc3545',
};

const StatCard = ({ title, value, icon, color, change }) => (
  <div className="card" style={{ padding: '24px 28px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: 13, color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 28, fontWeight: 800 }}>{value}</div>
        {change !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>
            <FiArrowUp size={14} /> +{change}% this month
          </div>
        )}
      </div>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        {icon}
      </div>
    </div>
  </div>
);

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(({ data }) => setData(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (!data) return null;

  const revenueChartData = data.monthlyRevenue.map(d => ({
    name: monthNames[(d._id.month - 1)],
    revenue: Math.round(d.revenue),
    orders: d.orders
  }));

  const pieData = data.statusBreakdown.map(s => ({ name: s._id, value: s.count }));

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Dashboard</h1>
        <p style={{ color: 'var(--gray)', fontSize: 14, marginTop: 4 }}>Welcome to your store overview</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
        <StatCard title="Total Revenue" value={`Rs.${data.stats.totalRevenue?.toLocaleString()}`} icon={<FiDollarSign size={22} />} color="#28a745" change={12} />
        <StatCard title="Total Orders" value={data.stats.totalOrders?.toLocaleString()} icon={<FiShoppingBag size={22} />} color="#007bff" change={8} />
        <StatCard title="Total Users" value={data.stats.totalUsers?.toLocaleString()} icon={<FiUsers size={22} />} color="#6f42c1" change={5} />
        <StatCard title="Total Products" value={data.stats.totalProducts?.toLocaleString()} icon={<FiPackage size={22} />} color="var(--primary)" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 28 }}>
        {/* Revenue Chart */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Revenue Overview (Last 6 Months)</h3>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value) => [`Rs.${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
              No revenue data yet
            </div>
          )}
        </div>

        {/* Order Status Pie */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Order Status</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={statusColors[entry.name] || '#ccc'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {pieData.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusColors[d.name] || '#ccc' }} />
                    <span style={{ textTransform: 'capitalize', color: '#555' }}>{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No data</div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Orders</h3>
          <Link to="/admin/orders" style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 600 }}>View All</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map(order => (
                <tr key={order._id}>
                  <td><Link to={`/orders/${order._id}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{order.orderId}</Link></td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{order.user?.name}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{order.user?.email}</div>
                  </td>
                  <td style={{ fontWeight: 700 }}>Rs.{order.totalPrice?.toFixed(2)}</td>
                  <td>
                    <span style={{
                      background: statusColors[order.orderStatus] + '22',
                      color: statusColors[order.orderStatus],
                      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize'
                    }}>{order.orderStatus}</span>
                  </td>
                  <td style={{ color: '#888', fontSize: 13 }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
