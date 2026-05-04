import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { categoryAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', order: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    categoryAPI.getAll().then(({ data }) => setCategories(data.categories)).finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setForm({ name: '', description: '', order: 0 }); setEditCat(null); setShowModal(true); };
  const openEdit = (cat) => { setForm({ name: cat.name, description: cat.description || '', order: cat.order || 0 }); setEditCat(cat); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editCat) {
        const { data } = await categoryAPI.update(editCat._id, form);
        setCategories(prev => prev.map(c => c._id === editCat._id ? data.category : c));
        toast.success('Category updated!');
      } else {
        const { data } = await categoryAPI.create(form);
        setCategories(prev => [...prev, data.category]);
        toast.success('Category created!');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoryAPI.delete(id);
      setCategories(prev => prev.filter(c => c._id !== id));
      toast.success('Category deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete — check if products exist');
    }
  };

  const catEmojis = { electronics: '📱', fashion: '👗', 'home-kitchen': '🏠', sports: '⚽', books: '📚' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Categories</h1>
          <p style={{ color: 'var(--gray)', fontSize: 14, marginTop: 4 }}>{categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary"><FiPlus size={16} /> Add Category</button>
      </div>

      {loading ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
          {categories.map(cat => (
            <div key={cat._id} className="card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(233,69,96,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                    {catEmojis[cat.slug] || '🏷️'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>{cat.name}</h3>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>/{cat.slug}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEdit(cat)}
                    style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat._id)}
                    style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #ffcdd2', background: '#fff5f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
              {cat.description && (
                <p style={{ fontSize: 13, color: '#777', marginTop: 12, lineHeight: 1.6 }}>{cat.description}</p>
              )}
              <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                <span style={{ background: cat.isActive ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)', color: cat.isActive ? 'var(--success)' : 'var(--danger)', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
                <span style={{ background: '#f5f5f5', color: '#666', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>
                  Order: {cat.order}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 460 }}>
            <div style={{ padding: '22px 28px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{editCat ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: '#f5f5f5', border: 'none', width: 34, height: 34, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '22px 28px' }}>
              <div className="form-group">
                <label>Category Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="form-control" placeholder="e.g. Electronics" required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="form-control" style={{ resize: 'vertical' }} placeholder="Optional description..." />
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                  className="form-control" min={0} />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : editCat ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
