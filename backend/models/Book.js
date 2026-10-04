const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a book title'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Please provide the author name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please provide the category/genre'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide the price'],
      min: [0, 'Price must be greater than or equal to 0']
    },
    stock: {
      type: Number,
      required: [true, 'Please provide the stock count'],
      default: 10,
      min: [0, 'Stock cannot be negative']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true
    },
    coverImage: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    bestSeller: {
      type: Boolean,
      default: false
    },
    isbn: {
      type: String,
      default: ''
    },
    pages: {
      type: Number,
      default: 0
    },
    publisher: {
      type: String,
      default: ''
    },
    year: {
      type: Number,
      default: new Date().getFullYear()
    }
  },
  {
    timestamps: true
  }
);

// Index for text search on title, author, and description
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);
