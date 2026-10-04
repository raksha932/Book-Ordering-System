import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Guard: Not logged in -> Super Admin Login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Guard: Customer trying to access Super Admin pages -> redirect to customer home
  if (user.role === 'customer') {
    return <Navigate to="/home" replace />;
  }

  // Guard: Role must be superadmin or admin
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    return <Navigate to="/admin/login" replace />;
  }

  // Determine title from path
  const path = location.pathname;
  let pageTitle = "Dashboard";
  if (path.includes("/admin/books")) pageTitle = "Manage Books";
  else if (path.includes("/admin/orders")) pageTitle = "Manage Orders";
  else if (path.includes("/admin/customers")) pageTitle = "Manage Customers";

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader setMobileOpen={setMobileOpen} title={pageTitle} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>

      <Toast />
    </div>
  );
};

export default AdminLayout;
