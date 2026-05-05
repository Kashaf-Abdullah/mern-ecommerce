import React, { useState, useEffect, useRef } from 'react';
import { FiSave, FiRefreshCw, FiCopy, FiCheck, FiEye } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const PRESETS = [
  { name: 'Default', primary: '#e94560', secondary: '#1a1a2e', bg: '#f8f9fa', nav: '#ffffff', footer: '#1a1a2e', card: '#ffffff', text: '#1a1a2e' },
  { name: 'Ocean', primary: '#0ea5e9', secondary: '#0f172a', bg: '#f0f9ff', nav: '#ffffff', footer: '#0f172a', card: '#ffffff', text: '#0f172a' },
  { name: 'Forest', primary: '#16a34a', secondary: '#14532d', bg: '#f0fdf4', nav: '#ffffff', footer: '#14532d', card: '#ffffff', text: '#14532d' },
  { name: 'Royal', primary: '#7c3aed', secondary: '#1e1b4b', bg: '#faf5ff', nav: '#ffffff', footer: '#1e1b4b', card: '#ffffff', text: '#1e1b4b' },
  { name: 'Sunset', primary: '#f97316', secondary: '#431407', bg: '#fff7ed', nav: '#ffffff', footer: '#431407', card: '#ffffff', text: '#1c1917' },
  { name: 'Dark Mode', primary: '#f59e0b', secondary: '#111827', bg: '#111827', nav: '#1f2937', footer: '#030712', card: '#1f2937', text: '#f9fafb' },
];

const TEXT_SECTIONS = {
  'Homepage': [
    { key: 'heroTitle', label: 'Hero Title' },
    { key: 'heroSubtitle', label: 'Hero Subtitle', multiline: true },
    { key: 'heroBtn1', label: 'Hero Button 1' },
    { key: 'heroBtn2', label: 'Hero Button 2' },
    { key: 'featuredTitle', label: 'Featured Section Title' },
    { key: 'trendingTitle', label: 'Trending Section Title' },
    { key: 'promoBannerTitle', label: 'Promo Banner Title' },
    { key: 'promoBannerText', label: 'Promo Banner Text', multiline: true },
    { key: 'promoBtn', label: 'Promo Button' },
  ],
  'Navbar & Footer': [
    { key: 'announcementBar', label: 'Announcement Bar', multiline: true },
    { key: 'footerTagline', label: 'Footer Tagline', multiline: true },
    { key: 'copyright', label: 'Copyright Text' },
  ],
  'Product Page': [
    { key: 'addToCartBtn', label: 'Add to Cart Button' },
    { key: 'buyNowBtn', label: 'Buy Now Button' },
    { key: 'outOfStockText', label: 'Out of Stock Text' },
    { key: 'freeDeliveryText', label: 'Free Delivery Text' },
    { key: 'returnsText', label: 'Returns Text' },
    { key: 'guaranteeText', label: 'Guarantee Text' },
  ],
};

const SectionCard = ({ title, children }) => (
  <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12, marginBottom: 16, overflow: 'hidden' }}>
    <div style={{ padding: '14px 20px', borderBottom: '1px solid #f5f5f5', fontWeight: 700, fontSize: 15 }}>{title}</div>
    <div style={{ padding: '8px 20px 16px' }}>{children}</div>
  </div>
);

const FieldRow = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '10px 0', borderBottom: '1px solid #f9f9f9' }}>
    <label style={{ fontSize: 13, color: '#666', minWidth: 180, paddingTop: 8 }}>{label}</label>
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

const inputStyle = {
  width: '100%', padding: '9px 12px', border: '2px solid #e0e0e0',
  borderRadius: 8, fontSize: 14, fontFamily: 'inherit',
  background: '#fff', color: '#1a1a2e', outline: 'none',
};

const AdminSettings = () => {
  const { theme, texts, payment, saveTheme, saveTexts, savePayment, t } = useTheme();
  const [tab, setTab] = useState('theme');
  const [localTheme, setLocalTheme] = useState({
    primary: '#e94560',
    secondary: '#1a1a2e',
    bg: '#f8f9fa',
    nav: '#ffffff',
    footer: '#1a1a2e',
    card: '#ffffff',
    text: '#1a1a2e',
    radius: '12px',
    font: "'DM Sans', sans-serif",
    btnStyle: 'filled',
    logoType: 'text',
    logoText: 'ShopNow',
    logoImage: null,
    logoSize: 'medium',
    logoMaxWidth: 200,
    logoMaxHeight: 60,
    ...theme
  });
  const [localTexts, setLocalTexts] = useState({ ...texts });
  const [localPayment, setLocalPayment] = useState({ ...payment });
  const [copied, setCopied] = useState(false);

  // Update local state when theme/texts/payment change
  useEffect(() => {
    setLocalTheme({ ...theme });
  }, [theme]);

  useEffect(() => {
    setLocalTexts({ ...texts });
  }, [texts]);

  useEffect(() => {
    setLocalPayment({ ...payment });
  }, [payment]);

  const updateLocalTheme = (key, val) => setLocalTheme(p => ({ ...p, [key]: val }));
  const updateLocalText = (key, val) => setLocalTexts(p => ({ ...p, [key]: val }));
  const updateLocalPayment = (key, val) => setLocalPayment(p => ({ ...p, [key]: val }));

  const applyPreset = (preset) => {
    const updated = { ...localTheme, ...preset };
    setLocalTheme(updated);
  };

  const handleSaveTheme = () => {
    saveTheme(localTheme);
    toast.success('Theme saved & applied!');
  };

  const handleSaveTexts = () => {
    saveTexts(localTexts);
    toast.success('Text content saved!');
  };

  const handleSavePayment = () => {
    if (!localPayment.cod && !localPayment.receipt) {
      toast.error('Please enable at least one payment method');
      return;
    }
    savePayment(localPayment);
    toast.success('Payment settings saved!');
  };

  const copyCSS = () => {
    const css = `:root {\n  --primary: ${localTheme.primary};\n  --secondary: ${localTheme.secondary};\n  --bg: ${localTheme.bg};\n  --nav-bg: ${localTheme.nav};\n  --footer-bg: ${localTheme.footer};\n  --card-bg: ${localTheme.card};\n  --text-color: ${localTheme.text};\n  --radius: ${localTheme.radius};\n  font-family: ${localTheme.font};\n}`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    toast.success('CSS variables copied!');
  };

  const resetTexts = () => {
    if (!window.confirm('Reset all text to defaults?')) return;
    const defaults = {
      heroTitle: 'Discover Amazing Products Today',
      heroSubtitle: 'Shop the latest trends with unbeatable prices.',
      heroBtn1: 'Shop Now', heroBtn2: 'View Deals',
      featuredTitle: 'Featured Products', trendingTitle: '🔥 Trending Now',
      promoBannerTitle: 'Special Offer 🎉', promoBannerText: 'Get up to 50% off on selected items.',
      promoBtn: 'Grab the Deal', addToCartBtn: 'Add to Cart', buyNowBtn: 'Buy Now',
      outOfStockText: 'Out of Stock', copyright: '© 2024 ShopNow. All rights reserved.',
      freeDeliveryText: 'Free delivery on orders above ₹500', returnsText: '7-day easy returns',
      guaranteeText: '100% Genuine product guaranteed',
      footerTagline: 'Your one-stop shop for everything you need.',
      announcementBar: '🚚 Free shipping on orders above ₹500',
    };
    setLocalTexts(defaults);
    saveTexts(defaults);
    toast.success('Text reset to defaults');
  };

  const ColorPicker = ({ label, subtitle, themeKey }) => (
    <FieldRow label={label}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input type="color" value={localTheme[themeKey] || '#000000'}
          onChange={e => updateLocalTheme(themeKey, e.target.value)}
          style={{ width: 44, height: 34, border: '2px solid #e0e0e0', borderRadius: 8, padding: 2, cursor: 'pointer' }} />
        <input type="text" value={localTheme[themeKey] || ''}
          onChange={e => updateLocalTheme(themeKey, e.target.value)}
          style={{ ...inputStyle, width: 110, padding: '7px 10px', fontFamily: 'monospace', fontSize: 13 }} />
        {subtitle && <span style={{ fontSize: 12, color: '#aaa' }}>{subtitle}</span>}
      </div>
    </FieldRow>
  );

  const tabs = [
    { id: 'theme', label: '🎨 Theme Colors' },
    { id: 'logo', label: '🏷️ Logo & Branding' },
    { id: 'text', label: '✏️ Text & Content' },
    { id: 'payment', label: '💳 Payment Methods' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Store Settings</h1>
        <p style={{ color: 'var(--gray)', fontSize: 14, marginTop: 4 }}>Customize your store's appearance, content & payment</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #f0f0f0', marginBottom: 24 }}>
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            style={{
              padding: '10px 20px', fontWeight: tab === tb.id ? 700 : 500, fontSize: 14,
              background: 'none', border: 'none', cursor: 'pointer',
              color: tab === tb.id ? 'var(--primary)' : '#666',
              borderBottom: `3px solid ${tab === tb.id ? 'var(--primary)' : 'transparent'}`,
              marginBottom: -2, transition: 'all 0.2s'
            }}>{tb.label}</button>
        ))}
      </div>

      {/* ===== THEME TAB ===== */}
      {tab === 'theme' && (
        <div>
          <SectionCard title="Quick Presets">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingTop: 10 }}>
              {PRESETS.map(p => (
                <button key={p.name} onClick={() => applyPreset(p)}
                  style={{
                    padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                    background: p.bg, color: p.text,
                    border: localTheme.primary === p.primary ? `2px solid ${p.primary}` : '2px solid #e0e0e0',
                    fontWeight: localTheme.primary === p.primary ? 700 : 400,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderLeft: `5px solid ${p.primary}`, transition: 'all 0.2s'
                  }}>
                  {p.name}
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Brand Colors">
            <ColorPicker label="Primary Color" subtitle="Buttons, badges, accents" themeKey="primary" />
            <ColorPicker label="Secondary Color" subtitle="Dark sections, headers" themeKey="secondary" />
            <ColorPicker label="Page Background" themeKey="bg" />
            <ColorPicker label="Navbar Background" themeKey="nav" />
            <ColorPicker label="Footer Background" themeKey="footer" />
            <ColorPicker label="Card Background" themeKey="card" />
            <ColorPicker label="Text Color" themeKey="text" />
          </SectionCard>

          <SectionCard title="Typography & Style">
            <FieldRow label="Font Family">
              <select value={localTheme.font} onChange={e => updateLocalTheme('font', e.target.value)}
                style={{ ...inputStyle, width: 240 }}>
                <option value="'DM Sans', sans-serif">DM Sans</option>
                <option value="'Inter', sans-serif">Inter</option>
                <option value="'Poppins', sans-serif">Poppins</option>
                <option value="'Nunito', sans-serif">Nunito</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="Georgia, serif">Georgia (Serif)</option>
              </select>
            </FieldRow>
            <FieldRow label="Border Radius">
              <select value={localTheme.radius} onChange={e => updateLocalTheme('radius', e.target.value)}
                style={{ ...inputStyle, width: 200 }}>
                <option value="4px">Sharp (4px)</option>
                <option value="8px">Soft (8px)</option>
                <option value="12px">Rounded (12px)</option>
                <option value="20px">Pill (20px)</option>
              </select>
            </FieldRow>
            <FieldRow label="Button Style">
              <select value={localTheme.btnStyle || 'filled'} onChange={e => updateLocalTheme('btnStyle', e.target.value)}
                style={{ ...inputStyle, width: 200 }}>
                <option value="filled">Filled (Solid)</option>
                <option value="outline">Outline</option>
                <option value="soft">Soft (Light Fill)</option>
              </select>
            </FieldRow>
          </SectionCard>

          {/* Live Preview */}
          <SectionCard title="Live Preview">
            <div style={{ background: '#f5f5f5', borderRadius: 12, padding: 16 }}>
              <div style={{ background: localTheme.nav, padding: '12px 20px', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <span style={{ fontWeight: 800, fontSize: 20, color: localTheme.primary }}>{localTheme.logoText || localTexts.storeName || 'ShopNow'}</span>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['Add to Cart', 'Buy Now'].map((btn, i) => (
                    <span key={btn} style={{
                      padding: '8px 16px', borderRadius: localTheme.radius, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      ...(localTheme.btnStyle === 'outline'
                        ? { background: 'transparent', color: i === 0 ? localTheme.primary : localTheme.secondary, border: `2px solid ${i === 0 ? localTheme.primary : localTheme.secondary}` }
                        : localTheme.btnStyle === 'soft'
                          ? { background: (i === 0 ? localTheme.primary : localTheme.secondary) + '22', color: i === 0 ? localTheme.primary : localTheme.secondary, border: 'none' }
                          : { background: i === 0 ? localTheme.primary : localTheme.secondary, color: '#fff', border: 'none' })
                    }}>{btn}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                {[1, 2, 3].map(n => (
                  <div key={n} style={{ background: localTheme.card, borderRadius: localTheme.radius, padding: 14, flex: 1, border: '1px solid #e0e0e0' }}>
                    <div style={{ height: 80, background: '#f0f0f0', borderRadius: 8, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🛍️</div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: localTheme.text, marginBottom: 4 }}>Product {n}</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: localTheme.primary }}>₹{999 * n}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: localTheme.footer, borderRadius: 10, padding: '14px 20px', marginTop: 14, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                {localTexts.copyright || '© 2024 ShopNow'}
              </div>
            </div>
          </SectionCard>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button onClick={copyCSS} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {copied ? <><FiCheck size={14} /> Copied!</> : <><FiCopy size={14} /> Copy CSS</>}
            </button>
            <button onClick={handleSaveTheme} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiSave size={15} /> Save & Apply Theme
            </button>
          </div>
        </div>
      )}

      {/* ===== LOGO TAB ===== */}
      {tab === 'logo' && (
        <div>
          <SectionCard title="Logo Type">
            <FieldRow label="Logo Display Type">
              <div style={{ display: 'flex', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" name="logoType" value="text"
                    checked={localTheme.logoType === 'text'}
                    onChange={e => updateLocalTheme('logoType', e.target.value)} />
                  <span>Text Only</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" name="logoType" value="image"
                    checked={localTheme.logoType === 'image'}
                    onChange={e => updateLocalTheme('logoType', e.target.value)} />
                  <span>Image Only</span>
                </label>
              </div>
            </FieldRow>
          </SectionCard>

          {localTheme.logoType === 'text' && (
            <SectionCard title="Text Logo Settings">
              <FieldRow label="Logo Text">
                <input type="text" value={localTheme.logoText || ''}
                  onChange={e => updateLocalTheme('logoText', e.target.value)}
                  placeholder="Enter your store name"
                  style={inputStyle} />
              </FieldRow>
            </SectionCard>
          )}

          {localTheme.logoType === 'image' && (
            <SectionCard title="Image Logo Settings">
              <FieldRow label="Current Logo">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {localTheme.logoImage ? (
                    <img src={localTheme.logoImage.url} alt="Logo"
                      style={{ maxWidth: 150, maxHeight: 60, objectFit: 'contain', border: '1px solid #e0e0e0', borderRadius: 8, padding: 8 }} />
                  ) : (
                    <div style={{ width: 150, height: 60, border: '2px dashed #e0e0e0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 12 }}>
                      No logo uploaded
                    </div>
                  )}
                  <div>
                    <input type="file" accept="image/*" id="logoUpload" style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const formData = new FormData();
                        formData.append('logo', file);

                        try {
                          const response = await fetch('/api/upload/logo', {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                            body: formData
                          });
                          const data = await response.json();
                          if (data.success) {
                            updateLocalTheme('logoImage', data.logo);
                            toast.success('Logo uploaded successfully!');
                          } else {
                            toast.error('Failed to upload logo');
                          }
                        } catch (error) {
                          toast.error('Upload failed');
                        }
                      }} />
                    <label htmlFor="logoUpload" style={{
                      padding: '8px 16px', background: localTheme.primary, color: '#fff', borderRadius: 8,
                      cursor: 'pointer', fontSize: 14, display: 'inline-block'
                    }}>
                      {localTheme.logoImage ? 'Change Logo' : 'Upload Logo'}
                    </label>
                    {localTheme.logoImage && (
                      <button onClick={() => updateLocalTheme('logoImage', null)}
                        style={{ marginLeft: 8, padding: '8px 16px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </FieldRow>
            </SectionCard>
          )}

          <SectionCard title="Logo Size & Responsiveness">
            <FieldRow label="Logo Size Preset">
              <select value={localTheme.logoSize || 'medium'}
                onChange={e => updateLocalTheme('logoSize', e.target.value)}
                style={{ ...inputStyle, width: 200 }}>
                <option value="small">Small (120x40px max)</option>
                <option value="medium">Medium (200x60px max)</option>
                <option value="large">Large (300x80px max)</option>
                <option value="custom">Custom Size</option>
              </select>
            </FieldRow>

            {localTheme.logoSize === 'custom' && (
              <>
                <FieldRow label="Max Width (px)">
                  <input type="number" value={localTheme.logoMaxWidth || 200}
                    onChange={e => updateLocalTheme('logoMaxWidth', parseInt(e.target.value) || 200)}
                    min="50" max="500" style={{ ...inputStyle, width: 120 }} />
                </FieldRow>
                <FieldRow label="Max Height (px)">
                  <input type="number" value={localTheme.logoMaxHeight || 60}
                    onChange={e => updateLocalTheme('logoMaxHeight', parseInt(e.target.value) || 60)}
                    min="20" max="200" style={{ ...inputStyle, width: 120 }} />
                </FieldRow>
              </>
            )}
          </SectionCard>

          {/* Logo Preview */}
          <SectionCard title="Logo Preview">
            <div style={{ background: localTheme.nav, borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: localTheme.text }}>Navbar Preview:</div>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                color: localTheme.primary,
                display: 'flex',
                alignItems: 'center',
                maxWidth: localTheme.logoSize === 'small' ? 120 : localTheme.logoSize === 'medium' ? 200 : localTheme.logoSize === 'large' ? 300 : localTheme.logoMaxWidth,
                maxHeight: localTheme.logoSize === 'small' ? 40 : localTheme.logoSize === 'medium' ? 60 : localTheme.logoSize === 'large' ? 80 : localTheme.logoMaxHeight,
              }}>
                {localTheme.logoType === 'image' && localTheme.logoImage ? (
                  <img src={localTheme.logoImage.url} alt="Logo"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }} />
                ) : (
                  <span style={{
                    fontSize: localTheme.logoSize === 'small' ? 18 : localTheme.logoSize === 'medium' ? 22 : localTheme.logoSize === 'large' ? 26 : 22,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {localTheme.logoText || 'ShopNow'}
                  </span>
                )}
              </div>
            </div>
          </SectionCard>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleSaveTheme} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiSave size={15} /> Save Logo Settings
            </button>
          </div>
        </div>
      )}

      {/* ===== TEXT TAB ===== */}
      {tab === 'text' && (
        <div>
          {Object.entries(TEXT_SECTIONS).map(([section, fields]) => (
            <SectionCard key={section} title={section}>
              {fields.map(f => (
                <FieldRow key={f.key} label={f.label}>
                  {f.multiline ? (
                    <textarea rows={3} value={localTexts[f.key] || ''}
                      onChange={e => updateLocalText(f.key, e.target.value)}
                      style={{ ...inputStyle, resize: 'vertical' }} />
                  ) : (
                    <input type="text" value={localTexts[f.key] || ''}
                      onChange={e => updateLocalText(f.key, e.target.value)}
                      style={inputStyle} />
                  )}
                </FieldRow>
              ))}
            </SectionCard>
          ))}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button onClick={resetTexts} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiRefreshCw size={14} /> Reset Defaults
            </button>
            <button onClick={handleSaveTexts} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiSave size={15} /> Save Text
            </button>
          </div>
        </div>
      )}

      {/* ===== PAYMENT TAB ===== */}
      {tab === 'payment' && (
        <div>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
            Choose which payment methods customers can use at checkout.
          </p>

          {/* COD */}
          <div style={{
            border: `2px solid ${localPayment.cod ? '#22c55e' : '#e0e0e0'}`,
            borderRadius: 12, padding: 20, marginBottom: 16,
            background: localPayment.cod ? 'rgba(34,197,94,0.04)' : '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>💵</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Cash on Delivery (COD)</div>
                  <div style={{ fontSize: 13, color: '#666', marginTop: 3 }}>Customer pays cash when order arrives at their door.</div>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <span style={{ fontSize: 13, color: '#666' }}>Enable</span>
                <div onClick={() => updateLocalPayment('cod', !localPayment.cod)}
                  style={{
                    width: 44, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                    background: localPayment.cod ? '#22c55e' : '#ccc'
                  }}>
                  <div style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff', top: 3, left: localPayment.cod ? 23 : 3, transition: 'left 0.2s' }} />
                </div>
              </label>
            </div>
            {localPayment.cod && (
              <div style={{ background: 'rgba(34,197,94,0.1)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#166534', display: 'flex', gap: 8, alignItems: 'center' }}>
                ✓ COD is active — customers can pay when order is delivered
              </div>
            )}
          </div>

          {/* Receipt Upload */}
          <div style={{
            border: `2px solid ${localPayment.receipt ? '#3b82f6' : '#e0e0e0'}`,
            borderRadius: 12, padding: 20, marginBottom: 16,
            background: localPayment.receipt ? 'rgba(59,130,246,0.04)' : '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🧾</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Bank Transfer + Receipt Upload</div>
                  <div style={{ fontSize: 13, color: '#666', marginTop: 3 }}>Customer transfers to your bank & uploads receipt screenshot. You verify before shipping.</div>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <span style={{ fontSize: 13, color: '#666' }}>Enable</span>
                <div onClick={() => updateLocalPayment('receipt', !localPayment.receipt)}
                  style={{
                    width: 44, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                    background: localPayment.receipt ? '#3b82f6' : '#ccc'
                  }}>
                  <div style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff', top: 3, left: localPayment.receipt ? 23 : 3, transition: 'left 0.2s' }} />
                </div>
              </label>
            </div>

            {localPayment.receipt && (
              <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 18, marginTop: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Your Bank Account Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { key: 'bankHolder', label: 'Account Holder Name', placeholder: 'e.g. Ramesh Kumar', span: 2 },
                    { key: 'bankName', label: 'Bank Name', placeholder: 'e.g. State Bank of India' },
                    { key: 'bankAcc', label: 'Account Number', placeholder: 'e.g. 1234567890' },
                    { key: 'bankIfsc', label: 'IFSC / Routing Code', placeholder: 'e.g. SBIN0001234' },
                    { key: 'bankUpi', label: 'UPI ID (optional)', placeholder: 'e.g. yourstore@upi' },
                  ].map(f => (
                    <div key={f.key} style={{ gridColumn: f.span === 2 ? 'span 2' : 'span 1' }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6, display: 'block' }}>{f.label}</label>
                      <input type="text" value={localPayment[f.key] || ''}
                        onChange={e => updateLocalPayment(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        style={{ ...inputStyle }} />
                    </div>
                  ))}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6, display: 'block' }}>
                      Instructions for Customer
                    </label>
                    <textarea rows={3} value={localPayment.bankNote || ''}
                      onChange={e => updateLocalPayment('bankNote', e.target.value)}
                      placeholder="e.g. Transfer exact amount and upload receipt screenshot. Order ships after payment is verified (24–48 hrs)."
                      style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                </div>

                {/* Preview how it looks at checkout */}
                <div style={{ marginTop: 20, background: '#f9f9f9', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: '#555' }}>👁 Customer Checkout Preview</div>
                  <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Bank Transfer Details</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '6px 12px', fontSize: 13, marginBottom: 14 }}>
                      {localPayment.bankHolder && <><span style={{ color: '#888' }}>Name</span><span style={{ fontWeight: 600 }}>{localPayment.bankHolder}</span></>}
                      {localPayment.bankName && <><span style={{ color: '#888' }}>Bank</span><span>{localPayment.bankName}</span></>}
                      {localPayment.bankAcc && <><span style={{ color: '#888' }}>Account</span><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{localPayment.bankAcc}</span></>}
                      {localPayment.bankIfsc && <><span style={{ color: '#888' }}>IFSC</span><span style={{ fontFamily: 'monospace' }}>{localPayment.bankIfsc}</span></>}
                      {localPayment.bankUpi && <><span style={{ color: '#888' }}>UPI</span><span style={{ color: '#3b82f6' }}>{localPayment.bankUpi}</span></>}
                    </div>
                    {localPayment.bankNote && (
                      <div style={{ fontSize: 12, color: '#666', background: '#fff8e1', padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>
                        ℹ️ {localPayment.bankNote}
                      </div>
                    )}
                    <div style={{ border: '2px dashed #d1d5db', borderRadius: 10, padding: 20, textAlign: 'center', color: '#888', fontSize: 13 }}>
                      📎 <strong>Upload Payment Receipt</strong><br />
                      <span style={{ fontSize: 12 }}>Screenshot or photo of transaction confirmation</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active methods summary */}
          <div style={{ background: '#f9f9f9', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
            <strong>Active payment methods: </strong>
            {[localPayment.cod && 'Cash on Delivery', localPayment.receipt && 'Bank Transfer + Receipt'].filter(Boolean).join(', ') || (
              <span style={{ color: '#dc3545' }}>⚠️ None selected — please enable at least one!</span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleSavePayment} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiSave size={15} /> Save Payment Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
