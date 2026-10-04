const Notification = require('../models/Notification');

/**
 * @desc    Get user/admin notifications
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'superadmin' || req.user.role === 'admin') {
      query = { recipientType: 'superadmin' };
    } else {
      query = { recipientType: 'customer', recipientUser: req.user._id };
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications'
    });
  }
};

/**
 * @desc    Mark single notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Mark notification read error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
};

/**
 * @desc    Mark all user/admin notifications as read
 * @route   PUT /api/notifications/mark-all-read
 * @access  Private
 */
const markAllAsRead = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'superadmin' || req.user.role === 'admin') {
      query = { recipientType: 'superadmin', isRead: false };
    } else {
      query = { recipientType: 'customer', recipientUser: req.user._id, isRead: false };
    }

    await Notification.updateMany(query, { isRead: true });

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all read error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark all as read'
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
