import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  CheckCircle, 
  ArrowLeft, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  User 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import BookImage from '../components/BookImage';

const Checkout = () => {
  const { cartItems, subtotal, tax, shipping, total, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    paymentMethod: 'Cash on Campus / Delivery'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.address || !formData.phone) {
      setError('Please fill in all required shipping and contact details.');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      },
      items: cartItems.map(item => ({
        id: item.book.id || item.book._id,
        title: item.book.title,
        author: item.book.author,
        price: item.book.price,
        quantity: item.quantity,
        image: item.book.image || item.book.coverImage
      })),
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod: formData.paymentMethod
    };

    const res = await placeOrder(orderPayload);
    setIsSubmitting(false);

    if (res.success && res.data) {
      clearCart();
      setCompletedOrder(res.data);
    } else {
      setError(res.message || 'Failed to place order in database.');
    }
  };

  // If order was just placed, render modern Confirmation View
  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            Order Confirmed!
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Thank You For Your Order!
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Your book order has been successfully confirmed and recorded in the database.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-left space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <p className="text-xs text-slate-400">Order Reference</p>
              <p className="text-base font-extrabold text-indigo-600">{completedOrder.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Order Date</p>
              <p className="text-xs font-semibold text-slate-700">{completedOrder.date}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Items Ordered ({completedOrder.items.length})
            </p>
            <div className="space-y-2">
              {completedOrder.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 truncate max-w-xs">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="font-semibold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
            <span className="font-bold text-slate-800">Total Amount</span>
            <span className="text-xl font-black text-indigo-600">${completedOrder.total.toFixed(2)}</span>
          </div>

          <div className="pt-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl space-y-1">
            <p><strong>Shipping To:</strong> {completedOrder.customer.address}, {completedOrder.customer.city}, {completedOrder.customer.state} {completedOrder.customer.zipCode}</p>
            <p><strong>Payment Option:</strong> {completedOrder.paymentMethod}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Link
            to="/my-orders"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 shadow-md transition text-sm"
          >
            <Package className="w-4 h-4" />
            <span>View in My Orders</span>
          </Link>
          <Link
            to="/books"
            className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-200 transition text-sm"
          >
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  // If cart is empty and no order placed
  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">No Items to Checkout</h2>
        <p className="text-slate-500 text-sm">Add some books to your cart before proceeding to checkout.</p>
        <Link
          to="/books"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/cart" className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-indigo-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">Checkout</span>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-sm text-slate-500">Provide shipping details and select your preferred payment method.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Customer and Shipping Address Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Shipping Form Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <span>Shipping Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Campus / Delivery Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  placeholder="Hostel, Department, or Street Address"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <span>Payment Method</span>
            </h2>

            <p className="text-xs text-slate-500">
              Select your preferred method to complete this order.
            </p>

            <div className="space-y-3 pt-1">
              {[
                { id: 'Cash on Campus / Delivery', label: 'Cash on Campus / Pay on Delivery', sub: 'Pay in cash when you collect your books' },
                { id: 'UPI / QR Code', label: 'UPI / QR Payment', sub: 'Instant payment via Google Pay, PhonePe, or Paytm' },
                { id: 'Credit / Debit Card', label: 'Credit / Debit Card', sub: 'Secure payment via Visa, Mastercard, or RuPay' }
              ].map((option) => (
                <label
                  key={option.id}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                    formData.paymentMethod === option.id
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={formData.paymentMethod === option.id}
                    onChange={handleInputChange}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="block text-sm font-bold text-slate-800">{option.label}</span>
                    <span className="block text-xs text-slate-500">{option.sub}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Place Order CTA */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-7 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Review Your Order ({cartItems.length} items)
          </h2>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cartItems.map(({ book, quantity }) => (
              <div key={book.id} className="flex items-center gap-3 text-sm">
                <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                  <BookImage
                    src={book.image}
                    alt={book.title}
                    title={book.title}
                    author={book.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 truncate">{book.title}</h4>
                  <p className="text-xs text-slate-500">Qty: {quantity} × ${book.price.toFixed(2)}</p>
                </div>
                <div className="font-bold text-slate-900 text-right">
                  ${(book.price * quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (8%)</span>
              <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-semibold text-slate-900">
                {shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">Total Payable</span>
              <span className="text-2xl font-black text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Place Order (${total.toFixed(2)})</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
