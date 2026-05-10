import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiPercent, FiSettings, FiBell, FiHeart, FiMenu, FiX, FiLogOut, FiEye } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

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
  const [open, setOpen] = useState(true);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f9' }}>
      <aside style={{ width: open ? 240 : 64, background: '#1a1a2e', color: '#fff', transition: 'width 0.28s', flexShrink: 0, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', zIndex: 200 }}>
        <div style={{ padding: '18px 14px', display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', minHeight: 62 }}>
          {open && <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--primary, #e94560)' }}>Shop<span style={{ color: '#fff' }}>Admin</span></span>}
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

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ background: '#fff', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 14, color: '#6b7280' }}>
            Welcome back, <strong style={{ color: '#1a1a2e' }}>{user?.name}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <NavLink to="/admin/settings" title="Store Settings" style={{ color: '#6b7280', display: 'flex', alignItems: 'center' }}>
              <FiSettings size={20} />
            </NavLink>
            <img src={user?.avatar?.url} alt={user?.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }} />
          </div>
        </header>
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
