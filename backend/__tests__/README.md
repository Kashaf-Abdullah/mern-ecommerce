# E-Commerce Backend Test Suite

## Overview
Comprehensive test suite for the MERN e-commerce backend covering all major features and functionality.

## Test Files

### Authentication Tests (`auth.test.js`)
- User Registration
  - Valid credentials registration
  - Duplicate email prevention
  - Email validation
  - Password hashing
- User Login
  - Valid credentials login
  - Incorrect password handling
  - Non-existent email handling
  - JWT token generation
- Email Verification
  - Verification email sending
  - Token validation
  - Expired token handling
  - User verification status
- Password Reset
  - Reset email sending
  - Reset token generation
  - Password reset with valid token
  - Expired token rejection
- User Logout
  - Successful logout
  - JWT invalidation
- Password Validation
  - Strong password requirements
  - Weak password rejection

### Product Tests (`products.test.js`)
- Product Creation
  - Valid product creation
  - Required fields validation
  - Price validation
  - Stock management
- Product Retrieval
  - Get product by ID
  - List all products
  - Filter by category
  - Filter by price range
  - Search by name
- Product Update
  - Update price
  - Update stock
  - Update description
- Product Deletion
  - Delete product
  - Handle non-existent product deletion
- Product Images
  - Image upload
  - Multiple image support
  - Image URL validation
- Product Rating & Reviews
  - Average rating calculation
  - Rating validation (1-5)
  - Review count tracking

### Order Tests (`orders.test.js`)
- Order Creation
  - Valid order creation
  - Required items validation
  - Total amount calculation
  - Order timestamp
- Order Status Updates
  - Status progression (pending → confirmed → shipped → delivered)
  - Status change to cancelled
  - Status change history tracking
- Order Retrieval
  - Get order by ID
  - Get all user orders
  - Filter orders by status
- Shipping Information
  - Shipping address storage
  - Tracking number tracking
  - Estimated delivery date calculation
- Payment Information
  - Payment method storage
  - Payment status tracking
  - Transaction ID storage
- Order Cancellation
  - Cancellation of pending orders
  - Prevention of shipped order cancellation
  - Refund processing
- Order Validation
  - Minimum order amount validation
  - Required fields validation

### Payment Tests (`payments.test.js`)
- Payment Processing
  - Card number validation
  - Expiry date validation
  - CVV validation
  - Payment success processing
- Payment Methods
  - Credit card support
  - PayPal support
  - Stripe support
  - Razorpay support
- Payment Amount Handling
  - Positive amount validation
  - Zero and negative amount rejection
  - Decimal amount support
  - Tax calculation
  - Total with tax calculation
- Payment Status
  - Pending status
  - Completed status
  - Failed status
  - Refunded status
- Refunds
  - Full refund processing
  - Partial refund processing
  - Refund transaction tracking
- Payment Security
  - Card detail encryption
  - Sensitive data protection
  - SSL/TLS validation
- Payment Receipts
  - Receipt generation
  - Email receipt delivery
- Payment Disputes
  - Dispute filing
  - Dispute status tracking

### Cart Tests (`cart.test.js`)
- Add to Cart
  - Add product to cart
  - Quantity increase for duplicate products
  - Quantity validation
  - Price management
- Remove from Cart
  - Remove product from cart
  - Clear entire cart
  - Non-existent item handling
- Update Cart Quantity
  - Update item quantity
  - Minimum quantity validation
  - Stock availability check
- Cart Calculations
  - Subtotal calculation
  - Discount application
  - Coupon code application
  - Tax calculation
  - Total with discount and tax
  - Shipping cost calculation
- Cart Persistence
  - Save cart to database
  - Retrieve saved cart
  - Update cart in database
  - Delete cart after checkout
- Inventory Management
  - Stock validation
  - Out of stock prevention
  - Stock reservation
  - Stock release on removal
- Cart Validation
  - Non-empty cart validation
  - Item availability validation
  - Current pricing validation
- Wishlist Integration
  - Move item from wishlist to cart

### Coupon Tests (`coupons.test.js`)
- Coupon Creation
  - Valid coupon creation
  - Coupon code format validation
  - Percentage discount support
  - Fixed amount discount support
- Coupon Validation
  - Active coupon check
  - Expiry date validation
  - Expired coupon rejection
  - Usage limit validation
  - Minimum purchase requirement
- Coupon Application
  - Percentage discount calculation
  - Fixed discount calculation
  - Maximum discount cap
  - Minimum purchase enforcement
- Coupon Usage Tracking
  - Usage count increment
  - User-specific usage tracking
  - One-per-customer enforcement
- Coupon Categories
  - Category-specific coupons
  - Product exclusions
  - Product-specific coupons
- Coupon Retrieval
  - Find by code
  - List active coupons
- Coupon Deletion
  - Delete expired coupons
  - Deactivate coupon
- Coupon Combination
  - Prevent coupon stacking
  - Best coupon selection

### Review Tests (`reviews.test.js`)
- Review Creation
  - Valid review creation
  - Required rating field
  - Rating validation (1-5)
  - Verified purchase requirement
- Review Retrieval
  - Get product reviews
  - Filter by rating
  - Get user reviews
  - Sort by date
- Review Moderation
  - Pending review moderation
  - Review approval
  - Review rejection with reason
  - Hide offensive reviews
- Review Rating Calculation
  - Average rating calculation
  - Rating distribution
  - Verified purchase percentage
- Review Helpfulness
  - Mark helpful/unhelpful
  - Sort by helpfulness
- Review Images
  - Attach images to review
  - Image URL validation
  - Image count limit
- Review Deletion
  - User review deletion
  - Product review removal
  - Rating recalculation
- Review Responses
  - Seller response to review
  - Response date tracking

### User Tests (`users.test.js`)
- User Profile
  - Profile creation
  - Profile update
  - Profile picture update
  - Phone number validation
- User Address
  - Add address
  - Set default address
  - Update address
  - Delete address
  - Address field validation
- User Preferences
  - Notification preferences
  - Language preference
  - Currency preference
  - Theme preference
- User Authentication
  - Login history tracking
  - Last login tracking
  - Account creation date
  - Password change date
- User Roles & Permissions
  - Role assignment
  - Admin permission check
  - Seller permission check
  - Customer permission check
- User Account Status
  - Account activation
  - Account deactivation
  - Account suspension
  - Account blocking
  - Email verification
- User Statistics
  - Total orders tracking
  - Total spent tracking
  - Return rate calculation
  - Average order value
- User Loyalty
  - Loyalty points tracking
  - Points redemption
  - Membership tier tracking
- User Account Deletion
  - Mark for deletion
  - Permanent data deletion

### Wishlist Tests (`wishlist.test.js`)
- Add to Wishlist
  - Add product to wishlist
  - Prevent duplicates
  - Track addition date
  - Add multiple products
- Remove from Wishlist
  - Remove product
  - Clear entire wishlist
  - Non-existent item handling
- Wishlist Retrieval
  - Get user wishlist
  - Check product in wishlist
  - Get wishlist count
- Wishlist Sorting
  - Sort by date (newest first)
  - Sort by price
  - Sort by rating
- Wishlist Filtering
  - Filter by category
  - Filter by price range
  - Filter by availability
- Wishlist Sharing
  - Generate share link
  - Track share count
  - Public wishlist support
  - Private wishlist support
- Wishlist Notifications
  - Price drop notifications
  - Back in stock notifications
  - Notification preferences
- Wishlist Analysis
  - Most wishlisted products
  - Average wishlist count
- Wishlist to Cart
  - Move item to cart
  - Move multiple items to cart
- Wishlist Persistence
  - Save to database
  - Update in database

### Category Tests (`categories.test.js`)
- Category Creation
  - Valid category creation
  - Unique category name validation
  - Slug generation
  - Description setting
  - Category image support
- Subcategories
  - Subcategory creation
  - Subcategory retrieval
  - Nested subcategories
- Category Retrieval
  - Get by ID
  - Get by slug
  - List all categories
  - List active categories only
- Category Update
  - Update name
  - Update image
  - Update description
  - Activate/deactivate category
- Category Deletion
  - Delete category
  - Prevent deletion of categories with products
  - Soft delete support
- Category Products
  - Get category products
  - Product count
  - Subcategory product count
- Category Metadata
  - SEO metadata
  - Creation date tracking
  - Update date tracking
  - Display order
- Category Filters
  - Get category filters
  - Add filter
  - Remove filter
- Category Hierarchy
  - Build category tree
  - Get category path
  - Get parent category
- Category Search
  - Search by name
  - Case-insensitive search

### Middleware Tests (`middleware.test.js`)
- Authentication Middleware
  - Valid JWT verification
  - Missing token handling
  - Expired token rejection
  - Invalid token rejection
  - User extraction from token
- Authorization Middleware
  - Admin access check
  - Non-admin access denial
  - Seller access check
  - Customer access check
  - Specific permission check
- Error Handling Middleware
  - 404 error handling
  - 500 error handling
  - Validation error handling
  - Error response format
  - Error logging
  - Async error handling
- Validation Middleware
  - Required fields validation
  - Email format validation
  - Password strength validation
  - Phone number validation
  - Input sanitization
  - Data type validation
- Rate Limiting Middleware
  - Request limit enforcement
  - Exceeded request blocking
  - Time window reset
- CORS Middleware
  - Allowed origin check
  - Disallowed origin rejection
  - CORS header setting
- Logging Middleware
  - Request method logging
  - Response status logging
  - Timestamp logging
  - Response time logging
- Body Parser Middleware
  - JSON parsing
  - URL-encoded parsing
  - Large payload handling
  - Invalid JSON rejection

### API Integration Tests (`api.integration.test.js`)
- Product Endpoints
- Order Endpoints
- Auth Endpoints
- Cart Endpoints
- Payment Endpoints
- User Endpoints
- Wishlist Endpoints
- Review Endpoints
- Category Endpoints
- Coupon Endpoints
- HTTP Status Codes
- Request Headers
- Response Format
- Query Parameters
- Error Responses

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test -- auth.test.js
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="Login"
```

## Test Coverage

The test suite aims for comprehensive coverage of:
- ✅ Authentication & Authorization
- ✅ Product Management
- ✅ Order Processing
- ✅ Payment Handling
- ✅ Cart Management
- ✅ Coupon System
- ✅ Reviews & Ratings
- ✅ User Management
- ✅ Wishlist Management
- ✅ Category Management
- ✅ Middleware (Auth, Error, Validation)
- ✅ API Integration

## Test Utilities

Use `testUtils.js` for:
- Mock data generation
- Validation helpers
- Test data examples
- Assertion helpers
- Database utilities

## Example: Running a Specific Test

```bash
# Run only product tests
npm test -- products.test.js

# Run only authentication tests
npm test -- auth.test.js

# Run payment tests in watch mode
npm test -- --watch payments.test.js
```

## Adding New Tests

1. Create a new test file in `__tests__` directory
2. Follow the naming convention: `feature.test.js`
3. Import testUtils for helpers
4. Use existing test patterns
5. Run tests to verify

## Best Practices

- ✅ Keep tests focused and independent
- ✅ Use descriptive test names
- ✅ Use setup/teardown hooks (beforeEach/afterEach)
- ✅ Test both success and error cases
- ✅ Use mock data generators
- ✅ Avoid hard-coded values
- ✅ Clean up after tests
- ✅ Test edge cases

## Notes

- Tests use Jest framework
- MongoDB Memory Server for database testing (optional)
- Supertest for API integration testing
- All tests are isolated and don't depend on external services
- Mock functions are used for email and external APIs

## Troubleshooting

### Tests Failing
1. Check if all dependencies are installed: `npm install`
2. Verify MongoDB connection settings
3. Check test file syntax
4. Run single test file to isolate issue

### Performance Issues
1. Run tests without coverage: `npm test`
2. Run specific test file instead of all
3. Close other applications to free resources

### Database Issues
1. Clear database between tests using testUtils
2. Ensure test database is clean
3. Check MongoDB connection

## Future Enhancements

- [ ] Add E2E tests with Selenium/Cypress
- [ ] Add performance/load testing
- [ ] Add security testing
- [ ] Increase coverage to 95%+
- [ ] Add API contract testing
- [ ] Add database migration testing
