const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientType: {
      type: String,
      enum: ['customer', 'superadmin'],
      required: true
    },
    recipientUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null
    },
    orderIdString: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['status_update', 'order_cancelled', 'order_created', 'general'],
      default: 'status_update'
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
