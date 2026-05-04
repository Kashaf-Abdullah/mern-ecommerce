// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { FiShoppingCart, FiHeart, FiStar, FiMinus, FiPlus, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
// import { productAPI, reviewAPI } from '../../utils/api';
// import { useCart } from '../../context/CartContext';
// import { useWishlist } from '../../context/CartContext';
// import { useAuth } from '../../context/AuthContext';
// import toast from 'react-hot-toast';

// const StarRating = ({ rating, size = 16 }) => (
//   <div style={{ display: 'flex', gap: 2 }}>
//     {[1,2,3,4,5].map(s => (
//       <span key={s} style={{ color: s <= Math.round(rating) ? '#ffc107' : '#ddd', fontSize: size }}>★</span>
//     ))}
//   </div>
// );

// const ProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { addToCart } = useCart();
//   const { toggleWishlist, isWishlisted } = useWishlist();
//   const { isAuthenticated } = useAuth();
//   const [product, setProduct] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [qty, setQty] = useState(1);
//   const [tab, setTab] = useState('description');
//   const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const [pRes, rRes] = await Promise.all([
//           productAPI.getOne(id),
//           reviewAPI.getForProduct(id)
//         ]);
//         setProduct(pRes.data.product);
//         setReviews(rRes.data.reviews);
//       } catch {
//         navigate('/products');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   if (loading) return <div className="page-loading"><div className="spinner" /></div>;
//   if (!product) return null;

//   const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
//   const wished = isWishlisted(product._id);

//   const handleAddToCart = () => {
//     addToCart(product._id, qty);
//   };

//   const handleBuyNow = async () => {
//     await addToCart(product._id, qty);
//     navigate('/checkout');
//   };

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     if (!isAuthenticated) { toast.error('Please login to write a review'); return; }
//     setSubmitting(true);
//     try {
//       const { data } = await reviewAPI.create({ productId: product._id, ...reviewForm });
//       setReviews(prev => [data.review, ...prev]);
//       setReviewForm({ rating: 5, title: '', comment: '' });
//       toast.success('Review submitted!');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to submit review');
//     } finally { setSubmitting(false); }
//   };

//   return (
//     <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
//       {/* Breadcrumb */}
//       <div className="breadcrumb">
//         <a href="/">Home</a> / <a href="/products">Products</a> / <span style={{ color: '#333' }}>{product.name}</span>
//       </div>

//       {/* Main Product Section */}
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, marginBottom: 50 }}>
//         {/* Images */}
//         <div>
//           <div style={{ borderRadius: 14, overflow: 'hidden', aspectRatio: '1', background: '#f8f8f8', marginBottom: 16, border: '1px solid #e0e0e0' }}>
//             <img
//               src={product.images?.[activeImage]?.url || 'https://via.placeholder.com/600'}
//               alt={product.name}
//               style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 20 }}
//             />
//           </div>
//           {product.images?.length > 1 && (
//             <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
//               {product.images.map((img, i) => (
//                 <div key={i} onClick={() => setActiveImage(i)}
//                   style={{
//                     width: 72, height: 72, borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
//                     border: activeImage === i ? '2px solid var(--primary)' : '2px solid #e0e0e0',
//                     transition: 'border-color 0.2s'
//                   }}>
//                   <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Product Info */}
//         <div>
//           <div style={{ fontSize: 12, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>
//             {product.brand}
//           </div>
//           <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.3, marginBottom: 14 }}>{product.name}</h1>

//           {/* Rating */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
//             <StarRating rating={product.ratings} size={18} />
//             <span style={{ fontWeight: 700 }}>{product.ratings}</span>
//             <span style={{ color: 'var(--gray)', fontSize: 14 }}>({product.numReviews} reviews)</span>
//           </div>

//           {/* Price */}
//           <div style={{ background: '#f8f8f8', borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
//               <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--dark)' }}>₹{effectivePrice.toLocaleString()}</span>
//               {product.discountPrice > 0 && (
//                 <>
//                   <span style={{ fontSize: 18, color: 'var(--gray)', textDecoration: 'line-through' }}>₹{product.price.toLocaleString()}</span>
//                   <span style={{ background: 'var(--primary)', color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}>
//                     {product.discountPercent}% OFF
//                   </span>
//                 </>
//               )}
//             </div>
//             {product.discountPrice > 0 && (
//               <div style={{ color: 'var(--success)', fontSize: 14, marginTop: 6, fontWeight: 600 }}>
//                 You save ₹{(product.price - product.discountPrice).toLocaleString()}!
//               </div>
//             )}
//           </div>

//           {/* Stock */}
//           <div style={{ marginBottom: 20 }}>
//             {product.stock > 0 ? (
//               <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: 14 }}>
//                 ✓ In Stock ({product.stock} available)
//               </span>
//             ) : (
//               <span style={{ color: 'var(--danger)', fontWeight: 600, fontSize: 14 }}>✗ Out of Stock</span>
//             )}
//           </div>

//           {/* Quantity */}
//           {product.stock > 0 && (
//             <div style={{ marginBottom: 24 }}>
//               <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, display: 'block' }}>Quantity</label>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: 'fit-content', border: '2px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
//                 <button onClick={() => setQty(Math.max(1, qty - 1))}
//                   style={{ width: 42, height: 42, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
//                   <FiMinus size={16} />
//                 </button>
//                 <span style={{ width: 56, textAlign: 'center', fontWeight: 700, fontSize: 16 }}>{qty}</span>
//                 <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
//                   style={{ width: 42, height: 42, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
//                   <FiPlus size={16} />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Actions */}
//           <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
//             <button onClick={handleAddToCart} disabled={product.stock === 0}
//               className="btn btn-outline btn-lg" style={{ flex: 1, borderRadius: 10, borderWidth: 2 }}>
//               <FiShoppingCart size={18} /> Add to Cart
//             </button>
//             <button onClick={handleBuyNow} disabled={product.stock === 0}
//               className="btn btn-primary btn-lg" style={{ flex: 1, borderRadius: 10 }}>
//               Buy Now
//             </button>
//             <button onClick={() => toggleWishlist(product._id)}
//               style={{
//                 width: 52, height: 52, borderRadius: 10, border: '2px solid #e0e0e0',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 color: wished ? 'var(--primary)' : '#888', background: wished ? 'rgba(233,69,96,0.08)' : '#fff',
//                 cursor: 'pointer', transition: 'all 0.2s'
//               }}>
//               <FiHeart size={20} fill={wished ? 'currentColor' : 'none'} />
//             </button>
//           </div>

//           {/* Trust signals */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//             {[
//               { icon: <FiTruck size={16} />, text: 'Free delivery on orders above ₹500' },
//               { icon: <FiRefreshCw size={16} />, text: '7-day easy returns' },
//               { icon: <FiShield size={16} />, text: '100% Genuine product guaranteed' },
//             ].map((item, i) => (
//               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#555' }}>
//                 <span style={{ color: 'var(--primary)' }}>{item.icon}</span> {item.text}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="card" style={{ padding: 0, marginBottom: 40 }}>
//         <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
//           {['description', 'specifications', 'reviews'].map(t => (
//             <button key={t} onClick={() => setTab(t)}
//               style={{
//                 padding: '16px 24px', fontWeight: 600, fontSize: 14,
//                 background: 'none', textTransform: 'capitalize',
//                 color: tab === t ? 'var(--primary)' : '#666',
//                 borderBottom: tab === t ? '2px solid var(--primary)' : '2px solid transparent',
//                 transition: 'all 0.2s'
//               }}>
//               {t} {t === 'reviews' && `(${reviews.length})`}
//             </button>
//           ))}
//         </div>
//         <div style={{ padding: 28 }}>
//           {tab === 'description' && (
//             <p style={{ lineHeight: 1.9, color: '#444', fontSize: 15 }}>{product.description}</p>
//           )}
//           {tab === 'specifications' && (
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
//               {product.specifications?.map((spec, i) => (
//                 <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
//                   <span style={{ fontWeight: 600, minWidth: 120, fontSize: 14, color: '#888' }}>{spec.key}</span>
//                   <span style={{ fontSize: 14 }}>{spec.value}</span>
//                 </div>
//               )) || <p style={{ color: 'var(--gray)' }}>No specifications available</p>}
//             </div>
//           )}
//           {tab === 'reviews' && (
//             <div>
//               {/* Review Form */}
//               {isAuthenticated && (
//                 <form onSubmit={handleReviewSubmit} style={{ background: '#f9f9f9', padding: 20, borderRadius: 12, marginBottom: 30 }}>
//                   <h4 style={{ marginBottom: 16 }}>Write a Review</h4>
//                   <div style={{ marginBottom: 16 }}>
//                     <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Rating</label>
//                     <div style={{ display: 'flex', gap: 6 }}>
//                       {[1,2,3,4,5].map(s => (
//                         <span key={s} onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
//                           style={{ fontSize: 28, cursor: 'pointer', color: s <= reviewForm.rating ? '#ffc107' : '#ddd', transition: 'color 0.15s' }}>★</span>
//                       ))}
//                     </div>
//                   </div>
//                   <input type="text" placeholder="Review title (optional)" value={reviewForm.title}
//                     onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
//                     className="form-control" style={{ marginBottom: 12 }}
//                   />
//                   <textarea rows={4} placeholder="Share your experience..." value={reviewForm.comment}
//                     onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
//                     className="form-control" style={{ marginBottom: 16, resize: 'vertical' }} required
//                   />
//                   <button type="submit" disabled={submitting} className="btn btn-primary">
//                     {submitting ? 'Submitting...' : 'Submit Review'}
//                   </button>
//                 </form>
//               )}
//               {/* Reviews list */}
//               {reviews.length === 0 ? (
//                 <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '30px 0' }}>No reviews yet. Be the first to review!</p>
//               ) : (
//                 reviews.map(review => (
//                   <div key={review._id} style={{ padding: '20px 0', borderBottom: '1px solid #f0f0f0' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                         <img src={review.user.avatar?.url} alt={review.user.name}
//                           style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
//                         <div>
//                           <div style={{ fontWeight: 600, fontSize: 14 }}>{review.user.name}</div>
//                           <div style={{ fontSize: 12, color: 'var(--gray)' }}>{new Date(review.createdAt).toLocaleDateString()}</div>
//                         </div>
//                       </div>
//                       <StarRating rating={review.rating} size={14} />
//                     </div>
//                     {review.title && <h5 style={{ fontSize: 14, marginBottom: 6 }}>{review.title}</h5>}
//                     <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>{review.comment}</p>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiShoppingCart, FiHeart, FiMinus, FiPlus,
  FiTruck, FiShield, FiRefreshCw, FiZoomIn,
  FiX, FiChevronLeft, FiChevronRight, FiCheck
} from 'react-icons/fi';
import { productAPI, reviewAPI } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// ─── Star Rating ────────────────────────────────────────────────
const StarRating = ({ rating, size = 16, interactive = false, onSet }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(s => (
      <span
        key={s}
        onClick={() => interactive && onSet && onSet(s)}
        style={{
          color: s <= Math.round(rating) ? '#ffc107' : '#e0e0e0',
          fontSize: size,
          cursor: interactive ? 'pointer' : 'default',
          transition: 'color 0.15s'
        }}>★</span>
    ))}
  </div>
);

// ─── Lightbox Overlay ───────────────────────────────────────────
const Lightbox = ({ images, activeIdx, onClose, onPrev, onNext }) => {
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.93)',
        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
      {/* Close */}
      <button onClick={onClose}
        style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
        <FiX size={22} />
      </button>

      {/* Counter */}
      <div style={{ position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600 }}>
        {activeIdx + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button onClick={e => { e.stopPropagation(); onPrev(); }}
          style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 50, height: 50, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiChevronLeft size={26} />
        </button>
      )}

      {/* Image */}
      <img
        src={images[activeIdx]?.url}
        alt=""
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '88vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
      />

      {/* Next */}
      {images.length > 1 && (
        <button onClick={e => { e.stopPropagation(); onNext(); }}
          style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 50, height: 50, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiChevronRight size={26} />
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
          {images.map((img, i) => (
            <div key={i} onClick={e => { e.stopPropagation(); }}
              style={{ width: i === activeIdx ? 52 : 44, height: i === activeIdx ? 52 : 44, borderRadius: 8, overflow: 'hidden', border: `2px solid ${i === activeIdx ? '#fff' : 'rgba(255,255,255,0.3)'}`, cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
              onClick={e => { e.stopPropagation(); onNext(i); }}>
              <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          productAPI.getOne(id),
          reviewAPI.getForProduct(id)
        ]);
        setProduct(pRes.data.product);
        setReviews(rRes.data.reviews);
      } catch {
        navigate('/products');
      } finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  const prevImage = (jumpTo) => {
    if (typeof jumpTo === 'number') { setActiveImage(jumpTo); return; }
    setActiveImage(i => (i - 1 + (product?.images?.length || 1)) % (product?.images?.length || 1));
  };
  const nextImage = (jumpTo) => {
    if (typeof jumpTo === 'number') { setActiveImage(jumpTo); return; }
    setActiveImage(i => (i + 1) % (product?.images?.length || 1));
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleAddToCart = () => addToCart(product._id, qty);
  const handleBuyNow = async () => { await addToCart(product._id, qty); navigate('/checkout'); };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to write a review'); return; }
    setSubmitting(true);
    try {
      const { data } = await reviewAPI.create({ productId: product._id, ...reviewForm });
      setReviews(prev => [data.review, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (!product) return null;

  const images = product.images || [];
  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const wished = isWishlisted(product._id);
  const savings = product.discountPrice > 0 ? product.price - product.discountPrice : 0;

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <Lightbox
          images={images}
          activeIdx={activeImage}
          onClose={() => setLightboxOpen(false)}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span style={{ color: '#333', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
      </div>

      {/* ── Main Product Section ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, marginBottom: 50 }}>

        {/* ── IMAGE GALLERY ── */}
        <div>
          {/* Main image with zoom */}
          <div
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setLightboxOpen(true)}
            style={{
              borderRadius: 16, overflow: 'hidden',
              aspectRatio: '1', background: '#f8f8f8',
              border: '1px solid #e8e8e8',
              marginBottom: 14, position: 'relative', cursor: 'zoom-in'
            }}>
            {/* Main image */}
            <img
              src={images[activeImage]?.url || 'https://via.placeholder.com/600?text=No+Image'}
              alt={product.name}
              style={{
                width: '100%', height: '100%', objectFit: 'contain', padding: 16,
                transition: zoom ? 'none' : 'transform 0.3s',
                transform: zoom ? `scale(1.8)` : 'scale(1)',
                transformOrigin: zoom ? `${mousePos.x}% ${mousePos.y}%` : 'center center',
              }}
            />
            {/* Zoom hint */}
            {!zoom && images.length > 0 && (
              <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '6px 10px', borderRadius: 8, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                <FiZoomIn size={13} /> Hover to zoom
              </div>
            )}
            {/* Discount badge */}
            {product.discountPercent > 0 && (
              <div style={{ position: 'absolute', top: 14, left: 14, background: 'var(--primary)', color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}>
                -{product.discountPercent}%
              </div>
            )}
            {/* Nav arrows (only if >1 image) */}
            {images.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); prevImage(); }}
                  style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <FiChevronLeft size={18} />
                </button>
                <button onClick={e => { e.stopPropagation(); nextImage(); }}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <FiChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <div key={i} onClick={() => setActiveImage(i)}
                  style={{
                    width: 68, height: 68, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                    border: `2px solid ${activeImage === i ? 'var(--primary)' : '#e0e0e0'}`,
                    transition: 'border-color 0.2s', position: 'relative'
                  }}>
                  <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {activeImage === i && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(233,69,96,0.1)' }} />
                  )}
                </div>
              ))}
              {/* Fullscreen button */}
              <div onClick={() => setLightboxOpen(true)}
                style={{
                  width: 68, height: 68, borderRadius: 10, border: '2px dashed #d1d5db',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#aaa', gap: 4, flexShrink: 0,
                  background: '#fafafa'
                }}>
                <FiZoomIn size={18} />
                <span style={{ fontSize: 10, fontWeight: 600 }}>View All</span>
              </div>
            </div>
          )}

          {/* No image placeholder */}
          {images.length === 0 && (
            <div style={{ textAlign: 'center', color: '#ccc', paddingTop: 10, fontSize: 13 }}>No images uploaded</div>
          )}
        </div>

        {/* ── PRODUCT INFO ── */}
        <div>
          {/* Brand */}
          <div style={{ fontSize: 12, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 700, marginBottom: 8 }}>
            {product.brand}
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.3, marginBottom: 14 }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <StarRating rating={product.ratings} size={18} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>{product.ratings}</span>
            <span style={{ color: 'var(--gray)', fontSize: 14 }}>({product.numReviews} reviews)</span>
          </div>

          {/* Price box */}
          <div style={{ background: '#f8f8f8', borderRadius: 14, padding: '18px 22px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 34, fontWeight: 800, color: 'var(--dark)' }}>
                ₹{effectivePrice.toLocaleString()}
              </span>
              {savings > 0 && (
                <>
                  <span style={{ fontSize: 18, color: 'var(--gray)', textDecoration: 'line-through' }}>
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span style={{ background: 'var(--primary)', color: '#fff', padding: '4px 12px', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>
                    {product.discountPercent}% OFF
                  </span>
                </>
              )}
            </div>
            {savings > 0 && (
              <div style={{ color: 'var(--success)', fontSize: 14, marginTop: 8, fontWeight: 600 }}>
                🎉 You save ₹{savings.toLocaleString()}!
              </div>
            )}
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7, marginBottom: 18 }}>
              {product.shortDescription}
            </p>
          )}

          {/* Stock */}
          <div style={{ marginBottom: 20 }}>
            {product.stock > 0 ? (
              <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiCheck size={16} /> In Stock ({product.stock} available)
              </span>
            ) : (
              <span style={{ color: 'var(--danger)', fontWeight: 600, fontSize: 14 }}>✗ Out of Stock</span>
            )}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, display: 'block' }}>Quantity</label>
              <div style={{ display: 'flex', alignItems: 'center', width: 'fit-content', border: '2px solid #e0e0e0', borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{ width: 44, height: 44, background: '#f5f5f5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiMinus size={16} />
                </button>
                <span style={{ width: 56, textAlign: 'center', fontWeight: 700, fontSize: 17 }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  style={{ width: 44, height: 44, background: '#f5f5f5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiPlus size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              style={{
                flex: 1, padding: '14px 0', borderRadius: 12, fontWeight: 700, fontSize: 15,
                background: '#fff', color: 'var(--dark)', border: '2px solid var(--dark)',
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: product.stock === 0 ? 0.5 : 1, transition: 'all 0.2s'
              }}
              onMouseEnter={e => { if (product.stock > 0) { e.currentTarget.style.background = 'var(--dark)'; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--dark)'; }}>
              <FiShoppingCart size={18} /> Add to Cart
            </button>

            <button onClick={handleBuyNow} disabled={product.stock === 0}
              className="btn btn-primary"
              style={{ flex: 1, padding: '14px 0', borderRadius: 12, fontWeight: 700, fontSize: 15, justifyContent: 'center', opacity: product.stock === 0 ? 0.5 : 1 }}>
              Buy Now
            </button>

            <button onClick={() => toggleWishlist(product._id)}
              style={{
                width: 54, height: 54, borderRadius: 12, border: `2px solid ${wished ? 'var(--primary)' : '#e0e0e0'}`,
                background: wished ? 'rgba(233,69,96,0.08)' : '#fff',
                color: wished ? 'var(--primary)' : '#888',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
              }}>
              <FiHeart size={20} fill={wished ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Trust signals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
            {[
              { icon: <FiTruck size={16} />, text: 'Free delivery on orders above ₹500' },
              { icon: <FiRefreshCw size={16} />, text: '7-day easy returns and exchange' },
              { icon: <FiShield size={16} />, text: '100% Genuine product guaranteed' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#555' }}>
                <span style={{ color: 'var(--primary)', flexShrink: 0 }}>{item.icon}</span> {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs: Description / Specs / Reviews ── */}
      <div className="card" style={{ padding: 0, marginBottom: 40 }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
          {['description', 'specifications', 'reviews'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: '16px 26px', fontWeight: 600, fontSize: 14, background: 'none', border: 'none',
                textTransform: 'capitalize', cursor: 'pointer',
                color: tab === t ? 'var(--primary)' : '#666',
                borderBottom: `3px solid ${tab === t ? 'var(--primary)' : 'transparent'}`,
                transition: 'all 0.2s'
              }}>
              {t === 'reviews' ? `Reviews (${reviews.length})` : t}
            </button>
          ))}
        </div>

        <div style={{ padding: 28 }}>
          {/* Description */}
          {tab === 'description' && (
            <p style={{ lineHeight: 1.9, color: '#444', fontSize: 15 }}>{product.description}</p>
          )}

          {/* Specifications */}
          {tab === 'specifications' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 40px' }}>
              {product.specifications?.length > 0 ? product.specifications.map((spec, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontWeight: 600, minWidth: 130, fontSize: 14, color: '#888' }}>{spec.key}</span>
                  <span style={{ fontSize: 14, color: '#333' }}>{spec.value}</span>
                </div>
              )) : (
                <p style={{ color: 'var(--gray)', gridColumn: 'span 2' }}>No specifications available</p>
              )}
            </div>
          )}

          {/* Reviews */}
          {tab === 'reviews' && (
            <div>
              {/* Write a review */}
              {isAuthenticated && (
                <form onSubmit={handleReviewSubmit}
                  style={{ background: '#f9f9f9', padding: 22, borderRadius: 14, marginBottom: 30, border: '1px solid #f0f0f0' }}>
                  <h4 style={{ marginBottom: 16, fontSize: 16 }}>Write a Review</h4>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>Your Rating</label>
                    <StarRating rating={reviewForm.rating} size={30} interactive onSet={r => setReviewForm(f => ({ ...f, rating: r }))} />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>Title (optional)</label>
                    <input type="text" placeholder="Summarize your review" value={reviewForm.title}
                      onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                      className="form-control" />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>Your Review *</label>
                    <textarea rows={4} placeholder="Share your experience with this product..."
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                      className="form-control" style={{ resize: 'vertical' }} required />
                  </div>

                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews list */}
              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--gray)', padding: '30px 0', fontSize: 15 }}>
                  No reviews yet. Be the first to review!
                </div>
              ) : reviews.map(review => (
                <div key={review._id} style={{ padding: '20px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={review.user.avatar?.url || 'https://via.placeholder.com/36?text=U'} alt={review.user.name}
                        style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #f0f0f0' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{review.user.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray)', marginTop: 2 }}>
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size={15} />
                  </div>
                  {review.title && <h5 style={{ fontSize: 14, marginBottom: 6, color: '#333' }}>{review.title}</h5>}
                  <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail