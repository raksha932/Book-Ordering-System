import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Trash2, 
  Mail, 
  Calendar, 
  Phone,
  ShoppingBag,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

const statusBadgeConfig = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-blue-50 text-blue-700 border-blue-200',
  Shipped: 'bg-purple-50 text-purple-700 border-purple-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-200'
};

const ManageCustomers = () => {
  const { customers, fetchCustomers, deleteCustomer } = useAuth();
  const { orders, fetchOrders } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCustId, setExpandedCustId] = useState(null);

  useEffect(() => {
    if (fetchCustomers) fetchCustomers();
    if (fetchOrders) fetchOrders(true);
  }, [fetchCustomers, fetchOrders]);

  const filteredCustomers = customers.filter((c) => {
    const q = searchTerm.toLowerCase().trim();
    return !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q);
  });

  const toggleExpand = (id) => {
    setExpandedCustId(prev => (prev === id ? null : id));
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete customer account for "${name}" from MongoDB?`)) {
      await deleteCustomer(id);
    }
  };

  // Total books ordered across all patrons
  const totalSystemBooksOrdered = customers.reduce((sum, c) => sum + (c.totalBooksOrdered || 0), 0);
  const totalSystemOrdersPlaced = customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Management</h1>
        <p className="text-xs text-slate-500">
          Live customer records, purchase histories, book order counts, and delivery tracking.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Registered Customers</span>
            <span className="text-2xl font-black text-slate-900">{customers.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Books Ordered</span>
            <span className="text-2xl font-black text-indigo-600">{totalSystemBooksOrdered}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Customer Orders</span>
            <span className="text-2xl font-black text-emerald-600">{totalSystemOrdersPlaced}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Summary */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, email, or phone..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Synchronized Live from MongoDB: <strong className="text-indigo-600">{filteredCustomers.length}</strong> customers
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Books Ordered</th>
                <th className="py-3.5 px-6">Total Orders</th>
                <th className="py-3.5 px-6">Latest Status</th>
                <th className="py-3.5 px-6">Payment Method</th>
                <th className="py-3.5 px-6">Joined Date</th>
                <th className="py-3.5 px-6 text-right">Details & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-xs sm:text-sm">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => {
                  const custId = cust._id || cust.id;
                  const isExpanded = expandedCustId === custId;
                  const booksCount = cust.totalBooksOrdered || 0;
                  const ordersCount = cust.totalOrders || 0;
                  const latestStatus = cust.latestOrder?.status || 'No Orders';
                  const badgeStyle = statusBadgeConfig[latestStatus] || 'bg-slate-100 text-slate-600 border-slate-200';

                  return (
                    <React.Fragment key={custId}>
                      <tr className="hover:bg-slate-50/80 transition">
                        
                        {/* Name + Email + Phone */}
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {cust.name ? cust.name.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{cust.name}</span>
                              <span className="text-xs text-slate-400 block">{cust.email}</span>
                              {cust.phone && <span className="text-[11px] text-slate-400 block font-normal">{cust.phone}</span>}
                            </div>
                          </div>
                        </td>

                        {/* Books Ordered */}
                        <td className="py-3.5 px-6">
                          <span className="inline-flex items-center gap-1.5 font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-xl text-xs">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{booksCount} {booksCount === 1 ? 'book' : 'books'}</span>
                          </span>
                        </td>

                        {/* Total Orders */}
                        <td className="py-3.5 px-6 font-bold text-slate-900">
                          {ordersCount} {ordersCount === 1 ? 'order' : 'orders'}
                        </td>

                        {/* Latest Order Status */}
                        <td className="py-3.5 px-6">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${badgeStyle}`}>
                            {latestStatus}
                          </span>
                        </td>

                        {/* Payment Method */}
                        <td className="py-3.5 px-6 text-slate-700 text-xs font-medium">
                          {cust.latestOrder?.paymentMethod || '—'}
                        </td>

                        {/* Joined Date */}
                        <td className="py-3.5 px-6 text-slate-500 text-xs">
                          {cust.createdAt ? new Date(cust.createdAt).toISOString().split('T')[0] : '—'}
                        </td>

                        {/* Expand & Delete Actions */}
                        <td className="py-3.5 px-6 text-right">
                          <div className="inline-flex items-center gap-1">
                            {ordersCount > 0 && (
                              <button
                                onClick={() => toggleExpand(custId)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                              >
                                <span>{isExpanded ? 'Hide' : 'Orders'}</span>
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(custId, cust.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete Customer Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>

                      {/* Expandable Order Breakdown */}
                      {isExpanded && cust.orders && (
                        <tr className="bg-slate-50/70">
                          <td colSpan="7" className="p-5">
                            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-sm">
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <ShoppingBag className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Order Details for {cust.name} ({cust.orders.length} Total)</span>
                              </h4>

                              <div className="space-y-2">
                                {cust.orders.map((ord) => (
                                  <div
                                    key={ord.id}
                                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                                  >
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <strong className="text-indigo-600 font-bold">#{ord.id.slice(-8)}</strong>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadgeConfig[ord.status] || ''}`}>
                                          {ord.status}
                                        </span>
                                        <span className="text-slate-400 text-[11px]">{ord.date}</span>
                                      </div>
                                      <div className="mt-1 text-slate-600">
                                        Books: {ord.items.map(i => `${i.title} (x${i.quantity})`).join(', ')}
                                      </div>
                                    </div>

                                    <div className="text-right sm:text-right shrink-0">
                                      <span className="font-black text-slate-900 block">${(Number(ord.total) || 0).toFixed(2)}</span>
                                      <span className="text-[11px] text-slate-500 block">{ord.paymentMethod}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No customer accounts found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ManageCustomers;
