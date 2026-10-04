import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, ArrowRight, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginCustomer } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setErrorDetails('');
    setAccountNotFound(false);

    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setLoading(true);
    const res = await loginCustomer(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/home');
    } else {
      setError(res.message);
      setErrorDetails(res.details || '');
      if (res.notFound) {
        setAccountNotFound(true);
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-soft p-8 sm:p-10 space-y-6">
        
        {/* Brand header with Logo */}
        <div className="text-center space-y-3">
          <img
            src={logoImg}
            alt="The Book Order System"
            className="w-24 h-24 object-contain mx-auto drop-shadow-md hover:scale-105 transition-transform"
          />
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Customer Sign In
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sign in with your registered account credentials.
            </p>
          </div>
        </div>

        {/* Error notification */}
        {error && !accountNotFound && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span className="flex-1 leading-relaxed">{error}</span>
            </div>
            {errorDetails && (
              <div className="text-[11px] bg-rose-100/70 p-2 rounded-lg font-mono text-rose-900 break-all border border-rose-200/50">
                <span className="font-bold">Reason:</span> {errorDetails}
              </div>
            )}
          </div>
        )}

        {/* Account not found banner with direct Create Account action */}
        {accountNotFound && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs space-y-2 text-center">
            <div className="flex items-center justify-center gap-1.5 font-bold text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Customer Account Not Found</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              No customer account was found with this email. Would you like to create one now?
            </p>
            <div className="pt-1">
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition text-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Customer Account</span>
              </Link>
            </div>
          </div>
        )}

        {/* Real Production Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Registered Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating Customer...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In as Customer</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="pt-2 text-center space-y-2 text-xs text-slate-500">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:underline">
              Create Customer Account
            </Link>
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center">
            <Link to="/" className="text-slate-400 hover:text-slate-700 font-medium">
              ← Return to Portal Selection
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
