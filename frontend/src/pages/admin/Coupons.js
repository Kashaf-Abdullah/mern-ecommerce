import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiPercent } from 'react-icons/fi';
import { couponAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const initialForm = {
  code: '', description: '', discountType: 'percentage', discountValue: '',
  maxDiscount: '', minOrderAmount: '', usageLimit: '', isActive: true,
  startDate: new Date().toISOString().split('T')[0],
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
};

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    couponAPI.getAll().then(({ data }) => setCoupons(data.coupons)).finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setForm(initialForm); setEditCoupon(null); setShowModal(true); };
  const openEdit = (c) => {
    setForm({
      code: c.code, description: c.description || '', discountType: c.discountType,
      discountValue: c.discountValue, maxDiscount: c.maxDiscount || '',
      minOrderAmount: c.minOrderAmount || '', usageLimit: c.usageLimit || '',
      isActive: c.isActive,
      startDate: c.startDate ? c.startDate.split('T')[0] : initialForm.startDate,
      expiryDate: c.expiryDate ? c.expiryDate.split('T')[0] : initialForm.expiryDate,
    });
    setEditCoupon(c);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      discountValue: Number(form.discountValue),
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
    };
    try {
      if (editCoupon) {
        const { data } = await couponAPI.update(editCoupon._id, payload);
        setCoupons(prev => prev.map(c => c._id === editCoupon._id ? data.coupon : c));
        toast.success('Coupon updated!');
      } else {
        const { data } = await couponAPI.create(payload);
        setCoupons(prev => [data.coupon, ...prev]);
        toast.success('Coupon created!');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await couponAPI.delete(id);
      setCoupons(prev => prev.filter(c => c._id !== id));
      toast.success('Coupon deleted');
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  const isExpired = (coupon) => new Date(coupon.expiryDate) < new Date();
  const isMaxed = (coupon) => coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Coupons</h1>
          <p style={{ color: 'var(--gray)', fontSize: 14, marginTop: 4 }}>{coupons.length} coupons</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary"><FiPlus size={16} /> Create Coupon</button>
      </div>

      {loading ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Min Order</th>
                  <th>Usage</th>
                  <th>Validity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>No coupons yet</td></tr>
                ) : coupons.map(coupon => (
                  <tr key={coupon._id}>
                    <td>
                      <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 15, letterSpacing: 1, color: 'var(--dark)', background: '#f5f5f5', display: 'inline-block', padding: '4px 10px', borderRadius: 6 }}>
                        {coupon.code}
                      </div>
                      {coupon.description && <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{coupon.description}</div>}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FiPercent size={14} />
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `Rs.${coupon.discountValue}`}
                      </div>
                      {coupon.maxDiscount && <div style={{ fontSize: 12, color: '#888' }}>Max: Rs.{coupon.maxDiscount}</div>}
                    </td>
                    <td style={{ fontSize: 14 }}>Rs.{coupon.minOrderAmount || 0}</td>
                    <td>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>
                        {coupon.usedCount} / {coupon.usageLimit || '∞'}
                      </div>
                      {coupon.usageLimit && (
                        <div style={{ width: 80, height: 4, background: '#f0f0f0', borderRadius: 2, marginTop: 4 }}>
                          <div style={{ width: `${Math.min(100, (coupon.usedCount / coupon.usageLimit) * 100)}%`, height: '100%', background: 'var(--primary)', borderRadius: 2 }} />
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: 13 }}>
                      <div style={{ color: '#444' }}>{new Date(coupon.startDate).toLocaleDateString()} –</div>
                      <div style={{ color: isExpired(coupon) ? 'var(--danger)' : '#444' }}>{new Date(coupon.expiryDate).toLocaleDateString()}</div>
                    </td>
                    <td>
                      {!coupon.isActive ? (
                        <span style={{ background: 'rgba(108,117,125,0.1)', color: '#6c757d', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Inactive</span>
                      ) : isExpired(coupon) ? (
                        <span style={{ background: 'rgba(220,53,69,0.1)', color: 'var(--danger)', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Expired</span>
                      ) : isMaxed(coupon) ? (
                        <span style={{ background: 'rgba(255,193,7,0.15)', color: '#856404', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Maxed Out</span>
                      ) : (
                        <span style={{ background: 'rgba(40,167,69,0.1)', color: 'var(--success)', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Active</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(coupon)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(coupon._id)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #ffcdd2', background: '#fff5f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '22px 28px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{editCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: '#f5f5f5', border: 'none', width: 34, height: 34, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '22px 28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>Coupon Code *</label>
                  <input type="text" value={form.code}
                    onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    className="form-control" placeholder="e.g. SAVE20" required
                    style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16, letterSpacing: 1 }} />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>Description</label>
                  <input type="text" value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="form-control" placeholder="Optional description" />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>Discount Type *</label>
                  <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}
                    className="form-control">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>
                    Discount Value * {form.discountType === 'percentage' ? '(%)' : '(Rs.)'}
                  </label>
                  <input type="number" value={form.discountValue}
                    onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))}
                    className="form-control" min="0" max={form.discountType === 'percentage' ? 100 : undefined} required />
                </div>

                {form.discountType === 'percentage' && (
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>Max Discount (Rs.)</label>
                    <input type="number" value={form.maxDiscount}
                      onChange={e => setForm(f => ({ ...f, maxDiscount: e.target.value }))}
                      className="form-control" min="0" placeholder="No limit" />
                  </div>
                )}

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>Min Order Amount (Rs.)</label>
                  <input type="number" value={form.minOrderAmount}
                    onChange={e => setForm(f => ({ ...f, minOrderAmount: e.target.value }))}
                    className="form-control" min="0" placeholder="0" />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>Usage Limit</label>
                  <input type="number" value={form.usageLimit}
                    onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))}
                    className="form-control" min="0" placeholder="Unlimited" />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>Start Date *</label>
                  <input type="date" value={form.startDate}
                    onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                    className="form-control" required />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>Expiry Date *</label>
                  <input type="date" value={form.expiryDate}
                    onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                    className="form-control" required />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                    <input type="checkbox" checked={form.isActive}
                      onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                      style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                    Active (coupon is usable immediately)
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24, paddingTop: 20, borderTop: '1px solid #f0f0f0' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : editCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
