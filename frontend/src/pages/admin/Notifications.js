import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [targetType, setTargetType] = useState('all'); // 'all' or 'specific'
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getNotifications();
      setNotifications(data.notifications);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data } = await adminAPI.getAllUsers();
      setAllUsers(data.users);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (targetType === 'specific') {
      fetchUsers();
    }
  }, [targetType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Please enter title and message');
      return;
    }
    if (targetType === 'specific' && selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        message: message.trim(),
        link: link.trim(),
        targetType,
        users: targetType === 'specific' ? selectedUsers : []
      };
      await adminAPI.createNotification(payload);
      toast.success('Notification posted');
      setTitle('');
      setMessage('');
      setLink('');
      setTargetType('all');
      setSelectedUsers([]);
      fetchNotifications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post notification');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Notifications</h1>
          <p style={{ color: '#6b7280' }}>Post notifications to all users or specific users and review the notification history.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Create Notification</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="form-control" placeholder="Notification title" />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} className="form-control" rows={4} placeholder="Notification message" />
          </div>
          <div className="form-group">
            <label>Link (optional)</label>
            <input value={link} onChange={e => setLink(e.target.value)} className="form-control" placeholder="Optional URL or deep link" />
          </div>
          <div className="form-group">
            <label>Send to</label>
            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="radio"
                  name="targetType"
                  value="all"
                  checked={targetType === 'all'}
                  onChange={e => setTargetType(e.target.value)}
                />
                All Users
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="radio"
                  name="targetType"
                  value="specific"
                  checked={targetType === 'specific'}
                  onChange={e => setTargetType(e.target.value)}
                />
                Specific Users
              </label>
            </div>
            {targetType === 'specific' && (
              <div>
                <label>Select Users</label>
                {usersLoading ? (
                  <div style={{ padding: 12, color: '#6b7280' }}>Loading users...</div>
                ) : (
                  <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
                    {allUsers.map(user => (
                      <label key={user._id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 4 }}>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user._id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                            }
                          }}
                        />
                        <span>{user.name} ({user.email})</span>
                      </label>
                    ))}
                  </div>
                )}
                {selectedUsers.length > 0 && (
                  <div style={{ marginTop: 8, fontSize: 14, color: '#6b7280' }}>
                    {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Posting...' : 'Post Notification'}
          </button>
        </form>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Sent Notifications</h2>
        {loading ? (
          <div style={{ color: '#6b7280' }}>Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No notifications posted yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {notifications.map(notification => (
              <div key={notification._id} style={{ padding: 18, borderRadius: 14, border: '1px solid #e5e7eb', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{notification.title}</h3>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#6b7280', fontSize: 13 }}>{new Date(notification.createdAt).toLocaleString()}</span>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                      Sent to: {notification.targetAll ? 'All Users' : `${notification.users?.length || 0} Users`}
                    </div>
                  </div>
                </div>
                <p style={{ margin: '10px 0 0', color: '#444' }}>{notification.message}</p>
                {notification.link && (
                  <a href={notification.link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: 14 }}>Open Link</a>
                )}
                {!notification.targetAll && notification.users && notification.users.length > 0 && (
                  <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                    Recipients: {notification.users.map(u => u.name).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
