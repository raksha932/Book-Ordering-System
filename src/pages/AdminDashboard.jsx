import React from 'react';
import { Link } from 'react-router-dom';
import { 
  IndianRupee, 
  ShoppingBag, 
  BookOpen, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight, 
  Plus, 
  Clock, 
  Truck, 
  CheckCircle2 
} from 'lucide-react';
import { useBooks } from '../context/BookContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { books } = useBooks();
  const { orders, fetchOrders } = useOrders();
  const { customers, fetchCustomers } = useAuth();

  React.useEffect(() => {
    if (fetchCustomers) {
      fetchCustomers();
    }
    if (fetchOrders) {
      fetchOrders();
    }
  }, [fetchCustomers, fetchOrders]);

  // Metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.status !== 'Cancelled' ? ord.total : 0), 0);
  const totalOrders = orders.length;
  const totalBooks = books.length;
  const totalCustomers = customers.length;

  const lowStockBooks = books.filter(b => !b.inStock || b.stockCount < 10);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500">
            Real-time bookstore analytics, order tracking, and stock monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/books"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Inventory</span>
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition text-xs"
          >
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
            <span>View All Orders</span>
          </Link>
        </div>
      </div>

      {/* 4 Stats KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹{totalRevenue.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Live database total
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Orders Placed
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {totalOrders}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Live database records
          </div>
        </div>

        {/* Total Books */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Book Titles
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {totalBooks}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Across 8 departments & genres
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Customers
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {totalCustomers}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Registered accounts
          </div>
        </div>

      </div>

      {/* Main Grid: Recent Orders & Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Customer Orders</h2>
              <p className="text-xs text-slate-400">Latest transactions requiring fulfillment</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Items</th>
                  <th className="py-3 px-6">Total</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-6 font-bold text-indigo-600">{ord.id}</td>
                    <td className="py-3.5 px-6 text-slate-900">{ord.customer?.name || 'Customer'}</td>
                    <td className="py-3.5 px-6">{(ord.items?.length || 0)} titles</td>
                    <td className="py-3.5 px-6 font-extrabold text-slate-900">₹{(Number(ord.total) || 0).toFixed(2)}</td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : ord.status === 'Shipped'
                          ? 'bg-purple-50 text-purple-700'
                          : ord.status === 'Processing'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert Column */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h2 className="text-lg font-bold text-slate-900">Inventory Alerts</h2>
          </div>
          <p className="text-xs text-slate-400">
            Books with low or zero stock requiring procurement
          </p>

          <div className="space-y-3 pt-2">
            {lowStockBooks.length > 0 ? (
              lowStockBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <h4 className="font-bold text-slate-800 truncate">{book.title}</h4>
                    <p className="text-slate-400">{book.category}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-lg font-bold shrink-0 ${
                      book.inStock
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {book.inStock ? `${book.stockCount} left` : 'Out of Stock'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                All book titles currently have healthy inventory levels!
              </p>
            )}
          </div>

          <Link
            to="/admin/books"
            className="block text-center text-xs font-bold text-indigo-600 hover:underline pt-2"
          >
            Update Inventory in Manage Books →
          </Link>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
