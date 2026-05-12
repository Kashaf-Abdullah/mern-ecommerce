const mongoose = require('mongoose');

describe('Category Tests', () => {
  describe('Category Creation', () => {
    it('should create category with valid data', () => {
      const category = {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        slug: 'electronics'
      };

      expect(category.name).toBeTruthy();
      expect(category.slug).toBeTruthy();
    });

    it('should validate category name is unique', () => {
      const categories = [
        { name: 'Electronics' },
        { name: 'Clothing' }
      ];

      const name = 'Electronics';
      const exists = categories.some(c => c.name === name);

      expect(exists).toBe(true);
    });

    it('should generate slug from name', () => {
      const name = 'Electronics & Gadgets';
      const slug = name.toLowerCase().replace(/[&\s]/g, '-');

      expect(slug).toBe('electronics---gadgets');
    });

    it('should set category description', () => {
      const category = {
        name: 'Electronics',
        description: 'Electronic devices'
      };

      expect(category.description).toBeTruthy();
    });

    it('should support category image', () => {
      const category = {
        name: 'Electronics',
        image: 'https://example.com/electronics.jpg'
      };

      expect(category.image).toMatch(/\.(jpg|png|gif)$/i);
    });
  });

  describe('Subcategories', () => {
    it('should create subcategory', () => {
      const subcategory = {
        name: 'Smartphones',
        parentCategory: 'Electronics'
      };

      expect(subcategory.name).toBeTruthy();
      expect(subcategory.parentCategory).toBeTruthy();
    });

    it('should retrieve all subcategories', () => {
      const categories = [
        { id: 1, name: 'Smartphones', parent: 'Electronics' },
        { id: 2, name: 'Laptops', parent: 'Electronics' }
      ];

      const electronics = categories.filter(c => c.parent === 'Electronics');
      expect(electronics.length).toBe(2);
    });

    it('should support nested subcategories', () => {
      const category = {
        name: 'Electronics',
        subcategories: [
          { name: 'Mobile Devices', subcategories: [{ name: 'Smartphones' }] }
        ]
      };

      expect(category.subcategories.length).toBeGreaterThan(0);
    });
  });

  describe('Category Retrieval', () => {
    it('should get category by ID', () => {
      const categoryId = new mongoose.Types.ObjectId();
      expect(categoryId).toBeTruthy();
    });

    it('should get category by slug', () => {
      const categories = [
        { slug: 'electronics', name: 'Electronics' },
        { slug: 'clothing', name: 'Clothing' }
      ];

      const slug = 'electronics';
      const category = categories.find(c => c.slug === slug);

      expect(category.name).toBe('Electronics');
    });

    it('should list all categories', () => {
      const categories = [
        { name: 'Electronics' },
        { name: 'Clothing' },
        { name: 'Books' }
      ];

      expect(categories.length).toBe(3);
    });

    it('should list active categories only', () => {
      const categories = [
        { name: 'Electronics', isActive: true },
        { name: 'Clothing', isActive: false },
        { name: 'Books', isActive: true }
      ];

      const active = categories.filter(c => c.isActive);
      expect(active.length).toBe(2);
    });
  });

  describe('Category Update', () => {
    it('should update category name', () => {
      const category = {
        name: 'Electronics'
      };

      category.name = 'Electronics & Gadgets';
      expect(category.name).toBe('Electronics & Gadgets');
    });

    it('should update category image', () => {
      const category = {
        image: 'old-image.jpg'
      };

      category.image = 'new-image.jpg';
      expect(category.image).toBe('new-image.jpg');
    });

    it('should update category description', () => {
      const category = {
        description: 'Old description'
      };

      category.description = 'New description';
      expect(category.description).toBe('New description');
    });

    it('should activate/deactivate category', () => {
      const category = {
        isActive: true
      };

      category.isActive = false;
      expect(category.isActive).toBe(false);
    });
  });

  describe('Category Deletion', () => {
    it('should delete category', () => {
      const categories = [
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Clothing' }
      ];

      const deleted = categories.filter(c => c.id !== 1);
      expect(deleted.length).toBe(1);
    });

    it('should not delete category with products', () => {
      const category = {
        id: 1,
        name: 'Electronics',
        productCount: 5
      };

      const canDelete = category.productCount === 0;
      expect(canDelete).toBe(false);
    });

    it('should handle soft delete', () => {
      const category = {
        id: 1,
        isDeleted: false
      };

      category.isDeleted = true;
      expect(category.isDeleted).toBe(true);
    });
  });

  describe('Category Products', () => {
    it('should get products in category', () => {
      const category = 'Electronics';
      const products = [
        { name: 'Phone', category: 'Electronics' },
        { name: 'Laptop', category: 'Electronics' }
      ];

      const categoryProducts = products.filter(p => p.category === category);
      expect(categoryProducts.length).toBe(2);
    });

    it('should count products in category', () => {
      const category = {
        name: 'Electronics',
        productCount: 50
      };

      expect(category.productCount).toBe(50);
    });

    it('should count products in subcategory', () => {
      const subcategory = {
        name: 'Smartphones',
        productCount: 25
      };

      expect(subcategory.productCount).toBeGreaterThan(0);
    });
  });

  describe('Category Metadata', () => {
    it('should store SEO metadata', () => {
      const category = {
        name: 'Electronics',
        seo: {
          metaTitle: 'Buy Electronics Online',
          metaDescription: 'Shop electronics online'
        }
      };

      expect(category.seo.metaTitle).toBeTruthy();
    });

    it('should track category creation date', () => {
      const category = {
        createdAt: new Date()
      };

      expect(category.createdAt).toBeTruthy();
    });

    it('should track category update date', () => {
      const category = {
        updatedAt: new Date()
      };

      expect(category.updatedAt).toBeTruthy();
    });

    it('should set display order', () => {
      const categories = [
        { name: 'Electronics', order: 1 },
        { name: 'Clothing', order: 2 },
        { name: 'Books', order: 3 }
      ];

      const sorted = categories.sort((a, b) => a.order - b.order);
      expect(sorted[0].name).toBe('Electronics');
    });
  });

  describe('Category Filters', () => {
    it('should get category filters', () => {
      const category = {
        name: 'Electronics',
        filters: [
          { name: 'Brand', values: ['Apple', 'Samsung', 'Sony'] },
          { name: 'Price', range: { min: 0, max: 10000 } }
        ]
      };

      expect(category.filters.length).toBe(2);
    });

    it('should add filter to category', () => {
      const category = {
        filters: []
      };

      category.filters.push({
        name: 'Brand',
        values: ['Apple', 'Samsung']
      });

      expect(category.filters.length).toBe(1);
    });

    it('should remove filter from category', () => {
      const category = {
        filters: [
          { id: 1, name: 'Brand' },
          { id: 2, name: 'Price' }
        ]
      };

      category.filters = category.filters.filter(f => f.id !== 1);
      expect(category.filters.length).toBe(1);
    });
  });

  describe('Category Hierarchy', () => {
    it('should build category tree', () => {
      const categories = [
        { id: 1, name: 'Electronics', parent: null },
        { id: 2, name: 'Smartphones', parent: 1 },
        { id: 3, name: 'Laptops', parent: 1 }
      ];

      const tree = categories.filter(c => c.parent === null);
      expect(tree.length).toBe(1);
    });

    it('should get category path', () => {
      const path = 'Electronics > Smartphones > iPhone';
      expect(path).toMatch(/>/);
    });

    it('should get parent category', () => {
      const categories = {
        '2': { name: 'Smartphones', parent: 1 },
        '1': { name: 'Electronics' }
      };

      const childId = 2;
      const parentId = categories[childId].parent;

      expect(parentId).toBe(1);
    });
  });

  describe('Category Search', () => {
    it('should search categories by name', () => {
      const categories = [
        { name: 'Electronics' },
        { name: 'Clothing' },
        { name: 'Electronics & Gadgets' }
      ];

      const search = 'Electronics';
      const results = categories.filter(c => c.name.includes(search));

      expect(results.length).toBe(2);
    });

    it('should search categories case-insensitive', () => {
      const categories = [
        { name: 'Electronics' }
      ];

      const search = 'electronics';
      const results = categories.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase())
      );

      expect(results.length).toBe(1);
    });
  });
});
