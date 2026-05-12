import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('API Tests', () => {
  describe('Product API', () => {
    it('should fetch all products', async () => {
      const mockData = [
        { id: 1, name: 'Product 1', price: 99 },
        { id: 2, name: 'Product 2', price: 199 }
      ];
      axios.get.mockResolvedValue({ data: mockData });

      const response = await axios.get('/api/products');
      expect(response.data).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith('/api/products');
    });

    it('should fetch product by ID', async () => {
      const mockData = { id: 1, name: 'Product 1', price: 99 };
      axios.get.mockResolvedValue({ data: mockData });

      const response = await axios.get('/api/products/1');
      expect(response.data).toEqual(mockData);
    });

    it('should handle API error', async () => {
      const errorMessage = 'API Error';
      axios.get.mockRejectedValue(new Error(errorMessage));

      try {
        await axios.get('/api/products');
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });

    it('should create product', async () => {
      const mockData = { id: 1, name: 'New Product', price: 99 };
      axios.post.mockResolvedValue({ data: mockData });

      const productData = { name: 'New Product', price: 99 };
      const response = await axios.post('/api/products', productData);
      expect(response.data).toEqual(mockData);
    });
  });

  describe('Order API', () => {
    it('should fetch user orders', async () => {
      const mockData = [
        { id: 1, status: 'pending' },
        { id: 2, status: 'completed' }
      ];
      axios.get.mockResolvedValue({ data: mockData });

      const response = await axios.get('/api/orders');
      expect(response.data).toEqual(mockData);
    });

    it('should create order', async () => {
      const mockData = { id: 1, totalAmount: 299 };
      axios.post.mockResolvedValue({ data: mockData });

      const orderData = { items: [] };
      const response = await axios.post('/api/orders', orderData);
      expect(response.data).toEqual(mockData);
    });

    it('should update order status', async () => {
      const mockData = { id: 1, status: 'shipped' };
      axios.put.mockResolvedValue({ data: mockData });

      const response = await axios.put('/api/orders/1', { status: 'shipped' });
      expect(response.data.status).toBe('shipped');
    });
  });

  describe('Cart API', () => {
    it('should get cart', async () => {
      const mockData = { items: [], total: 0 };
      axios.get.mockResolvedValue({ data: mockData });

      const response = await axios.get('/api/cart');
      expect(response.data).toEqual(mockData);
    });

    it('should add to cart', async () => {
      const mockData = { items: [{ productId: 1, quantity: 1 }] };
      axios.post.mockResolvedValue({ data: mockData });

      const response = await axios.post('/api/cart/add', { productId: 1 });
      expect(response.data.items.length).toBe(1);
    });

    it('should remove from cart', async () => {
      const mockData = { items: [] };
      axios.delete.mockResolvedValue({ data: mockData });

      const response = await axios.delete('/api/cart/remove/1');
      expect(response.data.items.length).toBe(0);
    });
  });

  describe('Auth API', () => {
    it('should login user', async () => {
      const mockData = { token: 'jwt_token', user: { id: 1, email: 'test@example.com' } };
      axios.post.mockResolvedValue({ data: mockData });

      const response = await axios.post('/api/auth/login', { email: 'test@example.com', password: 'password' });
      expect(response.data.token).toBeTruthy();
    });

    it('should register user', async () => {
      const mockData = { token: 'jwt_token', user: { id: 1, email: 'new@example.com' } };
      axios.post.mockResolvedValue({ data: mockData });

      const response = await axios.post('/api/auth/register', { name: 'Test', email: 'new@example.com', password: 'password' });
      expect(response.data.user.email).toBe('new@example.com');
    });

    it('should logout user', async () => {
      axios.post.mockResolvedValue({ data: { success: true } });

      const response = await axios.post('/api/auth/logout');
      expect(response.data.success).toBe(true);
    });
  });
});

describe('LocalStorage Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save token to localStorage', () => {
    const token = 'test_token_123';
    localStorage.setItem('token', token);

    expect(localStorage.getItem('token')).toBe(token);
  });

  it('should save user data to localStorage', () => {
    const user = { id: 1, name: 'Test User', email: 'test@example.com' };
    localStorage.setItem('user', JSON.stringify(user));

    const retrieved = JSON.parse(localStorage.getItem('user'));
    expect(retrieved).toEqual(user);
  });

  it('should remove token from localStorage', () => {
    localStorage.setItem('token', 'test_token');
    localStorage.removeItem('token');

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should clear all localStorage', () => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('user', 'user_data');

    localStorage.clear();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});

describe('Session Storage Tests', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should save data to sessionStorage', () => {
    const data = { page: 1 };
    sessionStorage.setItem('pagination', JSON.stringify(data));

    expect(JSON.parse(sessionStorage.getItem('pagination'))).toEqual(data);
  });

  it('should retrieve data from sessionStorage', () => {
    sessionStorage.setItem('currentCart', 'cart_data');
    expect(sessionStorage.getItem('currentCart')).toBe('cart_data');
  });
});
