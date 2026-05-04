import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { theme, t } = useTheme();
  const footerBg  = theme.footer  || '#1a1a2e';
  const primary   = theme.primary  || '#e94560';

  const linkStyle = {
    display: 'block', marginBottom: 10, fontSize: 14,
    color: '#9ca3af', transition: 'color 0.2s', textDecoration: 'none'
  };

  return (
    <footer style={{ background: footerBg, color: '#9ca3af', marginTop: 60 }}>
      <div className="container" style={{ padding: '50px 20px 30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, color: primary, marginBottom: 12 }}>
              {t('storeName') || 'ShopNow'}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
              {t('footerTagline') || 'Your one-stop shop for everything you need.'}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                <a key={i} href="#"
                  style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = primary}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: 16, fontSize: 15, fontWeight: 700 }}>
              {t('quickLinksTitle') || 'Quick Links'}
            </h4>
            {[
              { label: 'Home',     to: '/' },
              { label: 'Products', to: '/products' },
              { label: 'Cart',     to: '/cart' },
              { label: 'My Orders',to: '/orders' },
              { label: 'Profile',  to: '/profile' },
            ].map(l => (
              <Link key={l.to} to={l.to} style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color = primary}
                onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: 16, fontSize: 15, fontWeight: 700 }}>
              {t('categoriesTitle') || 'Categories'}
            </h4>
            {['Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Books'].map(cat => (
              <Link key={cat} to={`/products?search=${cat}`} style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color = primary}
                onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
                {cat}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: 16, fontSize: 15, fontWeight: 700 }}>
              {t('contactTitle') || 'Contact Us'}
            </h4>
            {[
              { Icon: FiMail,   text: 'support@shopnow.com' },
              { Icon: FiPhone,  text: '+91 98765 43210' },
              { Icon: FiMapPin, text: 'Mumbai, India' },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 14 }}>
                <Icon size={16} style={{ color: primary, flexShrink: 0 }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ fontSize: 13 }}>{t('copyright') || '© 2024 ShopNow. All rights reserved.'}</p>
          <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(p => (
              <a key={p} href="#" style={{ color: '#6b7280', transition: 'color 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = primary}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                {p}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
