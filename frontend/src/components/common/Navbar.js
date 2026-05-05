// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiChevronDown, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
// import { useAuth } from '../../context/AuthContext';
// import { useCart } from '../../context/CartContext';
// import { useWishlist } from '../../context/CartContext';
// import { useTheme } from '../../context/ThemeContext';
// import { productAPI } from '../../utils/api';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, isAuthenticated, isAdmin, logout } = useAuth();
//   const { cartCount } = useCart();
//   const { wishlist } = useWishlist();
//   const { theme, t } = useTheme();
//   const [search, setSearch] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const searchRef = useRef(null);
//   const userMenuRef = useRef(null);
//   const wishlistCount = wishlist?.products?.length || 0;

//   useEffect(() => {
//     const h = () => setScrolled(window.scrollY > 10);
//     window.addEventListener('scroll', h);
//     return () => window.removeEventListener('scroll', h);
//   }, []);

//   useEffect(() => {
//     const h = (e) => {
//       if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
//       if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
//     };
//     document.addEventListener('mousedown', h);
//     return () => document.removeEventListener('mousedown', h);
//   }, []);

//   useEffect(() => {
//     if (search.length < 2) { setSuggestions([]); return; }
//     const timer = setTimeout(async () => {
//       try {
//         const { data } = await productAPI.getSuggestions(search);
//         setSuggestions(data.suggestions);
//         setShowSuggestions(true);
//       } catch {}
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [search]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (search.trim()) {
//       navigate(`/products?search=${encodeURIComponent(search.trim())}`);
//       setSearch(''); setShowSuggestions(false);
//     }
//   };

//   const primary = theme.primary || '#e94560';
//   const navBg = theme.nav || '#ffffff';
//   const textColor = theme.text || '#1a1a2e';

//   return (
//     <nav style={{ position: 'sticky', top: 0, zIndex: 1000, boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : '0 1px 0 #f0f0f0', transition: 'box-shadow 0.3s' }}>
//       {/* Announcement bar */}
//       <div style={{ background: theme.secondary || '#1a1a2e', color: '#fff', fontSize: 13, padding: '6px 0', textAlign: 'center' }}>
//         {t('announcementBar') || '🚚 Free shipping on orders above ₹500'}
//       </div>

//       {/* Main nav */}
//       <div style={{ background: navBg }} className="container">
//         <div style={{ display: 'flex', alignItems: 'center', height: 64, gap: 20 }}>
//           {/* Logo / Store name */}
//           <Link to="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: primary, whiteSpace: 'nowrap' }}>
//             {t('storeName') || 'ShopNow'}
//           </Link>

//           {/* Search */}
//           <div ref={searchRef} style={{ flex: 1, position: 'relative', maxWidth: 500 }}>
//             <form onSubmit={handleSearch} style={{ display: 'flex' }}>
//               <input
//                 type="text"
//                 placeholder={t('searchPlaceholder') || 'Search products, brands...'}
//                 value={search}
//                 onChange={e => setSearch(e.target.value)}
//                 onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
//                 style={{ flex: 1, padding: '10px 16px', border: '2px solid #e0e0e0', borderRadius: '8px 0 0 8px', fontSize: 14, outline: 'none', color: textColor }}
//               />
//               <button type="submit" style={{ background: primary, color: '#fff', padding: '10px 18px', borderRadius: '0 8px 8px 0', display: 'flex', alignItems: 'center', border: 'none', cursor: 'pointer' }}>
//                 <FiSearch size={18} />
//               </button>
//             </form>
//             {showSuggestions && suggestions.length > 0 && (
//               <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#fff', borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.15)', zIndex: 100, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
//                 {suggestions.map(s => (
//                   <div key={s._id}
//                     onClick={() => { navigate(`/products/${s._id}`); setSearch(''); setShowSuggestions(false); }}
//                     style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' }}
//                     onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
//                     onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
//                     <img src={s.images?.[0]?.url} alt={s.name} style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 6 }} />
//                     <div>
//                       <div style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</div>
//                       <div style={{ fontSize: 12, color: '#888' }}>{s.brand}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Icons */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//             <Link to="/wishlist" style={{ position: 'relative', color: textColor, display: 'flex' }}>
//               <FiHeart size={22} />
//               {wishlistCount > 0 && <span style={{ position: 'absolute', top: -8, right: -8, background: primary, color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{wishlistCount}</span>}
//             </Link>
//             <Link to="/cart" style={{ position: 'relative', color: textColor, display: 'flex' }}>
//               <FiShoppingCart size={22} />
//               {cartCount > 0 && <span style={{ position: 'absolute', top: -8, right: -8, background: primary, color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
//             </Link>

//             {isAuthenticated ? (
//               <div ref={userMenuRef} style={{ position: 'relative' }}>
//                 <button onClick={() => setUserMenuOpen(!userMenuOpen)}
//                   style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', padding: '6px 10px', borderRadius: 8, border: '2px solid #e0e0e0', cursor: 'pointer' }}>
//                   <img src={user.avatar?.url} alt={user.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
//                   <span style={{ fontSize: 14, fontWeight: 600, maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name.split(' ')[0]}</span>
//                   <FiChevronDown size={14} />
//                 </button>
//                 {userMenuOpen && (
//                   <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.15)', minWidth: 180, zIndex: 100, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
//                     {[
//                       { to: '/profile', icon: <FiUser size={15} />, label: 'My Profile' },
//                       { to: '/orders',  icon: <FiPackage size={15} />, label: 'My Orders' },
//                       ...(isAdmin ? [{ to: '/admin', icon: <FiSettings size={15} />, label: 'Admin Panel' }] : [])
//                     ].map(item => (
//                       <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)}
//                         style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 14, borderBottom: '1px solid #f5f5f5', color: textColor, textDecoration: 'none' }}
//                         onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
//                         onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
//                         {item.icon} {item.label}
//                       </Link>
//                     ))}
//                     <button onClick={() => { logout(); setUserMenuOpen(false); }}
//                       style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 14, width: '100%', background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}
//                       onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
//                       onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
//                       <FiLogOut size={15} /> Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div style={{ display: 'flex', gap: 10 }}>
//                 <Link to="/login"    className="btn btn-outline btn-sm">{t('loginBtn') || 'Login'}</Link>
//                 <Link to="/register" className="btn btn-primary btn-sm">{t('signupBtn') || 'Sign Up'}</Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Category bar */}
//       <div style={{ borderTop: '1px solid #f0f0f0', background: navBg }}>
//         <div className="container" style={{ display: 'flex', gap: 4, overflowX: 'auto', padding: '8px 20px' }}>
//           {['All Products', 'Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Books'].map(cat => (
//             <Link key={cat} to={cat === 'All Products' ? '/products' : `/products?search=${cat}`}
//               style={{ padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', color: '#444', background: 'transparent', textDecoration: 'none', transition: 'all 0.2s' }}
//               onMouseEnter={e => { e.currentTarget.style.background = primary + '18'; e.currentTarget.style.color = primary; }}
//               onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#444'; }}>
//               {cat}
//             </Link>
//           ))}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX,
  FiChevronDown, FiLogOut, FiPackage, FiSettings
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { productAPI, categoryAPI } from '../../utils/api';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { theme, t } = useTheme();

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const wishlistCount = wishlist?.products?.length || 0;

  const primary   = theme.primary   || '#e94560';
  const navBg     = theme.nav       || '#ffffff';
  const textColor = theme.text      || '#1a1a2e';
  const secondary = theme.secondary || '#1a1a2e';

  // Determine if navbar has dark background (for text color contrast)
  const isDarkNav = navBg.toLowerCase() === '#ffffff' || navBg.toLowerCase() === '#fff' ? false : true;
  const categoryLinkColor = isDarkNav ? '#e0e0e0' : '#444';
  const categoryLinkHoverBg = isDarkNav ? 'rgba(255,255,255,0.1)' : primary + '18';

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    categoryAPI.getAll()
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (searchRef.current  && !searchRef.current.contains(e.target))  setShowSuggestions(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [navigate]);

  useEffect(() => {
    if (search.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const { data } = await productAPI.getSuggestions(search);
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    setSearch('');
    setShowSuggestions(false);
    setMobileSearchOpen(false);
  };

  const SuggestionDropdown = () =>
    showSuggestions && suggestions.length > 0 ? (
      <div style={{
        position: 'absolute', top: '110%', left: 0, right: 0, zIndex: 300,
        background: '#fff', borderRadius: 10, border: '1px solid #e0e0e0',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)', overflow: 'hidden'
      }}>
        {suggestions.map(s => (
          <div key={s._id}
            onClick={() => { navigate(`/products/${s._id}`); setSearch(''); setShowSuggestions(false); setMobileSearchOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
            <img src={s.images?.[0]?.url} alt={s.name} style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 6 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: textColor }}>{s.name}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{s.brand}</div>
            </div>
          </div>
        ))}
      </div>
    ) : null;

  const Badge = ({ count }) =>
    count > 0 ? (
      <span style={{
        position: 'absolute', top: -7, right: -7, background: primary, color: '#fff',
        fontSize: 9, fontWeight: 700, lineHeight: 1, borderRadius: '50%',
        width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '2px solid #fff'
      }}>
        {count > 9 ? '9+' : count}
      </span>
    ) : null;

  const SearchBox = ({ autoFocus = false }) => (
    <div ref={searchRef} style={{ position: 'relative', width: '100%' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex' }}>
        <input
          autoFocus={autoFocus}
          type="text"
          placeholder={t('searchPlaceholder') || 'Search products, brands...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          style={{
            flex: 1, padding: '9px 14px', border: '2px solid #e0e0e0', borderRight: 'none',
            borderRadius: '8px 0 0 8px', fontSize: 14, outline: 'none',
            color: textColor, background: '#fafafa', minWidth: 0
          }}
        />
        <button type="submit" style={{
          background: primary, color: '#fff', padding: '9px 14px',
          border: 'none', cursor: 'pointer', borderRadius: '0 8px 8px 0',
          display: 'flex', alignItems: 'center', flexShrink: 0
        }}>
          <FiSearch size={17} />
        </button>
      </form>
      <SuggestionDropdown />
    </div>
  );

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : '0 1px 0 #f0f0f0',
        transition: 'box-shadow 0.3s'
      }}>

        {/* Announcement bar */}
        <div style={{ background: secondary, color: '#fff', fontSize: 13, padding: '6px 0', textAlign: 'center' }}>
          {t('announcementBar') || '🚚 Free shipping on orders above ₹500'}
        </div>

        {/* Main nav row */}
        <div style={{ background: navBg }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto', padding: '0 16px',
            display: 'flex', alignItems: 'center', height: 64, gap: 12
          }}>

            {/* LOGO — always left */}
            <Link to="/" style={{
              display: 'flex',
              alignItems: 'center',
              maxWidth: theme.logoSize === 'small' ? 120 : theme.logoSize === 'medium' ? 200 : theme.logoSize === 'large' ? 300 : theme.logoMaxWidth || 200,
              maxHeight: theme.logoSize === 'small' ? 40 : theme.logoSize === 'medium' ? 60 : theme.logoSize === 'large' ? 80 : theme.logoMaxHeight || 60,
              flexShrink: 0,
              textDecoration: 'none'
            }}>
              {theme.logoType === 'image' && theme.logoImage ? (
                <img src={theme.logoImage.url} alt="Logo"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }} />
              ) : (
                <span style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 800,
                  fontSize: isMobile ? (theme.logoSize === 'small' ? 16 : theme.logoSize === 'medium' ? 20 : theme.logoSize === 'large' ? 24 : 20) :
                                       (theme.logoSize === 'small' ? 18 : theme.logoSize === 'medium' ? 22 : theme.logoSize === 'large' ? 26 : 22),
                  color: primary,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {theme.logoText || t('storeName') || 'ShopNow'}
                </span>
              )}
            </Link>

            {/* SEARCH — desktop center */}
           
            {/* RIGHT ICONS */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: isMobile ? 16 : 20 }}>
 {!isMobile && (
              <div style={{ flex: 1, maxWidth: 520 }}>
                <SearchBox />
              </div>
            )}

              {isMobile ? (
                /* ── MOBILE: search icon + heart + cart + hamburger ONLY ── */
                <>
                  <button onClick={() => setMobileSearchOpen(v => !v)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: textColor, display: 'flex', position: 'relative' }}>
                    <FiSearch size={22} />
                  </button>

                  <Link to="/wishlist" style={{ color: textColor, display: 'flex', position: 'relative', textDecoration: 'none' }}>
                    <FiHeart size={22} />
                    <Badge count={wishlistCount} />
                  </Link>

                  <Link to="/cart" style={{ color: textColor, display: 'flex', position: 'relative', textDecoration: 'none' }}>
                    <FiShoppingCart size={22} />
                    <Badge count={cartCount} />
                  </Link>

                  <button onClick={() => setMobileMenuOpen(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: textColor, display: 'flex' }}>
                    <FiMenu size={24} />
                  </button>
                </>
              ) : (
                /* ── DESKTOP: heart + cart + login/signup or user menu ── */
                <>
                  <Link to="/wishlist" style={{ color: textColor, display: 'flex', position: 'relative', textDecoration: 'none' }}>
                    <FiHeart size={22} />
                    <Badge count={wishlistCount} />
                  </Link>

                  <Link to="/cart" style={{ color: textColor, display: 'flex', position: 'relative', textDecoration: 'none' }}>
                    <FiShoppingCart size={22} />
                    <Badge count={cartCount} />
                  </Link>

                  {isAuthenticated ? (
                    <div ref={userMenuRef} style={{ position: 'relative' }}>
                      <button onClick={() => setUserMenuOpen(v => !v)} style={{
                        display: 'flex', alignItems: 'center', gap: 8, background: 'none',
                        padding: '6px 10px', borderRadius: 8, border: '2px solid #e0e0e0',
                        cursor: 'pointer', color: textColor
                      }}>
                        <img src={user.avatar?.url} alt={user.name}
                          style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontSize: 13, fontWeight: 600, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.name.split(' ')[0]}
                        </span>
                        <FiChevronDown size={13} />
                      </button>
                      {userMenuOpen && (
                        <div style={{
                          position: 'absolute', right: 0, top: '110%', background: '#fff',
                          borderRadius: 10, minWidth: 180, zIndex: 300,
                          border: '1px solid #e0e0e0', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', overflow: 'hidden'
                        }}>
                          {[
                            { to: '/profile', icon: <FiUser size={14} />,    label: 'My Profile' },
                            { to: '/orders',  icon: <FiPackage size={14} />, label: 'My Orders' },
                            ...(isAdmin ? [{ to: '/admin', icon: <FiSettings size={14} />, label: 'Admin Panel' }] : [])
                          ].map(item => (
                            <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)} style={{
                              display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px',
                              fontSize: 14, color: textColor, textDecoration: 'none', borderBottom: '1px solid #f5f5f5'
                            }}
                              onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                              onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                              {item.icon} {item.label}
                            </Link>
                          ))}
                          <button onClick={() => { logout(); setUserMenuOpen(false); }} style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px',
                            fontSize: 14, width: '100%', background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer'
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                            <FiLogOut size={14} /> Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to="/login"    className="btn btn-outline btn-sm">{t('loginBtn')  || 'Login'}</Link>
                      <Link to="/register" className="btn btn-primary btn-sm">{t('signupBtn') || 'Sign Up'}</Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile expandable search */}
          {isMobile && mobileSearchOpen && (
            <div style={{ padding: '0 16px 12px', background: navBg }}>
              <SearchBox autoFocus />
            </div>
          )}
        </div>

        {/* Category bar — desktop only */}
        {!isMobile && (
          <div style={{ borderTop: isDarkNav ? 'none' : '1px solid #f0f0f0', background: navBg }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 4, overflowX: 'auto', padding: '7px 16px' }}>
              {[{ name: 'All Products', _id: '' }, ...categories].map(cat => (
                <Link key={cat._id || cat.name}
                  to={cat._id ? `/products?category=${cat._id}` : '/products'}
                  style={{
                    padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500,
                    whiteSpace: 'nowrap', color: categoryLinkColor, textDecoration: 'none',
                    transition: 'all 0.2s', background: 'transparent'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = categoryLinkHoverBg; e.currentTarget.style.color = isDarkNav ? '#fff' : primary; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = categoryLinkColor; }}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1100
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            position: 'absolute', top: 0, right: 0, width: 'min(300px, 90vw)', height: '100%',
            background: '#fff', overflowY: 'auto', display: 'flex', flexDirection: 'column',
            boxShadow: '-4px 0 30px rgba(0,0,0,0.15)'
          }}>

            {/* Drawer header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 20px', borderBottom: '1px solid #f0f0f0', flexShrink: 0
            }}>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20,
                color: primary, textDecoration: 'none'
              }}>
                {t('storeName') || 'ShopNow'}
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: textColor, padding: 4
              }}>
                <FiX size={22} />
              </button>
            </div>

            {/* Auth section inside drawer */}
            {isAuthenticated ? (
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <img src={user.avatar?.url} alt={user.name}
                    style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: textColor }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{user.email}</div>
                  </div>
                </div>
                {[
                  { to: '/profile', icon: <FiUser size={16} />,    label: 'My Profile' },
                  { to: '/orders',  icon: <FiPackage size={16} />, label: 'My Orders' },
                  ...(isAdmin ? [{ to: '/admin', icon: <FiSettings size={16} />, label: 'Admin Panel' }] : [])
                ].map(item => (
                  <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0',
                    fontSize: 15, color: textColor, textDecoration: 'none', borderBottom: '1px solid #f5f5f5'
                  }}>
                    {item.icon} {item.label}
                  </Link>
                ))}
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0',
                  fontSize: 15, width: '100%', background: 'none', border: 'none',
                  color: '#dc3545', cursor: 'pointer', marginTop: 4
                }}>
                  <FiLogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              /* Login/Signup ONLY inside drawer — not in navbar on mobile */
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 10 }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-outline btn-sm" style={{ flex: 1, textAlign: 'center' }}>
                  {t('loginBtn') || 'Login'}
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center' }}>
                  {t('signupBtn') || 'Sign Up'}
                </Link>
              </div>
            )}

            {/* Categories */}
            <div style={{ padding: '14px 20px', flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#aaa', textTransform: 'uppercase', marginBottom: 10 }}>
                Categories
              </div>
              {[{ name: 'All Products', _id: '' }, ...categories].map(cat => (
                <Link key={cat._id || cat.name}
                  to={cat._id ? `/products?category=${cat._id}` : '/products'}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'block', padding: '12px 0', fontSize: 15,
                    color: textColor, textDecoration: 'none', borderBottom: '1px solid #f5f5f5',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = primary}
                  onMouseLeave={e => e.currentTarget.style.color = textColor}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;