import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { categoriesList } from '../data/books';
import logoImg from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-14 pb-8 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-100">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/home" className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="The Book Order System"
                className="w-10 h-10 object-contain rounded-xl shadow-sm"
              />
              <span className="text-xl font-black text-slate-900 tracking-tight">
                The Book <span className="text-indigo-600">Order System</span>
              </span>
            </Link>
            
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              A comprehensive frontend-only bookstore application designed for college mini-projects.
              Explore popular books, add to cart, simulate checkout, and test admin management modules.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Department of Computer Science & Engineering</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>project@bookorderingsystem.edu</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/home" className="hover:text-indigo-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/books" className="hover:text-indigo-600 transition">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-indigo-600 transition">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-indigo-600 transition">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-600 transition">
                  Customer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">
              Genres
            </h4>
            <ul className="space-y-2.5 text-sm">
              {categoriesList.slice(1, 6).map(cat => (
                <li key={cat}>
                  <Link
                    to={`/books?category=${encodeURIComponent(cat)}`}
                    className="hover:text-indigo-600 transition"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portal Navigation */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">
              Portal Access
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-indigo-600 font-semibold hover:underline">
                  Switch Role (Main Page)
                </Link>
              </li>
              <li>
                <Link to="/home" className="hover:text-indigo-600 transition">
                  Customer Home
                </Link>
              </li>
              <li>
                <Link to="/books" className="hover:text-indigo-600 transition">
                  Browse Catalog
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-indigo-600 transition">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Book Ordering System. College Mini-Project.</p>
          <p className="flex items-center gap-1">
            Built with React.js, Tailwind CSS & Vite
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
