const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const SuperAdmin = require('../models/SuperAdmin');
const Order = require('../models/Order');

/**
 * Generate signed JWT Token with explicit role
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'book_ordering_system_jwt_secret_key_2026',
    { expiresIn: '30d' }
  );
};

// ==========================================
// 1. ISOLATED CUSTOMER AUTHENTICATION
// ==========================================

/**
 * @desc    Register a new Customer account (Isolated from Super Admin)
 * @route   POST /api/auth/customer/register
 * @access  Public
 */
const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide full name' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide email ID' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide phone number' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const cleanName = name.trim();
    const normalizedEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    // Query ONLY Customer collection - Super Admin database is never checked or exposed
    const existingCustomer = await Customer.findOne({ email: normalizedEmail });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please sign in.'
      });
    }

    const customer = await Customer.create({
      name: cleanName,
      email: normalizedEmail,
      phone: cleanPhone,
      password,
      role: 'customer'
    });

    const token = generateToken(customer._id, 'customer');

    return res.status(201).json({
      success: true,
      message: 'Customer account created successfully',
      token,
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: 'customer'
      }
    });
  } catch (error) {
    console.error('Customer registration error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during customer registration'
    });
  }
};

/**
 * @desc    Authenticate Customer (Isolated from Super Admin)
 * @route   POST /api/auth/customer/login
 * @access  Public
 */
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Query ONLY Customer collection
    const customer = await Customer.findOne({ email: normalizedEmail });
    if (!customer) {
      return res.status(404).json({
        success: false,
        notFound: true,
        message: 'Customer account does not exist with this email. Please click "Create Account" to register.'
      });
    }

    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials and try again.'
      });
    }

    const token = generateToken(customer._id, 'customer');

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      token,
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: 'customer'
      }
    });
  } catch (error) {
    console.error('Customer login error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during customer login'
    });
  }
};

// ==========================================
// 2. ISOLATED SUPER ADMIN AUTHENTICATION
// ==========================================

/**
 * @desc    Register a new Super Admin account (Isolated from Customer)
 * @route   POST /api/auth/admin/register
 * @access  Public
 */
const registerSuperAdmin = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide Super Admin full name' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide Super Admin email ID' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide phone number' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const cleanName = name.trim();
    const normalizedEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    // Query ONLY SuperAdmin collection
    const existingAdmin = await SuperAdmin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'A Super Admin account with this email already exists. Please Sign In.'
      });
    }

    const superAdmin = await SuperAdmin.create({
      name: cleanName,
      email: normalizedEmail,
      phone: cleanPhone,
      password,
      role: 'superadmin'
    });

    const token = generateToken(superAdmin._id, 'superadmin');

    return res.status(201).json({
      success: true,
      message: 'Super Admin account created successfully',
      token,
      user: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        phone: superAdmin.phone,
        role: 'superadmin'
      }
    });
  } catch (error) {
    console.error('Super Admin registration error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during Super Admin registration'
    });
  }
};

/**
 * @desc    Authenticate Super Admin (Isolated from Customer)
 * @route   POST /api/auth/admin/login
 * @access  Public
 */
const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Query ONLY SuperAdmin collection
    const superAdmin = await SuperAdmin.findOne({ email: normalizedEmail });
    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        notFound: true,
        message: 'Super Admin account does not exist with this email. Please click "Create Account" to register.'
      });
    }

    const isMatch = await superAdmin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Super Admin credentials. Please verify your password and try again.'
      });
    }

    const token = generateToken(superAdmin._id, 'superadmin');

    return res.status(200).json({
      success: true,
      message: 'Super Admin authenticated successfully',
      token,
      user: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        phone: superAdmin.phone,
        role: 'superadmin'
      }
    });
  } catch (error) {
    console.error('Super Admin login error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during Super Admin login'
    });
  }
};

// ==========================================
// 3. COMPATIBILITY DISPATCHERS & PROFILE
// ==========================================

/**
 * Common register dispatcher
 */
const register = async (req, res) => {
  const isSuperAdmin = req.body.role === 'superadmin' || req.body.role === 'admin';
  if (isSuperAdmin) {
    return registerSuperAdmin(req, res);
  }
  return registerCustomer(req, res);
};

/**
 * Common login dispatcher
 */
const login = async (req, res) => {
  const isSuperAdmin = req.body.portal === 'superadmin' || req.body.portal === 'admin';
  if (isSuperAdmin) {
    return loginSuperAdmin(req, res);
  }
  return loginCustomer(req, res);
};

/**
 * Get profile of current logged-in user (Customer or Super Admin)
 */
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        address: req.user.address
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving profile'
    });
  }
};

/**
 * Get all registered customers (Super Admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    // Queries only customers
    const customers = await Customer.find().select('-password').sort({ createdAt: -1 }).lean();
    
    // Fetch orders to compute real-time metrics per customer
    const allOrders = await Order.find().sort({ createdAt: -1 }).lean();

    const enrichedCustomers = customers.map(cust => {
      const custIdStr = cust._id.toString();
      const custEmail = (cust.email || '').toLowerCase().trim();

      const customerOrders = allOrders.filter(ord => {
        const ordUserId = ord.user ? ord.user.toString() : '';
        const ordEmail = (ord.customerEmail || '').toLowerCase().trim();
        return ordUserId === custIdStr || (custEmail && ordEmail === custEmail);
      });

      const totalOrders = customerOrders.length;
      const totalBooksOrdered = customerOrders.reduce((sum, ord) => {
        const itemsQty = (ord.orderItems || []).reduce((itemSum, item) => itemSum + (Number(item.quantity) || 1), 0);
        return sum + itemsQty;
      }, 0);

      const latestOrder = customerOrders[0] || null;

      return {
        ...cust,
        totalOrders,
        totalBooksOrdered,
        latestOrder: latestOrder ? {
          id: latestOrder._id,
          status: latestOrder.status,
          total: latestOrder.totalPrice,
          paymentMethod: latestOrder.paymentMethod,
          itemsCount: latestOrder.orderItems?.length || 0,
          date: latestOrder.createdAt ? new Date(latestOrder.createdAt).toISOString().split('T')[0] : ''
        } : null,
        orders: customerOrders.map(ord => ({
          id: ord._id,
          status: ord.status,
          total: ord.totalPrice,
          paymentMethod: ord.paymentMethod,
          date: ord.createdAt ? new Date(ord.createdAt).toISOString().split('T')[0] : '',
          items: (ord.orderItems || []).map(i => ({
            title: i.title,
            quantity: i.quantity,
            price: i.price
          }))
        }))
      };
    });

    return res.status(200).json({
      success: true,
      count: enrichedCustomers.length,
      data: enrichedCustomers
    });
  } catch (error) {
    console.error('Server error retrieving customers with order metrics:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving customers'
    });
  }
};

/**
 * Delete a customer account (Super Admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    await customer.deleteOne();
    return res.status(200).json({
      success: true,
      message: 'Customer account deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting customer'
    });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  registerSuperAdmin,
  loginSuperAdmin,
  register,
  login,
  getMe,
  getAllUsers,
  deleteUser
};
