import React, { useState, useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import { useStoreData } from '../contexts/StoreDataContext';
import { useUserAuth } from '../contexts/UserAuthContext';
import { 
  Trash2, ShoppingBag, ArrowRight, Minus, Plus, MessageCircle, 
  ChevronLeft, User, MapPin, CheckCircle2, ShieldCheck, Truck, 
  Zap, Star, CreditCard, Lock, ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartWhatsAppLink } from '../utils/whatsappHelper';
import ProductCard from '../components/ProductCard';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { formatPrice, storeSettings, products } = useStoreData();
  const { user, isAuthenticated } = useUserAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('cart'); // 'cart' or 'order_info'
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    location: '',
    notes: ''
  });

  // Pre-fill name from user account
  React.useEffect(() => {
    if (user?.display_name) {
      setCustomerDetails(prev => ({ ...prev, name: user.display_name }));
    }
  }, [user]);

  const handleWhatsAppCheckout = (e) => {
    e.preventDefault();
    const shopName = storeSettings.shopName || 'SWEETO-HUB';
    const phone = storeSettings.whatsappNumber || '237699999999';
    
    const whatsappUrl = getCartWhatsAppLink(
      phone,
      cartItems,
      cartTotal,
      shopName,
      formatPrice,
      customerDetails
    );

    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
  };

  const recommendations = useMemo(() => {
    return products
      .filter(p => p.status === 'active' && !cartItems.find(item => item.id === p.id))
      .slice(0, 4);
  }, [products, cartItems]);

  const isDetailsValid = 
    customerDetails.name.trim() !== '' && 
    customerDetails.phone.trim() !== '' && 
    customerDetails.location.trim() !== '';

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-24 h-24 bg-gray-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <ShoppingBag className="text-gray-300 dark:text-slate-700" size={40} />
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter">
              Your cart is <span className="text-[var(--primary-color)] italic underline decoration-wavy underline-offset-8">empty</span>
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-lg font-medium max-w-md mx-auto mb-10 leading-relaxed">
              Don't miss out on our latest tech arrivals. Start adding items to your cart today!
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-4 bg-black dark:bg-white text-white dark:text-black px-12 py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] transition-all hover:scale-105 shadow-2xl active:scale-95"
            >
              Explore Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-white dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className={`flex items-center gap-2 ${step === 'cart' ? 'text-black dark:text-white' : 'text-gray-300'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${step === 'cart' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-slate-800'}`}>1</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Shopping Cart</span>
          </div>
          <div className="w-12 h-px bg-gray-100 dark:bg-slate-800" />
          <div className={`flex items-center gap-2 ${step === 'order_info' ? 'text-black dark:text-white' : 'text-gray-300'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${step === 'order_info' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-slate-800'}`}>2</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Order Info</span>
          </div>
        </div>

        {step === 'cart' ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">


            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
                  Cart <span className="text-[var(--primary-color)]">Items</span>
                </h1>
                <button onClick={clearCart} className="text-[10px] font-black uppercase text-gray-400 hover:text-red-500 tracking-[0.2em]">Clear All</button>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-6 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 group hover:shadow-xl transition-all"
                  >
                    <div className="shrink-0 w-24 h-24 bg-gray-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center p-4">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-grow flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.category}</p>
                          {item.selectedColor && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 dark:bg-slate-800 rounded-full border border-gray-100 dark:border-slate-700">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.selectedColor.code }} />
                              <span className="text-[9px] font-black text-gray-500 uppercase tracking-tight">{item.selectedColor.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                          <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-full p-1">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor?.code)} className="w-6 h-6 flex items-center justify-center"><Minus size={10} /></button>
                            <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor?.code)} className="w-6 h-6 flex items-center justify-center"><Plus size={10} /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id, item.selectedColor?.code)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Card */}
              <div className="mt-12 p-10 bg-gray-900 dark:bg-white rounded-[3rem] text-white dark:text-black flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 block mb-2">Total Amount</span>
                  <span className="text-5xl font-black tracking-tighter">{formatPrice(cartTotal)}</span>
                </div>
                <button 
                  onClick={() => {
                    if (storeSettings.requireLoginForCheckout !== false && !isAuthenticated) {
                      navigate('/login', { state: { from: '/cart' } });
                    } else {
                      setStep('order_info');
                      window.scrollTo(0, 0);
                    }
                  }}
                  className="w-full md:w-auto bg-[var(--primary-color)] text-white px-10 py-6 rounded-full font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-xl shadow-[var(--primary-color)]/30 active:scale-95"
                >
                  Continue to Order <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <button 
              onClick={() => { setStep('cart'); window.scrollTo(0,0); }}
              className="flex items-center gap-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest mb-10"
            >
              <ArrowLeft size={14} /> Back to Bag
            </button>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 lg:p-16 border border-gray-100 dark:border-slate-800 shadow-2xl space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500">
                  <MapPin size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Order <span className="text-blue-500">Details</span></h2>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Provide your contact info to chat on WhatsApp</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={customerDetails.name}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className="w-full bg-gray-50 dark:bg-slate-950 border-2 border-transparent focus:border-blue-500 rounded-3xl py-6 px-8 text-lg font-bold text-gray-900 dark:text-white outline-none transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2">WhatsApp Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={customerDetails.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 699 99 99 99"
                    className="w-full bg-gray-50 dark:bg-slate-950 border-2 border-transparent focus:border-blue-500 rounded-3xl py-6 px-8 text-lg font-bold text-gray-900 dark:text-white outline-none transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2">Current Location / Pickup Point</label>
                  <input 
                    type="text" 
                    name="location"
                    value={customerDetails.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Douala, Akwa"
                    className="w-full bg-gray-50 dark:bg-slate-950 border-2 border-transparent focus:border-blue-500 rounded-3xl py-6 px-8 text-lg font-bold text-gray-900 dark:text-white outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2">Special Instructions (Optional)</label>
                <textarea 
                  name="notes"
                  value={customerDetails.notes}
                  onChange={handleInputChange}
                  placeholder="Tell us more about your order or preferred pickup time..."
                  className="w-full bg-gray-50 dark:bg-slate-950 border-2 border-transparent focus:border-blue-500 rounded-[3rem] py-8 px-10 text-lg font-bold text-gray-900 dark:text-white outline-none transition-all h-48 resize-none shadow-inner"
                />
              </div>

              <div className="pt-12 border-t border-gray-100 dark:border-slate-800">
                <button 
                  disabled={!isDetailsValid}
                  onClick={handleWhatsAppCheckout}
                  className={`w-full py-8 rounded-full font-black uppercase text-sm tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-2xl ${
                    isDetailsValid 
                      ? 'bg-[#25D366] text-white hover:bg-[#128C7E] hover:scale-[1.02] active:scale-95' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  <MessageCircle size={24} /> Complete Order on WhatsApp
                </button>
                {!isDetailsValid && (
                  <p className="text-center text-[10px] font-black text-red-500 uppercase tracking-widest mt-6 animate-pulse">
                    * Please fill in your name, phone and location to proceed
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TRUST BADGES ALWAYS VISIBLE */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex flex-col items-center text-center gap-3">
            <ShieldCheck size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Secure Chat</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <MessageCircle size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Live Support</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <Lock size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Privacy Protected</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <CreditCard size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Cash on Pickup</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
