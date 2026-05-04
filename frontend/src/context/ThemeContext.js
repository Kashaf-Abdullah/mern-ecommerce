import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI } from '../utils/api';

const defaultTheme = {
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
};

const defaultTexts = {
  storeName: 'ShopNow',
  announcementBar: '🚚 Free shipping on orders above ₹500 | Use code WELCOME10 for 10% off',
  heroTitle: 'Discover Amazing Products Today',
  heroSubtitle: 'Shop the latest trends with unbeatable prices. Free shipping on orders above ₹500.',
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
  freeDeliveryText: 'Free delivery on orders above ₹500',
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

  // Also try loading from backend (overrides localStorage if available)
  useEffect(() => {
    settingsAPI.getAll().then(({ data }) => {
      if (data.settings) {
        if (data.settings.theme)   { setTheme(t => ({ ...t, ...data.settings.theme }));   localStorage.setItem('shopnow_theme',   JSON.stringify({ ...theme,   ...data.settings.theme })); }
        if (data.settings.texts)   { setTexts(t => ({ ...t, ...data.settings.texts }));   localStorage.setItem('shopnow_texts',   JSON.stringify({ ...texts,   ...data.settings.texts })); }
        if (data.settings.payment) { setPayment(t => ({ ...t, ...data.settings.payment })); localStorage.setItem('shopnow_payment', JSON.stringify({ ...payment, ...data.settings.payment })); }
      }
    }).catch(() => {}); // Silently fail, use localStorage
  }, []); // eslint-disable-line
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-dark', darkenHex(theme.primary, 20));
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--dark', theme.secondary);
    root.style.setProperty('--darker', darkenHex(theme.secondary, 10));
    root.style.setProperty('--light', theme.bg);
    root.style.setProperty('--radius', theme.radius);
    root.style.setProperty('--radius-sm', `calc(${theme.radius} - 4px)`);
    root.style.setProperty('--nav-bg', theme.nav);
    root.style.setProperty('--footer-bg', theme.footer);
    root.style.setProperty('--card-bg', theme.card);
    root.style.setProperty('--text-color', theme.text);
    document.body.style.background = theme.bg;
    document.body.style.color = theme.text;
    document.body.style.fontFamily = theme.font;
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

  const t = (key) => texts[key] || defaultTexts[key] || key;

  return (
    <ThemeContext.Provider value={{ theme, texts, payment, saveTheme, saveTexts, savePayment, t }}>
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

export default ThemeContext;
