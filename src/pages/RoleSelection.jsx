import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, ArrowRight, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import logoImg from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCustomerClick = () => {
    if (user && user.role === 'customer') {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  const handleAdminClick = () => {
    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      
      {/* Top Banner / College Project Tag */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-600">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>College Mini-Project Edition</span>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Full-Stack Node + MongoDB Architecture
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto w-full py-8 sm:py-12 space-y-10 text-center">
        
        {/* Brand Logo & Header */}
        <div className="space-y-4">
          <div className="relative inline-block">
            <div className="absolute -inset-3 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-xl -z-10" />
            <img
              src={logoImg}
              alt="The Book Order System"
              className="w-28 h-28 sm:w-32 sm:h-32 object-contain mx-auto drop-shadow-xl hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              The Book <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">Order System</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Welcome! Please select your portal role to sign in. The Customer and Administrator flows are completely separated.
            </p>
          </div>
        </div>



        {/* The Two Main Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto text-left">
          
          {/* Card 1: Customer Login */}
          <div className="bg-white rounded-3xl border-2 border-indigo-100 hover:border-indigo-400 p-6 sm:p-8 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-50 rounded-bl-full -z-0 pointer-events-none transition-transform group-hover:scale-110" />

            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                <User className="w-7 h-7" />
              </div>

              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
                  Portal 01
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Customer Login
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  For students, faculty, and book lovers. Browse catalog books, inspect synopses, manage your shopping cart, and place orders.
                </p>
              </div>

              <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Browse & search books catalog</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Cart & simplified checkout</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Track your personal order history</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 relative z-10 space-y-2">
              <button
                onClick={handleCustomerClick}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-200 transition group-hover:shadow-lg"
              >
                <span>Customer Login</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-[11px] text-slate-400">
                New user? Registration available
              </p>
            </div>
          </div>

          {/* Card 2: Admin Login */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-slate-800 p-6 sm:p-8 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-slate-100 rounded-bl-full -z-0 pointer-events-none transition-transform group-hover:scale-110" />

            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-300 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-amber-400" />
              </div>

              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-slate-900 text-amber-400 border border-slate-700 mb-2">
                  Portal 02 • Super Admin
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Super Admin Login
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  For store management and super administrators. Access the management dashboard, control catalog inventory, fulfill orders, and manage customers.
                </p>
              </div>

              <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Real-time bookstore analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Manage book inventory & stock status</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Fulfill orders & manage customers</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 relative z-10 space-y-2">
              <button
                onClick={handleAdminClick}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md shadow-slate-300 transition group-hover:shadow-lg"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Super Admin Login</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-[11px] text-slate-400">
                Sign in or register a Super Admin account
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 py-4 border-t border-slate-200/60 max-w-4xl mx-auto w-full">
        © {new Date().getFullYear()} The Book Order System • Department of Computer Science & Engineering
      </div>

    </div>
  );
};

export default RoleSelection;
