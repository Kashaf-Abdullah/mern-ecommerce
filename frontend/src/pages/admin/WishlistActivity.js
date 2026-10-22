import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const WishlistActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchWishlistActivity = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getWishlistActivity(pageNumber);
      setActivities(data.activities);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load wishlist activity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistActivity(page);
  }, [page]);

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Wishlist Activity</h1>
          <p style={{ color: 'var(--gray)' }}>See which users added products to wishlist and when.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        {loading ? (
          <div style={{ color: 'var(--gray)' }}>Loading activity...</div>
        ) : activities.length === 0 ? (
          <div style={{ color: 'var(--gray)' }}>No wishlist activity yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--gray)' }}>
                  <th style={{ padding: '14px 12px', borderBottom: '1px solid var(--border)' }}>User</th>
                  <th style={{ padding: '14px 12px', borderBottom: '1px solid var(--border)' }}>Product</th>
                  <th style={{ padding: '14px 12px', borderBottom: '1px solid var(--border)' }}>Action</th>
                  <th style={{ padding: '14px 12px', borderBottom: '1px solid var(--border)' }}>Added</th>
                </tr>
              </thead>
              <tbody>
                {activities.map(activity => (
                  <tr key={activity._id} style={{ background: 'var(--card-bg)' }}>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-color)' }}>{activity.user?.name || 'Unknown'}</div>
                      <div style={{ color: 'var(--gray)', fontSize: 13 }}>{activity.user?.email || ''}</div>
                    </td>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-color)' }}>{activity.product?.name || 'Unknown product'}</div>
                      <div style={{ color: 'var(--gray)', fontSize: 13 }}>₹{activity.product?.price ?? '-'}</div>
                    </td>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--border)', textTransform: 'capitalize', color: activity.action === 'added' ? '#16a34a' : '#dc2626' }}>
                      {activity.action}
                    </td>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--border)', color: 'var(--gray)' }}>
                      {new Date(activity.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pages > 1 && (
              <div style={{ marginTop: 18, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Array.from({ length: pages }, (_, idx) => idx + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    style={{
                      border: '1px solid #d1d5db',
                      background: num === page ? '#1a1a2e' : 'var(--card-bg)',
                      color: num === page ? '#fff' : '#374151',
                      borderRadius: 8,
                      padding: '8px 12px',
                      cursor: 'pointer'
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistActivity;
