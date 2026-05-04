// orderRoutes.js
const express = require('express');
const orderRouter = express.Router();
const { createOrder, getMyOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

orderRouter.post('/', protect, createOrder);
orderRouter.get('/my', protect, getMyOrders);
orderRouter.get('/:id', protect, getOrder);
orderRouter.put('/:id/cancel', protect, cancelOrder);
orderRouter.get('/', protect, authorize('admin'), getAllOrders);
orderRouter.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = orderRouter;
