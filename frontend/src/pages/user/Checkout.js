import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiTruck, FiCheck, FiUpload, FiX } from 'react-icons/fi';
import { orderAPI, couponAPI } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const steps = ['Address', 'Payment', 'Review'];

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, subtotal, clearCart } = useCart();
  const { payment: paySet, t } = useTheme();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const fileRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [address, setAddress] = useState({
    fullName: user?.name || '', phone: '',
    addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: '', country: 'India',
  });

  useEffect(() => {
    if (paySet.cod) setPaymentMethod('cod');
    else if (paySet.receipt) setPaymentMethod('receipt');
  }, [paySet]);

  useEffect(() => {
    const def = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];
    if (def) setAddress(def);
  }, [user]);

  const shippingPrice = subtotal >= 500 ? 0 : 50;
  const taxPrice = Math.round(subtotal * 0.18 * 100) / 100;
  const discount = couponData?.discount || 0;
  const total = subtotal + shippingPrice + taxPrice - discount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await couponAPI.validate(couponCode, subtotal);
      setCouponData(data.coupon);
      toast.success(`Coupon applied! Save Rs.${data.coupon.discount.toFixed(2)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setCouponData(null);
    } finally { setCouponLoading(false); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Max file size is 5MB'); return; }
    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = e => setReceiptPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) { toast.error('Please select a payment method'); return; }
    if (paymentMethod === 'receipt' && !receiptFile) {
      toast.error('Please upload your payment receipt'); return;
    }
    setLoading(true);
    try {
      let receiptData = null;
      if (paymentMethod === 'receipt' && receiptFile) {
        // Convert to base64 to attach to order notes
        receiptData = receiptPreview;
      }

      const { data } = await orderAPI.create({
        shippingAddress: address,
        paymentMethod,
        couponCode: couponData?.code,
        notes: receiptData ? `Receipt uploaded by customer. Verify before shipping.` : undefined,
      });

      await clearCart();
      navigate(`/order-success/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  const availableMethods = [
    paySet.cod && { value: 'cod', label: 'Cash on Delivery', desc: 'Pay cash when order arrives at your door', icon: '💵' },
    paySet.receipt && { value: 'receipt', label: 'Bank Transfer', desc: 'Transfer & upload payment screenshot', icon: '🧾' },
  ].filter(Boolean);

  const SummaryBar = () => (
    <div className="card" style={{ 
      padding: isMobile ? 18 : 24, 
      position: isMobile ? 'static' : 'sticky', 
      top: 80,
      marginTop: isMobile ? 20 : 0
    }}>
      <h3 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, marginBottom: 16 }}>Price Details</h3>
      {[
        { label: `Items (${cart.items?.length})`, value: `Rs.${subtotal.toLocaleString()}` },
        { label: 'Delivery', value: shippingPrice === 0 ? 'FREE 🎉' : `Rs.${shippingPrice}`, color: shippingPrice === 0 ? 'var(--success)' : undefined },
        { label: 'Tax (18% GST)', value: `Rs.${taxPrice.toFixed(2)}` },
        ...(discount > 0 ? [{ label: 'Coupon Discount', value: `-Rs.${discount.toFixed(2)}`, color: 'var(--success)' }] : []),
      ].map(row => (
        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: isMobile ? 13 : 14 }}>
          <span style={{ color: '#666' }}>{row.label}</span>
          <span style={{ fontWeight: 600, color: row.color }}>{row.value}</span>
        </div>
      ))}
      <div style={{ borderTop: '1px dashed #e0e0e0', padding: '12px 0', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="text" placeholder="Coupon code" value={couponCode}
            onChange={e => setCouponCode(e.target.value.toUpperCase())}
            className="form-control" style={{ fontSize: isMobile ? 12 : 13 }} />
          <button onClick={applyCoupon} disabled={couponLoading} className="btn btn-outline btn-sm" style={{ whiteSpace: 'nowrap' }}>Apply</button>
        </div>
        {couponData && <div style={{ color: 'var(--success)', fontSize: 12, marginTop: 6, fontWeight: 600 }}>✓ "{couponData.code}" applied!</div>}
      </div>
      <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? 15 : 17, fontWeight: 800 }}>
          <span>Total</span>
          <span style={{ color: 'var(--primary)' }}>Rs.{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: isMobile ? 20 : 30, paddingBottom: 60 }}>
      <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 800, marginBottom: isMobile ? 20 : 28 }}>Checkout</h1>

      {/* Steps */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: isMobile ? 24 : 36, overflowX: 'auto', paddingBottom: isMobile ? 8 : 0 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 8, flexShrink: 0 }}>
              <div style={{ width: isMobile ? 30 : 34, height: isMobile ? 30 : 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i <= step ? 'var(--primary)' : '#e0e0e0', color: i <= step ? '#fff' : '#999', fontWeight: 700, fontSize: isMobile ? 12 : 14 }}>
                {i < step ? <FiCheck size={isMobile ? 14 : 16} /> : i + 1}
              </div>
              <span style={{ fontSize: isMobile ? 12 : 14, fontWeight: i === step ? 700 : 400, color: i <= step ? 'var(--dark)' : '#999', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: i < step ? 'var(--primary)' : '#e0e0e0', margin: '0 6px', minWidth: isMobile ? 8 : 12 }} />}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: isMobile ? 18 : 28 }}>
        <div>
          {/* STEP 0: Address */}
          {step === 0 && (
            <div className="card" style={{ padding: isMobile ? 18 : 28 }}>
              <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, marginBottom: isMobile ? 16 : 22, display: 'flex', alignItems: 'center', gap: 10 }}>
                <FiMapPin color="var(--primary)" /> Delivery Address
              </h3>
              {user?.addresses?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#888', marginBottom: 10 }}>SAVED ADDRESSES</div>
                  {user.addresses.map(addr => (
                    <div key={addr._id} onClick={() => setAddress(addr)} style={{ padding: isMobile ? '12px 14px' : '14px 16px', borderRadius: 10, marginBottom: 8, cursor: 'pointer', border: `2px solid ${address._id === addr._id ? 'var(--primary)' : '#e0e0e0'}`, background: address._id === addr._id ? 'rgba(233,69,96,0.04)' : '#fff' }}>
                      <div style={{ fontWeight: 600, fontSize: isMobile ? 13 : 14 }}>{addr.fullName} — {addr.phone}</div>
                      <div style={{ color: '#666', fontSize: isMobile ? 12 : 13, marginTop: 3 }}>{addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}</div>
                    </div>
                  ))}
                  <div style={{ fontSize: 12, fontWeight: 600, margin: '16px 0 10px', color: '#666' }}>Or enter new address:</div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 12 : 14 }}>
                {[
                  { key: 'fullName', label: 'Full Name', span: isMobile ? 1 : 1 },
                  { key: 'phone', label: 'Phone Number', span: isMobile ? 1 : 1 },
                  { key: 'addressLine1', label: 'Address Line 1', span: isMobile ? 1 : 2 },
                  { key: 'addressLine2', label: 'Address Line 2 (optional)', span: isMobile ? 1 : 2 },
                  { key: 'city', label: 'City', span: isMobile ? 1 : 1 },
                  { key: 'state', label: 'State', span: isMobile ? 1 : 1 },
                  { key: 'pincode', label: 'Pincode', span: isMobile ? 1 : 1 },
                  { key: 'country', label: 'Country', span: isMobile ? 1 : 1 },
                ].map(f => (
                  <div key={f.key} style={{ gridColumn: `span ${f.span}` }}>
                    <label style={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>{f.label}</label>
                    <input type="text" value={address[f.key] || ''} onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))} className="form-control" required={!f.label.includes('optional')} />
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="btn btn-primary btn-lg" style={{ marginTop: isMobile ? 18 : 24, borderRadius: 10, width: '100%' }}
                disabled={!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.pincode}>
                Continue to Payment
              </button>
            </div>
          )}

          {/* STEP 1: Payment */}
          {step === 1 && (
            <div className="card" style={{ padding: isMobile ? 18 : 28 }}>
              <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, marginBottom: isMobile ? 16 : 22, display: 'flex', alignItems: 'center', gap: 10 }}>
                <FiCreditCard color="var(--primary)" /> Payment Method
              </h3>

              {availableMethods.length === 0 ? (
                <div style={{ padding: isMobile ? 20 : 30, textAlign: 'center', color: '#dc3545', background: '#fff5f5', borderRadius: 10, fontSize: isMobile ? 13 : 14 }}>
                  ⚠️ No payment methods configured. Please contact the store admin.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {availableMethods.map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? 12 : 14, padding: isMobile ? 14 : 18, border: `2px solid ${paymentMethod === opt.value ? 'var(--primary)' : '#e0e0e0'}`, borderRadius: 12, cursor: 'pointer', background: paymentMethod === opt.value ? 'rgba(233,69,96,0.04)' : '#fff', transition: 'all 0.2s' }}>
                      <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value)} style={{ accentColor: 'var(--primary)', marginTop: 3 }} />
                      <span style={{ fontSize: isMobile ? 20 : 24, flexShrink: 0 }}>{opt.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: isMobile ? 14 : 15 }}>{opt.label}</div>
                        <div style={{ fontSize: isMobile ? 12 : 13, color: '#888', marginTop: 2, wordBreak: 'break-word' }}>{opt.desc}</div>

                        {/* Bank Transfer details + receipt upload */}
                        {opt.value === 'receipt' && paymentMethod === 'receipt' && (
                          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #f0f0f0' }}>
                            {(paySet.bankHolder || paySet.bankName || paySet.bankAcc) && (
                              <div style={{ background: '#f9f9f9', borderRadius: 10, padding: isMobile ? '12px 14px' : '14px 16px', marginBottom: 14, fontSize: isMobile ? 12 : 13 }}>
                                <div style={{ fontWeight: 700, marginBottom: 8, fontSize: isMobile ? 13 : 14 }}>Transfer to this account:</div>
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '90px 1fr' : '110px 1fr', gap: '5px 10px', lineHeight: 1.8 }}>
                                  {paySet.bankHolder && <><span style={{ color: '#888' }}>Name</span><strong style={{ wordBreak: 'break-word' }}>{paySet.bankHolder}</strong></>}
                                  {paySet.bankName && <><span style={{ color: '#888' }}>Bank</span><span style={{ wordBreak: 'break-word' }}>{paySet.bankName}</span></>}
                                  {paySet.bankAcc && <><span style={{ color: '#888' }}>Account</span><span style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: 0.5, wordBreak: 'break-all' }}>{paySet.bankAcc}</span></>}
                                  {paySet.bankIfsc && <><span style={{ color: '#888' }}>IFSC</span><span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{paySet.bankIfsc}</span></>}
                                  {paySet.bankUpi && <><span style={{ color: '#888' }}>UPI</span><span style={{ color: '#3b82f6', fontWeight: 600, wordBreak: 'break-all' }}>{paySet.bankUpi}</span></>}
                                </div>
                                {paySet.bankNote && (
                                  <div style={{ marginTop: 8, fontSize: isMobile ? 11 : 12, background: '#fff8e1', padding: '6px 10px', borderRadius: 6, color: '#666' }}>
                                    ℹ️ {paySet.bankNote}
                                  </div>
                                )}
                              </div>
                            )}

                            <div style={{ fontSize: isMobile ? 12 : 13, fontWeight: 700, marginBottom: 8 }}>
                              Upload Payment Receipt <span style={{ color: '#dc3545' }}>*</span>
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

                            {!receiptFile ? (
                              <div onClick={() => fileRef.current.click()}
                                style={{ border: '2px dashed #d1d5db', borderRadius: 10, padding: isMobile ? '16px' : '20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(233,69,96,0.03)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fff'; }}>
                                <FiUpload size={isMobile ? 22 : 26} color="#aaa" style={{ marginBottom: 6 }} />
                                <div style={{ fontWeight: 600, color: '#555', fontSize: isMobile ? 12 : 13 }}>Click to upload screenshot</div>
                                <div style={{ fontSize: isMobile ? 10 : 11, color: '#aaa', marginTop: 3 }}>JPG, PNG up to 5MB</div>
                              </div>
                            ) : (
                              <div style={{ border: '2px solid #22c55e', borderRadius: 10, padding: isMobile ? 10 : 14, display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 14, background: 'rgba(34,197,94,0.04)' }}>
                                <img src={receiptPreview} alt="Receipt" style={{ width: isMobile ? 48 : 60, height: isMobile ? 48 : 60, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontWeight: 700, fontSize: isMobile ? 12 : 13, color: '#166534' }}>✓ Receipt uploaded!</div>
                                  <div style={{ fontSize: isMobile ? 11 : 12, color: '#888', marginTop: 2, wordBreak: 'break-word' }}>{receiptFile.name}</div>
                                </div>
                                <button onClick={e => { e.stopPropagation(); e.preventDefault(); setReceiptFile(null); setReceiptPreview(null); }}
                                  style={{ background: '#fff', border: '1px solid #fca5a5', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#dc3545', flexShrink: 0 }}>
                                  <FiX size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: isMobile ? 10 : 12, marginTop: isMobile ? 18 : 24, flexDirection: isMobile ? 'column' : 'row' }}>
                <button onClick={() => setStep(0)} className="btn btn-outline btn-lg" style={{ borderRadius: 10, flex: isMobile ? 1 : undefined }}>Back</button>
                <button onClick={() => setStep(2)} disabled={!paymentMethod} className="btn btn-primary btn-lg" style={{ borderRadius: 10, flex: 1 }}>Review Order</button>
              </div>
            </div>
          )}

          {/* STEP 2: Review */}
          {step === 2 && (
            <div className="card" style={{ padding: isMobile ? 18 : 28 }}>
              <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, marginBottom: isMobile ? 16 : 22, display: 'flex', alignItems: 'center', gap: 10 }}>
                <FiTruck color="var(--primary)" /> Order Review
              </h3>
              <div style={{ background: '#f9f9f9', borderRadius: 10, padding: isMobile ? '12px 14px' : '14px 18px', marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: 0.8, marginBottom: 6 }}>DELIVERY ADDRESS</div>
                <div style={{ fontWeight: 600, fontSize: isMobile ? 13 : 14 }}>{address.fullName} — {address.phone}</div>
                <div style={{ color: '#666', fontSize: isMobile ? 12 : 13, marginTop: 2, wordBreak: 'break-word' }}>{address.addressLine1}, {address.city}, {address.state} {address.pincode}</div>
              </div>
              <div style={{ background: '#f9f9f9', borderRadius: 10, padding: isMobile ? '12px 14px' : '14px 18px', marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: 0.8, marginBottom: 6 }}>PAYMENT METHOD</div>
                <div style={{ fontWeight: 600, fontSize: isMobile ? 13 : 14 }}>{paymentMethod === 'cod' ? '💵 Cash on Delivery' : '🧾 Bank Transfer'}</div>
                {paymentMethod === 'receipt' && receiptFile && (
                  <div style={{ fontSize: isMobile ? 12 : 13, color: '#22c55e', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FiCheck size={14} /> Receipt ready: {receiptFile.name}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 14 }}>
                {cart.items?.map(item => item.product && (
                  <div key={item._id} style={{ display: 'flex', gap: isMobile ? 10 : 14, padding: '10px 0', borderBottom: '1px solid #f5f5f5', alignItems: 'flex-start' }}>
                    <img src={item.product.images?.[0]?.url} alt={item.product.name} style={{ width: isMobile ? 48 : 56, height: isMobile ? 48 : 56, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: isMobile ? 13 : 14, wordBreak: 'break-word' }}>{item.product.name}</div>
                      <div style={{ fontSize: isMobile ? 11 : 12, color: '#888' }}>Qty: {item.quantity} × Rs.{item.price}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: isMobile ? 13 : 14, flexShrink: 0 }}>Rs.{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: isMobile ? 10 : 12, marginTop: isMobile ? 18 : 24, flexDirection: isMobile ? 'column' : 'row' }}>
                <button onClick={() => setStep(1)} className="btn btn-outline btn-lg" style={{ borderRadius: 10, flex: isMobile ? 1 : undefined }}>Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn btn-primary btn-lg" style={{ flex: 1, borderRadius: 10, justifyContent: 'center', fontSize: isMobile ? 13 : 14 }}>
                  {loading ? 'Placing Order...' : `Place Order • Rs.${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>
        <SummaryBar />
      </div>
    </div>
  );
};

export default Checkout;
