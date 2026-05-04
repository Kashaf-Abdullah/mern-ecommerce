import React, { useState, useEffect } from 'react';
import { FiSearch, FiUserX, FiUserCheck } from 'react-icons/fi';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchUsers(); }, [page, search, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, ...(search && { search }), ...(roleFilter && { role: roleFilter }) };
      const { data } = await adminAPI.getUsers(params);
      setUsers(data.users);
      setTotalPages(data.pages);
      setTotal(data.total);
    } finally { setLoading(false); }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const { data } = await adminAPI.toggleBlock(userId);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: data.user.isActive } : u));
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Users</h1>
        <p style={{ color: 'var(--gray)', fontSize: 14, marginTop: 4 }}>{total} total users</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
          <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} size={16} />
          <input type="text" placeholder="Search by name or email..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="form-control" style={{ paddingLeft: 42 }} />
        </div>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          className="form-control" style={{ width: 160 }}>
          <option value="">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
          <option value="subadmin">Sub-admins</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Email Verified</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>No users found</td></tr>
              ) : users.map(user => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={user.avatar?.url} alt={user.name}
                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #f0f0f0' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      background: user.role === 'admin' ? 'rgba(233,69,96,0.1)' : user.role === 'subadmin' ? 'rgba(255,193,7,0.15)' : 'rgba(108,117,125,0.1)',
                      color: user.role === 'admin' ? 'var(--primary)' : user.role === 'subadmin' ? '#856404' : '#666',
                      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'capitalize'
                    }}>{user.role}</span>
                  </td>
                  <td>
                    <span style={{ color: user.isEmailVerified ? 'var(--success)' : '#ffc107', fontWeight: 600, fontSize: 13 }}>
                      {user.isEmailVerified ? '✓ Verified' : '⏳ Pending'}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      background: user.isActive ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)',
                      color: user.isActive ? 'var(--success)' : 'var(--danger)',
                      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700
                    }}>{user.isActive ? 'Active' : 'Blocked'}</span>
                  </td>
                  <td style={{ fontSize: 13, color: '#888' }}>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ fontSize: 13, color: '#888' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleBlock(user._id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                          border: `1px solid ${user.isActive ? '#ffcdd2' : '#c8e6c9'}`,
                          background: user.isActive ? '#fff5f5' : '#f1f8e9',
                          color: user.isActive ? 'var(--danger)' : 'var(--success)',
                          borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600
                        }}>
                        {user.isActive ? <><FiUserX size={13} /> Block</> : <><FiUserCheck size={13} /> Unblock</>}
                      </button>
                    )}
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
    </div>
  );
};

export default AdminUsers;
