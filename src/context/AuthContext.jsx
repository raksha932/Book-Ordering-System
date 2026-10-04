import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  authAPI, 
  setCustomerToken, 
  clearCustomerToken, 
  getCustomerToken,
  setAdminToken, 
  clearAdminToken, 
  getAdminToken 
} from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Completely isolated customer and admin user sessions
  const [customerUser, setCustomerUser] = useState(() => {
    const saved = localStorage.getItem('bos_customer_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('bos_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);

  // Session verification on mount for both isolated sessions
  useEffect(() => {
    const initAuth = async () => {
      // 1. Verify Customer session
      const custToken = getCustomerToken();
      if (custToken) {
        try {
          const res = await authAPI.getMe('customer');
          if (res.success && res.user) {
            setCustomerUser(res.user);
            localStorage.setItem('bos_customer_user', JSON.stringify(res.user));
          }
        } catch (err) {
          clearCustomerToken();
          localStorage.removeItem('bos_customer_user');
          setCustomerUser(null);
        }
      } else {
        localStorage.removeItem('bos_customer_user');
        setCustomerUser(null);
      }

      // 2. Verify Super Admin session
      const admToken = getAdminToken();
      if (admToken) {
        try {
          const res = await authAPI.getMe('admin');
          if (res.success && res.user) {
            setAdminUser(res.user);
            localStorage.setItem('bos_admin_user', JSON.stringify(res.user));
          }
        } catch (err) {
          clearAdminToken();
          localStorage.removeItem('bos_admin_user');
          setAdminUser(null);
        }
      } else {
        localStorage.removeItem('bos_admin_user');
        setAdminUser(null);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Sync Customer session to localStorage
  useEffect(() => {
    if (customerUser) {
      localStorage.setItem('bos_customer_user', JSON.stringify(customerUser));
    } else {
      localStorage.removeItem('bos_customer_user');
    }
  }, [customerUser]);

  // Sync Admin session to localStorage
  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('bos_admin_user', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('bos_admin_user');
    }
  }, [adminUser]);

  /**
   * Real Isolated Customer Registration
   */
  const registerCustomer = async (name, email, password, phone) => {
    try {
      const res = await authAPI.registerCustomer(name, email, password, phone);
      if (res.success) {
        setCustomerToken(res.token);
        setCustomerUser(res.user);
        return { success: true, user: res.user, message: res.message };
      }
      return { success: false, message: res.message || 'Customer registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.data?.message || err.message || 'Registration failed. Please try again.'
      };
    }
  };

  /**
   * Real Isolated Super Admin Registration
   */
  const registerSuperAdmin = async (name, email, password, phone) => {
    try {
      const res = await authAPI.registerSuperAdmin(name, email, password, phone);
      if (res.success) {
        setAdminToken(res.token);
        setAdminUser(res.user);
        return { success: true, user: res.user, message: res.message };
      }
      return { success: false, message: res.message || 'Super Admin registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.data?.message || err.message || 'Super Admin registration failed. Please try again.'
      };
    }
  };

  /**
   * Real Isolated Customer Login
   */
  const loginCustomer = async (email, password) => {
    try {
      const res = await authAPI.loginCustomer(email, password);
      if (res.success) {
        setCustomerToken(res.token);
        setCustomerUser(res.user);
        return { success: true, user: res.user };
      }
      return {
        success: false,
        message: res.message || 'Login failed',
        details: res.details || null,
        notFound: res.notFound || false
      };
    } catch (err) {
      return {
        success: false,
        notFound: err.notFound || err.data?.notFound || false,
        message: err.data?.message || err.message || 'Customer authentication failed',
        details: err.data?.details || null
      };
    }
  };

  /**
   * Real Isolated Super Admin Login
   */
  const loginSuperAdmin = async (email, password) => {
    try {
      const res = await authAPI.loginSuperAdmin(email, password);
      if (res.success) {
        setAdminToken(res.token);
        setAdminUser(res.user);
        return { success: true, user: res.user };
      }
      return {
        success: false,
        message: res.message || 'Authentication failed',
        details: res.details || null,
        notFound: res.notFound || false
      };
    } catch (err) {
      return {
        success: false,
        notFound: err.notFound || err.data?.notFound || false,
        message: err.data?.message || err.message || 'Super Admin authentication failed',
        details: err.data?.details || null
      };
    }
  };

  /**
   * Session Logout
   */
  const logoutCustomer = () => {
    clearCustomerToken();
    localStorage.removeItem('bos_customer_user');
    setCustomerUser(null);
  };

  const logoutAdmin = () => {
    clearAdminToken();
    localStorage.removeItem('bos_admin_user');
    setAdminUser(null);
  };

  const logout = () => {
    const isPathAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    if (isPathAdmin) {
      logoutAdmin();
    } else {
      logoutCustomer();
    }
  };

  /**
   * Fetch Customers from MongoDB (Super Admin only)
   */
  const fetchCustomers = useCallback(async () => {
    try {
      const res = await authAPI.getUsers();
      if (res.success && res.data) {
        setCustomers(res.data);
      }
    } catch (err) {
      console.error('Failed to load registered customers:', err.message);
    }
  }, []);

  // Real-time synchronization for customer registrations and order activity in admin view
  useEffect(() => {
    if (adminUser) {
      fetchCustomers();

      const interval = setInterval(() => {
        fetchCustomers();
      }, 4000);

      const onFocus = () => fetchCustomers();
      window.addEventListener('focus', onFocus);

      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', onFocus);
      };
    } else {
      setCustomers([]);
    }
  }, [adminUser, fetchCustomers]);

  /**
   * Delete Customer in MongoDB (Super Admin only)
   */
  const deleteCustomer = async (id) => {
    try {
      const res = await authAPI.deleteUser(id);
      if (res.success) {
        setCustomers(prev => prev.filter(c => c._id !== id && c.id !== id));
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.data?.message || err.message };
    }
  };

  // Resolve current active user based on route context
  const isCurrentPathAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const user = isCurrentPathAdmin ? adminUser : (customerUser || adminUser);
  const isSuperAdmin = Boolean(adminUser);
  const isCustomer = Boolean(customerUser);

  return (
    <AuthContext.Provider
      value={{
        user,
        customerUser,
        adminUser,
        loading,
        isAdmin: Boolean(adminUser),
        isSuperAdmin,
        isCustomer,
        customers,
        loginCustomer,
        registerCustomer,
        loginAdmin: loginSuperAdmin,
        loginSuperAdmin,
        registerAdmin: registerSuperAdmin,
        registerSuperAdmin,
        logout,
        logoutCustomer,
        logoutAdmin,
        fetchCustomers,
        deleteCustomer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
