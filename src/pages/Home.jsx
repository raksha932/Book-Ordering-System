import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Award, 
  BookOpen, 
  Flame, 
  Star,
  CheckCircle
} from 'lucide-react';
import { useBooks } from '../context/BookContext';
import BookCard from '../components/BookCard';
import BookImage from '../components/BookImage';
import { categoriesList } from '../data/books';

const Home = () => {
  const { books } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/books');
    }
  };

  const featuredBooks = books.filter(b => b.featured).slice(0, 4);
  const bestSellers = books.filter(b => b.bestSeller).slice(0, 4);

  const categoryIcons = {
    "Technology": "💻",
    "Fiction": "✨",
    "Business": "📈",
    "Self-Help": "🌱",
    "Science": "🔬",
    "Philosophy": "🏛️",
    "History": "📜",
    "Mystery": "🔍"
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading, Subtext, Search */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-bold tracking-wide uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen College Book Ordering System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Discover Your Next <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">
                  Favorite Book
                </span> Today
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Explore an extensive collection of bestselling literature, computer science masterworks, 
                business strategies, and personal growth books. Fast delivery and simple checkout.
              </p>

              {/* Hero Search Bar */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0 pt-2">
                <div className="flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-2xl shadow-lg border border-slate-200">
                  <div className="flex items-center gap-3 px-3 flex-1">
                    <Search className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by title, author, or keyword..."
                      className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none py-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md shadow-indigo-200 shrink-0 text-sm"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Popular quick searches */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-slate-500">
                <span className="font-semibold text-slate-400">Popular:</span>
                {["Clean Code", "Atomic Habits", "Technology", "Business"].map(term => (
                  <button
                    key={term}
                    onClick={() => navigate(`/books?search=${encodeURIComponent(term)}`)}
                    className="bg-white px-2.5 py-1 rounded-md border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Visual Book Showcase */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Decorative background glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-amber-500/10 rounded-3xl blur-2xl -z-10" />

                {/* Hero Showcase Container */}
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/90 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Semester Top Pick
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                      In Stock
                    </span>
                  </div>

                  {books[0] && (
                    <div className="flex gap-4 items-center bg-slate-50/80 hover:bg-indigo-50/40 p-3.5 rounded-2xl border border-slate-100 transition group">
                      <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                        <BookImage
                          src={books[0].coverImage}
                          alt={books[0].title}
                          className="w-full h-full object-cover"
                          category={books[0].category}
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
                          {books[0].category}
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-1">
                          {books[0].title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{books[0].author}</p>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold pt-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{books[0].rating}</span>
                          <span className="text-slate-400 font-normal">({books[0].reviewsCount})</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-base font-extrabold text-slate-900">
                            ₹{books[0].price.toFixed(2)}
                          </span>
                          <Link
                            to={`/books/${books[0].id}`}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs hover:border-indigo-300"
                          >
                            Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {books[1] && (
                    <div className="flex gap-4 items-center bg-slate-50/80 hover:bg-indigo-50/40 p-3.5 rounded-2xl border border-slate-100 transition group">
                      <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                        <BookImage
                          src={books[1].coverImage}
                          alt={books[1].title}
                          className="w-full h-full object-cover"
                          category={books[1].category}
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
                          {books[1].category}
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-1">
                          {books[1].title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{books[1].author}</p>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold pt-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{books[1].rating}</span>
                          <span className="text-slate-400 font-normal">({books[1].reviewsCount})</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-base font-extrabold text-slate-900">
                            ₹{books[1].price.toFixed(2)}
                          </span>
                          <Link
                            to={`/books/${books[1].id}`}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs hover:border-indigo-300"
                          >
                            Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Free Campus Delivery
                    </span>
                    <Link
                      to="/books"
                      className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <span>Explore all {books.length} books</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Floating Rating Pill Badge */}
                <div className="absolute -bottom-4 -left-4 bg-white px-4 py-2.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 hidden sm:flex">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">4.9 / 5 Rating</div>
                    <div className="text-[11px] text-slate-400">1,200+ Verified Students</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Guarantee Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Free Campus Delivery</h4>
              <p className="text-xs text-slate-500">On all orders over ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">100% Authentic</h4>
              <p className="text-xs text-slate-500">Verified publishers only</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Easy Returns</h4>
              <p className="text-xs text-slate-500">7-day hassle-free replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Curated Quality</h4>
              <p className="text-xs text-slate-500">Top academic & bestsellers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Explore Genres</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Categories
            </h2>
          </div>
          <Link
            to="/books"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            <span>View All Books</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categoriesList.slice(1).map((category) => (
            <button
              key={category}
              onClick={() => navigate(`/books?category=${encodeURIComponent(category)}`)}
              className="bg-white hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 p-4 rounded-2xl text-center transition group shadow-sm hover:shadow-md"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                {categoryIcons[category] || "📚"}
              </div>
              <h4 className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 truncate">
                {category}
              </h4>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Handpicked For You</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Books
            </h2>
          </div>
          <Link
            to="/books"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4" />
                <span>Reader Favorites</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Best Sellers of the Semester
              </h2>
            </div>
            <Link
              to="/books"
              className="text-sm font-semibold text-indigo-300 hover:text-white flex items-center gap-1 group"
            >
              <span>See more top picks</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {bestSellers.map((book) => (
              <div key={book.id} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action (CTA) Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 rounded-3xl p-8 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Expand Your Knowledge?
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Order your textbooks, reference guides, and personal development titles today.
              Experience frictionless cart checkout and instant tracking in our college mini-project.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/books"
                className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-8 py-3.5 rounded-xl shadow-lg transition text-sm inline-flex items-center justify-center gap-2"
              >
                <span>Browse All Books Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/cart"
                className="bg-indigo-500/30 hover:bg-indigo-500/50 text-white border border-white/20 font-bold px-8 py-3.5 rounded-xl transition text-sm inline-flex items-center justify-center"
              >
                View Your Cart
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
