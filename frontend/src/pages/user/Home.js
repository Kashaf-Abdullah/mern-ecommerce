import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import { productAPI, categoryAPI } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import ProductCard from '../../components/user/ProductCard';
import { getProductImageUrl } from '../../utils/productImage';

const Home = () => {
  const { t } = useTheme();
  const [featured,   setFeatured]   = useState([]);
  const [trending,   setTrending]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [isMobile,   setIsMobile]   = useState(window.innerWidth <= 768);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [fR, tR, cR] = await Promise.all([
          productAPI.getAll({ featured: true, limit: 8 }),
          productAPI.getAll({ trending: true, limit: 8 }),
          categoryAPI.getAll(),
        ]);
        setFeatured(fR.data.products);
        setTrending(tR.data.products);
        setCategories(cR.data.categories);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const catEmoji = {
    electronics: '📱',
    beauty: '💄',
    clothes: '👕',
    'home-kitchen': '🏠',
    sports: '⚽',
    books: '📚',
    footwear: '👟',
    'toys-games': '🧸'
  };

  const SectionHeader = ({ title, subtitle, link }) => (
    <div className="section-head">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {link && <Link to={link}>View all <FiArrowRight size={16} /></Link>}
    </div>
  );

  // Hero tiles use real products, so the hero always matches the store's catalogue
  const heroTiles = (featured.length ? featured : trending).slice(0, 4);

  return (
    <div className="container" style={{ paddingTop: isMobile ? 16 : 28, paddingBottom: isMobile ? 30 : 50 }}>

      <section className="hero">
        <div className="hero-copy">
          <h1>{t('heroTitle')}</h1>
          <p>{t('heroSubtitle')}</p>
          <div className="hero-actions">
            <Link to="/products" className="hero-btn main">{t('heroBtn1')} <FiArrowRight size={18} /></Link>
            <Link to="/products?featured=true" className="hero-btn ghost">{t('heroBtn2')}</Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden={heroTiles.length === 0}>
          {heroTiles.map(p => (
            <Link key={p._id} to={`/products/${p._id}`} className="hero-tile">
              <img src={getProductImageUrl(p)} alt={p.name} loading="lazy" />
              <span>{p.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="perks">
        {[
          { icon: <FiTruck size={20} />,      title: 'Free shipping',   desc: t('freeDeliveryText') },
          { icon: <FiRefreshCw size={20} />,  title: 'Easy returns',    desc: t('returnsText') },
          { icon: <FiShield size={20} />,     title: 'Secure payment',  desc: t('guaranteeText') },
          { icon: <FiHeadphones size={20} />, title: 'Support',         desc: 'Here whenever you need help' },
        ].map(f => (
          <div key={f.title} className="perk">
            <div className="perk-icon">{f.icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.4 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {categories.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <SectionHeader title="Shop by category" subtitle="Find what you're looking for" link="/products" />
          <div className="cat-grid">
            {categories.map(cat => (
              <Link key={cat._id} to={`/products?category=${cat._id}`} className="cat-tile">
                <span className="emoji">{catEmoji[cat.slug] || '🛍️'}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {!loading && featured.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <SectionHeader title={t('featuredTitle')} subtitle={t('featuredSubtitle')} link="/products?featured=true" />
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      <section className="promo">
        <div>
          <h2>{t('promoBannerTitle')}</h2>
          <p>{t('promoBannerText')}</p>
          <Link to="/products" className="promo-btn">{t('promoBtn')}</Link>
        </div>
        <div style={{ fontSize: isMobile ? 56 : 88, opacity: 0.25 }} aria-hidden>🏷️</div>
      </section>

      {!loading && trending.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <SectionHeader title={t('trendingTitle')} subtitle={t('trendingSubtitle')} link="/products?trending=true" />
          <div className="products-grid">
            {trending.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {loading && <div className="page-loading"><div className="spinner" /></div>}
    </div>
  );
};

export default Home;
