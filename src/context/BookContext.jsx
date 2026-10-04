import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { booksAPI } from '../api/apiClient';

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Helper to normalize MongoDB book object
   */
  const normalizeBook = (book) => ({
    ...book,
    id: book._id || book.id,
    stockCount: book.stock !== undefined ? book.stock : 0,
    inStock: book.stock > 0,
    image: book.coverImage || book.image || ''
  });

  /**
   * Fetch all books from Backend API with optional search, category, and sort filters
   */
  const fetchBooks = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await booksAPI.getAll(filters);
      if (res.success && res.data) {
        const normalized = res.data.map(normalizeBook);
        setBooks(normalized);
      }
    } catch (err) {
      console.error('Failed to load books from database:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial books on mount
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  /**
   * Real Add Book via Backend API (Admin)
   */
  const addBook = async (newBookData) => {
    try {
      const payload = {
        title: newBookData.title,
        author: newBookData.author,
        category: newBookData.category,
        price: parseFloat(newBookData.price) || 0,
        stock: parseInt(newBookData.stockCount || newBookData.stock || 0, 10),
        description: newBookData.description || '',
        coverImage: newBookData.coverImage || newBookData.image || '',
        featured: Boolean(newBookData.featured),
        bestSeller: Boolean(newBookData.bestSeller),
        isbn: newBookData.isbn || '',
        pages: parseInt(newBookData.pages, 10) || 0,
        publisher: newBookData.publisher || '',
        year: parseInt(newBookData.year || newBookData.publicationYear, 10) || new Date().getFullYear()
      };

      const res = await booksAPI.create(payload);
      if (res.success && res.data) {
        const created = normalizeBook(res.data);
        setBooks(prev => [created, ...prev]);
        return { success: true, data: created };
      }
      return { success: false, message: res.message };
    } catch (err) {
      console.error('Error adding book:', err.message);
      return { success: false, message: err.message };
    }
  };

  /**
   * Real Update Book via Backend API (Admin)
   */
  const updateBook = async (id, updatedFields) => {
    try {
      const payload = { ...updatedFields };
      if (updatedFields.stockCount !== undefined) {
        payload.stock = parseInt(updatedFields.stockCount, 10);
      }
      if (updatedFields.image !== undefined && !updatedFields.coverImage) {
        payload.coverImage = updatedFields.image;
      }

      const res = await booksAPI.update(id, payload);
      if (res.success && res.data) {
        const updated = normalizeBook(res.data);
        setBooks(prev => prev.map(b => (b.id === id || b._id === id ? updated : b)));
        return { success: true, data: updated };
      }
      return { success: false, message: res.message };
    } catch (err) {
      console.error('Error updating book:', err.message);
      return { success: false, message: err.message };
    }
  };

  /**
   * Real Delete Book via Backend API (Admin)
   */
  const deleteBook = async (id) => {
    try {
      const res = await booksAPI.delete(id);
      if (res.success) {
        setBooks(prev => prev.filter(b => b.id !== id && b._id !== id));
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      console.error('Error deleting book:', err.message);
      return { success: false, message: err.message };
    }
  };

  /**
   * Fetch single book by ID
   */
  const getBookById = async (id) => {
    // Check locally first
    const local = books.find(b => b.id === id || b._id === id);
    if (local) return local;

    try {
      const res = await booksAPI.getById(id);
      if (res.success && res.data) {
        return normalizeBook(res.data);
      }
    } catch (err) {
      console.error('Error fetching book by ID:', err.message);
    }
    return null;
  };

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        error,
        fetchBooks,
        addBook,
        updateBook,
        deleteBook,
        getBookById
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => useContext(BookContext);
