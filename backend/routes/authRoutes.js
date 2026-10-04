const express = require('express');
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  registerSuperAdmin,
  loginSuperAdmin,
  register,
  login,
  getMe,
  getAllUsers,
  deleteUser
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Dedicated Customer Auth endpoints
router.post('/customer/register', registerCustomer);
router.post('/customer/login', loginCustomer);

// Dedicated Super Admin Auth endpoints
router.post('/admin/register', registerSuperAdmin);
router.post('/admin/login', loginSuperAdmin);

// Common dispatchers for client flexibility
router.post('/register', register);
router.post('/login', login);

// Session verification
router.get('/me', protect, getMe);

// Super Admin user management (Patrons only)
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
