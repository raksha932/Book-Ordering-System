const Book = require('../models/Book');

/**
 * @desc    Get all books with optional search, category filter, and sorting
 * @route   GET /api/books
 * @access  Public
 */
const getBooks = async (req, res) => {
  try {
    const { search, category, featured, bestSeller, sort } = req.query;

    let query = {};

    // Search by title, author, or keyword
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { category: searchRegex },
        { description: searchRegex }
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by featured flag
    if (featured === 'true') {
      query.featured = true;
    }

    // Filter by bestSeller flag
    if (bestSeller === 'true') {
      query.bestSeller = true;
    }

    let booksQuery = Book.find(query);

    // Sorting
    if (sort === 'price_asc') {
      booksQuery = booksQuery.sort({ price: 1 });
    } else if (sort === 'price_desc') {
      booksQuery = booksQuery.sort({ price: -1 });
    } else if (sort === 'rating') {
      booksQuery = booksQuery.sort({ rating: -1 });
    } else {
      booksQuery = booksQuery.sort({ createdAt: -1 });
    }

    const books = await booksQuery;

    return res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    console.error('Get books error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve books'
    });
  }
};

/**
 * @desc    Get single book by ID
 * @route   GET /api/books/:id
 * @access  Public
 */
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Get book by ID error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Invalid book ID or server error'
    });
  }
};

/**
 * @desc    Create a new book
 * @route   POST /api/books
 * @access  Private (Admin only)
 */
const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      category,
      price,
      stock,
      description,
      coverImage,
      rating,
      reviewsCount,
      featured,
      bestSeller,
      isbn,
      pages,
      publisher,
      year
    } = req.body;

    if (!title || !author || !category || price === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, author, category, price, and stock'
      });
    }

    const newBook = await Book.create({
      title,
      author,
      category,
      price: Number(price),
      stock: Number(stock),
      description: description || 'No description provided.',
      coverImage: coverImage || '',
      rating: rating ? Number(rating) : 4.5,
      reviewsCount: reviewsCount ? Number(reviewsCount) : 0,
      featured: Boolean(featured),
      bestSeller: Boolean(bestSeller),
      isbn: isbn || '',
      pages: pages ? Number(pages) : 0,
      publisher: publisher || '',
      year: year ? Number(year) : new Date().getFullYear()
    });

    return res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: newBook
    });
  } catch (error) {
    console.error('Create book error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create book'
    });
  }
};

/**
 * @desc    Update book details
 * @route   PUT /api/books/:id
 * @access  Private (Admin only)
 */
const updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    console.error('Update book error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update book'
    });
  }
};

/**
 * @desc    Delete a book
 * @route   DELETE /api/books/:id
 * @access  Private (Admin only)
 */
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    await book.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete book'
    });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
