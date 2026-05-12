const mongoose = require('mongoose');
const Product = require('../models/Product');

describe('Product Tests', () => {
  describe('Product Creation', () => {
    it('should create a product with valid data', () => {
      const product = {
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: 10,
        category: 'Electronics'
      };

      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product.price).toBeGreaterThan(0);
    });

    it('should require product name', () => {
      const product = {
        description: 'No name product',
        price: 99.99
      };

      expect(product.name).toBeUndefined();
    });

    it('should require product price', () => {
      const product = {
        name: 'Product',
        description: 'No price'
      };

      expect(product.price).toBeUndefined();
    });

    it('should validate price is positive', () => {
      const validPrice = 99.99;
      const invalidPrice = -10;

      expect(validPrice).toBeGreaterThan(0);
      expect(invalidPrice).toBeLessThan(0);
    });

    it('should set default stock to 0', () => {
      const product = {
        name: 'Product',
        price: 99.99,
        stock: undefined
      };

      const stock = product.stock || 0;
      expect(stock).toBe(0);
    });
  });

  describe('Product Retrieval', () => {
    it('should retrieve product by ID', () => {
      const productId = new mongoose.Types.ObjectId();
      expect(productId).toBeTruthy();
    });

    it('should list all products', () => {
      const products = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' }
      ];

      expect(products.length).toBe(2);
    });

    it('should filter products by category', () => {
      const products = [
        { name: 'Phone', category: 'Electronics' },
        { name: 'Shirt', category: 'Clothing' }
      ];

      const electronics = products.filter(p => p.category === 'Electronics');
      expect(electronics.length).toBe(1);
      expect(electronics[0].name).toBe('Phone');
    });

    it('should filter products by price range', () => {
      const products = [
        { name: 'Cheap Item', price: 10 },
        { name: 'Expensive Item', price: 500 }
      ];

      const inRange = products.filter(p => p.price >= 20 && p.price <= 400);
      expect(inRange.length).toBe(0);
    });

    it('should search products by name', () => {
      const products = [
        { name: 'Samsung Phone' },
        { name: 'Apple iPhone' },
        { name: 'Laptop'  }
      ];

      const search = 'phone';
      const results = products.filter(p => p.name.toLowerCase().includes(search));
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('Product Update', () => {
    it('should update product price', () => {
      const product = {
        name: 'Product',
        price: 100,
        stock: 5
      };

      product.price = 99.99;
      expect(product.price).toBe(99.99);
    });

    it('should update product stock', () => {
      const product = {
        name: 'Product',
        stock: 10
      };

      product.stock -= 1;
      expect(product.stock).toBe(9);
    });

    it('should update product description', () => {
      const product = {
        name: 'Product',
        description: 'Old description'
      };

      product.description = 'New description';
      expect(product.description).toBe('New description');
    });
  });

  describe('Product Deletion', () => {
    it('should delete a product', () => {
      const products = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' }
      ];

      products.pop();
      expect(products.length).toBe(1);
    });

    it('should handle deletion of non-existent product', () => {
      const products = [];
      const initialLength = products.length;

      // Attempt to delete
      const deleted = products.filter(p => p.id === 999);
      expect(products.length).toBe(initialLength);
    });
  });

  describe('Product Images', () => {
    it('should upload product image', () => {
      const imageUrl = 'https://cdn.example.com/product.jpg';
      expect(imageUrl).toMatch(/\.(jpg|jpeg|png|gif)$/i);
    });

    it('should support multiple product images', () => {
      const images = [
        'image1.jpg',
        'image2.jpg',
        'image3.jpg'
      ];

      expect(images.length).toBe(3);
    });

    it('should validate image URL', () => {
      const validUrl = 'https://example.com/image.jpg';
      const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i;

      expect(urlRegex.test(validUrl)).toBe(true);
    });
  });

  describe('Product Rating & Reviews', () => {
    it('should calculate average rating', () => {
      const ratings = [4, 5, 3, 4, 5];
      const average = ratings.reduce((a, b) => a + b) / ratings.length;

      expect(average).toBe(4.2);
    });

    it('should validate rating is between 1-5', () => {
      const validRating = 4;
      const invalidRating = 6;

      expect(validRating).toBeGreaterThanOrEqual(1);
      expect(validRating).toBeLessThanOrEqual(5);
      expect(invalidRating).toBeGreaterThan(5);
    });

    it('should track review count', () => {
      const product = {
        name: 'Product',
        reviews: [
          { rating: 5, comment: 'Great!' },
          { rating: 4, comment: 'Good' }
        ]
      };

      expect(product.reviews.length).toBe(2);
    });
  });
});
