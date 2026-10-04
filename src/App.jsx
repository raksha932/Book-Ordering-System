import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { BookProvider } from './context/BookContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Entry & Auth Pages
import RoleSelection from './pages/RoleSelection';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';

// Customer Bookstore Pages (Guarded)
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';

// Admin Portal Pages (Guarded)
import AdminDashboard from './pages/AdminDashboard';
import ManageBooks from './pages/ManageBooks';
import ManageOrders from './pages/ManageOrders';
import ManageCustomers from './pages/ManageCustomers';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BookProvider>
          <CartProvider>
            <OrderProvider>
              <BrowserRouter>
              <Routes>
                {/* 1. Main Landing Page: Role Selection (First Page) */}
                <Route path="/" element={<RoleSelection />} />

                {/* 2. Customer Authentication Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 3. Protected Customer Bookstore Flow */}
                {/* Accessible ONLY after customer login */}
                <Route element={<CustomerLayout />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/books/:id" element={<BookDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                </Route>

                {/* 4. Admin Authentication Pages */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegister />} />

                {/* 5. Protected Admin Portal Flow */}
                {/* Accessible ONLY after admin login */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="books" element={<ManageBooks />} />
                  <Route path="orders" element={<ManageOrders />} />
                  <Route path="customers" element={<ManageCustomers />} />
                </Route>

                {/* 6. Catch-All Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </OrderProvider>
        </CartProvider>
      </BookProvider>
    </NotificationProvider>
  </AuthProvider>
  );
}

export default App;
