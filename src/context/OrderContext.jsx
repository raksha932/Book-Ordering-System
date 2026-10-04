import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ordersAPI } from '../api/apiClient';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Normalize Order for UI compatibility
   */
  const normalizeOrder = (ord) => {
    const custName = ord.customerName || ord.shippingAddress?.fullName || ord.user?.name || 'Customer';
    const custEmail = ord.customerEmail || ord.user?.email || '';
    const custPhone = ord.shippingAddress?.phone || ord.user?.phone || '';

    return {
      ...ord,
      id: ord._id || ord.id,
      date: ord.createdAt ? ord.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
      subtotal: ord.itemsPrice || 0,
      tax: ord.taxPrice || 0,
      shipping: ord.shippingPrice || 0,
      total: ord.totalPrice || 0,
      customer: {
        name: custName,
        email: custEmail,
        phone: custPhone,
        address: ord.shippingAddress?.address || '',
        city: ord.shippingAddress?.city || '',
        state: ord.shippingAddress?.state || '',
        zipCode: ord.shippingAddress?.postalCode || ''
      },
      items: (ord.orderItems || []).map(item => ({
        id: item.book?._id || item.book || item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.coverImage
      }))
    };
  };

  /**
   * Fetch Orders from Real Backend API
   * (If user is Admin / Super Admin, fetches all orders; if Customer, fetches my-orders)
   */
  const fetchOrders = useCallback(async (silent = false) => {
    if (!user) {
      setOrders([]);
      return;
    }

    if (!silent) {
      setLoading(true);
    }
    setError(null);
    try {
      let res;
      const isPathAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
      const isAdminUser = user.role === 'admin' || user.role === 'superadmin';

      if (isPathAdmin && isAdminUser) {
        res = await ordersAPI.getAll();
      } else {
        res = await ordersAPI.getMyOrders();
      }

      if (res.success && res.data) {
        let orderList = res.data;
        // If Customer session, strictly guard that orders belong to this customer
        if (!isPathAdmin && user.role === 'customer') {
          const myId = (user.id || user._id || '').toString();
          const myEmail = (user.email || '').toLowerCase().trim();
          orderList = orderList.filter(ord => {
            const ordUserId = ord.user ? (ord.user._id || ord.user).toString() : '';
            const ordEmail = (ord.customerEmail || '').toLowerCase().trim();
            return (myId && ordUserId === myId) || (myEmail && ordEmail === myEmail);
          });
        }
        setOrders(orderList.map(normalizeOrder));
      }
    } catch (err) {
      console.error('Failed to load orders from database:', err.message);
      if (!silent) {
        setError(err.message);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [user]);

  // Initial fetch + 3-second real-time synchronization polling + focus refresh
  useEffect(() => {
    if (!user) return;

    // Initial load
    fetchOrders(false);

    // 3-second background polling for instant Customer <-> Admin synchronization
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 3000);

    const onFocus = () => {
      fetchOrders(true);
    };
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [user, fetchOrders]);

  /**
   * Real Place Order via Backend API
   */
  const placeOrder = async (orderData) => {
    try {
      const payload = {
        orderItems: (orderData.items || []).map(item => ({
          book: item.id || item._id,
          title: item.title,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity, 10),
          coverImage: item.image || item.coverImage || ''
        })),
        shippingAddress: {
          fullName: orderData.customer?.name || orderData.shippingAddress?.fullName,
          address: orderData.customer?.address || orderData.shippingAddress?.address,
          city: orderData.customer?.city || orderData.shippingAddress?.city,
          state: orderData.customer?.state || orderData.shippingAddress?.state,
          postalCode: orderData.customer?.zipCode || orderData.shippingAddress?.postalCode,
          phone: orderData.customer?.phone || orderData.shippingAddress?.phone
        },
        paymentMethod: orderData.paymentMethod || 'Cash on Campus Delivery',
        itemsPrice: parseFloat(orderData.subtotal) || 0,
        taxPrice: parseFloat(orderData.tax) || 0,
        shippingPrice: parseFloat(orderData.shipping) || 0,
        totalPrice: parseFloat(orderData.total) || 0
      };

      const res = await ordersAPI.create(payload);
      if (res.success && res.data) {
        const created = normalizeOrder(res.data);
        setOrders(prev => [created, ...prev]);
        fetchOrders(true);
        return { success: true, data: created };
      }
      return { success: false, message: res.message };
    } catch (err) {
      console.error('Error placing order:', err.message);
      return { success: false, message: err.message };
    }
  };

  /**
   * Real Update Order Status via Backend API (Admin)
   */
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await ordersAPI.updateStatus(orderId, newStatus);
      if (res.success && res.data) {
        const updated = normalizeOrder(res.data);
        setOrders(prev =>
          prev.map(ord => (ord.id === orderId || ord._id === orderId ? updated : ord))
        );
        fetchOrders(true);
        return { success: true, data: updated };
      }
      return { success: false, message: res.message || 'Failed to update order status' };
    } catch (err) {
      console.error('Error updating order status:', err.message);
      return { success: false, message: err.message };
    }
  };

  /**
   * Cancel Order (Customer or Admin)
   */
  const cancelOrder = async (orderId) => {
    try {
      const res = await ordersAPI.cancel(orderId);
      if (res.success && res.data) {
        const updated = normalizeOrder(res.data);
        setOrders(prev =>
          prev.map(ord => (ord.id === orderId || ord._id === orderId ? updated : ord))
        );
        fetchOrders(true);
        return { success: true, data: updated };
      }
      return { success: false, message: res.message || 'Failed to cancel order' };
    } catch (err) {
      console.error('Error cancelling order:', err.message);
      return { success: false, message: err.message };
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        fetchOrders,
        placeOrder,
        updateOrderStatus,
        cancelOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
