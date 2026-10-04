import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('bos_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(item => {
          if (item.book?.image && item.book.image.includes('1532012164546')) {
            return {
              ...item,
              book: { ...item.book, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80' }
            };
          }
          return item;
        });
      } catch {
        // fallback
      }
    }
    return [
      {
        book: {
          id: "b-1",
          title: "Atomic Habits",
          author: "James Clear",
          category: "Self-Help",
          price: 19.99,
          inStock: true,
          stockCount: 42,
          image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80"
        },
        quantity: 1
      }
    ];
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('bos_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const addToCart = (book, quantity = 1) => {
    if (!book.inStock) {
      showToast(`Sorry, "${book.title}" is out of stock!`);
      return false;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.book.id === book.id);
      if (existing) {
        return prev.map(item =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { book, quantity }];
    });

    showToast(`Added "${book.title}" to cart!`);
    return true;
  };

  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.book.id === bookId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (bookId) => {
    setCartItems(prev => {
      const target = prev.find(item => item.book.id === bookId);
      if (target) {
        showToast(`Removed "${target.book.title}" from cart`);
      }
      return prev.filter(item => item.book.id !== bookId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  const tax = subtotal > 0 ? parseFloat((subtotal * 0.08).toFixed(2)) : 0;
  const shipping = subtotal > 45 || subtotal === 0 ? 0 : 4.99;
  const total = subtotal > 0 ? parseFloat((subtotal + tax + shipping).toFixed(2)) : 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax,
        shipping,
        total,
        toastMessage
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
