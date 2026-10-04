import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Eye 
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import BookImage from '../components/BookImage';

const statusBadgeConfig = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-blue-50 text-blue-700 border-blue-200',
  Shipped: 'bg-purple-50 text-purple-700 border-purple-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-200'
};

const ManageOrders = () => {
  const { orders, updateOrderStatus, fetchOrders } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  React.useEffect(() => {
    if (fetchOrders) {
      fetchOrders();
    }
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setFeedbackMsg(null);
    const res = await updateOrderStatus(orderId, newStatus);
    setUpdatingId(null);
    if (res.success) {
      setFeedbackMsg(`Order #${orderId.slice(-8)} updated to "${newStatus}". Customer has been notified.`);
      setTimeout(() => setFeedbackMsg(null), 4500);
    } else {
      alert(res.message || 'Failed to update order status');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === 'All' || (order.status && order.status.toLowerCase() === filterStatus.toLowerCase());
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.id?.toLowerCase().includes(q) ||
      order._id?.toLowerCase().includes(q) ||
      order.customer?.name?.toLowerCase().includes(q) ||
      order.customer?.email?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const toggleExpand = (id) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Orders</h1>
        <p className="text-xs text-slate-500">
          Review customer purchases, inspect ordered books, and update shipment progress.
        </p>
      </div>

      {feedbackMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <span>{feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg(null)} className="text-emerald-600 hover:text-emerald-950 font-bold ml-2">×</button>
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID or customer name..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterStatus === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Total</th>
                <th className="py-3.5 px-6">Current Status</th>
                <th className="py-3.5 px-6">Update Status</th>
                <th className="py-3.5 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-xs sm:text-sm">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  const badgeStyle = statusBadgeConfig[order.status] || 'bg-slate-100 text-slate-700';

                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-6 font-extrabold text-indigo-600">
                          {order.id}
                        </td>

                        <td className="py-3.5 px-6">
                          <div>
                            <span className="font-bold text-slate-900 block">{order.customer?.name || 'Customer'}</span>
                            <span className="text-xs text-slate-400">{order.customer?.email || 'N/A'}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-6 text-slate-600">
                          {order.date}
                        </td>

                        <td className="py-3.5 px-6 font-black text-slate-900">
                          ${(Number(order.total) || 0).toFixed(2)}
                        </td>

                        <td className="py-3.5 px-6">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${badgeStyle}`}>
                            {order.status}
                          </span>
                        </td>

                        {/* Status update select */}
                        <td className="py-3.5 px-6">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer disabled:opacity-50"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Expand toggle */}
                        <td className="py-3.5 px-6 text-right">
                          <button
                            onClick={() => toggleExpand(order.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition"
                          >
                            <span>{isExpanded ? 'Hide' : 'View'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Order Details Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/70">
                          <td colSpan="7" className="p-6">
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Order Items Breakdown
                              </h4>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                                  >
                                    <div className="w-10 h-14 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                                      <BookImage
                                        src={item.image}
                                        alt={item.title}
                                        title={item.title}
                                        author={item.author}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <h5 className="font-bold text-slate-800 text-xs truncate">
                                        {item.title}
                                      </h5>
                                      <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                                      <p className="text-xs font-extrabold text-indigo-600">
                                        ${(item.price * item.quantity).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                                <div>
                                  <strong>Destination:</strong> {[order.customer?.address, order.customer?.city, order.customer?.state, order.customer?.zipCode].filter(Boolean).join(', ') || 'N/A'} | <strong>Phone:</strong> {order.customer?.phone || 'N/A'}
                                </div>
                                <div>
                                  <strong>Payment:</strong> {order.paymentMethod || 'N/A'}
                                </div>
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
                    No orders found matching your search.
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

export default ManageOrders;
