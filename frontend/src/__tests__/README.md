# E-Commerce Frontend Test Suite

## Overview
Frontend test suite for React components, utilities, and API integration.

## Test Files

### Components Tests (`components.test.js`)
- **Navbar Component**
  - Render navbar
  - Display logo
  - Display navigation links
  - Display search box
  - Display cart icon with count
  - Mobile menu functionality

- **ProductCard Component**
  - Render product card
  - Display product price
  - Display product rating
  - Display review count
  - Add to cart button
  - Wishlist button
  - Click handlers

- **Footer Component**
  - Render footer
  - Display company info
  - Display footer links
  - Social media links
  - Newsletter subscription

- **Forms**
  - Login form rendering
  - Email input validation
  - Password input validation
  - Form submission
  - Error handling

- **Cart Page**
  - Display cart items
  - Display total price
  - Checkout button
  - Continue shopping button
  - Empty cart message
  - Remove item functionality

### API Tests (`api.test.js`)
- **Product API**
  - Fetch all products
  - Fetch product by ID
  - Create product
  - Error handling

- **Order API**
  - Fetch user orders
  - Create order
  - Update order status

- **Cart API**
  - Get cart
  - Add to cart
  - Remove from cart

- **Authentication API**
  - User login
  - User registration
  - User logout

- **Storage Tests**
  - LocalStorage operations
  - SessionStorage operations
  - Token management
  - User data persistence

### Utilities Tests (`utils.test.js`)
- **Price Formatting**
  - Format whole numbers
  - Format decimals
  - Handle large prices
  - Handle zero price

- **Date Formatting**
  - Format dates
  - Handle different date formats

- **String Validation**
  - Email validation
  - Phone validation

- **Array Operations**
  - Filter products by price
  - Sort products by price
  - Get unique categories

- **Cart Calculations**
  - Calculate subtotal
  - Calculate tax
  - Calculate total with discount

- **String Manipulation**
  - Capitalize strings
  - Slugify strings
  - Truncate strings

- **Number Operations**
  - Round prices
  - Check if even/odd
  - Check if positive

- **Object Operations**
  - Merge objects
  - Get object keys
  - Filter objects

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
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Test File
```bash
npm test components.test.js
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="Cart"
```

## Setting Up Frontend Tests

### Install Testing Dependencies
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest
```

### Environment Setup

Create `jest.config.js` in frontend directory:
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
```

Create `src/setupTests.js`:
```javascript
import '@testing-library/jest-dom';
```

## Best Practices

- ✅ Use React Testing Library
- ✅ Test user behavior, not implementation
- ✅ Use descriptive test names
- ✅ Mock external dependencies (API calls, localStorage)
- ✅ Test both success and error cases
- ✅ Clean up after each test
- ✅ Use setup/teardown hooks
- ✅ Keep tests independent

## Common Testing Patterns

### Testing Component Rendering
```javascript
it('should render component', () => {
  render(<Component />);
  expect(screen.getByText('text')).toBeInTheDocument();
});
```

### Testing User Interactions
```javascript
it('should handle click', () => {
  const handleClick = jest.fn();
  render(<button onClick={handleClick}>Click</button>);
  fireEvent.click(screen.getByText('Click'));
  expect(handleClick).toHaveBeenCalled();
});
```

### Testing Input Changes
```javascript
it('should update input value', () => {
  render(<input placeholder="Name" />);
  const input = screen.getByPlaceholderText('Name');
  fireEvent.change(input, { target: { value: 'John' } });
  expect(input.value).toBe('John');
});
```

### Mocking API Calls
```javascript
jest.mock('axios');
axios.get.mockResolvedValue({ data: mockData });
```

## Debugging Tests

### Debug Component Output
```javascript
import { render, screen } from '@testing-library/react';

it('test', () => {
  const { debug } = render(<Component />);
  debug(); // Prints DOM
});
```

### Check Element Properties
```javascript
const element = screen.getByRole('button');
console.log(element); // See all properties
```

## Coverage Goals

- Components: 80%+
- Utilities: 90%+
- Overall: 75%+

## CI/CD Integration

Add to package.json:
```json
{
  "scripts": {
    "test:ci": "react-scripts test --coverage --watchAll=false"
  }
}
```

## Troubleshooting

### Tests Timeout
- Increase timeout: `jest.setTimeout(10000)`
- Use `waitFor()` for async operations

### Cannot Find Module
- Check import paths
- Verify file exists
- Check jest.config.js moduleNameMapper

### Mock Not Working
- Clear mock: `jest.clearAllMocks()`
- Reset mock: `jest.resetAllMocks()`
- Check mock location (top of file)

## Resources

- [React Testing Library Docs](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://testing-library.com/docs/queries/about)

## Future Enhancements

- [ ] Add E2E tests with Cypress
- [ ] Add visual regression testing
- [ ] Add performance testing
- [ ] Increase coverage to 90%+
- [ ] Add accessibility testing
- [ ] Add snapshot testing
