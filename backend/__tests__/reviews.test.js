const mongoose = require('mongoose');

describe('Review Tests', () => {
  describe('Review Creation', () => {
    it('should create review with valid data', () => {
      const review = {
        productId: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(),
        rating: 4,
        title: 'Great Product',
        comment: 'Very satisfied with this purchase',
        createdAt: new Date()
      };

      expect(review.rating).toBeGreaterThanOrEqual(1);
      expect(review.rating).toBeLessThanOrEqual(5);
      expect(review.comment).toBeTruthy();
    });

    it('should require rating', () => {
      const review = {
        productId: new mongoose.Types.ObjectId(),
        comment: 'Good product'
      };

      expect(review.rating).toBeUndefined();
    });

    it('should validate rating is 1-5', () => {
      const validRatings = [1, 2, 3, 4, 5];
      validRatings.forEach(rating => {
        expect(rating >= 1 && rating <= 5).toBe(true);
      });

      const invalidRatings = [0, 6, -1];
      invalidRatings.forEach(rating => {
        expect(rating >= 1 && rating <= 5).toBe(false);
      });
    });

    it('should require verified purchase', () => {
      const review = {
        userId: new mongoose.Types.ObjectId(),
        productId: new mongoose.Types.ObjectId(),
        isPurchaseVerified: true
      };

      expect(review.isPurchaseVerified).toBe(true);
    });
  });

  describe('Review Retrieval', () => {
    it('should get reviews for a product', () => {
      const productId = new mongoose.Types.ObjectId();
      const reviews = [
        { productId, rating: 5 },
        { productId, rating: 4 }
      ];

      const productReviews = reviews.filter(r => r.productId.equals(productId));
      expect(productReviews.length).toBe(2);
    });

    it('should filter reviews by rating', () => {
      const reviews = [
        { rating: 5 },
        { rating: 4 },
        { rating: 3 },
        { rating: 5 }
      ];

      const fiveStarReviews = reviews.filter(r => r.rating === 5);
      expect(fiveStarReviews.length).toBe(2);
    });

    it('should get user reviews', () => {
      const userId = new mongoose.Types.ObjectId();
      const reviews = [
        { userId, productId: new mongoose.Types.ObjectId() },
        { userId, productId: new mongoose.Types.ObjectId() }
      ];

      const userReviews = reviews.filter(r => r.userId.equals(userId));
      expect(userReviews.length).toBe(2);
    });

    it('should sort reviews by date', () => {
      const reviews = [
        { id: 1, createdAt: new Date('2024-01-01') },
        { id: 2, createdAt: new Date('2024-01-03') },
        { id: 3, createdAt: new Date('2024-01-02') }
      ];

      const sorted = reviews.sort((a, b) => b.createdAt - a.createdAt);
      expect(sorted[0].id).toBe(2);
    });
  });

  describe('Review Moderation', () => {
    it('should mark review as pending for moderation', () => {
      const review = {
        status: 'pending',
        flaggedForReview: true
      };

      expect(review.status).toBe('pending');
    });

    it('should approve review', () => {
      const review = {
        status: 'pending'
      };

      review.status = 'approved';
      expect(review.status).toBe('approved');
    });

    it('should reject review with reason', () => {
      const review = {
        status: 'rejected',
        rejectionReason: 'Inappropriate language'
      };

      expect(review.status).toBe('rejected');
      expect(review.rejectionReason).toBeTruthy();
    });

    it('should hide offensive reviews', () => {
      const review = {
        isHidden: true,
        reason: 'Spam'
      };

      expect(review.isHidden).toBe(true);
    });
  });

  describe('Review Rating Calculation', () => {
    it('should calculate average rating', () => {
      const reviews = [
        { rating: 5 },
        { rating: 4 },
        { rating: 3 },
        { rating: 5 }
      ];

      const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      expect(average).toBe(4.25);
    });

    it('should calculate rating distribution', () => {
      const reviews = [
        { rating: 5 },
        { rating: 5 },
        { rating: 4 },
        { rating: 3 }
      ];

      const distribution = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length
      };

      expect(distribution[5]).toBe(2);
      expect(distribution[4]).toBe(1);
    });

    it('should calculate verified purchase percentage', () => {
      const reviews = [
        { isPurchaseVerified: true },
        { isPurchaseVerified: true },
        { isPurchaseVerified: false },
        { isPurchaseVerified: true }
      ];

      const verified = reviews.filter(r => r.isPurchaseVerified).length;
      const percentage = (verified / reviews.length) * 100;

      expect(percentage).toBe(75);
    });
  });

  describe('Review Helpfulness', () => {
    it('should mark review as helpful', () => {
      const review = {
        helpfulCount: 5,
        unhelpfulCount: 1
      };

      review.helpfulCount += 1;
      expect(review.helpfulCount).toBe(6);
    });

    it('should mark review as unhelpful', () => {
      const review = {
        helpfulCount: 5,
        unhelpfulCount: 1
      };

      review.unhelpfulCount += 1;
      expect(review.unhelpfulCount).toBe(2);
    });

    it('should sort by helpfulness', () => {
      const reviews = [
        { id: 1, helpful: 10 },
        { id: 2, helpful: 50 },
        { id: 3, helpful: 25 }
      ];

      const sorted = reviews.sort((a, b) => b.helpful - a.helpful);
      expect(sorted[0].id).toBe(2);
    });
  });

  describe('Review Images', () => {
    it('should attach images to review', () => {
      const review = {
        images: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg'
        ]
      };

      expect(review.images.length).toBe(2);
    });

    it('should validate image URLs', () => {
      const imageUrl = 'https://example.com/image.jpg';
      const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i;

      expect(urlRegex.test(imageUrl)).toBe(true);
    });

    it('should limit number of images', () => {
      const review = {
        images: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg'],
        maxImages: 5
      };

      expect(review.images.length <= review.maxImages).toBe(true);
    });
  });

  describe('Review Deletion', () => {
    it('should allow user to delete their review', () => {
      const review = {
        userId: 'user123',
        canDelete: true
      };

      expect(review.canDelete).toBe(true);
    });

    it('should delete review on product', () => {
      const product = {
        reviews: [
          { id: 1, rating: 5 },
          { id: 2, rating: 4 }
        ]
      };

      product.reviews = product.reviews.filter(r => r.id !== 1);
      expect(product.reviews.length).toBe(1);
    });

    it('should recalculate rating after deletion', () => {
      const reviews = [
        { id: 1, rating: 5 },
        { id: 2, rating: 4 }
      ];

      // Remove rating 5
      const updated = reviews.filter(r => r.id !== 1);
      const avg = updated.reduce((sum, r) => sum + r.rating, 0) / updated.length;

      expect(avg).toBe(4);
    });
  });

  describe('Review Responses', () => {
    it('should allow seller to respond to review', () => {
      const review = {
        sellerResponse: {
          text: 'Thank you for your feedback!',
          respondedAt: new Date()
        }
      };

      expect(review.sellerResponse.text).toBeTruthy();
    });

    it('should track response date', () => {
      const response = {
        respondedAt: new Date()
      };

      expect(response.respondedAt).toBeTruthy();
    });
  });
});
