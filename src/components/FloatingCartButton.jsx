import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const FloatingCartButton = () => {
  const { cartCount, openCart } = useCart();
  const [shouldPulse, setShouldPulse] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger pulse animation when cart count increases
  useEffect(() => {
    if (cartCount > 0) {
      setShouldPulse(true);
      setIsVisible(true);
      const timer = setTimeout(() => setShouldPulse(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [cartCount]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-24 right-6 z-[60] transition-all duration-500 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
      }`}
    >
      {/* "Just Added" Pop-out Notification */}
      {shouldPulse && (
        <div className="absolute bottom-full right-0 mb-4 animate-ai-slide-up">
          <div className="bg-slate-950 text-white px-4 py-2 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-2 whitespace-nowrap">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest">Added to Bag!</span>
          </div>
          {/* Tooltip Arrow */}
          <div className="w-3 h-3 bg-slate-950 border-r border-b border-white/10 rotate-45 absolute -bottom-1.5 right-8"></div>
        </div>
      )}

      <button
        onClick={openCart}
        className={`group relative flex items-center gap-3 px-6 py-4 rounded-full bg-[var(--primary-color)] text-white shadow-xl shadow-[var(--primary-color)]/30 hover:shadow-2xl hover:shadow-[var(--primary-color)]/50 hover:-translate-y-1 active:scale-95 transition-all duration-300 ${
          shouldPulse ? 'animate-bounce' : ''
        }`}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        
        <div className="relative">
          <ShoppingBag size={24} className="group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Badge */}
          <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-lg animate-ai-zoom-in">
            {cartCount}
          </span>
        </div>

        <div className="flex flex-col items-start leading-none pr-1">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">View Cart</span>
          <span className="text-sm font-bold flex items-center">
            Checkout <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </button>

      {/* Background Pulse Ring */}
      {shouldPulse && (
        <div className="absolute inset-0 rounded-full bg-[var(--primary-color)]/30 animate-ping -z-10" />
      )}
    </div>
  );
};

export default FloatingCartButton;
