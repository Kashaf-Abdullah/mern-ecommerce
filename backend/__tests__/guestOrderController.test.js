jest.mock('../models/Order', () => ({
  create: jest.fn(),
  findById: jest.fn(),
}));
jest.mock('../models/Product', () => ({
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));
jest.mock('../models/User', () => ({ find: jest.fn() }));
jest.mock('../models/Notification', () => ({ create: jest.fn() }));
jest.mock('../models/StoreSettings', () => ({ findOne: jest.fn() }));
jest.mock('../models/index', () => ({
  Cart: { findOne: jest.fn(), findOneAndUpdate: jest.fn() },
  Coupon: { findOne: jest.fn() },
}));
jest.mock('../utils/sendEmail', () => jest.fn());

const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const StoreSettings = require('../models/StoreSettings');
const sendEmail = require('../utils/sendEmail');
const { createOrder } = require('../controllers/orderController');

describe('Guest order creation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    StoreSettings.findOne.mockResolvedValue(null);
  });

  it('creates an order with verified product pricing and no user account', async () => {
    const productId = new mongoose.Types.ObjectId();
    const orderId = new mongoose.Types.ObjectId();
    Product.find.mockResolvedValue([{
      _id: productId,
      name: 'Test product',
      images: [{ url: 'https://example.com/product.jpg' }],
      price: 100,
      discountPrice: 80,
      stock: 10,
      isActive: true,
    }]);
    Product.findByIdAndUpdate.mockResolvedValue({});
    Order.create.mockResolvedValue({ _id: orderId, orderId: 'ORD-TEST', totalPrice: 238.8 });
    Order.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({ _id: orderId, guestEmail: 'guest@example.com' }),
    });
    User.find.mockResolvedValue([]);
    sendEmail.mockResolvedValue();
    const req = {
      body: {
        guestEmail: ' Guest@Example.com ',
        shippingAddress: { fullName: 'Guest Customer' },
        paymentMethod: 'cod',
        items: [
          { productId: productId.toString(), quantity: 1, price: 1 },
          { productId: productId.toString(), quantity: 1, price: 1 },
        ],
        totalPrice: 2,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createOrder(req, res);

    const savedOrder = Order.create.mock.calls[0][0];
    expect(savedOrder.user).toBeUndefined();
    expect(savedOrder.guestEmail).toBe('guest@example.com');
    expect(savedOrder.items).toHaveLength(1);
    expect(savedOrder.items[0].price).toBe(80);
    expect(savedOrder.items[0].quantity).toBe(2);
    expect(savedOrder.totalPrice).toBe(238.8);
    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(productId, { $inc: { stock: -2 } });
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ email: 'guest@example.com' }));
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('uses the shipping fee configured by the admin', async () => {
    const productId = new mongoose.Types.ObjectId();
    StoreSettings.findOne.mockResolvedValue({ value: 125 });
    Product.find.mockResolvedValue([{
      _id: productId,
      name: 'Test product',
      images: [{ url: 'https://example.com/product.jpg' }],
      price: 100,
      discountPrice: 80,
      stock: 10,
      isActive: true,
    }]);
    Product.findByIdAndUpdate.mockResolvedValue({});
    Order.create.mockResolvedValue({ _id: new mongoose.Types.ObjectId(), orderId: 'ORD-TEST', totalPrice: 313.8 });
    Order.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({ guestEmail: 'guest@example.com' }),
    });
    User.find.mockResolvedValue([]);
    sendEmail.mockResolvedValue();
    const req = {
      body: {
        guestEmail: 'guest@example.com',
        shippingAddress: { fullName: 'Guest Customer' },
        paymentMethod: 'cod',
        items: [{ productId: productId.toString(), quantity: 2 }],
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createOrder(req, res);

    const savedOrder = Order.create.mock.calls[0][0];
    expect(StoreSettings.findOne).toHaveBeenCalledWith({ key: 'shippingFee' });
    expect(savedOrder.shippingPrice).toBe(125);
    expect(savedOrder.totalPrice).toBe(313.8);
  });
});
