import React from 'react';
import { Menu, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const AdminHeader = ({ setMobileOpen, title = "Admin Panel" }) => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <p className="text-xs text-slate-400 hidden sm:block">
            Book Ordering System Management Console
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <NotificationBell align="right" />

        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Role Selection</span>
        </Link>

        {/* Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-bold text-slate-800">
              {user?.name || 'Administrator'}
            </span>
            <span className="block text-[10px] text-slate-400 font-medium">
              Super Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
