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
    const errorDetail = connectDB.getLastError ? connectDB.getLastError() : null;
    return res.status(503).json({
      success: false,
      isDatabaseOffline: true,
      message: 'MongoDB database is currently offline or unreachable. Please verify your MongoDB service is running or check MONGODB_URI in your environment variables.',
      details: errorDetail || (process.env.MONGODB_URI ? 'Connection timed out. Please allow IP 0.0.0.0/0 in MongoDB Atlas Network Access.' : 'MONGODB_URI environment variable is missing in Vercel settings.')
    });
  }
  next();
};

module.exports = checkDBConnection;
