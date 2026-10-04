import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle, AlertCircle } from 'lucide-react';

const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  const isWarning = toastMessage.toLowerCase().includes('out of stock') || toastMessage.toLowerCase().includes('sorry');

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border text-sm font-medium text-white ${
        isWarning ? 'bg-amber-600 border-amber-500' : 'bg-indigo-600 border-indigo-500'
      }`}>
        {isWarning ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

export default Toast;
