import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

const AdminRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError('Please provide all required Super Admin fields (Name, Email, Phone, Password).');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await registerSuperAdmin(name.trim(), email.trim(), password, phone.trim());
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
              Create Super Admin Account
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Register a new Super Admin account with full inventory, orders, and system controls.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/70 border border-rose-800 text-rose-200 text-xs font-semibold rounded-xl space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="flex-1 leading-relaxed">{error}</span>
            </div>
            {error.toLowerCase().includes('already exists') && (
              <div className="pt-2 border-t border-rose-800/60 flex justify-end">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs shadow transition"
                >
                  Sign In to Super Admin Account &rarr;
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Real Super Admin Registration Form */}
        <form onSubmit={handleAdminRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Super Admin Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Prof. Alex Smith"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Super Admin Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@saec.ac.in"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Password (Min 6 Characters) *
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

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              <span>Registering Super Admin in Database...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Register as Super Admin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="pt-2 text-center text-xs text-slate-400 space-y-2 border-t border-slate-700/60">
          <p>
            Already have a Super Admin account?{' '}
            <Link to="/admin/login" className="font-bold text-indigo-400 hover:underline">
              Sign In as Super Admin
            </Link>
          </p>
          <div>
            <Link to="/" className="text-slate-400 hover:text-white transition font-medium">
              ← Return to Role Selection
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminRegister;
