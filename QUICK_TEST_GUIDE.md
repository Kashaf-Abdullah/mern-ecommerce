# Quick Test Reference Guide

## 🚀 Run Tests Instantly

### Backend
```bash
cd backend && npm test
```

### Frontend
```bash
cd frontend && npm test
```

## 📋 Backend Test Files

| Test File | Command | Tests |
|-----------|---------|-------|
| Authentication | `npm test -- auth.test.js` | 35+ |
| Products | `npm test -- products.test.js` | 45+ |
| Orders | `npm test -- orders.test.js` | 35+ |
| Payments | `npm test -- payments.test.js` | 45+ |
| Cart | `npm test -- cart.test.js` | 40+ |
| Coupons | `npm test -- coupons.test.js` | 50+ |
| Reviews | `npm test -- reviews.test.js` | 40+ |
| Users | `npm test -- users.test.js` | 50+ |
| Wishlist | `npm test -- wishlist.test.js` | 45+ |
| Categories | `npm test -- categories.test.js` | 50+ |
| Middleware | `npm test -- middleware.test.js` | 45+ |
| API Tests | `npm test -- api.integration.test.js` | 50+ |

## 📋 Frontend Test Files

| Test File | Command | Tests |
|-----------|---------|-------|
| Components | `npm test components.test.js` | 40+ |
| API & Storage | `npm test api.test.js` | 35+ |
| Utilities | `npm test utils.test.js` | 50+ |

## ⚙️ Common Commands

### Watch Mode (Auto-run on changes)
```bash
# Backend
cd backend && npm run test:watch

# Frontend
cd frontend && npm test -- --watch
```

### Coverage Report
```bash
# Backend
cd backend && npm run test:coverage

# Frontend
cd frontend && npm test -- --coverage
```

### Run Specific Test Pattern
```bash
# Backend - run tests matching "Login"
npm test -- --testNamePattern="Login"

# Run tests in a single file
npm test -- auth.test.js
```

## 🔍 What Each Feature Tests

### ✅ Authentication (`auth.test.js`)
- Register new users
- Login with credentials
- Email verification
- Password reset
- JWT token management

### ✅ Products (`products.test.js`)
- Create/read/update/delete products
- Price validation
- Stock management
- Image uploads
- Ratings & reviews

### ✅ Orders (`orders.test.js`)
- Create orders
- Update status (pending → shipped → delivered)
- Track shipping info
- Handle cancellations
- Process refunds

### ✅ Payments (`payments.test.js`)
- Credit card processing
- PayPal integration
- Stripe payments
- Razorpay support
- Tax calculations
- Refund handling

### ✅ Shopping Cart (`cart.test.js`)
- Add/remove items
- Update quantities
- Calculate totals
- Apply coupons
- Manage inventory

### ✅ Coupons (`coupons.test.js`)
- Create discount codes
- Apply discounts
- Track usage
- Expire coupons
- Validate codes

### ✅ Reviews (`reviews.test.js`)
- Submit reviews
- Rate products (1-5 stars)
- Upload images
- Moderate content
- Track helpfulness

### ✅ User Profiles (`users.test.js`)
- Update profile info
- Manage addresses
- Set preferences
- Track statistics
- Loyalty points

### ✅ Wishlist (`wishlist.test.js`)
- Add/remove favorites
- Share wishlists
- Price drop alerts
- Move to cart
- Filter items

### ✅ Categories (`categories.test.js`)
- Organize products
- Subcategories
- Hierarchies
- SEO metadata
- Product filtering

### ✅ Middleware (`middleware.test.js`)
- Authentication checks
- Authorization
- Error handling
- Request validation
- Rate limiting

### ✅ API Endpoints (`api.integration.test.js`)
- All REST endpoints
- HTTP status codes
- Request/response format
- Error handling

## 🎯 When Tests Fail

1. **Read the error message carefully** - It tells you what's wrong
2. **Run single test file** - Isolate the problem
3. **Check recent changes** - What changed?
4. **Read test code** - Understand what's being tested
5. **Check mock data** - Ensure test data is valid

## 💡 Writing New Tests

### Backend Example
```javascript
describe('Feature', () => {
  it('should do something', () => {
    const result = functionToTest();
    expect(result).toBe(expectedValue);
  });
});
```

### Frontend Example
```javascript
it('should render button', () => {
  render(<Component />);
  expect(screen.getByText('Button')).toBeInTheDocument();
});
```

## 📊 Coverage Target

- **Overall:** 70%+
- **Critical Features:** 90%+
- **Utilities:** 95%+

## 🔗 Quick Links

- Backend Tests: `backend/__tests__/`
- Frontend Tests: `frontend/src/__tests__/`
- Full Documentation: `TESTS.md`
- Backend Docs: `backend/__tests__/README.md`
- Frontend Docs: `frontend/src/__tests__/README.md`

## 🐛 Quick Troubleshooting

### Tests Won't Run
```bash
# Clear cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules && npm install
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `.env` file configuration
- Verify connection string

### Port Already in Use
```bash
# Kill existing process
# Windows
taskkill /F /IM node.exe

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Memory Issues
- Run fewer tests at once
- Close other applications
- Check available RAM

## 📝 Test Organization

```
__tests__/
├── Feature categories
├── Unit tests
├── Integration tests
├── Mock data (testUtils.js)
├── Setup files
└── README documentation
```

## 🚀 Performance Tips

- Use watch mode during development
- Run single test file when debugging
- Generate coverage only when needed
- Use grep to run specific tests

## 📞 Need Help?

1. Check documentation in `__tests__/README.md`
2. Review existing test examples
3. Check Jest documentation
4. Check React Testing Library docs

---

**Pro Tip:** Keep this guide open while testing! 📖
