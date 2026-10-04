import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ShoppingBag, 
  MapPin, 
  CreditCard 
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import BookImage from '../components/BookImage';

const statusBadgeConfig = {
  Pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  Processing: { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
  Shipped: { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: Truck },
  Delivered: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  Cancelled: { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle }
};

const MyOrders = () => {
  const { orders, cancelOrder, fetchOrders } = useOrders();
  const [filterStatus, setFilterStatus] = useState('All');
  const [cancellingId, setCancellingId] = useState(null);

  React.useEffect(() => {
    if (fetchOrders) {
      fetchOrders();
    }
  }, [fetchOrders]);

  const handleCancel = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setCancellingId(orderId);
      const res = await cancelOrder(orderId);
      setCancellingId(null);
      if (!res.success) {
        alert(res.message || 'Failed to cancel order');
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'All') return true;
    return order.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Orders</h1>
          <p className="text-sm text-slate-500">Track current book deliveries and review past purchase history.</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
          {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterStatus === tab
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const statusConfig = statusBadgeConfig[order.status] || statusBadgeConfig.Processing;
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden transition hover:border-slate-300"
              >
                {/* Order Header bar */}
                <div className="p-5 sm:px-8 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 sm:gap-8">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Order Number
                      </span>
                      <span className="text-sm font-extrabold text-indigo-600">{order.id}</span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Date Placed
                      </span>
                      <span className="text-sm font-semibold text-slate-700">{order.date}</span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Total Amount
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.bg}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{order.status}</span>
                    </span>

                    {(order.status === 'Pending' || order.status === 'Processing') && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        disabled={cancellingId === order.id}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1 rounded-xl transition disabled:opacity-50 cursor-pointer"
                      >
                        {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Items in this order */}
                <div className="p-5 sm:p-8 space-y-4">
                  <div className="divide-y divide-slate-100">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                        <div className="w-16 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                          <BookImage
                            src={item.image}
                            alt={item.title}
                            title={item.title}
                            author={item.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500">by {item.author}</p>
                          <p className="text-xs font-semibold text-slate-600 mt-1">
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right font-extrabold text-slate-900 text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping & Payment Meta */}
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500">
                    <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl">
                      <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-700 block">Delivery Address:</span>
                        <span>{order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.zipCode}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl">
                      <CreditCard className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-700 block">Payment Details:</span>
                        <span>{order.paymentMethod} (Total: ${order.total.toFixed(2)})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Orders Found</h3>
          <p className="text-sm text-slate-500">
            {filterStatus === 'All'
              ? "You haven't placed any book orders yet."
              : `No orders found matching the "${filterStatus}" filter.`}
          </p>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
