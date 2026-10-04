const mongoose = require('mongoose');

/**
 * Middleware to check if MongoDB is connected before executing database operations
 */
const checkDBConnection = (req, res, next) => {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      isDatabaseOffline: true,
      message: 'MongoDB database is currently offline or unreachable. Please verify your MongoDB service is running or check MONGODB_URI in backend/.env.'
    });
  }
  next();
};

module.exports = checkDBConnection;
