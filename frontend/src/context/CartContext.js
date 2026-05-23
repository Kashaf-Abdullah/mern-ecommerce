import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI, wishlistAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// ==================== CART CONTEXT ====================
const CartContext = createContext(null);

const LOCAL_CART_KEY = 'shopnow_cart';
const DEFAULT_CART = { items: [], discountAmount: 0 };

const loadLocalCart = () => {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_CART;
  } catch {
    return DEFAULT_CART;
  }
};

const getEffectivePrice = (product) => (product.discountPrice > 0 ? product.discountPrice : product.price);
const matchesCartItem = (item, itemId) => item._id === itemId || item.product?._id === itemId;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => loadLocalCart());
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await cartAPI.get();
      setCart(data.cart);
    } catch (err) {
      console.error('Cart fetch error:', err);
    }
  };

  useEffect(() => { fetchCart(); }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1, product = null) => {
    const qty = Math.max(1, Number(quantity) || 1);

    if (!isAuthenticated) {
      if (!product) { toast.error('Unable to add item to cart'); return; }
      const available = product.stock ?? Infinity;
      if (available <= 0) { toast.error('Product is out of stock'); return; }

      const existingItem = cart.items.find(item => matchesCartItem(item, productId));
      const nextItems = existingItem
        ? cart.items.map(item => matchesCartItem(item, productId)
            ? {
                ...item,
                product,
                quantity: Math.min(available, item.quantity + qty),
                price: getEffectivePrice(product)
              }
            : item
          )
        : [...cart.items, {
            _id: productId,
            product,
            quantity: Math.min(qty, available),
            price: getEffectivePrice(product)
          }];

      setCart({ ...cart, items: nextItems });
      toast.success('Added to cart!');
      return;
    }

    setLoading(true);
    try {
      const { data } = await cartAPI.add(productId, quantity);
      setCart(data.cart);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally { setLoading(false); }
  };

  const updateItem = async (itemId, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);

    if (!isAuthenticated) {
      const nextItems = cart.items.map(item => {
        if (!matchesCartItem(item, itemId)) return item;
        const available = item.product?.stock ?? Infinity;
        return {
          ...item,
          quantity: Math.min(qty, available)
        };
      });
      setCart({ ...cart, items: nextItems });
      toast.success('Cart updated');
      return;
    }

    setLoading(true);
    try {
      const { data } = await cartAPI.update(itemId, qty);
      setCart(data.cart);
      toast.success('Cart updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart');
    } finally { setLoading(false); }
  };

  const removeItem = async (productId) => {
    if (!isAuthenticated) {
      setCart({ ...cart, items: cart.items.filter(item => !matchesCartItem(item, productId)) });
      toast.success('Item removed');
      return;
    }

    setLoading(true);
    try {
      const { data } = await cartAPI.remove(productId);
      setCart(data.cart);
      toast.success('Item removed');
    } catch (err) {
      toast.error('Failed to remove item');
    } finally { setLoading(false); }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      setCart(DEFAULT_CART);
      return;
    }

    try {
      await cartAPI.clear();
      setCart(DEFAULT_CART);
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  };

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const subtotal = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, cartCount, subtotal, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

// ==================== WISHLIST CONTEXT ====================
const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      wishlistAPI.get().then(({ data }) => setWishlist(data.wishlist)).catch(() => {});
    }
  }, [isAuthenticated]);

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) { toast.error('Please login to save to wishlist'); return; }
    try {
      const { data } = await wishlistAPI.toggle(productId);
      const { data: wishlistData } = await wishlistAPI.get();
      setWishlist(wishlistData.wishlist);
      toast.success(data.action === 'added' ? 'Added to wishlist!' : 'Removed from wishlist');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const isWishlisted = (productId) => {
    return wishlist?.products?.some(p => {
      const id = p._id || p;
      return id.toString() === productId.toString();
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
