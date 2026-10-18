const mongoose = require('mongoose');
const Order = require('../models/Order');

const validOrder = (overrides = {}) => ({
  items: [{
    product: new mongoose.Types.ObjectId(),
    name: 'Test product',
    image: 'https://example.com/product.jpg',
    price: 100,
    quantity: 1,
  }],
  shippingAddress: {
    fullName: 'Guest Customer',
    phone: '1234567890',
    addressLine1: '1 Test Street',
    city: 'Lahore',
    state: 'Punjab',
    pincode: '54000',
    country: 'Pakistan',
  },
  paymentMethod: 'cod',
  itemsPrice: 100,
  taxPrice: 18,
  shippingPrice: 50,
  totalPrice: 168,
  ...overrides,
});

describe('Guest checkout order model', () => {
  it('accepts an order without a registered user when a guest email is provided', () => {
    const order = new Order(validOrder({ guestEmail: 'guest@example.com' }));

    expect(order.validateSync()).toBeUndefined();
    expect(order.user).toBeUndefined();
  });

  it('requires a guest email when no registered user is attached', () => {
    const order = new Order(validOrder());

    expect(order.validateSync().errors.guestEmail).toBeDefined();
  });

  it('does not require a guest email for registered-user orders', () => {
    const order = new Order(validOrder({ user: new mongoose.Types.ObjectId() }));

    expect(order.validateSync()).toBeUndefined();
  });
});
