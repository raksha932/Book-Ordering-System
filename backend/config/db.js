const mongoose = require('mongoose');
let lastConnectionError = null;

/**
 * Connect to MongoDB database using Mongoose
 * Enforces database-level collection isolation between Customer and SuperAdmin
 */
const connectDB = async () => {
  try {
    // Reuse existing connection in serverless execution environments
    if (mongoose.connection.readyState >= 1) {
      lastConnectionError = null;
      return mongoose.connection;
    }

    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI || mongoURI === 'your_mongodb_connection_string') {
      lastConnectionError = 'MONGODB_URI environment variable is not defined or is placeholder';
      console.warn('⚠️  Warning: MONGODB_URI is not set or still contains placeholder');
      return;
    }

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    lastConnectionError = null;
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);

    // Migrate/sync legacy users into isolated Customer and SuperAdmin collections if needed
    try {
      const db = conn.connection.db;
      const collections = await db.listCollections().toArray();
      const hasUsers = collections.some(c => c.name === 'users');

      if (hasUsers) {
        const Customer = require('../models/Customer');
        const SuperAdmin = require('../models/SuperAdmin');

        const legacyUsers = await db.collection('users').find({}).toArray();
        for (const u of legacyUsers) {
          if (u.role === 'customer') {
            const exists = await Customer.findById(u._id);
            if (!exists) {
              await Customer.collection.insertOne({
                _id: u._id,
                name: u.name,
                email: u.email,
                phone: u.phone || '',
                password: u.password,
                role: 'customer',
                address: u.address || {},
                createdAt: u.createdAt || new Date(),
                updatedAt: u.updatedAt || new Date()
              });
            }
          } else if (u.role === 'admin' || u.role === 'superadmin') {
            const exists = await SuperAdmin.findById(u._id);
            if (!exists) {
              await SuperAdmin.collection.insertOne({
                _id: u._id,
                name: u.name,
                email: u.email,
                phone: u.phone || '',
                password: u.password,
                role: 'superadmin',
                createdAt: u.createdAt || new Date(),
                updatedAt: u.updatedAt || new Date()
              });
            }
          }
        }
      }
    } catch (syncErr) {
      console.warn('Initial collection sync check note:', syncErr.message);
    }

  } catch (error) {
    lastConnectionError = error.message;
    console.error(`MongoDB connection error: ${error.message}`);
  }
};

connectDB.getLastError = () => lastConnectionError;

module.exports = connectDB;
