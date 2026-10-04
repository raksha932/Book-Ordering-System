import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  RotateCcw, 
  BookX,
  CheckCircle2
} from 'lucide-react';
import { useBooks } from '../context/BookContext';
import BookCard from '../components/BookCard';
import { categoriesList } from '../data/books';

const Books = () => {
  const { books } = useBooks();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const queryParamSearch = searchParams.get('search') || '';
  const queryParamCategory = searchParams.get('category') || 'All Categories';

  const [searchQuery, setSearchQuery] = useState(queryParamSearch);
  const [selectedCategory, setSelectedCategory] = useState(queryParamCategory);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating', 'title'
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    if (queryParamSearch !== searchQuery) {
      setSearchQuery(queryParamSearch);
    }
  }, [queryParamSearch]);

  useEffect(() => {
    if (queryParamCategory !== selectedCategory) {
      setSelectedCategory(queryParamCategory);
    }
  }, [queryParamCategory]);

  // Filter & Sort Logic
  const filteredAndSortedBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Category Filter
        const matchesCategory =
          selectedCategory === 'All Categories' ||
          book.category.toLowerCase() === selectedCategory.toLowerCase();

        // Search Filter (Title, Author, Category, Description)
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.category.toLowerCase().includes(q) ||
          (book.description && book.description.toLowerCase().includes(q));

        // Stock Filter
        const matchesStock = !onlyInStock || book.inStock;

        return matchesCategory && matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        // Default: featured first, then bestSeller, then id
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [books, searchQuery, selectedCategory, sortBy, onlyInStock]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (category === 'All Categories') {
        updated.delete('category');
      } else {
        updated.set('category', category);
      }
      return updated;
    });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (!val.trim()) {
        updated.delete('search');
      } else {
        updated.set('search', val);
      }
      return updated;
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSortBy('featured');
    setOnlyInStock(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Browse Book Catalog
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl">
          Search, filter by genre, sort by price, and pick from our hand-curated collection of textbooks and bestsellers.
        </p>
      </div>

      {/* Control Bar: Search + Category Pills + Sort Dropdown */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-5">
        
        {/* Top Controls: Search Bar and Sorting */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
          {/* Search Box */}
          <div className="md:col-span-7 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by title, author, or keyword..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange({ target: { value: '' } })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3">
            <div className="relative">
              <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition appearance-none cursor-pointer"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* In-Stock Filter Toggle */}
          <div className="md:col-span-2 flex items-center justify-start md:justify-end">
            <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>

          {categoriesList.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count and Active Filter Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
        <p>
          Showing <span className="font-bold text-slate-800">{filteredAndSortedBooks.length}</span> of {books.length} books
          {selectedCategory !== 'All Categories' && (
            <span> in <strong className="text-indigo-600">{selectedCategory}</strong></span>
          )}
          {searchQuery && (
            <span> matching "<strong className="text-indigo-600">{searchQuery}</strong>"</span>
          )}
        </p>

        {(selectedCategory !== 'All Categories' || searchQuery || onlyInStock || sortBy !== 'featured') && (
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* Books Grid */}
      {filteredAndSortedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 my-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <BookX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No books found</h3>
          <p className="text-sm text-slate-500">
            No titles matched your selected search criteria. Try removing filters or searching with a different keyword.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-md transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Filters & Show All Books</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Books;
