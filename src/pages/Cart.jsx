import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import CategoryBadge from '../components/CategoryBadge';
import BookImage from '../components/BookImage';

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartCount, 
    subtotal, 
    tax, 
    shipping, 
    total 
  } = useCart();

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your Cart is Empty
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Looks like you haven't added any books to your shopping cart yet. Browse our catalog to find exciting titles!
          </p>
        </div>
        <Link
          to="/books"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md shadow-indigo-200 transition text-sm"
        >
          <span>Explore Books</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-sm text-slate-500">
            You have <strong className="text-indigo-600">{cartCount}</strong> {cartCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline self-start sm:self-auto flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Items</span>
        </button>
      </div>

      {/* Cart Grid: Items on Left, Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          <div className="p-4 sm:p-6 divide-y divide-slate-100">
            {cartItems.map(({ book, quantity }) => (
              <div
                key={book.id}
                className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6"
              >
                {/* Book Thumbnail */}
                <Link
                  to={`/books/${book.id}`}
                  className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0 shadow-sm border border-slate-200"
                >
                  <BookImage
                    src={book.image}
                    alt={book.title}
                    title={book.title}
                    author={book.author}
                    category={book.category}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={book.category} />
                    <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      In Stock
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base sm:text-lg line-clamp-1 hover:text-indigo-600 transition">
                    <Link to={`/books/${book.id}`}>{book.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-500">by {book.author}</p>
                  <div className="text-sm font-extrabold text-slate-900 pt-1">
                    ₹{book.price.toFixed(2)} each
                  </div>
                </div>

                {/* Quantity Controls & Total for this item */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => updateQuantity(book.id, quantity - 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(book.id, quantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal for line item */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-base font-black text-indigo-600">
                      ₹{(book.price * quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(book.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/books"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-7 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <span>Estimated Tax (8%)</span>
              </span>
              <span className="font-semibold text-slate-900">₹{tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <span>Shipping</span>
              </span>
              <span className="font-semibold text-slate-900">
                {shipping === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  `₹${shipping.toFixed(2)}`
                )}
              </span>
            </div>

            {shipping > 0 && (
              <p className="text-[11px] text-slate-400 italic">
                Add ₹{(45 - subtotal).toFixed(2)} more to qualify for Free Shipping!
              </p>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">Total</span>
              <span className="text-2xl font-black text-indigo-600">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-indigo-200 transition text-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Simulated college checkout (No real payment needed)</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Instant order generation & tracking</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
