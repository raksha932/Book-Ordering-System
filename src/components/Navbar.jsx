import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  ShoppingCart, 
  User, 
  Package, 
  Menu, 
  X, 
  LogOut, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { categoriesList } from '../data/books';
import logoImg from '../assets/logo.png';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCategorySelect = (category) => {
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
    if (category === "All Categories") {
      navigate('/books');
    } else {
      navigate(`/books?category=${encodeURIComponent(category)}`);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors duration-200 py-1.5 px-3 rounded-lg ${
      isActive
        ? 'text-indigo-600 bg-indigo-50/80 font-bold'
        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-3 group">
            <img
              src={logoImg}
              alt="The Book Order System"
              className="w-10 h-10 object-contain rounded-xl shadow-sm group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 block leading-tight">
                The Book <span className="text-indigo-600">Order System</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
                College Mini-Project Edition
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <NavLink to="/home" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/books" className={navLinkClass}>
              Books
            </NavLink>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(prev => !prev)}
                className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 py-1.5 px-3 rounded-lg transition"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>

              {categoryDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setCategoryDropdownOpen(false)}
                  />
                  <div className="absolute top-full mt-2 left-0 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Browse by Genre
                    </div>
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition flex items-center justify-between"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <NavLink to="/my-orders" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </span>
            </NavLink>
          </nav>

          {/* Desktop Right Actions: Cart & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Customer Notifications */}
            {user && <NotificationBell align="right" />}

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition duration-150 flex items-center"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile & Logout */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-400 capitalize">
                      Customer
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Cart Icon & Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            {user && <NotificationBell align="right" />}

            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
          <div className="flex flex-col space-y-1">
            <Link
              to="/home"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              Home
            </Link>
            <Link
              to="/books"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              All Books
            </Link>
            <Link
              to="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              My Orders
            </Link>
          </div>

          {/* Mobile Categories list */}
          <div className="pt-2 border-t border-slate-100">
            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Categories
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {categoriesList.slice(1).map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className="text-left px-3 py-1.5 text-xs text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-md"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Auth */}
          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-rose-600 font-bold px-2 py-1 hover:bg-rose-50 rounded"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
