const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env
dotenv.config();

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const orderRoutes = require('./routes/orderRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Initialize Express application
const app = express();

// Connect to MongoDB
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const checkDBConnection = require('./middleware/dbCheck');

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Book Ordering System backend is running'
  });
});

// API Routes (guarded by DB connectivity check)
app.use('/api/auth', checkDBConnection, authRoutes);
app.use('/api/books', checkDBConnection, bookRoutes);
app.use('/api/orders', checkDBConnection, orderRoutes);
app.use('/api/notifications', checkDBConnection, notificationRoutes);

// Root Information Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Book Ordering System API is live',
    healthCheck: '/api/health'
  });
});

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server error stack:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
