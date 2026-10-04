const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const SuperAdmin = require('../models/SuperAdmin');

/**
 * Protect routes - Verifies JWT from Authorization header
 * Checks both Customer and SuperAdmin isolated models
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'book_ordering_system_jwt_secret_key_2026');

      if (decoded.role === 'superadmin' || decoded.role === 'admin') {
        const superAdmin = await SuperAdmin.findById(decoded.id).select('-password');
        if (!superAdmin) {
          return res.status(401).json({
            success: false,
            message: 'Super Admin belonging to this session no longer exists'
          });
        }
        req.user = superAdmin;
        req.superAdmin = superAdmin;
      } else {
        const customer = await Customer.findById(decoded.id).select('-password');
        if (!customer) {
          return res.status(401).json({
            success: false,
            message: 'Customer belonging to this session no longer exists'
          });
        }
        req.user = customer;
        req.customer = customer;
      }

      return next();
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: invalid or expired session token'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: no token provided'
    });
  }
};

/**
 * Customer Only Guard: Strictly requires Customer account
 */
const customerOnly = async (req, res, next) => {
  if (req.user && req.user.role === 'customer') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access forbidden: Customer account required'
  });
};

/**
 * Super Admin Only Guard: Strictly requires Super Admin account
 */
const adminOnly = async (req, res, next) => {
  if (req.user && (req.user.role === 'superadmin' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access forbidden: Super Admin credentials required'
  });
};

module.exports = {
  protect,
  adminOnly,
  customerOnly
};
