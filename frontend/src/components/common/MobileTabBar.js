import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiGrid, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart, useWishlist } from '../../context/CartContext';

const Badge = ({ count }) => (count > 0 ? <span className="tab-badge">{count > 99 ? '99+' : count}</span> : null);

// Bottom navigation for phones; hidden on tablet/desktop via CSS
const MobileTabBar = () => {
  const { isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const wishCount = wishlist?.products?.length || 0;

  const items = [
    { to: '/', label: 'Home', icon: <FiHome size={20} />, end: true },
    { to: '/products', label: 'Shop', icon: <FiGrid size={20} /> },
    { to: '/wishlist', label: 'Wishlist', icon: <FiHeart size={20} />, count: wishCount },
    { to: '/cart', label: 'Cart', icon: <FiShoppingCart size={20} />, count: cartCount },
    { to: isAuthenticated ? '/profile' : '/login', label: isAuthenticated ? 'Account' : 'Sign in', icon: <FiUser size={20} /> },
  ];

  return (
    <nav className="tabbar" aria-label="Main">
      {items.map(i => (
        <NavLink key={i.label} to={i.to} end={i.end} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}>
          <span className="tab-icon">{i.icon}<Badge count={i.count} /></span>
          <span>{i.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileTabBar;
