import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiPercent, FiSettings, FiBell, FiHeart, FiMenu, FiX, FiLogOut, FiEye } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import useBreakpoint from '../../hooks/useBreakpoint';

const navItems = [
  { to: '/admin',            icon: <FiGrid size={18} />,        label: 'Dashboard',  end: true },
  { to: '/admin/products',   icon: <FiPackage size={18} />,     label: 'Products' },
  { to: '/admin/orders',     icon: <FiShoppingBag size={18} />, label: 'Orders' },
  { to: '/admin/users',      icon: <FiUsers size={18} />,       label: 'Users' },
  { to: '/admin/categories', icon: <FiTag size={18} />,         label: 'Categories' },
  { to: '/admin/coupons',    icon: <FiPercent size={18} />,     label: 'Coupons' },
  { to: '/admin/notifications', icon: <FiBell size={18} />,    label: 'Notifications' },
  { to: '/admin/wishlist-activity', icon: <FiHeart size={18} />, label: 'Wishlist Activity' },
  { to: '/admin/settings',   icon: <FiSettings size={18} />,    label: 'Settings' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, isDesktop } = useBreakpoint();
  const [open, setOpen] = useState(window.innerWidth > 1024);

  // Phones: slide-over drawer. Tablets: icon rail. Desktop: full sidebar.
  useEffect(() => { setOpen(isDesktop); }, [isDesktop, isMobile]);

  useEffect(() => {
    if (isMobile && open) {
      setOpen(false);
    }
  }, [location.pathname]);

  const sidebarWidth = isMobile ? 280 : open ? 240 : 64;
  const sidebarLeft = isMobile ? (open ? 0 : '-100%') : 0;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <aside style={{
        width: sidebarWidth,
        background: 'var(--secondary)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        color: '#fff',
        transition: 'all 0.28s ease',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: sidebarLeft,
        height: '100vh',
        overflow: 'hidden',
        zIndex: 200,
        boxShadow: isMobile && open ? '0 18px 40px rgba(0,0,0,0.2)' : 'none',
      }}>
        <div style={{ padding: '18px 14px', display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', minHeight: 62 }}>
          {open && <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--primary, #e94560)' }}>Shop<span style={{ color: '#fff' }}>Admin</span></span>}
          <button onClick={() => setOpen(!open)} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            {open ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        <nav style={{ flex: 1, padding: '14px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 12px', borderRadius: 10, marginBottom: 3,
                color: isActive ? '#fff' : '#9ca3af',
                background: isActive ? 'var(--primary, #e94560)' : 'transparent',
                fontWeight: isActive ? 600 : 400, fontSize: 14,
                transition: 'all 0.2s', whiteSpace: 'nowrap', overflow: 'hidden', textDecoration: 'none',
              })}>
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {open && item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', width: '100%', background: 'none', border: 'none', color: '#9ca3af', fontSize: 14, cursor: 'pointer', borderRadius: 8, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <FiEye size={18} style={{ flexShrink: 0 }} />{open && 'View Store'}
          </button>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', width: '100%', background: 'none', border: 'none', color: '#f87171', fontSize: 14, cursor: 'pointer', borderRadius: 8, whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <FiLogOut size={18} style={{ flexShrink: 0 }} />{open && 'Logout'}
          </button>
        </div>
      </aside>

      {isMobile && open && (
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 150 }} />
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ background: 'var(--card-bg)', padding: isMobile ? '0 16px' : '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
          {isMobile && (
            <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 10, marginRight: 8 }}>
              <FiMenu size={22} />
            </button>
          )}
          <div style={{ fontSize: 14, color: 'var(--gray)' }}>
            Welcome back, <strong style={{ color: 'var(--text-color)' }}>{user?.name}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <NavLink to="/admin/settings" title="Store Settings" style={{ color: 'var(--gray)', display: 'flex', alignItems: 'center' }}>
              <FiSettings size={20} />
            </NavLink>
            <img src={user?.avatar?.url} alt={user?.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
          </div>
        </header>
        <main className="admin-main" style={{ flex: 1, padding: isMobile ? 16 : 28, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
