import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star, 
  Check, 
  Truck, 
  ShieldCheck, 
  BookOpen, 
  Calendar, 
  FileText, 
  Barcode, 
  Building2, 
  Plus, 
  Minus,
  MessageSquare
} from 'lucide-react';
import { useBooks } from '../context/BookContext';
import { useCart } from '../context/CartContext';
import CategoryBadge from '../components/CategoryBadge';
import BookCard from '../components/BookCard';
import BookImage from '../components/BookImage';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookById, books } = useBooks();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      const found = await getBookById(id);
      if (isMounted) {
        setBook(found);
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [id, getBookById, books]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500 font-medium">Loading book details from database...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Book Not Found</h2>
        <p className="text-slate-500">The book you are looking for does not exist in the database or has been removed.</p>
        <Link
          to="/books"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(book, quantity);
  };

  // Related books: same category, excluding current book
  const relatedBooks = books
    .filter((b) => b.category === book.category && b.id !== book.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span>/</span>
        <Link to="/books" className="hover:text-indigo-600">Books</Link>
        <span>/</span>
        <Link to={`/books?category=${encodeURIComponent(book.category)}`} className="hover:text-indigo-600">
          {book.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{book.title}</span>
      </div>

      {/* Main Book Detail Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Image */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-100 relative group">
              <BookImage
                src={book.image}
                alt={book.title}
                title={book.title}
                author={book.author}
                category={book.category}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wide shadow-md ${
                    book.inStock
                      ? 'bg-emerald-500 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {book.inStock ? `In Stock (${book.stockCount || 10} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Quick Guarantees under Image */}
            <div className="w-full max-w-sm mt-6 grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Fast campus delivery</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified original copy</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Author, Pricing, Quantity & Add to Cart */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category & Rating */}
              <div className="flex items-center gap-3">
                <CategoryBadge category={book.category} />
                <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-amber-700 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <span>{book.rating}</span>
                  <span className="text-amber-500 font-normal">({book.reviewsCount} ratings)</span>
                </div>
              </div>

              {/* Title & Author */}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {book.title}
              </h1>
              <p className="text-base text-slate-600">
                Written by <span className="font-semibold text-slate-900">{book.author}</span>
              </p>

              {/* Price Block */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline gap-4">
                <span className="text-3xl sm:text-4xl font-black text-indigo-600">
                  ₹{book.price.toFixed(2)}
                </span>
                {book.originalPrice && book.originalPrice > book.price && (
                  <>
                    <span className="text-base text-slate-400 line-through">
                      ₹{book.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Save ₹{(book.originalPrice - book.price).toFixed(2)} (
                      {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}%)
                    </span>
                  </>
                )}
              </div>

              {/* Quick Summary Preview */}
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                {book.description}
              </p>
            </div>

            {/* Quantity Selector and Add to Cart Section */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Quantity Control */}
                <div className="flex items-center justify-between sm:justify-start border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={!book.inStock || quantity <= 1}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-40 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-slate-800 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    disabled={!book.inStock || (book.stockCount && quantity >= book.stockCount)}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-40 transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!book.inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition ${
                    book.inStock
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{book.inStock ? `Add to Cart - ₹${(book.price * quantity).toFixed(2)}` : 'Out of Stock'}</span>
                </button>
              </div>

              {/* Secondary CTA */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (handleAddToCart()) {
                      navigate('/cart');
                    }
                  }}
                  disabled={!book.inStock}
                  className="w-full py-2.5 text-center text-xs font-bold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-xl transition"
                >
                  Buy Now (Proceed to Checkout)
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Tabbed Info: Description, Specifications, Sample Reviews */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveTab('description')}
              className={`text-sm font-bold pb-2 transition border-b-2 -mb-3.5 ${
                activeTab === 'description'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Book Synopsis
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`text-sm font-bold pb-2 transition border-b-2 -mb-3.5 ${
                activeTab === 'specs'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Product Details
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-sm font-bold pb-2 transition border-b-2 -mb-3.5 ${
                activeTab === 'reviews'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Student & Reader Reviews ({book.reviewsCount})
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'description' && (
              <div className="prose text-sm text-slate-600 leading-relaxed max-w-none space-y-4">
                <p>{book.description}</p>
                <p>
                  This volume is part of our standard recommended reading list for students, researchers,
                  and enthusiastic lifelong readers. All physical copies are brand new and dispatched in
                  protective packaging.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Building2 className="w-4 h-4" />
                    <span className="text-xs font-bold text-slate-400 uppercase">Publisher</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{book.publisher || "Global Books"}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold text-slate-400 uppercase">Published</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{book.publicationYear || "2021"}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-bold text-slate-400 uppercase">Page Count</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{book.pages || 320} Pages</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Barcode className="w-4 h-4" />
                    <span className="text-xs font-bold text-slate-400 uppercase">ISBN-13</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{book.isbn || "978-0000000000"}</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-black text-slate-900">{book.rating}</div>
                    <div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">Based on {book.reviewsCount} student reviews</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert("Review submission will connect to Supabase backend in the next phase!")}
                    className="text-xs font-bold px-4 py-2 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Sample Review 1 */}
                <div className="p-4 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">Sarah M. (CS Major)</span>
                    <span className="text-[11px] text-slate-400">2 days ago</span>
                  </div>
                  <div className="flex text-amber-400 text-xs">★★★★★</div>
                  <p className="text-xs text-slate-600">
                    A must-read for coursework and beyond. The concepts are articulated cleanly with practical real-world relevance.
                  </p>
                </div>

                {/* Sample Review 2 */}
                <div className="p-4 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">Jonathan P.</span>
                    <span className="text-[11px] text-slate-400">1 week ago</span>
                  </div>
                  <div className="flex text-amber-400 text-xs">★★★★☆</div>
                  <p className="text-xs text-slate-600">
                    Arrived quickly in mint condition. The binding and print clarity are superb.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Books Section */}
      {relatedBooks.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              More in <span className="text-indigo-600">{book.category}</span>
            </h2>
            <Link
              to={`/books?category=${encodeURIComponent(book.category)}`}
              className="text-sm font-semibold text-indigo-600 hover:underline"
            >
              See all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook.id} book={relBook} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default BookDetails;
