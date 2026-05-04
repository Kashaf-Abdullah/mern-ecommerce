import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import { productAPI, categoryAPI } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import ProductCard from '../../components/user/ProductCard';

const Home = () => {
  const { theme, t } = useTheme();
  const [featured,   setFeatured]   = useState([]);
  const [trending,   setTrending]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  const primary   = theme.primary   || '#e94560';
  const secondary = theme.secondary || '#1a1a2e';

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
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24 }}>
      <div>
        <h2 style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>{title}</h2>
        {subtitle && <p style={{ color:'var(--gray)', fontSize:15 }}>{subtitle}</p>}
      </div>
      {link && (
        <Link to={link} style={{ display:'flex', alignItems:'center', gap:6, color:primary, fontSize:14, fontWeight:600, textDecoration:'none' }}>
          View All <FiArrowRight size={16} />
        </Link>
      )}
    </div>
  );

  return (
    <div className="container" style={{ paddingTop:30, paddingBottom:50 }}>

      {/* Hero Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${secondary} 0%, ${secondary}cc 100%)`,
        color:'#fff', borderRadius:16, padding:'60px 50px', marginBottom:50,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        overflow:'hidden', position:'relative'
      }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:300, height:300, borderRadius:'50%', background:`${primary}25` }} />
        <div style={{ position:'absolute', bottom:-40, right:200, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
        <div style={{ zIndex:1, maxWidth:550 }}>
          <div style={{ background:`${primary}33`, display:'inline-block', padding:'6px 16px', borderRadius:20, fontSize:13, fontWeight:600, marginBottom:16, color:'#fda4af' }}>
            🔥 New Season Sale
          </div>
          <h1 style={{ fontFamily:'Syne, sans-serif', fontSize:46, fontWeight:800, lineHeight:1.2, marginBottom:16 }}>
            {t('heroTitle') || 'Discover Amazing Products Today'}
          </h1>
          <p style={{ fontSize:17, opacity:0.8, marginBottom:30, lineHeight:1.7 }}>
            {t('heroSubtitle') || 'Shop the latest trends with unbeatable prices.'}
          </p>
          <div style={{ display:'flex', gap:14 }}>
            <Link to="/products"
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', borderRadius:10, background:primary, color:'#fff', fontWeight:700, fontSize:15, textDecoration:'none' }}>
              {t('heroBtn1') || 'Shop Now'} <FiArrowRight size={18} />
            </Link>
            <Link to="/products?featured=true"
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', borderRadius:10, background:'rgba(255,255,255,0.14)', color:'#fff', fontWeight:600, fontSize:15, textDecoration:'none' }}>
              {t('heroBtn2') || 'View Deals'}
            </Link>
          </div>
        </div>
        <div style={{ fontSize:110, zIndex:1, opacity:0.25 }}>🛒</div>
      </div>

      {/* Feature Bar */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:50 }}>
        {[
          { icon:<FiTruck size={24}/>,      title:'Free Shipping',   desc:'On orders above ₹500' },
          { icon:<FiRefreshCw size={24}/>,  title:'Easy Returns',    desc:'7-day return policy' },
          { icon:<FiShield size={24}/>,     title:'Secure Payment',  desc:'100% safe transactions' },
          { icon:<FiHeadphones size={24}/>, title:'24/7 Support',    desc:'Always here to help' },
        ].map(f => (
          <div key={f.title} className="card" style={{ padding:'20px 24px', display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:48, height:48, borderRadius:12, background:`${primary}18`, display:'flex', alignItems:'center', justifyContent:'center', color:primary, flexShrink:0 }}>
              {f.icon}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:15 }}>{f.title}</div>
              <div style={{ fontSize:13, color:'var(--gray)' }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <section style={{ marginBottom:50 }}>
          <SectionHeader title="Shop by Category" subtitle="Find what you're looking for" link="/products" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:14 }}>
            {categories.map(cat => (
              <Link key={cat._id} to={`/products?category=${cat._id}`} className="card"
                style={{ padding:'20px 16px', textAlign:'center', textDecoration:'none', transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderBottom=`3px solid ${primary}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderBottom='none'; }}>
                <div style={{ fontSize:34, marginBottom:8 }}>{catEmoji[cat.slug] || '🛍️'}</div>
                <div style={{ fontSize:13, fontWeight:600 }}>{cat.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {!loading && featured.length > 0 && (
        <section style={{ marginBottom:50 }}>
          <SectionHeader title={t('featuredTitle') || 'Featured Products'} subtitle={t('featuredSubtitle') || 'Handpicked just for you'} link="/products?featured=true" />
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <div style={{
        background:`linear-gradient(135deg, ${primary}, ${primary}cc)`,
        borderRadius:16, padding:'40px 50px', marginBottom:50,
        display:'flex', justifyContent:'space-between', alignItems:'center', color:'#fff'
      }}>
        <div>
          <h2 style={{ fontSize:32, marginBottom:8 }}>{t('promoBannerTitle') || 'Special Offer 🎉'}</h2>
          <p style={{ fontSize:16, opacity:0.9, marginBottom:20 }}>{t('promoBannerText') || 'Get up to 50% off on selected items!'}</p>
          <Link to="/products"
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 28px', borderRadius:10, background:'#fff', color:primary, fontWeight:700, fontSize:15, textDecoration:'none' }}>
            {t('promoBtn') || 'Grab the Deal'}
          </Link>
        </div>
        <div style={{ fontSize:90, opacity:0.2 }}>🏷️</div>
      </div>

      {/* Trending Products */}
      {!loading && trending.length > 0 && (
        <section style={{ marginBottom:50 }}>
          <SectionHeader title={t('trendingTitle') || '🔥 Trending Now'} subtitle={t('trendingSubtitle') || "What everyone's buying"} link="/products?trending=true" />
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
