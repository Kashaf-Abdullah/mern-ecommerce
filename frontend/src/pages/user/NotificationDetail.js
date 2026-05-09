import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const NotificationDetail = () => {
  const { id } = useParams();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNotification = async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getNotification(id);
      setNotification(data.notification);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load notification');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchNotification();
  }, [id]);

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 60, maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <Link to="/notifications" className="btn btn-outline btn-sm" style={{ marginBottom: 16 }}>← Back to Notifications</Link>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Notification Details</h1>
        <p style={{ color: '#6b7280' }}>Read the full notification and follow its link if provided.</p>
      </div>

      <div className="card" style={{ padding: 28 }}>
        {loading ? (
          <div style={{ color: '#6b7280' }}>Loading notification...</div>
        ) : !notification ? (
          <div style={{ color: '#6b7280' }}>Notification not found.</div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{notification.title}</h2>
                <p style={{ margin: '8px 0 0', color: '#6b7280' }}>{new Date(notification.createdAt).toLocaleString()}</p>
              </div>
              {notification.link && (
                <a href={notification.link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                  Open Link
                </a>
              )}
            </div>
            <div style={{ marginTop: 24, color: '#333', lineHeight: 1.8, fontSize: 15 }}>
              {notification.message.split('\n').map((line, idx) => (
                <p key={idx} style={{ margin: idx === 0 ? 0 : '1rem 0 0' }}>{line}</p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationDetail;
