describe('Utility Functions Tests', () => {
  // Price formatting
  describe('Price Formatting', () => {
    const formatPrice = (price) => `$${price.toFixed(2)}`;

    it('should format whole number prices', () => {
      expect(formatPrice(99)).toBe('$99.00');
    });

    it('should format decimal prices', () => {
      expect(formatPrice(99.99)).toBe('$99.99');
    });

    it('should handle large prices', () => {
      expect(formatPrice(9999.99)).toBe('$9999.99');
    });

    it('should handle zero price', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });
  });

  // Date formatting
  describe('Date Formatting', () => {
    const formatDate = (date) => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US');
    };

    it('should format date correctly', () => {
      const date = '2024-01-15';
      const formatted = formatDate(date);
      expect(formatted).toBeTruthy();
    });

    it('should handle different date formats', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('01-15-2024');
      expect(formatDate(date1)).toBeTruthy();
      expect(formatDate(date2)).toBeTruthy();
    });
  });

  // String validation
  describe('String Validation', () => {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const isValidPhone = (phone) => {
      const phoneRegex = /^\d{10}$/;
      return phoneRegex.test(phone);
    };

    it('should validate email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
    });

    it('should validate phone', () => {
      expect(isValidPhone('1234567890')).toBe(true);
      expect(isValidPhone('123')).toBe(false);
    });
  });

  // Array operations
  describe('Array Operations', () => {
    const filterByPrice = (products, minPrice, maxPrice) => {
      return products.filter(p => p.price >= minPrice && p.price <= maxPrice);
    };

    const sortByPrice = (products) => {
      return [...products].sort((a, b) => a.price - b.price);
    };

    const getUniqueCategories = (products) => {
      return [...new Set(products.map(p => p.category))];
    };

    it('should filter products by price', () => {
      const products = [
        { name: 'Item 1', price: 50 },
        { name: 'Item 2', price: 150 },
        { name: 'Item 3', price: 200 }
      ];

      const filtered = filterByPrice(products, 100, 200);
      expect(filtered.length).toBe(2);
    });

    it('should sort products by price', () => {
      const products = [
        { name: 'Item 1', price: 200 },
        { name: 'Item 2', price: 50 },
        { name: 'Item 3', price: 150 }
      ];

      const sorted = sortByPrice(products);
      expect(sorted[0].price).toBe(50);
      expect(sorted[2].price).toBe(200);
    });

    it('should get unique categories', () => {
      const products = [
        { name: 'Item 1', category: 'Electronics' },
        { name: 'Item 2', category: 'Clothing' },
        { name: 'Item 3', category: 'Electronics' }
      ];

      const categories = getUniqueCategories(products);
      expect(categories.length).toBe(2);
    });
  });

  // Cart calculations
  describe('Cart Calculations', () => {
    const calculateSubtotal = (items) => {
      return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const calculateTax = (subtotal) => {
      return subtotal * 0.18; // 18% GST
    };

    const calculateTotal = (subtotal, tax, discount = 0) => {
      return subtotal + tax - discount;
    };

    it('should calculate subtotal', () => {
      const items = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 }
      ];

      expect(calculateSubtotal(items)).toBe(250);
    });

    it('should calculate tax', () => {
      expect(calculateTax(100)).toBe(18);
    });

    it('should calculate total with discount', () => {
      const subtotal = 250;
      const tax = calculateTax(subtotal);
      const discount = 25;

      expect(calculateTotal(subtotal, tax, discount)).toBe(subtotal + tax - discount);
    });
  });

  // String manipulation
  describe('String Manipulation', () => {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-');
    const truncate = (str, length) => str.length > length ? str.slice(0, length) + '...' : str;

    it('should capitalize string', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should slugify string', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should truncate string', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });
  });

  // Number operations
  describe('Number Operations', () => {
    const roundPrice = (price) => Math.round(price * 100) / 100;
    const isEven = (num) => num % 2 === 0;
    const isPositive = (num) => num > 0;

    it('should round price correctly', () => {
      expect(roundPrice(99.999)).toBe(100);
      expect(roundPrice(99.994)).toBe(99.99);
    });

    it('should check if number is even', () => {
      expect(isEven(4)).toBe(true);
      expect(isEven(5)).toBe(false);
    });

    it('should check if number is positive', () => {
      expect(isPositive(10)).toBe(true);
      expect(isPositive(-10)).toBe(false);
    });
  });

  // Object operations
  describe('Object Operations', () => {
    const mergeObjects = (obj1, obj2) => ({ ...obj1, ...obj2 });
    const getObjectKeys = (obj) => Object.keys(obj);
    const filterObject = (obj, key) => {
      const newObj = { ...obj };
      delete newObj[key];
      return newObj;
    };

    it('should merge objects', () => {
      const result = mergeObjects({ a: 1 }, { b: 2 });
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should get object keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(getObjectKeys(obj).length).toBe(3);
    });

    it('should filter object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const filtered = filterObject(obj, 'b');
      expect(filtered).toEqual({ a: 1, c: 3 });
    });
  });
});
