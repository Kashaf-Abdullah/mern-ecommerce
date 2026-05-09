import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getNotifications();
      setNotifications(data.notifications);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 60, maxWidth: 920 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Notifications</h1>
          <p style={{ color: '#6b7280' }}>Your latest account notifications are shown here. Click one to view full details.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        {loading ? (
          <div style={{ color: '#6b7280' }}>Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No notifications yet. Check back later.</div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {notifications.map(notification => (
              <Link key={notification._id} to={`/notifications/${notification._id}`} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: 18, borderRadius: 14, border: '1px solid #e5e7eb', background: notification.isRead ? '#fff' : '#eef6ff', transition: 'background 0.2s' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111' }}>{notification.title}</h3>
                    <p style={{ margin: '8px 0 0', color: '#555', lineHeight: 1.6 }}>{notification.message.length > 120 ? `${notification.message.slice(0, 120)}...` : notification.message}</p>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 100 }}>
                    <span style={{ display: 'block', color: '#6b7280', fontSize: 13 }}>{new Date(notification.createdAt).toLocaleDateString()}</span>
                    {!notification.isRead && <span style={{ display: 'inline-flex', marginTop: 8, padding: '4px 10px', borderRadius: 999, background: 'var(--primary, #e94560)', color: '#fff', fontSize: 12, fontWeight: 700 }}>New</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
