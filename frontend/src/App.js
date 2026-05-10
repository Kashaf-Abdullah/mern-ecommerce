import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, WishlistProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

const Home          = lazy(() => import('./pages/user/Home'));
const ProductList   = lazy(() => import('./pages/user/ProductList'));
const ProductDetail = lazy(() => import('./pages/user/ProductDetail'));
const Cart          = lazy(() => import('./pages/user/Cart'));
const Wishlist      = lazy(() => import('./pages/user/Wishlist'));
const Checkout      = lazy(() => import('./pages/user/Checkout'));
const OrderSuccess  = lazy(() => import('./pages/user/OrderSuccess'));
const Orders        = lazy(() => import('./pages/user/Orders'));
const OrderDetail   = lazy(() => import('./pages/user/OrderDetail'));
const Profile       = lazy(() => import('./pages/user/Profile'));
const Login         = lazy(() => import('./pages/user/Login'));
const Register      = lazy(() => import('./pages/user/Register'));
const ForgotPassword= lazy(() => import('./pages/user/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/user/ResetPassword'));

const AdminDashboard  = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts   = lazy(() => import('./pages/admin/Products'));
const AdminOrders     = lazy(() => import('./pages/admin/Orders'));
const AdminUsers      = lazy(() => import('./pages/admin/Users'));
const AdminCategories = lazy(() => import('./pages/admin/Categories'));
const AdminCoupons    = lazy(() => import('./pages/admin/Coupons'));
const AdminSettings   = lazy(() => import('./pages/admin/Settings'));
const AdminNotifications = lazy(() => import('./pages/admin/Notifications'));
const AdminWishlistActivity = lazy(() => import('./pages/admin/WishlistActivity'));
const Notifications = lazy(() => import('./pages/user/Notifications'));
const NotificationDetail = lazy(() => import('./pages/user/NotificationDetail'));

const Navbar      = lazy(() => import('./components/common/Navbar'));
const Footer      = lazy(() => import('./components/common/Footer'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));

const Spinner = () => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
    <div className="spinner" />
  </div>
);

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

const UserLayout = ({ children }) => (
  <Suspense fallback={<Spinner />}>
    <Navbar />
    <main style={{ minHeight: '70vh' }}>{children}</main>
    <Footer />
  </Suspense>
);

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/"              element={<UserLayout><Home /></UserLayout>} />
          <Route path="/products"      element={<UserLayout><ProductList /></UserLayout>} />
          <Route path="/products/:id"  element={<UserLayout><ProductDetail /></UserLayout>} />
          <Route path="/cart"          element={<UserLayout><Cart /></UserLayout>} />

          <Route path="/login"         element={<PublicRoute><UserLayout><Login /></UserLayout></PublicRoute>} />
          <Route path="/register"      element={<PublicRoute><UserLayout><Register /></UserLayout></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><UserLayout><ForgotPassword /></UserLayout></PublicRoute>} />
          <Route path="/reset-password/:token" element={<PublicRoute><UserLayout><ResetPassword /></UserLayout></PublicRoute>} />

          <Route path="/wishlist"      element={<ProtectedRoute><UserLayout><Wishlist /></UserLayout></ProtectedRoute>} />
          <Route path="/checkout"      element={<ProtectedRoute><UserLayout><Checkout /></UserLayout></ProtectedRoute>} />
          <Route path="/order-success/:orderId" element={<ProtectedRoute><UserLayout><OrderSuccess /></UserLayout></ProtectedRoute>} />
          <Route path="/orders"        element={<ProtectedRoute><UserLayout><Orders /></UserLayout></ProtectedRoute>} />
          <Route path="/orders/:id"    element={<ProtectedRoute><UserLayout><OrderDetail /></UserLayout></ProtectedRoute>} />
          <Route path="/profile"       element={<ProtectedRoute><UserLayout><Profile /></UserLayout></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><UserLayout><Notifications /></UserLayout></ProtectedRoute>} />
          <Route path="/notifications/:id" element={<ProtectedRoute><UserLayout><NotificationDetail /></UserLayout></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
            <Route index             element={<AdminDashboard />} />
            <Route path="products"   element={<AdminProducts />} />
            <Route path="orders"     element={<AdminOrders />} />
            <Route path="users"      element={<AdminUsers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="coupons"    element={<AdminCoupons />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="wishlist-activity" element={<AdminWishlistActivity />} />
            <Route path="settings"   element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: { background: '#1a1a2e', color: '#fff', borderRadius: '8px', fontSize: '14px' },
                success: { style: { background: '#1a1a2e', color: '#fff' } },
                error:   { style: { background: '#dc3545', color: '#fff' } },
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
