// import React, { useState, useEffect } from 'react';
// import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
// import { productAPI, categoryAPI } from '../../utils/api';
// import toast from 'react-hot-toast';

// const initialForm = {
//   name: '', description: '', shortDescription: '', price: '', discountPrice: '',
//   brand: '', stock: '', category: '', featured: false, trending: false,
//   specifications: [{ key: '', value: '' }], tags: '', sku: ''
// };

// const AdminProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editProduct, setEditProduct] = useState(null);
//   const [form, setForm] = useState(initialForm);
//   const [saving, setSaving] = useState(false);
//   const [search, setSearch] = useState('');
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // Fetch categories only once on mount
//   useEffect(() => {
//     categoryAPI.getAll().then(({ data }) => setCategories(data.categories)).catch(err => console.error('Failed to load categories:', err));
//   }, []);

//   // Fetch products when page or search changes
//   useEffect(() => {
//     fetchProducts();
//   }, [page, search]);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const { data } = await productAPI.getAll({ page, limit: 15, ...(search && { search }), isActive: undefined });
//       setProducts(data.products);
//       setTotalPages(data.pagination.pages);
//     } finally { setLoading(false); }
//   };

//   const openAdd = () => { setForm(initialForm); setEditProduct(null); setShowModal(true); };
//   const openEdit = (p) => {
//     setForm({
//       name: p.name, description: p.description, shortDescription: p.shortDescription || '',
//       price: p.price, discountPrice: p.discountPrice || '', brand: p.brand,
//       stock: p.stock, category: p.category?._id || p.category,
//       featured: p.featured, trending: p.trending,
//       specifications: p.specifications?.length ? p.specifications : [{ key: '', value: '' }],
//       tags: p.tags?.join(', ') || '', sku: p.sku || ''
//     });
//     setEditProduct(p);
//     setShowModal(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const payload = {
//         ...form,
//         price: Number(form.price),
//         discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
//         stock: Number(form.stock),
//         specifications: form.specifications.filter(s => s.key && s.value),
//         tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
//       };

//       if (editProduct) {
//         const { data } = await productAPI.update(editProduct._id, payload);
//         setProducts(prev => prev.map(p => p._id === editProduct._id ? data.product : p));
//         toast.success('Product updated!');
//       } else {
//         const { data } = await productAPI.create(payload);
//         setProducts(prev => [data.product, ...prev]);
//         toast.success('Product created!');
//       }
//       setShowModal(false);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to save product');
//     } finally { setSaving(false); }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this product? This cannot be undone.')) return;
//     try {
//       await productAPI.delete(id);
//       setProducts(prev => prev.filter(p => p._id !== id));
//       toast.success('Product deleted');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to delete');
//     }
//   };

//   const addSpec = () => setForm(f => ({ ...f, specifications: [...f.specifications, { key: '', value: '' }] }));
//   const updateSpec = (i, k, v) => setForm(f => ({ ...f, specifications: f.specifications.map((s, idx) => idx === i ? { ...s, [k]: v } : s) }));
//   const removeSpec = (i) => setForm(f => ({ ...f, specifications: f.specifications.filter((_, idx) => idx !== i) }));

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
//         <div>
//           <h1 style={{ fontSize: 22, fontWeight: 800 }}>Products</h1>
//           <p style={{ color: 'var(--gray)', fontSize: 14, marginTop: 4 }}>{products.length} products shown</p>
//         </div>
//         <button onClick={openAdd} className="btn btn-primary">
//           <FiPlus size={16} /> Add Product
//         </button>
//       </div>

//       {/* Search */}
//       <div style={{ position: 'relative', marginBottom: 20, maxWidth: 400 }}>
//         <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
//         <input type="text" placeholder="Search products..." value={search}
//           onChange={e => { setSearch(e.target.value); setPage(1); }}
//           className="form-control" style={{ paddingLeft: 42 }} />
//       </div>

//       {/* Table */}
//       <div className="card">
//         <div className="table-wrap">
//           <table>
//             <thead>
//               <tr>
//                 <th>Product</th>
//                 <th>Category</th>
//                 <th>Price</th>
//                 <th>Stock</th>
//                 <th>Rating</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
//               ) : products.map(p => (
//                 <tr key={p._id}>
//                   <td>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                       <img src={p.images?.[0]?.url} alt={p.name} style={{ width: 46, height: 46, objectFit: 'cover', borderRadius: 8 }} />
//                       <div>
//                         <div style={{ fontWeight: 600, fontSize: 14, maxWidth: 200 }}>{p.name}</div>
//                         <div style={{ fontSize: 12, color: '#888' }}>{p.brand}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td style={{ fontSize: 13, color: '#666' }}>{p.category?.name}</td>
//                   <td>
//                     <div style={{ fontWeight: 700 }}>Rs.{(p.discountPrice > 0 ? p.discountPrice : p.price).toLocaleString()}</div>
//                     {p.discountPrice > 0 && <div style={{ fontSize: 12, color: '#aaa', textDecoration: 'line-through' }}>Rs.{p.price}</div>}
//                   </td>
//                   <td>
//                     <span style={{ fontWeight: 600, color: p.stock === 0 ? 'var(--danger)' : p.stock < 10 ? 'var(--warning)' : 'var(--success)' }}>
//                       {p.stock}
//                     </span>
//                   </td>
//                   <td style={{ fontSize: 13 }}>⭐ {p.ratings} ({p.numReviews})</td>
//                   <td>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
//                       {p.featured && <span style={{ background: 'rgba(233,69,96,0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, width: 'fit-content' }}>Featured</span>}
//                       {p.trending && <span style={{ background: 'rgba(23,162,184,0.1)', color: '#17a2b8', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, width: 'fit-content' }}>Trending</span>}
//                       {!p.featured && !p.trending && <span style={{ color: '#aaa', fontSize: 12 }}>—</span>}
//                     </div>
//                   </td>
//                   <td>
//                     <div style={{ display: 'flex', gap: 8 }}>
//                       <button onClick={() => openEdit(p)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#555' }}>
//                         <FiEdit2 size={14} />
//                       </button>
//                       <button onClick={() => handleDelete(p._id)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #ffcdd2', background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--danger)' }}>
//                         <FiTrash2 size={14} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {totalPages > 1 && (
//           <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0' }}>
//             <div className="pagination" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
//                 <button key={p} onClick={() => setPage(p)} className={`page-btn${page === p ? ' active' : ''}`}>{p}</button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
//           <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 700, maxHeight: '90vh', overflow: 'auto' }}>
//             <div style={{ padding: '24px 28px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
//               <h2 style={{ fontSize: 18, fontWeight: 700 }}>{editProduct ? 'Edit Product' : 'Add Product'}</h2>
//               <button onClick={() => setShowModal(false)} style={{ background: '#f5f5f5', border: 'none', width: 34, height: 34, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 <FiX size={18} />
//               </button>
//             </div>
//             <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//                 {[
//                   { key: 'name', label: 'Product Name', span: 2, required: true },
//                   { key: 'brand', label: 'Brand', required: true },
//                   { key: 'sku', label: 'SKU (optional)' },
//                   { key: 'price', label: 'Original Price (Rs.)', type: 'number', required: true },
//                   { key: 'discountPrice', label: 'Discount Price (Rs.)', type: 'number' },
//                   { key: 'stock', label: 'Stock Quantity', type: 'number', required: true },
//                   { key: 'tags', label: 'Tags (comma separated)' },
//                 ].map(f => (
//                   <div key={f.key} style={{ gridColumn: f.span === 2 ? 'span 2' : 'span 1' }}>
//                     <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>{f.label}</label>
//                     <input type={f.type || 'text'} value={form[f.key]}
//                       onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
//                       className="form-control" required={f.required} />
//                   </div>
//                 ))}

//                 <div style={{ gridColumn: 'span 2' }}>
//                   <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>Category *</label>
//                   <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
//                     className="form-control" required>
//                     <option value="">Select Category</option>
//                     {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//                   </select>
//                 </div>

//                 <div style={{ gridColumn: 'span 2' }}>
//                   <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>Short Description</label>
//                   <textarea rows={2} value={form.shortDescription}
//                     onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))}
//                     className="form-control" style={{ resize: 'vertical' }} />
//                 </div>

//                 <div style={{ gridColumn: 'span 2' }}>
//                   <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>Full Description *</label>
//                   <textarea rows={4} value={form.description}
//                     onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
//                     className="form-control" style={{ resize: 'vertical' }} required />
//                 </div>

//                 {/* Flags */}
//                 <div style={{ gridColumn: 'span 2', display: 'flex', gap: 24 }}>
//                   {['featured', 'trending'].map(key => (
//                     <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
//                       <input type="checkbox" checked={form[key]}
//                         onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
//                         style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
//                       {key.charAt(0).toUpperCase() + key.slice(1)}
//                     </label>
//                   ))}
//                 </div>

//                 {/* Specifications */}
//                 <div style={{ gridColumn: 'span 2' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
//                     <label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Specifications</label>
//                     <button type="button" onClick={addSpec} className="btn btn-outline btn-sm"><FiPlus size={13} /> Add</button>
//                   </div>
//                   {form.specifications.map((spec, i) => (
//                     <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginBottom: 8 }}>
//                       <input placeholder="Key (e.g. Color)" value={spec.key}
//                         onChange={e => updateSpec(i, 'key', e.target.value)} className="form-control" style={{ padding: '8px 12px', fontSize: 13 }} />
//                       <input placeholder="Value (e.g. Black)" value={spec.value}
//                         onChange={e => updateSpec(i, 'value', e.target.value)} className="form-control" style={{ padding: '8px 12px', fontSize: 13 }} />
//                       <button type="button" onClick={() => removeSpec(i)} style={{ background: '#fff5f5', border: '1px solid #ffcdd2', borderRadius: 8, color: 'var(--danger)', cursor: 'pointer', padding: '0 10px' }}>
//                         <FiX size={14} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24, paddingTop: 20, borderTop: '1px solid #f0f0f0' }}>
//                 <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
//                 <button type="submit" disabled={saving} className="btn btn-primary">
//                   {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminProducts;



import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX,
  FiImage, FiUpload, FiStar, FiMove, FiAlertCircle
} from 'react-icons/fi';
import { productAPI, categoryAPI } from '../../utils/api';
import toast from 'react-hot-toast';

/* ═══════════════════════════════════════════════════
   IMAGE MANAGER — handles both existing + new files
═══════════════════════════════════════════════════ */
const ImageManager = ({ images, newFiles, onAddFiles, onRemoveExisting, onRemoveNew, onSetMain }) => {
  const fileRef = useRef(null);
  const [draggingOver, setDraggingOver] = useState(false);

  const validateAndAdd = useCallback((fileList) => {
    const arr = Array.from(fileList);
    const imgs = arr.filter(f => f.type.startsWith('image/'));
    if (imgs.length === 0) { toast.error('Only image files are allowed (JPG, PNG, WebP)'); return; }
    const oversized = imgs.filter(f => f.size > 5 * 1024 * 1024);
    if (oversized.length) { toast.error(`${oversized.length} file(s) exceed 5MB limit`); return; }
    const total = images.length + newFiles.length + imgs.length;
    if (total > 10) { toast.error('Maximum 10 images per product'); return; }
    onAddFiles(imgs);
  }, [images, newFiles, onAddFiles]);

  const handleDrop = (e) => {
    e.preventDefault(); setDraggingOver(false);
    validateAndAdd(e.dataTransfer.files);
  };

  const allCount = images.length + newFiles.length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>
          Product Images
          <span style={{ fontWeight: 400, color: '#999', marginLeft: 6 }}>({allCount}/10)</span>
        </label>
        {allCount > 0 && (
          <button type="button" onClick={() => fileRef.current.click()}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#555' }}>
            <FiPlus size={13} /> Add More
          </button>
        )}
      </div>

      {/* Image grid */}
      {allCount > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>

          {/* ── Existing (already saved on server) ── */}
          {images.map((img, i) => (
            <div key={img._id || i}
              style={{ position: 'relative', width: 88, height: 88, borderRadius: 10, overflow: 'visible', flexShrink: 0 }}>
              <img src={img.url} alt="product"
                style={{
                  width: 88, height: 88, objectFit: 'cover', borderRadius: 10,
                  border: `2.5px solid ${i === 0 ? '#f59e0b' : '#d1d5db'}`,
                  display: 'block'
                }} />

              {/* Main badge */}
              {i === 0 && (
                <div style={{
                  position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
                  background: '#f59e0b', color: '#fff', fontSize: 9, fontWeight: 800,
                  padding: '2px 7px', borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: 0.5
                }}>⭐ MAIN</div>
              )}

              {/* Set as main button (for non-main images) */}
              {i !== 0 && (
                <button type="button" onClick={() => onSetMain('existing', i)}
                  title="Set as main image"
                  style={{
                    position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
                    background: '#fff', border: '1px solid #e0e0e0', borderRadius: 20,
                    fontSize: 9, fontWeight: 700, padding: '2px 7px', cursor: 'pointer',
                    whiteSpace: 'nowrap', color: '#666', boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                  }}>Set Main</button>
              )}

              {/* Saved badge */}
              <div style={{
                position: 'absolute', top: 4, left: 4,
                background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 8, fontWeight: 700,
                padding: '2px 5px', borderRadius: 4
              }}>SAVED</div>

              {/* Remove button */}
              <button type="button" onClick={() => onRemoveExisting(i)}
                style={{
                  position: 'absolute', top: -7, right: -7, width: 22, height: 22,
                  borderRadius: '50%', background: '#ef4444', border: '2px solid #fff',
                  color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.25)', zIndex: 2
                }}>
                <FiX size={11} />
              </button>
            </div>
          ))}

          {/* ── New files (preview, not yet uploaded) ── */}
          {newFiles.map((file, i) => {
            const isMain = images.length === 0 && i === 0;
            return (
              <div key={`new-${i}`}
                style={{ position: 'relative', width: 88, height: 88, borderRadius: 10, overflow: 'visible', flexShrink: 0 }}>
                <img src={URL.createObjectURL(file)} alt="new"
                  style={{
                    width: 88, height: 88, objectFit: 'cover', borderRadius: 10,
                    border: `2.5px solid ${isMain ? '#22c55e' : '#86efac'}`,
                    display: 'block'
                  }} />

                {/* Main/New badge */}
                <div style={{
                  position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
                  background: isMain ? '#22c55e' : '#86efac',
                  color: '#fff', fontSize: 9, fontWeight: 800,
                  padding: '2px 7px', borderRadius: 20, whiteSpace: 'nowrap'
                }}>{isMain ? '⭐ MAIN' : 'NEW'}</div>

                {/* Set as main (if not already main) */}
                {!isMain && (
                  <button type="button" onClick={() => onSetMain('new', i)}
                    title="Set as main image"
                    style={{
                      position: 'absolute', top: 4, left: 4,
                      background: 'rgba(255,255,255,0.9)', border: '1px solid #e0e0e0',
                      borderRadius: 4, fontSize: 8, fontWeight: 700, padding: '2px 5px',
                      cursor: 'pointer', color: '#555'
                    }}><FiStar size={9} /></button>
                )}

                {/* Remove */}
                <button type="button" onClick={() => onRemoveNew(i)}
                  style={{
                    position: 'absolute', top: -7, right: -7, width: 22, height: 22,
                    borderRadius: '50%', background: '#ef4444', border: '2px solid #fff',
                    color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.25)', zIndex: 2
                  }}>
                  <FiX size={11} />
                </button>
              </div>
            );
          })}

          {/* ── + Add more tile ── */}
          {allCount < 10 && (
            <button type="button" onClick={() => fileRef.current.click()}
              style={{
                width: 88, height: 88, borderRadius: 10,
                border: '2px dashed #d1d5db', background: '#fafafa',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 5, cursor: 'pointer', color: '#aaa',
                transition: 'all 0.2s', flexShrink: 0
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#aaa'; }}>
              <FiPlus size={22} />
              <span style={{ fontSize: 10, fontWeight: 600 }}>Add</span>
            </button>
          )}
        </div>
      )}

      {/* ── Drop zone (empty state) ── */}
      {allCount === 0 && (
        <div
          onClick={() => fileRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDraggingOver(true); }}
          onDragLeave={() => setDraggingOver(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${draggingOver ? 'var(--primary)' : '#d1d5db'}`,
            borderRadius: 12, padding: '36px 24px', textAlign: 'center', cursor: 'pointer',
            background: draggingOver ? 'rgba(233,69,96,0.04)' : '#fafafa',
            transition: 'all 0.2s'
          }}>
          <FiImage size={40} color={draggingOver ? 'var(--primary)' : '#ccc'} style={{ marginBottom: 12 }} />
          <div style={{ fontWeight: 700, fontSize: 15, color: draggingOver ? 'var(--primary)' : '#555', marginBottom: 6 }}>
            {draggingOver ? 'Drop images here!' : 'Click or drag & drop images'}
          </div>
          <div style={{ fontSize: 12, color: '#aaa' }}>JPG, PNG, WebP · Max 5MB each · Up to 10 images</div>
          <div style={{ marginTop: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'var(--primary)', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
              <FiUpload size={14} /> Choose Images
            </span>
          </div>
        </div>
      )}

      {/* Info tip */}
      {allCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: '#888', marginTop: 10, lineHeight: 1.5 }}>
          <FiAlertCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            <strong>⭐ MAIN</strong> = first image shown on product page.
            Click <strong>"Set Main"</strong> to reorder.
            <strong style={{ color: '#ef4444' }}> Red ✕</strong> to delete.
            <span style={{ color: '#22c55e' }}> Green = new (not yet saved)</span>.
          </span>
        </div>
      )}

      {newFiles.length > 0 && (
        <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid #86efac', borderRadius: 8, fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
          📤 {newFiles.length} new image{newFiles.length > 1 ? 's' : ''} will be uploaded when you save
        </div>
      )}

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
        onChange={e => { validateAndAdd(e.target.files); e.target.value = ''; }} />
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN ADMIN PRODUCTS PAGE
═══════════════════════════════════════════════════ */
const initialForm = {
  name: '', description: '', shortDescription: '',
  price: '', discountPrice: '', brand: '', stock: '',
  category: '', featured: false, trending: false,
  specifications: [{ key: '', value: '' }], tags: '', sku: ''
};

const AdminProducts = () => {
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showModal,   setShowModal]   = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form,        setForm]        = useState(initialForm);
  const [saving,      setSaving]      = useState(false);
  const [saveStep,    setSaveStep]    = useState(''); // progress message
  const [search,      setSearch]      = useState('');
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);

  // Image state
  const [imgExisting, setImgExisting] = useState([]); // already on server
  const [imgNew,      setImgNew]      = useState([]); // local File objects

  /* ── Fetch ── */
  useEffect(() => {
    fetchProducts();
    categoryAPI.getAll().then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, [page, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getAll({ page, limit: 15, ...(search && { search }) });
      setProducts(data.products || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  /* ── Open add modal ── */
  const openAdd = () => {
    setForm(initialForm);
    setImgExisting([]);
    setImgNew([]);
    setEditProduct(null);
    setSaveStep('');
    setShowModal(true);
  };

  /* ── Open edit modal ── */
  const openEdit = (p) => {
    setForm({
      name: p.name || '', description: p.description || '',
      shortDescription: p.shortDescription || '',
      price: p.price || '', discountPrice: p.discountPrice || '',
      brand: p.brand || '', stock: p.stock || '',
      category: p.category?._id || p.category || '',
      featured: !!p.featured, trending: !!p.trending,
      specifications: p.specifications?.length ? [...p.specifications] : [{ key: '', value: '' }],
      tags: p.tags?.join(', ') || '', sku: p.sku || ''
    });
    setImgExisting([...(p.images || [])]);
    setImgNew([]);
    setEditProduct(p);
    setSaveStep('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditProduct(null);
    setImgExisting([]);
    setImgNew([]);
    setSaveStep('');
  };

  /* ── Image handlers ── */
  const addNewFiles = (files) => setImgNew(prev => [...prev, ...files]);

  const removeExisting = async (idx) => {
    const img = imgExisting[idx];
    // If editing live product AND it has an _id, call delete API
    if (editProduct && img?._id) {
      try {
        await productAPI.deleteImage(editProduct._id, img._id);
        toast.success('Image deleted from server');
      } catch {
        // Might fail if Cloudinary not configured — just remove locally
      }
    }
    setImgExisting(prev => prev.filter((_, i) => i !== idx));
  };

  const removeNew = (idx) => setImgNew(prev => prev.filter((_, i) => i !== idx));

  // Move image to position 0 (set as main)
  const setMainImage = (type, idx) => {
    if (type === 'existing') {
      setImgExisting(prev => {
        const arr = [...prev];
        const [item] = arr.splice(idx, 1);
        return [item, ...arr];
      });
    } else {
      // If there are existing images, move this new file to front of existing
      // Otherwise just move to front of newFiles
      if (imgExisting.length > 0) {
        toast('To set a new image as main, first save the product, then reorder');
      } else {
        setImgNew(prev => {
          const arr = [...prev];
          const [item] = arr.splice(idx, 1);
          return [item, ...arr];
        });
      }
    }
  };

  /* ── Upload new images to server ── */
  const uploadImages = async (productId, files) => {
    if (!files.length) return;
    setSaveStep(`Uploading ${files.length} image(s)…`);
    const fd = new FormData();
    files.forEach(f => fd.append('images', f));
    await productAPI.uploadImages(productId, fd);
  };

  /* ── Submit (create or update) ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())  { toast.error('Product name is required'); return; }
    if (!form.price)        { toast.error('Price is required'); return; }
    if (!form.category)     { toast.error('Please select a category'); return; }
    if (!form.description.trim()) { toast.error('Description is required'); return; }

    setSaving(true);
    try {
      const payload = {
        ...form,
        price:         Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
        stock:         Number(form.stock) || 0,
        specifications: form.specifications.filter(s => s.key?.trim() && s.value?.trim()),
        tags:          form.tags.split(',').map(t => t.trim()).filter(Boolean),
        images:        imgExisting, // keep existing images (in current order)
      };

      let savedProduct;

      if (editProduct) {
        /* ── UPDATE ── */
        setSaveStep('Updating product…');
        const { data } = await productAPI.update(editProduct._id, payload);
        savedProduct = data.product;

        // Upload any newly added images
        if (imgNew.length > 0) {
          await uploadImages(savedProduct._id, imgNew);
          setSaveStep('Refreshing…');
          const { data: refreshed } = await productAPI.getOne(savedProduct._id);
          savedProduct = refreshed.product;
        }

        setProducts(prev => prev.map(p => p._id === editProduct._id ? savedProduct : p));
        toast.success('✅ Product updated!');

      } else {
        /* ── CREATE ── */
        setSaveStep('Creating product…');
        const { data } = await productAPI.create(payload);
        savedProduct = data.product;

        // Upload images for the newly created product
        if (imgNew.length > 0) {
          await uploadImages(savedProduct._id, imgNew);
          setSaveStep('Refreshing…');
          const { data: refreshed } = await productAPI.getOne(savedProduct._id);
          savedProduct = refreshed.product;
        }

        setProducts(prev => [savedProduct, ...prev]);
        toast.success('✅ Product created!');
      }

      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
      setSaveStep('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await productAPI.delete(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  /* ── Spec helpers ── */
  const addSpec    = () => setForm(f => ({ ...f, specifications: [...f.specifications, { key: '', value: '' }] }));
  const updateSpec = (i, k, v) => setForm(f => ({ ...f, specifications: f.specifications.map((s, idx) => idx === i ? { ...s, [k]: v } : s) }));
  const removeSpec = (i) => setForm(f => ({ ...f, specifications: f.specifications.filter((_, idx) => idx !== i) }));

  const iStyle = {
    width: '100%', padding: '9px 12px', border: '1.5px solid #e5e7eb',
    borderRadius: 8, fontSize: 14, fontFamily: 'inherit',
    outline: 'none', transition: 'border-color 0.2s', background: '#fff',
  };

  /* ═══════ RENDER ═══════ */
  return (
    <div>
      {/* ── Page header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Products</h1>
          <p style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
            {products.length} products on this page
          </p>
        </div>
        <button onClick={openAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {/* ── Search ── */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 420 }}>
        <FiSearch style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
        <input type="text" placeholder="Search products…" value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="form-control" style={{ paddingLeft: 42 }} />
      </div>

      {/* ── Products table ── */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ minWidth: 220 }}>Product</th>
                <th>Photos</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 44 }}>
                    <div className="spinner" style={{ margin: '0 auto' }} />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 44, color: '#aaa' }}>
                    No products found
                  </td>
                </tr>
              ) : products.map(p => (
                <tr key={p._id}>
                  {/* Product name + main image */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        {p.images?.[0]?.url ? (
                          <img src={p.images[0].url} alt={p.name}
                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 10, border: '1px solid #f0f0f0' }} />
                        ) : (
                          <div style={{ width: 50, height: 50, borderRadius: 10, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiImage size={20} color="#ccc" />
                          </div>
                        )}
                        {p.images?.length > 1 && (
                          <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#1a1a2e', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 5px', borderRadius: 6 }}>
                            +{p.images.length - 1}
                          </div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{p.brand}</div>
                      </div>
                    </div>
                  </td>

                  {/* Photo thumbnails */}
                  <td>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', maxWidth: 100 }}>
                      {(p.images || []).slice(0, 4).map((img, i) => (
                        <img key={i} src={img.url} alt=""
                          style={{ width: 26, height: 26, objectFit: 'cover', borderRadius: 5, border: i === 0 ? '2px solid #f59e0b' : '1px solid #e0e0e0' }} />
                      ))}
                      {(!p.images || p.images.length === 0) && (
                        <span style={{ fontSize: 11, color: '#ccc' }}>No photos</span>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: '#bbb', marginTop: 3 }}>
                      {p.images?.length || 0} photo{p.images?.length !== 1 ? 's' : ''}
                    </div>
                  </td>

                  <td style={{ fontSize: 13, color: '#666' }}>{p.category?.name || '—'}</td>

                  <td>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      Rs.{(p.discountPrice > 0 ? p.discountPrice : p.price)?.toLocaleString()}
                    </div>
                    {p.discountPrice > 0 && (
                      <div style={{ fontSize: 11, color: '#bbb', textDecoration: 'line-through' }}>
                        Rs.{p.price?.toLocaleString()}
                      </div>
                    )}
                  </td>

                  <td>
                    <span style={{
                      fontWeight: 700, fontSize: 14,
                      color: p.stock === 0 ? '#ef4444' : p.stock < 10 ? '#f59e0b' : '#22c55e'
                    }}>
                      {p.stock}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {p.featured && <span style={{ background: 'rgba(233,69,96,0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, width: 'fit-content' }}>⭐ Featured</span>}
                      {p.trending && <span style={{ background: 'rgba(23,162,184,0.12)', color: '#0891b2', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, width: 'fit-content' }}>🔥 Trending</span>}
                      {!p.featured && !p.trending && <span style={{ color: '#ccc', fontSize: 12 }}>—</span>}
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(p)} title="Edit"
                        style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#444' }}>
                        <FiEdit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} title="Delete"
                        style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #fca5a5', background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444' }}>
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '14px 22px', borderTop: '1px solid #f0f0f0' }}>
            <div className="pagination" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`page-btn${page === p ? ' active' : ''}`}>{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════
          ADD / EDIT MODAL
      ═══════════════════════════════════ */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#fff', borderRadius: 18,
            width: '100%', maxWidth: 780,
            maxHeight: '94vh', display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 60px rgba(0,0,0,0.25)'
          }}>
            {/* Modal header */}
            <div style={{
              padding: '18px 26px', borderBottom: '1px solid #f0f0f0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexShrink: 0, background: '#fafafa', borderRadius: '18px 18px 0 0'
            }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#1a1a2e' }}>
                  {editProduct ? '✏️  Edit Product' : '➕  Add New Product'}
                </h2>
                {editProduct && (
                  <p style={{ fontSize: 12, color: '#aaa', marginTop: 3 }}>
                    ID: {editProduct._id}
                  </p>
                )}
              </div>
              <button onClick={closeModal}
                style={{ background: '#f0f0f0', border: 'none', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                <FiX size={18} />
              </button>
            </div>

            {/* Modal form body — scrollable */}
            <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '22px 26px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                {/* ─────────── IMAGE MANAGER (full width) ─────────── */}
                <div style={{ gridColumn: 'span 2', padding: '18px', background: '#f9fafb', borderRadius: 14, border: '1px solid #f0f0f0' }}>
                  <ImageManager
                    images={imgExisting}
                    newFiles={imgNew}
                    onAddFiles={addNewFiles}
                    onRemoveExisting={removeExisting}
                    onRemoveNew={removeNew}
                    onSetMain={setMainImage}
                  />
                </div>

                {/* ─────────── BASIC FIELDS ─────────── */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#444' }}>Product Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. iPhone 15 Pro Max 256GB" style={iStyle} required
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>

                {[
                  { key: 'brand',        label: 'Brand *',           type: 'text',   placeholder: 'e.g. Apple' },
                  { key: 'sku',          label: 'SKU',               type: 'text',   placeholder: 'e.g. APL-IP15-256 (optional)' },
                  { key: 'price',        label: 'Original Price Rs. *',type: 'number', placeholder: '0' },
                  { key: 'discountPrice',label: 'Sale Price Rs.',      type: 'number', placeholder: 'Leave blank if no discount' },
                  { key: 'stock',        label: 'Stock Qty *',       type: 'number', placeholder: '0' },
                  { key: 'tags',         label: 'Tags',              type: 'text',   placeholder: 'phone, apple, 5g (comma separated)' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#444' }}>{f.label}</label>
                    <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={iStyle} required={f.label.endsWith('*')}
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </div>
                ))}

                {/* Category */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#444' }}>Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    style={{ ...iStyle }} required>
                    <option value="">— Select Category —</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>

                {/* Short Description */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#444' }}>Short Description</label>
                  <textarea rows={2} value={form.shortDescription} placeholder="Brief one-line product summary"
                    onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))}
                    style={{ ...iStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>

                {/* Full Description */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#444' }}>Full Description *</label>
                  <textarea rows={5} value={form.description} placeholder="Detailed product description…"
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    style={{ ...iStyle, resize: 'vertical' }} required
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>

                {/* Toggles */}
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: 28 }}>
                  {[
                    { key: 'featured', label: '⭐ Featured', desc: 'Show on homepage' },
                    { key: 'trending', label: '🔥 Trending', desc: 'Show in trending section' },
                  ].map(t => (
                    <label key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 16px', border: `2px solid ${form[t.key] ? 'var(--primary)' : '#e5e7eb'}`, borderRadius: 10, background: form[t.key] ? 'rgba(233,69,96,0.05)' : '#fff', transition: 'all 0.2s' }}>
                      <input type="checkbox" checked={form[t.key]}
                        onChange={e => setForm(f => ({ ...f, [t.key]: e.target.checked }))}
                        style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{t.label}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>{t.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Specifications */}
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>Specifications</label>
                      <span style={{ fontSize: 12, color: '#aaa', marginLeft: 8 }}>({form.specifications.length} rows)</span>
                    </div>
                    <button type="button" onClick={addSpec}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 13px', background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 600, color: '#555' }}>
                      <FiPlus size={13} /> Add Row
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {form.specifications.map((spec, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 36px', gap: 8 }}>
                        <input placeholder="e.g. Color" value={spec.key}
                          onChange={e => updateSpec(i, 'key', e.target.value)}
                          style={{ ...iStyle, padding: '8px 11px', fontSize: 13 }}
                          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                          onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                        <input placeholder="e.g. Midnight Black" value={spec.value}
                          onChange={e => updateSpec(i, 'value', e.target.value)}
                          style={{ ...iStyle, padding: '8px 11px', fontSize: 13 }}
                          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                          onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                        <button type="button" onClick={() => removeSpec(i)}
                          style={{ width: 36, height: 36, background: '#fff5f5', border: '1px solid #fca5a5', borderRadius: 8, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>{/* end grid */}

              {/* Save progress bar */}
              {saveStep && (
                <div style={{ marginTop: 16, padding: '10px 16px', background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: 10, fontSize: 13, color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderColor: '#bfdbfe', borderTopColor: '#1d4ed8', flexShrink: 0 }} />
                  {saveStep}
                </div>
              )}

              {/* Footer buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24, paddingTop: 20, borderTop: '1px solid #f0f0f0' }}>
                <button type="button" onClick={closeModal} disabled={saving}
                  style={{ padding: '10px 24px', border: '2px solid #e5e7eb', borderRadius: 10, background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#555' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary"
                  style={{ padding: '10px 30px', borderRadius: 10, fontSize: 15, fontWeight: 700, minWidth: 160, justifyContent: 'center' }}>
                  {saving ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                      {saveStep || 'Saving…'}
                    </span>
                  ) : editProduct ? '✓ Save Changes' : '✓ Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts