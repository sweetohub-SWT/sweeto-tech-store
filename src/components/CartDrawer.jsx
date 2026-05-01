import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useStoreData } from '../contexts/StoreDataContext';
import { useLocale } from '../contexts/LocaleContext';
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight, MessageCircle, MapPin, User, ChevronLeft, CheckCircle2, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/UserAuthContext';
import { getCartWhatsAppLink } from '../utils/whatsappHelper';

const CartDrawer = () => {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { formatPrice, storeSettings } = useStoreData();
  const { t } = useLocale();
  const { user, isAuthenticated } = useUserAuth();
  const navigate = useNavigate();
  
  // Steps: 'list', 'details', 'confirm'
  const [step, setStep] = useState('list');
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

  const handleWhatsAppCheckout = () => {
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
      // Reset state and close
      setTimeout(() => {
        setStep('list');
        closeCart();
      }, 500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
  };

  const isDetailsValid = 
    customerDetails.name.trim() !== '' && 
    customerDetails.phone.trim() !== '' && 
    customerDetails.location.trim() !== '';

  const renderHeader = () => {
    if (step === 'list') {
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--primary-color)]/10 rounded-xl flex items-center justify-center text-[var(--primary-color)]">
            <ShoppingBag size={20} />
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
            {t('yourBag').split(' ')[0]} <span className="text-[var(--primary-color)]">{t('yourBag').split(' ').slice(1).join(' ')}</span>
          </h2>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-3">
        <button onClick={() => setStep(step === 'confirm' ? 'details' : 'list')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-400">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
          {step === 'details' ? t('orderInfo') : t('reviewDetails')}
        </h2>
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 z-[1000] transition-all duration-500 ease-in-out ${isCartOpen ? 'visible' : 'invisible'}`}>
      <div 
        className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => { closeCart(); setStep('list'); }}
      />

      <div className={`absolute top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
            {renderHeader()}
            <button 
              onClick={() => { closeCart(); setStep('list'); }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-800">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-gray-50 dark:bg-slate-950 rounded-full flex items-center justify-center text-gray-300">
                  <ShoppingBag size={32} />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-black uppercase text-sm tracking-widest mb-2">{t('cartEmpty')}</p>
                  <p className="text-gray-400 text-xs leading-relaxed max-w-[200px] mx-auto uppercase font-bold tracking-wider">{t('cartEmptyDesc')}</p>
                </div>
                <button 
                  onClick={() => { navigate('/search'); closeCart(); }}
                  className="bg-slate-900 dark:bg-slate-800 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all"
                >
                  {t('shopNow')}
                </button>
              </div>
            ) : (
              <>
                {step === 'list' && (
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-slate-950 rounded-xl p-2 shrink-0 border border-gray-100 dark:border-slate-800 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight line-clamp-1">{item.name}</h4>
                            <button onClick={() => removeFromCart(item.id, item.selectedColor?.code)} className="text-gray-300 hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] font-black text-[var(--primary-color)] uppercase tracking-widest">{formatPrice(item.price)}</p>
                            {item.selectedColor && (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 dark:bg-slate-800 rounded-full border border-gray-100 dark:border-slate-700">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.selectedColor.code }} />
                                <span className="text-[8px] font-black text-gray-500 uppercase">{item.selectedColor.name}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center bg-gray-50 dark:bg-slate-950 rounded-lg p-0.5 border border-gray-100 dark:border-slate-800 scale-90 origin-left">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor?.code)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-[var(--primary-color)] rounded-md">
                                <Minus size={12} />
                              </button>
                              <span className="w-6 text-center text-xs font-black text-gray-900 dark:text-white">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor?.code)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-[var(--primary-color)] rounded-md">
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-sm font-black text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {step === 'details' && (
                  <div className="space-y-6 animate-ai-slide-up">
                    <div className="space-y-4">
                      <div className="relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">{t('fullName')}</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                          <input 
                            type="text" 
                            name="name"
                            value={customerDetails.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full bg-gray-50 dark:bg-slate-950 border-2 border-transparent focus:border-[var(--primary-color)] rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">{t('phoneNumber')}</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                          <input 
                            type="tel" 
                            name="phone"
                            value={customerDetails.phone}
                            onChange={handleInputChange}
                            placeholder="699 99 99 99"
                            className="w-full bg-gray-50 dark:bg-slate-950 border-2 border-transparent focus:border-[var(--primary-color)] rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">{t('yourLocation')}</label>
                        <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={18} />
                          <input 
                            type="text" 
                            name="location"
                            value={customerDetails.location}
                            onChange={handleInputChange}
                            placeholder="Douala, Bonapriso"
                            className="w-full bg-gray-50 dark:bg-slate-950 border-2 border-transparent focus:border-[var(--primary-color)] rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">{t('specialNotes')}</label>
                        <textarea 
                          name="notes"
                          value={customerDetails.notes}
                          onChange={handleInputChange}
                          placeholder="Please call before arrival"
                          className="w-full bg-gray-50 dark:bg-slate-950 border-2 border-transparent focus:border-[var(--primary-color)] rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 dark:text-white outline-none transition-all h-32 resize-none placeholder:text-gray-300 dark:placeholder:text-slate-700"
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold leading-relaxed">
                        {t('checkoutDesc')}
                      </p>
                    </div>
                  </div>
                )}

                {step === 'confirm' && (
                  <div className="space-y-8 animate-ai-slide-up text-center">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                      <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{t('readyToOrder')}</h3>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{t('reviewDetailsBelow')}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-950 rounded-[2rem] p-6 text-left border border-gray-100 dark:border-slate-800 space-y-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t('fullName')}</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{customerDetails.name}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t('phoneNumber')}</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{customerDetails.phone}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t('yourLocation')}</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{customerDetails.location}</p>
                      </div>
                      <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t('orderTotal')}</p>
                        <p className="text-xl font-black text-[var(--primary-color)]">{formatPrice(cartTotal)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 bg-gray-50 dark:bg-slate-950/50 border-t border-gray-100 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  {step === 'list' ? t('subtotal') : t('totalPayable')}
                </span>
                <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{formatPrice(cartTotal)}</span>
              </div>
              
              {step === 'list' ? (
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => {
                      if (storeSettings.requireLoginForCheckout !== false && !isAuthenticated) {
                        closeCart();
                        navigate('/login', { state: { from: window.location.pathname } });
                      } else {
                        setStep('details');
                      }
                    }}
                    className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:opacity-90 flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
                  >
                    {t('proceedToOrder')} <ArrowRight size={14} />
                  </button>
                </div>
              ) : step === 'details' ? (
                <button 
                  disabled={!isDetailsValid}
                  onClick={() => setStep('confirm')}
                  className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                    isDetailsValid 
                      ? 'bg-[var(--primary-color)] text-white shadow-xl shadow-[var(--primary-color)]/20 hover:-translate-y-0.5' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  {t('reviewOrder')} <ArrowRight size={14} />
                </button>
              ) : (
                <button 
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-green-600/20 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <MessageCircle size={18} /> {t('confirmOnWhatsApp')}
                </button>
              )}

              <p className="text-[9px] text-center text-gray-400 font-black uppercase tracking-widest pt-2">
                {t('fastResponse')} • {t('whatsAppSupport')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
