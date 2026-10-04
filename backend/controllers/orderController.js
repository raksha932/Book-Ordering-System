const Order = require('../models/Order');
const Book = require('../models/Book');
const Notification = require('../models/Notification');

/**
 * @desc    Create a new order & update book inventory stock
 * @route   POST /api/orders
 * @access  Private (Customer)
 */
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide shipping address and payment method'
      });
    }

    // Validate and decrement stock for each ordered book
    for (const item of orderItems) {
      if (item.book) {
        const bookDoc = await Book.findById(item.book);
        if (bookDoc) {
          if (bookDoc.stock < item.quantity) {
            return res.status(400).json({
              success: false,
              message: `Insufficient stock for "${bookDoc.title}". Available: ${bookDoc.stock}`
            });
          }
          bookDoc.stock -= item.quantity;
          await bookDoc.save();
        }
      }
    }

    const order = await Order.create({
      user: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: Number(itemsPrice) || 0,
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice) || 0,
      status: 'Pending'
    });

    // Notify Super Admin of new order placement
    try {
      await Notification.create({
        recipientType: 'superadmin',
        order: order._id,
        orderIdString: order._id.toString(),
        title: 'New Customer Order Placed',
        message: `${req.user.name || 'A customer'} placed a new order (#${order._id.toString().slice(-8)}) for $${order.totalPrice.toFixed(2)}.`,
        type: 'order_created'
      });
    } catch (notifErr) {
      console.error('Failed to create order notification:', notifErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to place order'
    });
  }
};

/**
 * @desc    Get logged in user's order history
 * @route   GET /api/orders/my-orders
 * @access  Private (Customer)
 */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { user: req.user._id },
        { customerEmail: (req.user.email || '').toLowerCase() }
      ]
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get my orders error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders'
    });
  }
};

/**
 * @desc    Get order details by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify ownership or super admin privileges
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order by ID error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve order'
    });
  }
};

/**
 * @desc    Get all orders across system
 * @route   GET /api/orders
 * @access  Private (Admin only)
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve all orders'
    });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private (Admin only)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const previousStatus = order.status;
    order.status = status;
    await order.save();

    // Notify the Customer about the updated order status
    try {
      if (order.user) {
        await Notification.create({
          recipientType: 'customer',
          recipientUser: order.user,
          order: order._id,
          orderIdString: order._id.toString(),
          title: `Order Status: ${status}`,
          message: `Your order #${order._id.toString().slice(-8)} status has been updated to "${status}".`,
          type: 'status_update'
        });
      }
    } catch (notifErr) {
      console.error('Customer notification error:', notifErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update order status'
    });
  }
};

/**
 * @desc    Cancel order (Customer or Super Admin)
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership or superadmin privileges
    const isOwner = order.user && order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    if (order.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Delivered orders cannot be cancelled'
      });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }

    order.status = 'Cancelled';
    await order.save();

    // Restore book inventory stock
    if (order.orderItems && order.orderItems.length > 0) {
      for (const item of order.orderItems) {
        if (item.book) {
          await Book.findByIdAndUpdate(item.book, {
            $inc: { stock: item.quantity }
          });
        }
      }
    }

    // If cancelled by Customer, notify the Super Admin!
    if (isOwner && !isAdmin) {
      try {
        await Notification.create({
          recipientType: 'superadmin',
          order: order._id,
          orderIdString: order._id.toString(),
          title: 'Customer Cancelled Order',
          message: `Customer ${order.customerName || req.user.name || 'User'} cancelled order #${order._id.toString().slice(-8)}.`,
          type: 'order_cancelled'
        });
      } catch (notifErr) {
        console.error('Admin cancellation notification error:', notifErr.message);
      }
    } else if (isAdmin && order.user) {
      // If cancelled by Super Admin, notify the Customer!
      try {
        await Notification.create({
          recipientType: 'customer',
          recipientUser: order.user,
          order: order._id,
          orderIdString: order._id.toString(),
          title: 'Order Cancelled',
          message: `Your order #${order._id.toString().slice(-8)} was cancelled by the store administrator.`,
          type: 'order_cancelled'
        });
      } catch (notifErr) {
        console.error('Customer cancellation notification error:', notifErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel order'
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
};
