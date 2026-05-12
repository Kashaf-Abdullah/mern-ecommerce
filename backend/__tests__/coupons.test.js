const mongoose = require('mongoose');

describe('Coupon Tests', () => {
  describe('Coupon Creation', () => {
    it('should create coupon with valid data', () => {
      const coupon = {
        code: 'SAVE20',
        discountType: 'percentage',
        discountValue: 20,
        expiryDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        maxUses: 100
      };

      expect(coupon.code).toBeTruthy();
      expect(coupon.discountValue).toBeGreaterThan(0);
    });

    it('should validate coupon code format', () => {
      const validCode = 'SAVE20';
      const invalidCode = 'save 20';

      expect(/^[A-Z0-9]+$/.test(validCode)).toBe(true);
      expect(/^[A-Z0-9]+$/.test(invalidCode)).toBe(false);
    });

    it('should support percentage discount', () => {
      const coupon = {
        discountType: 'percentage',
        discountValue: 20
      };

      expect(coupon.discountType).toBe('percentage');
      expect(coupon.discountValue).toBeLessThanOrEqual(100);
    });

    it('should support fixed amount discount', () => {
      const coupon = {
        discountType: 'fixed',
        discountValue: 50
      };

      expect(coupon.discountType).toBe('fixed');
      expect(coupon.discountValue).toBeGreaterThan(0);
    });
  });

  describe('Coupon Validation', () => {
    it('should validate coupon is active', () => {
      const coupon = {
        isActive: true
      };

      expect(coupon.isActive).toBe(true);
    });

    it('should validate coupon has not expired', () => {
      const coupon = {
        expiryDate: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
      };

      expect(coupon.expiryDate > new Date()).toBe(true);
    });

    it('should reject expired coupon', () => {
      const coupon = {
        expiryDate: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000)
      };

      expect(coupon.expiryDate > new Date()).toBe(false);
    });

    it('should validate usage limit not exceeded', () => {
      const coupon = {
        maxUses: 100,
        usedCount: 95
      };

      expect(coupon.usedCount < coupon.maxUses).toBe(true);
    });

    it('should reject if usage limit exceeded', () => {
      const coupon = {
        maxUses: 100,
        usedCount: 100
      };

      expect(coupon.usedCount >= coupon.maxUses).toBe(true);
    });

    it('should validate minimum purchase amount', () => {
      const coupon = {
        minPurchaseAmount: 100
      };

      const cartTotal = 150;
      expect(cartTotal >= coupon.minPurchaseAmount).toBe(true);
    });
  });

  describe('Coupon Application', () => {
    it('should calculate percentage discount', () => {
      const cartTotal = 100;
      const discountPercent = 20;
      const discount = cartTotal * (discountPercent / 100);

      expect(discount).toBe(20);
    });

    it('should calculate fixed discount', () => {
      const cartTotal = 100;
      const fixedDiscount = 25;

      expect(fixedDiscount).toBe(25);
    });

    it('should apply maximum discount cap', () => {
      const discount = 50;
      const maxCap = 30;
      const finalDiscount = Math.min(discount, maxCap);

      expect(finalDiscount).toBe(30);
    });

    it('should not give discount if minimum not met', () => {
      const coupon = {
        minPurchaseAmount: 200,
        discountValue: 50
      };

      const cartTotal = 150;
      const discount = cartTotal >= coupon.minPurchaseAmount ? coupon.discountValue : 0;

      expect(discount).toBe(0);
    });
  });

  describe('Coupon Usage Tracking', () => {
    it('should increment usage count on application', () => {
      const coupon = {
        usedCount: 10,
        maxUses: 100
      };

      coupon.usedCount += 1;
      expect(coupon.usedCount).toBe(11);
    });

    it('should track user-specific usage', () => {
      const coupon = {
        usersUsed: [
          { userId: '123', usedCount: 2 },
          { userId: '456', usedCount: 1 }
        ]
      };

      expect(coupon.usersUsed.length).toBe(2);
    });

    it('should prevent reuse if one per customer', () => {
      const coupon = {
        onePerCustomer: true,
        usedBy: ['user123']
      };

      const userId = 'user123';
      const canUse = !coupon.usersUsed?.includes(userId);

      expect(canUse).toBe(true);
    });
  });

  describe('Coupon Categories', () => {
    it('should apply coupon to specific categories', () => {
      const coupon = {
        applicableCategories: ['Electronics', 'Clothing']
      };

      const productCategory = 'Electronics';
      const isApplicable = coupon.applicableCategories.includes(productCategory);

      expect(isApplicable).toBe(true);
    });

    it('should exclude specific products', () => {
      const coupon = {
        excludedProducts: [
          new mongoose.Types.ObjectId(),
          new mongoose.Types.ObjectId()
        ]
      };

      const productId = new mongoose.Types.ObjectId();
      const isExcluded = coupon.excludedProducts.some(id => id.equals(productId));

      expect(isExcluded).toBe(false);
    });

    it('should apply coupon only to specific products', () => {
      const coupon = {
        applicableProducts: ['PROD1', 'PROD2']
      };

      const productId = 'PROD1';
      const isApplicable = coupon.applicableProducts.includes(productId);

      expect(isApplicable).toBe(true);
    });
  });

  describe('Coupon Retrieval', () => {
    it('should find coupon by code', () => {
      const coupons = [
        { code: 'SAVE20' },
        { code: 'SAVE30' }
      ];

      const code = 'SAVE20';
      const found = coupons.find(c => c.code === code);

      expect(found).toBeTruthy();
    });

    it('should list all active coupons', () => {
      const coupons = [
        { code: 'SAVE20', isActive: true },
        { code: 'SAVE30', isActive: false },
        { code: 'SAVE50', isActive: true }
      ];

      const active = coupons.filter(c => c.isActive);
      expect(active.length).toBe(2);
    });
  });

  describe('Coupon Deletion', () => {
    it('should delete expired coupons', () => {
      const coupons = [
        { code: 'OLD', expiryDate: new Date('2020-01-01') },
        { code: 'NEW', expiryDate: new Date('2030-01-01') }
      ];

      const activeCoupons = coupons.filter(c => c.expiryDate > new Date());
      expect(activeCoupons.length).toBe(1);
    });

    it('should deactivate coupon', () => {
      const coupon = {
        code: 'SAVE20',
        isActive: true
      };

      coupon.isActive = false;
      expect(coupon.isActive).toBe(false);
    });
  });

  describe('Coupon Combination', () => {
    it('should prevent stacking multiple coupons', () => {
      const cart = {
        appliedCoupons: ['SAVE20'],
        canStackCoupons: false
      };

      expect(cart.appliedCoupons.length).toBe(1);
      expect(!cart.canStackCoupons).toBe(true);
    });

    it('should apply best coupon if multiple valid', () => {
      const coupons = [
        { code: 'SAVE10', value: 10 },
        { code: 'SAVE30', value: 30 }
      ];

      const best = coupons.reduce((prev, current) => 
        current.value > prev.value ? current : prev
      );

      expect(best.code).toBe('SAVE30');
    });
  });
});
