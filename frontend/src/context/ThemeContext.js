import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI } from '../utils/api';

const defaultTheme = {
  primary: '#e94560',
  secondary: '#1a1a2e',
  bg: '#f6f7f9',
  nav: '#ffffff',
  footer: '#1a1a2e',
  card: '#ffffff',
  text: '#1a1a2e',
  radius: '12px',
  font: "'Plus Jakarta Sans', sans-serif",
  btnStyle: 'filled',
  logoType: 'text', // 'text' or 'image'
  logoText: 'ShopNow',
  logoImage: null, // { public_id, url }
  logoSize: 'medium', // 'small', 'medium', 'large'
  logoMaxWidth: 200, // in pixels
  logoMaxHeight: 60, // in pixels
};

const defaultTexts = {
  announcementBar: '🚚 Free shipping on orders above Rs.500 | Use code WELCOME10 for 10% off',
  heroTitle: 'Discover Amazing Products Today',
  heroSubtitle: 'Shop the latest trends with unbeatable prices. Free shipping on orders above Rs.500.',
  heroBtn1: 'Shop Now',
  heroBtn2: 'View Deals',
  featuredTitle: 'Featured Products',
  featuredSubtitle: 'Handpicked just for you',
  trendingTitle: '🔥 Trending Now',
  trendingSubtitle: "What everyone's buying",
  promoBannerTitle: 'Special Offer 🎉',
  promoBannerText: 'Get up to 50% off on selected items. Limited time only!',
  promoBtn: 'Grab the Deal',
  addToCartBtn: 'Add to Cart',
  buyNowBtn: 'Buy Now',
  outOfStockText: 'Out of Stock',
  freeDeliveryText: 'Free delivery on orders above Rs.500',
  returnsText: '7-day easy returns',
  guaranteeText: '100% Genuine product guaranteed',
  footerTagline: 'Your one-stop shop for everything you need. Quality products at the best prices.',
  copyright: '© 2024 ShopNow. All rights reserved.',
};

const defaultPayment = {
  cod: true,
  receipt: false,
  bankName: '',
  bankAcc: '',
  bankIfsc: '',
  bankHolder: '',
  bankUpi: '',
  bankNote: '',
};

const DEFAULT_SHIPPING_FEE = 50;

const defaultSocials = {
  instagram: { enabled: false, url: '' },
  facebook: { enabled: false, url: '' },
  twitter: { enabled: false, url: '' },
  youtube: { enabled: false, url: '' },
  linkedin: { enabled: false, url: '' },
  whatsapp: { enabled: false, url: '' },
};

const normalizeSocials = (value) => {
  if (!value || typeof value !== 'object') return defaultSocials;
  const normalized = {};
  Object.keys(defaultSocials).forEach((key) => {
    const current = value[key];
    if (typeof current === 'string') {
      normalized[key] = { enabled: !!current, url: current || '' };
    } else if (current && typeof current === 'object') {
      normalized[key] = {
        enabled: typeof current.enabled === 'boolean' ? current.enabled : !!current.url,
        url: current.url || '',
      };
    } else {
      normalized[key] = { ...defaultSocials[key] };
    }
  });
  return normalized;
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('shopnow_theme');
      return saved ? { ...defaultTheme, ...JSON.parse(saved) } : defaultTheme;
    } catch { return defaultTheme; }
  });

  const [texts, setTexts] = useState(() => {
    try {
      const saved = localStorage.getItem('shopnow_texts');
      return saved ? { ...defaultTexts, ...JSON.parse(saved) } : defaultTexts;
    } catch { return defaultTexts; }
  });

  const [payment, setPayment] = useState(() => {
    try {
      const saved = localStorage.getItem('shopnow_payment');
      return saved ? { ...defaultPayment, ...JSON.parse(saved) } : defaultPayment;
    } catch { return defaultPayment; }
  });

  const [shippingFee, setShippingFee] = useState(() => {
    try {
      const saved = localStorage.getItem('shopnow_shipping_fee');
      if (saved === null) return DEFAULT_SHIPPING_FEE;
      const fee = Number(saved);
      return Number.isFinite(fee) && fee >= 0 ? fee : DEFAULT_SHIPPING_FEE;
    } catch {
      return DEFAULT_SHIPPING_FEE;
    }
  });

  const [socials, setSocials] = useState(() => {
    try {
      const saved = localStorage.getItem('shopnow_socials');
      return saved ? normalizeSocials(JSON.parse(saved)) : defaultSocials;
    } catch { return defaultSocials; }
  });

  // Also try loading from backend (overrides localStorage if available)
  useEffect(() => {
    settingsAPI.getAll().then(({ data }) => {
      if (data.settings) {
        if (data.settings.theme)   { setTheme(t => ({ ...t, ...data.settings.theme }));   localStorage.setItem('shopnow_theme',   JSON.stringify({ ...theme,   ...data.settings.theme })); }
        if (data.settings.texts)   { setTexts(t => ({ ...t, ...data.settings.texts }));   localStorage.setItem('shopnow_texts',   JSON.stringify({ ...texts,   ...data.settings.texts })); }
        if (data.settings.payment) { setPayment(t => ({ ...t, ...data.settings.payment })); localStorage.setItem('shopnow_payment', JSON.stringify({ ...payment, ...data.settings.payment })); }
        const configuredFee = data.settings.shippingFee === undefined
          ? DEFAULT_SHIPPING_FEE
          : data.settings.shippingFee;
        if (typeof configuredFee === 'number' && Number.isFinite(configuredFee) && configuredFee >= 0) {
          setShippingFee(configuredFee);
          localStorage.setItem('shopnow_shipping_fee', String(configuredFee));
        }
        if (data.settings.socials)  {
          const normalized = normalizeSocials(data.settings.socials);
          setSocials(s => ({ ...s, ...normalized }));
          localStorage.setItem('shopnow_socials', JSON.stringify({ ...socials, ...normalized }));
        }
      }
    }).catch(() => {}); // Silently fail, use localStorage
  }, []); // eslint-disable-line
  useEffect(() => {
    const root = document.documentElement;
    const set = (k, v) => root.style.setProperty(k, v);
    const dark = luminance(theme.bg) < 0.4;

    set('--primary', theme.primary);
    set('--primary-dark', darkenHex(theme.primary, 20));
    set('--primary-soft', mixHex(theme.primary, theme.card, 0.12));
    set('--on-primary', luminance(theme.primary) > 0.55 ? '#111111' : '#ffffff');
    set('--secondary', theme.secondary);
    set('--dark', theme.secondary);
    set('--darker', darkenHex(theme.secondary, 10));
    set('--light', theme.bg);
    set('--bg', theme.bg);
    set('--radius', theme.radius);
    set('--radius-sm', `calc(${theme.radius} - 4px)`);
    set('--nav-bg', theme.nav);
    set('--nav-text', luminance(theme.nav) > 0.5 ? '#1a1a2e' : '#ffffff');
    set('--footer-bg', theme.footer);
    set('--card-bg', theme.card);
    set('--surface-2', mixHex(theme.text, theme.card, 0.05));
    set('--text-color', theme.text);
    set('--gray', mixHex(theme.text, theme.card, 0.62));
    set('--border', mixHex(theme.text, theme.card, 0.14));
    set('--input-bg', dark ? mixHex(theme.text, theme.card, 0.06) : theme.card);
    set('--shadow', dark ? '0 4px 20px rgba(0,0,0,0.45)' : '0 1px 2px rgba(16,24,40,0.05), 0 4px 16px rgba(16,24,40,0.06)');
    set('--shadow-hover', dark ? '0 10px 30px rgba(0,0,0,0.6)' : '0 10px 30px rgba(16,24,40,0.14)');

    root.setAttribute('data-btn', theme.btnStyle || 'filled');
    root.setAttribute('data-mode', dark ? 'dark' : 'light');
    root.style.colorScheme = dark ? 'dark' : 'light';
    document.body.style.background = theme.bg;
    document.body.style.color = theme.text;
    document.body.style.fontFamily = theme.font;

    // Load the chosen Google font on demand
    const family = (theme.font.match(/'([^']+)'/) || [])[1];
    if (family && !['Georgia'].includes(family)) {
      const id = 'theme-font-link';
      let link = document.getElementById(id);
      if (!link) { link = document.createElement('link'); link.id = id; link.rel = 'stylesheet'; document.head.appendChild(link); }
      link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@400;500;600;700;800&display=swap`;
    }
  }, [theme]);

  const saveTheme = (newTheme) => {
    const merged = { ...theme, ...newTheme };
    setTheme(merged);
    localStorage.setItem('shopnow_theme', JSON.stringify(merged));
    // Sync to backend (non-blocking)
    settingsAPI.save('theme', merged).catch(() => {});
  };

  const saveTexts = (newTexts) => {
    const merged = { ...texts, ...newTexts };
    setTexts(merged);
    localStorage.setItem('shopnow_texts', JSON.stringify(merged));
    settingsAPI.save('texts', merged).catch(() => {});
  };

  const savePayment = (newPayment) => {
    const merged = { ...payment, ...newPayment };
    setPayment(merged);
    localStorage.setItem('shopnow_payment', JSON.stringify(merged));
    settingsAPI.save('payment', merged).catch(() => {});
  };

  const saveShippingFee = async (newShippingFee) => {
    await settingsAPI.save('shippingFee', newShippingFee);
    setShippingFee(newShippingFee);
    localStorage.setItem('shopnow_shipping_fee', String(newShippingFee));
  };

  const saveSocials = (newSocials) => {
    const merged = { ...socials, ...newSocials };
    setSocials(merged);
    localStorage.setItem('shopnow_socials', JSON.stringify(merged));
    settingsAPI.save('socials', merged).catch(() => {});
  };

  const t = (key) => texts[key] || defaultTexts[key] || key;

  return (
    <ThemeContext.Provider value={{ theme, texts, payment, socials, shippingFee, saveTheme, saveTexts, savePayment, saveSocials, saveShippingFee, t }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

// Utility: darken a hex color by amt (0-100)
function darkenHex(hex, amt) {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - amt);
    const g = Math.max(0, ((num >> 8) & 0xff) - amt);
    const b = Math.max(0, (num & 0xff) - amt);
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  } catch { return hex; }
}

function toRgb(hex) {
  const h = (hex || '#000000').replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h.padEnd(6, '0');
  const n = parseInt(full.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Utility: mix color a into color b by ratio (0-1 = amount of a)
function mixHex(a, b, ratio) {
  try {
    const [r1, g1, b1] = toRgb(a);
    const [r2, g2, b2] = toRgb(b);
    const m = (x, y) => Math.round(x * ratio + y * (1 - ratio));
    return '#' + ((m(r1, r2) << 16) | (m(g1, g2) << 8) | m(b1, b2)).toString(16).padStart(6, '0');
  } catch { return a; }
}

// Utility: relative luminance 0 (black) - 1 (white)
function luminance(hex) {
  try {
    const [r, g, b] = toRgb(hex).map(v => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  } catch { return 1; }
}

export default ThemeContext;
