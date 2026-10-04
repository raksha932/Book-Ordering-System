const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect, adminOnly, customerOnly } = require('../middleware/authMiddleware');

// Customer order operations (strictly customer only)
router.post('/', protect, customerOnly, createOrder);
router.get('/my-orders', protect, customerOnly, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

// Admin order operations (strictly admin only)
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
