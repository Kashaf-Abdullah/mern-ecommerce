<!-- # Backend tests
cd backend && npm test              # Run all
npm run test:watch                 # Watch mode
npm run test:coverage              # Coverage report

# Frontend tests
cd frontend && npm test            # Run all
npm test -- --watch               # Watch mode -->
# E-Commerce Website - Complete Test Suite

## 📋 Overview

This project includes comprehensive test suites for both backend and frontend components of the MERN e-commerce platform. The tests cover authentication, products, orders, payments, cart management, reviews, users, wishlists, categories, coupons, and all middleware.

## 🗂️ Project Structure

```
mern-ecommerce/
├── backend/
│   ├── __tests__/
│   │   ├── auth.test.js                 # Authentication tests
│   │   ├── products.test.js             # Product management tests
│   │   ├── orders.test.js               # Order management tests
│   │   ├── payments.test.js             # Payment processing tests
│   │   ├── cart.test.js                 # Shopping cart tests
│   │   ├── coupons.test.js              # Coupon system tests
│   │   ├── reviews.test.js              # Review & rating tests
│   │   ├── users.test.js                # User profile tests
│   │   ├── wishlist.test.js             # Wishlist tests
│   │   ├── categories.test.js           # Category management tests
│   │   ├── middleware.test.js           # Middleware tests
│   │   ├── api.integration.test.js      # API integration tests
│   │   ├── testUtils.js                 # Test utilities & helpers
│   │   └── README.md                    # Backend test documentation
│   ├── jest.config.js                   # Jest configuration
│   ├── jest.setup.js                    # Jest setup
│   └── package.json                     # Updated with test scripts
│
├── frontend/
│   ├── src/__tests__/
│   │   ├── components.test.js           # React component tests
│   │   ├── api.test.js                  # API & storage tests
│   │   ├── utils.test.js                # Utility function tests
│   │   └── README.md                    # Frontend test documentation
│   └── package.json                     # Updated with test scripts
│
└── TESTS.md                             # This file
```

## 🚀 Quick Start

### Backend Testing

#### 1. Install Dependencies
```bash
cd backend
npm install
```

#### 2. Run All Tests
```bash
npm test
```

#### 3. Run Tests in Watch Mode
```bash
npm run test:watch
```

#### 4. Generate Coverage Report
```bash
npm run test:coverage
```

#### 5. Run Specific Test File
```bash
npm test -- auth.test.js
npm test -- products.test.js
npm test -- payments.test.js
```

### Frontend Testing

#### 1. Install Dependencies
```bash
cd frontend
npm install
```

#### 2. Run All Tests
```bash
npm test
```

#### 3. Run Tests in Watch Mode (Interactive)
```bash
npm test -- --watch
```

#### 4. Generate Coverage Report
```bash
npm test -- --coverage
```

#### 5. Run Specific Test
```bash
npm test components.test.js
npm test api.test.js
```

## 📊 Test Coverage

### Backend Tests (11 test files)

| Feature | Test File | Test Cases | Coverage |
|---------|-----------|-----------|----------|
| Authentication | auth.test.js | 35+ | High |
| Products | products.test.js | 45+ | High |
| Orders | orders.test.js | 35+ | High |
| Payments | payments.test.js | 45+ | High |
| Cart | cart.test.js | 40+ | High |
| Coupons | coupons.test.js | 50+ | High |
| Reviews | reviews.test.js | 40+ | High |
| Users | users.test.js | 50+ | High |
| Wishlist | wishlist.test.js | 45+ | High |
| Categories | categories.test.js | 50+ | High |
| Middleware | middleware.test.js | 45+ | High |

**Total Backend Tests: 500+ test cases**

### Frontend Tests (3 test files)

| Feature | Test File | Test Cases | Coverage |
|---------|-----------|-----------|----------|
| Components | components.test.js | 40+ | High |
| API & Storage | api.test.js | 35+ | High |
| Utilities | utils.test.js | 50+ | High |

**Total Frontend Tests: 125+ test cases**

### Total: 625+ Test Cases

## 📝 Test Categories

### Backend Tests

#### 1. **Authentication (auth.test.js)**
- User registration with validation
- Email verification
- Login/logout
- Password reset
- JWT token management
- Email verification flow

#### 2. **Products (products.test.js)**
- Product CRUD operations
- Price and stock validation
- Image management
- Rating and review tracking
- Search and filtering

#### 3. **Orders (orders.test.js)**
- Order creation and validation
- Status updates and tracking
- Shipping information
- Payment details
- Cancellation and refunds

#### 4. **Payments (payments.test.js)**
- Multiple payment methods (Stripe, PayPal, Razorpay)
- Card validation
- Tax calculation
- Refund processing
- Payment security

#### 5. **Cart (cart.test.js)**
- Add/remove items
- Quantity management
- Price calculations
- Coupon application
- Inventory management

#### 6. **Coupons (coupons.test.js)**
- Coupon creation and validation
- Discount application
- Usage tracking
- Category-specific coupons
- Expiry date handling

#### 7. **Reviews (reviews.test.js)**
- Review creation and moderation
- Rating validation (1-5 stars)
- Helpful/unhelpful marking
- Image attachments
- Seller responses

#### 8. **Users (users.test.js)**
- Profile management
- Address management
- Preferences and settings
- Account status tracking
- Loyalty points

#### 9. **Wishlist (wishlist.test.js)**
- Add/remove items
- Wishlist sharing
- Price drop notifications
- Move to cart
- Sorting and filtering

#### 10. **Categories (categories.test.js)**
- Category CRUD
- Subcategories
- Hierarchical structure
- SEO metadata
- Product filtering

#### 11. **Middleware & API (middleware.test.js, api.integration.test.js)**
- Authentication middleware
- Authorization checks
- Error handling
- Request validation
- Rate limiting
- CORS configuration

### Frontend Tests

#### 1. **Components (components.test.js)**
- Navbar component
- Product card rendering
- Footer component
- Form validation
- Cart page UI

#### 2. **API & Storage (api.test.js)**
- API endpoint tests
- LocalStorage operations
- SessionStorage operations
- API error handling
- Token management

#### 3. **Utilities (utils.test.js)**
- Price formatting
- Date formatting
- String validation
- Array operations
- Cart calculations
- String manipulation

## 🎯 Test Execution Examples

### Run All Backend Tests
```bash
cd backend
npm test
```

### Run All Frontend Tests
```bash
cd frontend
npm test
```

### Run Backend Tests with Coverage
```bash
cd backend
npm run test:coverage
```

### Run Specific Backend Feature Tests
```bash
# Authentication tests
npm test -- auth.test.js

# Product tests
npm test -- products.test.js

# Payment tests
npm test -- payments.test.js

# Order tests
npm test -- orders.test.js
```

### Run Specific Frontend Tests
```bash
# Component tests
npm test components.test.js

# API tests
npm test api.test.js

# Utility tests
npm test utils.test.js
```

### Watch Mode (Continuous Testing)
```bash
# Backend
cd backend && npm run test:watch

# Frontend
cd frontend && npm test -- --watch
```

## 🔧 Configuration Files

### Backend Jest Config (`backend/jest.config.js`)
```javascript
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.js'],
  collectCoverageFrom: ['controllers/**/*.js', 'models/**/*.js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
};
```

### Backend Jest Setup (`backend/jest.setup.js`)
- Increases test timeout to 30 seconds
- Configures test environment
- Mock configurations

## 📦 Test Dependencies

### Backend
- **jest**: ^29.7.0 - Test framework
- **supertest**: ^6.3.3 - HTTP assertion library
- **mongodb-memory-server**: ^9.1.6 - In-memory MongoDB

### Frontend
- **@testing-library/react**: React component testing
- **@testing-library/jest-dom**: DOM assertions
- **jest**: Test framework (via react-scripts)

## ✨ Key Testing Features

### Mock Data Generators
```javascript
// In testUtils.js
generateMockProduct()
generateMockUser()
generateMockOrder()
generateMockReview()
generateMockCoupon()
```

### Validation Helpers
```javascript
isValidEmail(email)
isValidPhone(phone)
isValidUrl(url)
isValidPassword(password)
```

### Database Utilities
```javascript
clearDatabase() // Clear all collections
```

## 🐛 Troubleshooting

### Backend Tests Failing
1. Ensure all dependencies are installed: `npm install`
2. Check MongoDB connection
3. Verify test database is accessible
4. Run single test file to isolate issue

### Frontend Tests Failing
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear Jest cache: `npm test -- --clearCache`
3. Check React version compatibility
4. Verify testing library is installed

### Port Already in Use
```bash
# Kill process using port 5000 (backend)
# Windows: taskkill /F /IM node.exe
# Mac/Linux: lsof -ti:5000 | xargs kill -9
```

## 📚 Documentation

### Backend Test Documentation
See [backend/__tests__/README.md](backend/__tests__/README.md)

### Frontend Test Documentation
See [frontend/src/__tests__/README.md](frontend/src/__tests__/README.md)

## 🚦 CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

## 📈 Best Practices

- ✅ Run tests before committing
- ✅ Write tests while developing features
- ✅ Maintain 70%+ code coverage
- ✅ Test both happy paths and error cases
- ✅ Use descriptive test names
- ✅ Keep tests isolated and independent
- ✅ Mock external dependencies
- ✅ Use data generators for consistency

## 🎓 Learning Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://testingjavascript.com/)
- [MongoDB Testing](https://docs.mongodb.com/manual/tutorial/write-to-a-collection-without-connection-pooling/)

## 📋 Test Checklist

Before pushing code, ensure:
- [ ] All tests pass
- [ ] No console errors
- [ ] Code coverage maintained
- [ ] New features have tests
- [ ] Edge cases are covered
- [ ] Tests are independent
- [ ] Mock data is realistic
- [ ] Documentation is updated

## 🤝 Contributing

When adding new features:
1. Create corresponding test file
2. Write tests before implementation (TDD)
3. Ensure all tests pass
4. Maintain or improve code coverage
5. Update documentation

## 📞 Support

For issues or questions about tests:
1. Check test documentation
2. Review existing test examples
3. Check troubleshooting section
4. Consult Jest/React Testing Library docs

## 📄 License

This test suite is part of the E-Commerce MERN project.

---

**Last Updated:** 2024
**Test Framework:** Jest
**Total Test Cases:** 625+
**Coverage Target:** 70%+
