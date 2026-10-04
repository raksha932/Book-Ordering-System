/**
 * Production API Client for Book Ordering System
 * Handles real HTTP communication between React Frontend and Express Backend
 * Implements strict, isolated token management for Customer and Super Admin
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Isolated Token Management
 */
export const getCustomerToken = () => localStorage.getItem('bos_customer_token');
export const setCustomerToken = (token) => {
  if (token) {
    localStorage.setItem('bos_customer_token', token);
  } else {
    localStorage.removeItem('bos_customer_token');
  }
};
export const clearCustomerToken = () => localStorage.removeItem('bos_customer_token');

export const getAdminToken = () => localStorage.getItem('bos_admin_token');
export const setAdminToken = (token) => {
  if (token) {
    localStorage.setItem('bos_admin_token', token);
  } else {
    localStorage.removeItem('bos_admin_token');
  }
};
export const clearAdminToken = () => localStorage.removeItem('bos_admin_token');

// Context-aware token getter
export const getToken = (role) => {
  if (role === 'admin' || role === 'superadmin') return getAdminToken();
  if (role === 'customer') return getCustomerToken();
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  if (path.startsWith('/admin')) {
    return getAdminToken() || getCustomerToken();
  }
  return getCustomerToken() || getAdminToken();
};

export const setToken = (token, role) => {
  if (role === 'admin' || role === 'superadmin') {
    setAdminToken(token);
  } else {
    setCustomerToken(token);
  }
};

export const clearToken = () => {
  clearCustomerToken();
  clearAdminToken();
};

/**
 * Common request wrapper with role-aware token attachment
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  let token = options.token;
  if (!token) {
    if (
      options.role === 'admin' ||
      endpoint.startsWith('/auth/admin') ||
      endpoint.startsWith('/auth/users') ||
      endpoint.includes('/status') ||
      (endpoint === '/orders' && options.method === 'GET')
    ) {
      token = getAdminToken();
    } else if (
      options.role === 'customer' ||
      endpoint.startsWith('/auth/customer') ||
      endpoint.includes('/my-orders') ||
      (endpoint === '/orders' && options.method === 'POST') ||
      endpoint.includes('/cancel')
    ) {
      token = getCustomerToken();
    } else {
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      token = path.startsWith('/admin') ? getAdminToken() : getCustomerToken();
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      error.notFound = data.notFound || false;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const connError = new Error('Unable to connect to the backend server. Please make sure the backend is running at http://localhost:5000.');
      connError.isNetworkError = true;
      throw connError;
    }
    throw error;
  }
}

/**
 * Authentication API
 */
export const authAPI = {
  loginCustomer: async (email, password) => {
    const res = await request('/auth/customer/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) setCustomerToken(res.token);
    return res;
  },

  registerCustomer: async (name, email, password, phone) => {
    const res = await request('/auth/customer/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone })
    });
    if (res.token) setCustomerToken(res.token);
    return res;
  },

  loginSuperAdmin: async (email, password) => {
    const res = await request('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) setAdminToken(res.token);
    return res;
  },

  registerSuperAdmin: async (name, email, password, phone) => {
    const res = await request('/auth/admin/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone })
    });
    if (res.token) setAdminToken(res.token);
    return res;
  },

  login: async (email, password, portal = 'customer') => {
    if (portal === 'superadmin' || portal === 'admin') {
      return await authAPI.loginSuperAdmin(email, password);
    }
    return await authAPI.loginCustomer(email, password);
  },

  register: async (userData, portal = 'customer') => {
    if (portal === 'superadmin' || portal === 'admin') {
      return await authAPI.registerSuperAdmin(userData.name, userData.email, userData.password, userData.phone);
    }
    return await authAPI.registerCustomer(userData.name, userData.email, userData.password, userData.phone);
  },

  getMe: async (role) => {
    return await request('/auth/me', {
      method: 'GET',
      role: role || (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') ? 'admin' : 'customer')
    });
  },

  getUsers: async () => {
    return await request('/auth/users', {
      method: 'GET',
      role: 'admin'
    });
  },

  deleteUser: async (id) => {
    return await request(`/auth/users/${id}`, {
      method: 'DELETE',
      role: 'admin'
    });
  }
};

/**
 * Books API
 */
export const booksAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All' && params.category !== 'All Categories') {
      query.append('category', params.category);
    }
    if (params.sort) query.append('sort', params.sort);
    if (params.featured) query.append('featured', 'true');
    if (params.bestSeller) query.append('bestSeller', 'true');

    const qs = query.toString() ? `?${query.toString()}` : '';
    return await request(`/books${qs}`, {
      method: 'GET'
    });
  },

  getById: async (id) => {
    return await request(`/books/${id}`, {
      method: 'GET'
    });
  },

  create: async (bookData) => {
    return await request('/books', {
      method: 'POST',
      role: 'admin',
      body: JSON.stringify(bookData)
    });
  },

  update: async (id, bookData) => {
    return await request(`/books/${id}`, {
      method: 'PUT',
      role: 'admin',
      body: JSON.stringify(bookData)
    });
  },

  delete: async (id) => {
    return await request(`/books/${id}`, {
      method: 'DELETE',
      role: 'admin'
    });
  }
};

/**
 * Orders API
 */
export const ordersAPI = {
  create: async (orderData) => {
    return await request('/orders', {
      method: 'POST',
      role: 'customer',
      body: JSON.stringify(orderData)
    });
  },

  getMyOrders: async () => {
    return await request('/orders/my-orders', {
      method: 'GET',
      role: 'customer'
    });
  },

  getById: async (id) => {
    return await request(`/orders/${id}`, {
      method: 'GET'
    });
  },

  getAll: async () => {
    return await request('/orders', {
      method: 'GET',
      role: 'admin'
    });
  },

  updateStatus: async (id, status) => {
    return await request(`/orders/${id}/status`, {
      method: 'PUT',
      role: 'admin',
      body: JSON.stringify({ status })
    });
  },

  cancel: async (id) => {
    return await request(`/orders/${id}/cancel`, {
      method: 'PUT',
      role: 'customer'
    });
  }
};

/**
 * Notifications API
 */
export const notificationsAPI = {
  getAll: async () => {
    return await request('/notifications', {
      method: 'GET'
    });
  },

  markAsRead: async (id) => {
    return await request(`/notifications/${id}/read`, {
      method: 'PUT'
    });
  },

  markAllAsRead: async () => {
    return await request('/notifications/mark-all-read', {
      method: 'PUT'
    });
  }
};
