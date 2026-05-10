import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor — attach JWT
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Response interceptor — handle 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.get('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => API.put(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => API.get(`/auth/verify-email/${token}`),
  updatePassword: (data) => API.put('/auth/update-password', data),
};

// ==================== PRODUCTS ====================
export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
//   uploadImages: (id, formData) => API.post(`/products/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   deleteImage: (id, imageId) => API.delete(`/products/${id}/images/${imageId}`),
//   getSuggestions: (q) => API.get('/products/suggestions', { params: { q } }),
// };
uploadImages: (id, formData) => API.post(`/products/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage: (id, imageId) => API.delete(`/products/${id}/images/${imageId}`),
  getSuggestions: (q) => API.get('/products/suggestions', { params: { q } }),
};

// ==================== CATEGORIES ====================
// export const categoryAPI = {
  // getAll: () => API.get('/categories'),
  // create: (data) => API.post('/categories', data),
  // update: (id, data) => API.put(`/categories/${id}`, data),
  export const categoryAPI = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

// ==================== CART ====================
export const cartAPI = {
  get: () => API.get('/cart'),
  add: (productId, quantity) => API.post('/cart/add', { productId, quantity }),
  update: (itemId, quantity) => API.put(`/cart/items/${itemId}`, { quantity }),
  remove: (productId) => API.delete(`/cart/items/${productId}`),
  clear: () => API.delete('/cart/clear'),
};

// ==================== WISHLIST ====================
export const wishlistAPI = {
  get: () => API.get('/wishlist'),
  toggle: (productId) => API.post('/wishlist/toggle', { productId }),
};

// ==================== ORDERS ====================
export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMyOrders: (params) => API.get('/orders/my', { params }),
  getOne: (id) => API.get(`/orders/${id}`),
  cancel: (id, reason) => API.put(`/orders/${id}/cancel`, { reason }),
  getAll: (params) => API.get('/orders', { params }),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
};

// ==================== PAYMENT ====================
export const paymentAPI = {
  createStripeIntent: (amount) => API.post('/payment/stripe/create-intent', { amount }),
  confirmStripe: (data) => API.post('/payment/stripe/confirm', data),
  createRazorpayOrder: (data) => API.post('/payment/razorpay/create-order', data),
  verifyRazorpay: (data) => API.post('/payment/razorpay/verify', data),
};

// ==================== REVIEWS ====================
export const reviewAPI = {
  getForProduct: (productId, params) => API.get(`/reviews/product/${productId}`, { params }),
  create: (data) => API.post('/reviews', data),
  delete: (id) => API.delete(`/reviews/${id}`),
};

// ==================== COUPONS ====================
export const couponAPI = {
  validate: (code, orderAmount) => API.post('/coupons/validate', { code, orderAmount }),
  getAll: () => API.get('/coupons'),
  create: (data) => API.post('/coupons', data),
  update: (id, data) => API.put(`/coupons/${id}`, data),
  delete: (id) => API.delete(`/coupons/${id}`),
};

// ==================== USER ====================
export const userAPI = {
  updateProfile: (data) => API.put('/users/profile', data),
  addAddress: (data) => API.post('/users/addresses', data),
  updateAddress: (id, data) => API.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => API.delete(`/users/addresses/${id}`),
  uploadAvatar: (formData) => API.post('/upload/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getNotifications: () => API.get('/users/notifications'),
  getNotification: (id) => API.get(`/users/notifications/${id}`),
};

// ==================== ADMIN ====================
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: (params) => API.get('/admin/users', { params }),
  getAllUsers: () => API.get('/admin/users'),
  toggleBlock: (id) => API.put(`/admin/users/${id}/toggle-block`),
  getNotifications: () => API.get('/admin/notifications'),
  createNotification: (data) => API.post('/admin/notifications', data),
  getWishlistActivity: (page = 1) => API.get('/admin/wishlist-activity', { params: { page } }),
};

// ==================== STORE SETTINGS ====================
export const settingsAPI = {
  getAll: () => API.get('/settings'),
  get: (key) => API.get(`/settings/${key}`),
  save: (key, value) => API.post('/settings', { key, value }),
  saveBulk: (settings) => API.post('/settings/bulk', { settings }),
  uploadReceipt: (formData) => API.post('/settings/upload-receipt', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadLogo: (formData) => API.post('/upload/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export default API;
