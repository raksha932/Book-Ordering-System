import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CategoryBadge from './CategoryBadge';
import BookImage from './BookImage';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Book Image & Badges Container */}
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        <BookImage
          src={book.image}
          alt={book.title}
          title={book.title}
          author={book.author}
          category={book.category}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Stock Status Pill */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2.5 py-1 text-[11px] font-bold tracking-wide rounded-md uppercase backdrop-blur-md shadow-sm ${
              book.inStock
                ? 'bg-emerald-500/90 text-white'
                : 'bg-rose-500/90 text-white'
            }`}
          >
            {book.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Quick View Button on Image Hover */}
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <Link
            to={`/books/${book.id}`}
            className="inline-flex items-center gap-1.5 bg-white text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg shadow-md hover:bg-slate-50 transition"
          >
            <Eye className="w-4 h-4 text-indigo-600" />
            Quick View
          </Link>
        </div>
      </div>

      {/* Book Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <CategoryBadge category={book.category} />
          {book.rating && (
            <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span>{book.rating}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
          <Link to={`/books/${book.id}`} title={book.title}>
            {book.title}
          </Link>
        </h3>

        {/* Author */}
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 mb-3">
          by <span className="font-medium text-slate-700">{book.author}</span>
        </p>

        {/* Price & Spacer */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-900">
              ₹{book.price.toFixed(2)}
            </span>
            {book.originalPrice && book.originalPrice > book.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {book.stockCount !== undefined && book.inStock && (
            <span className="text-[11px] text-slate-400">
              {book.stockCount} left
            </span>
          )}
        </div>

        {/* Action Buttons: View Details & Add to Cart */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Link
            to={`/books/${book.id}`}
            className="w-full inline-flex items-center justify-center px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Details
          </Link>

          <button
            onClick={() => addToCart(book)}
            disabled={!book.inStock}
            className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition ${
              book.inStock
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
