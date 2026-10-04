const mongoose = require('mongoose');
const connectDB = require('../config/db');

/**
 * Middleware to check if MongoDB is connected before executing database operations
 */
const checkDBConnection = async (req, res, next) => {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      // Fall through to error response below
    }
  }

  if (mongoose.connection.readyState !== 1) {
    let diagnosticMsg = 'MongoDB database is currently offline or unreachable.';
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'your_mongodb_connection_string') {
      diagnosticMsg = 'MONGODB_URI is not set in Vercel Environment Variables. Go to Vercel Dashboard > Settings > Environment Variables, add MONGODB_URI, then Redeploy.';
    } else {
      const errDetail = connectDB.getLastError ? connectDB.getLastError() : '';
      diagnosticMsg = `MongoDB connection failed (${errDetail || 'timed out'}). In MongoDB Atlas, go to Network Access and add 0.0.0.0/0 (Allow access from anywhere).`;
    }

    return res.status(503).json({
      success: false,
      isDatabaseOffline: true,
      message: diagnosticMsg
    });
  }
  next();
};

module.exports = checkDBConnection;
