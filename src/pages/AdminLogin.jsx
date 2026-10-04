import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide your administrative credentials.');
      return;
    }

    setLoading(true);
    const res = await loginAdmin(email.trim(), password);
    setLoading(false);

    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl p-8 sm:p-10 space-y-6 text-white">
        
        {/* Brand Header with Logo */}
        <div className="text-center space-y-3">
          <img
            src={logoImg}
            alt="The Book Order System"
            className="w-20 h-20 object-contain mx-auto drop-shadow-md rounded-2xl bg-white/5 p-1"
          />
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-indigo-900/60 text-indigo-300 border border-indigo-700 mb-2">
              Super Admin Portal
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Super Admin Sign In
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Secure control console for inventory, orders, and customer management.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/70 border border-rose-800 text-rose-200 text-xs font-semibold rounded-xl space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="flex-1 leading-relaxed">{error}</span>
            </div>
            {error.toLowerCase().includes('not exist') && (
              <div className="pt-2 border-t border-rose-800/60 flex items-center justify-between">
                <span className="text-[11px] text-rose-300">New Super Admin?</span>
                <Link
                  to="/admin/register"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs shadow transition"
                >
                  Create Super Admin Account &rarr;
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Real Production Super Admin Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Super Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@bookstore.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Verifying Super Admin Credentials...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In as Super Admin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Create Super Admin Account Link */}
        <div className="text-center text-xs text-slate-300">
          <span>Need a Super Admin account? </span>
          <Link
            to="/admin/register"
            className="text-indigo-400 hover:text-indigo-300 font-bold transition underline underline-offset-2 ml-1"
          >
            Create Super Admin Account
          </Link>
        </div>

        {/* Navigation back */}
        <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-700/60">
          <Link to="/" className="hover:text-white transition font-medium">
            ← Return to Role Selection
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
